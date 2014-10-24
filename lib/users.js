getDisplayName = function (user) {
  return user && user.profile && user.profile.name;
};
getDisplayNameById = function (userId) {
  return getDisplayName(Meteor.users.findOne(userId));
};
getEmail = function (user) {
  return user && user.emails && user.emails[0].address;
};