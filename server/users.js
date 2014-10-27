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
  signup: function (name, email, password, rpassword) {
    var name = stripHTML(name);
    var email = stripHTML(email);

    if (!name.trim())
      throw new Meteor.Error('invalid-name', getError('invalid-name'));

    if (!email.trim())
      throw new Meteor.Error('invalid-email', getError('invalid-email'));

    if (Meteor.users.find({ 'profile.name': name }).count() > 0)
      throw new Meteor.Error('duplicate-name', getError('duplicate-name'));

    if (password.length < 6)
      throw new Meteor.Error('weak-password', getError('weak-password'));

    if (password !== rpassword)
      throw new Meteor.Error('password-mismatch', getError('password-mismatch'));

    Accounts.createUser({
      'email': email, 
      'password': password,
      'profile': {
        'name': name
      }
    });
  },
  removeUser: function (userId) {
    var user = userId || this.userId;

    // either admin or removing own account
    if (!user || !canRemoveById(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    // don't let the last admin commit suicide
    if (Meteor.users.find({ 'isAdmin': true }).count() === 1)
      throw new Meteor.Error('cannot-delete', getError('cannot-delete'));

    // don't delete users, just remove all the info
    var random = Random.id();
    Meteor.users.update(user, {
      $set: { 
        'profile.name': 'deleted', 
        'isAdmin': false,
        'emails': [{ 'address': 'deleted@nowhere.com', verified: false }],
        'password': random
      }
    });
  },
  changePass: function (password) {
    console.log(password);
    // Accounts.setPassword(id, password);
  },
  attendEvent: function (eventId) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !canAttendEvent(user))
      throw new Meteor.Error('logged-out', getError('logged-out'));

    var eventObj = Events.findOne(eventId);
    if (typeof eventObj === 'undefined')
      throw new Meteor.Error('not-exists', getError('not-exists'));

    if (eventObj.finalized)
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

    if (!user || !canAttendEvent(user))
      throw new Meteor.Error('logged-out', getError('logged-out'));

    var eventObj = Events.findOne(eventId);
    if (typeof eventObj === 'undefined')
      throw new Meteor.Error('not-exists', getError('not-exists'));

    if (eventObj.finalized)
      throw new Meteor.Error('already-finalized', getError('already-finalized'));

    if (!_.contains(eventObj.members, userId))
      throw new Meteor.Error('not-attending', getError('not-attending'));

    Events.update(eventId, { $pull: { 'members': userId }, $inc: { 'info.slots': -1 } });
  }
});