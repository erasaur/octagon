Template.registerHelper('formatDate', function (date) {
  return moment(date).format('MMMM Do YYYY, h:mm a');
});
Template.registerHelper('formatName', function (userId) {
  return getDisplayNameById(userId);
});
Template.registerHelper('formatEmail', function (userId) {
  return getEmailById(userId);
});
Template.registerHelper('isAdmin', function () {
  return Meteor.user() && isAdmin(Meteor.user());
});