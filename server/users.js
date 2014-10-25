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
      throw new Meteor.Error('unmatch-passwords', getError('unmatch-passwords'));

    Accounts.createUser({
      'email': email, 
      'password': password,
      'profile': {
        'name': name
      }
    });
  },
  removeUser: function () {
    var user = this.userId;

    if (!user)
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Meteor.users.remove(user);
  },
  changePass: function (id, password) {
    Accounts.setPassword(id, password);
  }
});