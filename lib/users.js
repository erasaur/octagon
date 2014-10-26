getDisplayName = function (user) {
  return user && user.profile && user.profile.name;
};
getDisplayNameById = function (userId) {
  return getDisplayName(Meteor.users.findOne(userId));
};
getEmail = function (user) {
  return user && user.emails && user.emails[0].address;
};
getEmailById = function (userId) {
  return getEmail(Meteor.users.findOne(userId));
};
getStrikes = function (user) {
  return user && user.profile && user.profile.strikes;
};
getStrikesById = function (userId) {
  return getStrikes(Meteor.users.findOne(userId));
};