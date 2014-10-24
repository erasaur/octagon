isAdmin = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return !!user && !!user.isAdmin;
};
isAdminById = function (userId) {
  var user = Meteor.users.findOne(userId);
  return isAdmin(user);
};
canAttendEvent = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;  
  return !!user;
};