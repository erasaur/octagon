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
  createEvent: function (event) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    check(event, Schema.Events);

    var eventObj = {
      userId: userId,
      createdAt: new Date(),
      info: event.info,
      members: [],
      finalized: false,
      pictureId: event.pictureId
    };

    // TODO: send notifications
    return Events.insert(eventObj);  
  },
  updateEvent: function (event) {
    var user = Meteor.user();
    var eventId = event._id;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    check(event, Schema.Events);

    Events.update(eventId, { $set: { 'info': event.info } });
  },
  finalizeEvent: function (eventId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    // TODO: update points log here

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

    if (eventObj.slots <= 0)
      throw new Meteor.Error('event-full', getError('event-full'));

    Events.update(eventId, { $addToSet: { 'members': user._id }, $inc: { 'info.slots': -1 } });
  }
});
