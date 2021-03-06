Meteor.methods({
  search: function (query, options) {
    var user = Meteor.user(); 

    if (!user || !isAdmin(user))
      return '';

    options = options || {};

    if (options.limit)
      options.limit = Math.min(50, Math.abs(options.limit));
    else
      options.limit = 50;

    var regex = new RegExp("^" + query);
    return Meteor.users.find({ 
      'profile.name': { $regex: regex, $options: 'i' } 
    }, options).fetch();
  },
  assignPoints: function (log) {
    var user = Meteor.user();
    var points = log.points || 0;
    var meeting = log.isMeeting ? 1 : 0;
    var members = Meteor.users.find({ 'profile.name': { $in: log.members } }).fetch();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    members = _.pluck(members, '_id');
    Meteor.users.update({ '_id': { $in: members } }, { 
      $inc: { 'profile.points': points, 'profile.meetings': meeting }
    }, { multi: true });

    // log has to contain _ids, not names
    log.members = members;
    Meteor.call('createLog', log);
  },
  assignStrikes: function (strike) { // [memberName], numStrikes
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    StrikesSchema.clean(strike);
    check(strike, StrikesSchema);

    Meteor.users.update({ 'profile.name': { $in: strike.members } }, {
      $inc: { 'profile.strikes': 1 }
    });
  },
  promoteUser: function (user) {
    var currentUser = Meteor.user();
    var userId = user._id;

    if (!currentUser || !isAdmin(currentUser))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    if (user.isAdmin)
      throw new Meteor.Error('already-admin', getError('already-admin'));

    Meteor.users.update(userId, {
      $set: { 'isAdmin': true }
    });
  },
  finalizeEvent: function (event, members) {
    var user = Meteor.user();
    var userId = Meteor.userId();
    var eventId = event._id;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    if (!eventId || !Events.findOne(eventId))
      throw new Meteor.Error('invalid-event', getError('invalid-event'));

    if (members.length) {
      _.each(members, function (member) {
        var points = member.hours * getSetting('pointsPerHour');

        if (member.mic) 
          points += getSetting('pointsForMIC');
        if (member.carpool)
          points += getSetting('pointsForCarpool');

        // members get strikes if they sign up and don't attend
        if (points === 0) { 
          var penalize = (getStrikesById(member._id) % (getSetting('strikesPerPenalty') + 1) === 0);

          Meteor.users.update(member._id, { 
            $inc: { 
              'profile.strikes': 1, 
              'profile.points': penalize ? -getSetting('pointsPerPenalty') : 0
            },
            $addToSet: { 'profile.events': eventId } 
          });
        } 
        else {
          Meteor.users.update(member._id, { 
            $inc: {
              'profile.points': points,
              'profile.mic': member.mic ? 1 : 0,
              'profile.carpool': member.carpool ? 1 : 0
            },
            $addToSet: {
              'profile.events': { 
                '_id': eventId, 
                'hours': member.hours,
                'mic': member.mic, 
                'carpool': member.carpool 
              }
            }
          });
        }
      });

      var log = {
        members: _.pluck(members, '_id'),
        description: event.info.name + ' [' + moment(event.info.date).format('MM/DD/YYYY') + ']'
      };

      Meteor.call('createLog', log, function (error) {
        if (error)
          throw new Meteor.Error('log-error', error.reason);
      }); 
    }

    Events.update(eventId, { $set: { 'finalized': true } });
  },
  deleteEvent: function (eventId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Events.remove(eventId);      
  },
  addEventMember: function (eventId, memberName) {
    var currentUser = Meteor.user();
    var user = Meteor.users.findOne({ 'profile.name': memberName });
    var eventObj = Events.findOne(eventId);

    if (!currentUser || !isAdmin(currentUser))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    if (!eventObj)
      throw new Meteor.Error('invalid-event', getError('invalid-event'));

    if (!user)
      throw new Meteor.Error('invalid-user', getError('invalid-user'));

    if (eventObj.members && _.contains(eventObj.members, user._id))
      throw new Meteor.Error('user-attending', getError('user-attending'));

    if (eventObj.info.slots <= 0)
      throw new Meteor.Error('event-full', getError('event-full'));

    Events.update(eventId, { $addToSet: { 'members': user._id }, $inc: { 'info.slots': -1 } });
  },
  clearLog: function () {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Logs.remove({});
  }
});
