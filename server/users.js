Accounts.onCreateUser(function (options, user) {
  var userProfile = {
    events: [],
    carpool: 0,
    meetings: 0,
    mic: 0,
    points: 0,
    strikes: 0,
    suggests: 0
  };

  _.extend(userProfile, options.profile);

  user.profile = userProfile;
  user.isAdmin = (Meteor.users.find().count() === 0);
  return user;
});

Meteor.methods({
  signup: function (user) {
    if (Meteor.users.findOne({ 'profile.name': user.name }))
      throw new Meteor.Error('duplicate-name', getError('duplicate-name'));
    
    Accounts.createUser({
      'email': user.email, 
      'password': user.password,
      'profile': {
        'name': user.name
      }
    });
  },
  removeUser: function (userId) {
    var userId = userId || this.userId;
    var user = Meteor.users.findOne(userId);

    // either admin or removing own account
    if (!user || !canRemoveById(this.userId, user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    // don't let the last admin commit suicide
    if (Meteor.users.find({ 'isAdmin': true }).count() === 1)
      throw new Meteor.Error('cannot-delete', getError('cannot-delete'));

    // don't delete users, just remove all the info
    var randomPass = Random.id();
    var randomEmail = Random.id(8) + '@deleted.com';
    Meteor.users.update(user, {
      $set: { 
        'profile.name': '[deleted]', 
        'isAdmin': false,
        'emails': [{ 'address': randomEmail, verified: false }],
        'password': randomPass,
        'isDeleted': true
      }
    });

    // TODO: fully remove user
    // remove all posts created by user
    // remove all events created by user
    // remove all logs created by user
    // remove all suggestions by user
    // remove user from all events
    // remove user from all logs
  },
  changePass: function (password) {
    Accounts.setPassword(Meteor.userId(), password);
  },
  attendEvent: function (eventId) {
    var user = Meteor.user();
    var userId = this.userId;
    var now = new Date();

    if (!user || !canAttendEvent(user))
      throw new Meteor.Error('logged-out', getError('logged-out'));

    var eventObj = Events.findOne(eventId);
    if (typeof eventObj === 'undefined')
      throw new Meteor.Error('not-exists', getError('not-exists'));

    if (eventObj.finalized || now > eventObj.info.date)
      throw new Meteor.Error('already-finalized', getError('already-finalized'));

    if (_.contains(eventObj.members, userId))
      throw new Meteor.Error('already-attending', getError('already-attending'));

    if (eventObj.slots <= 0)
      throw new Meteor.Error('already-full', getError('already-full'));

    Events.update(eventId, { $addToSet: { 'members': userId }, $inc: { 'info.slots': -1 } });
  },
  unattendEvent: function (eventId) {
    var user = Meteor.user();
    var userId = this.userId;
    var now = new Date();

    if (!user || !canAttendEvent(user))
      throw new Meteor.Error('logged-out', getError('logged-out'));

    var eventObj = Events.findOne(eventId);
    if (typeof eventObj === 'undefined')
      throw new Meteor.Error('not-exists', getError('not-exists'));

    if (eventObj.finalized || now > eventObj.info.date)
      throw new Meteor.Error('already-finalized', getError('already-finalized'));

    if (!_.contains(eventObj.members, userId))
      throw new Meteor.Error('not-attending', getError('not-attending'));

    Events.update(eventId, { $pull: { 'members': userId }, $inc: { 'info.slots': -1 } });
  }
});