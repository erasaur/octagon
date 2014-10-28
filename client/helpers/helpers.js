Template.registerHelper('formatDate', function (date) {
  return moment(date).format('MMMM Do YYYY, h:mm a');
});
Template.registerHelper('formatName', function (userId) {
  console.log(Meteor.users.find().fetch());
  return getDisplayNameById(userId);
});
Template.registerHelper('formatEmail', function (userId) {
  return getEmailById(userId);
});
Template.registerHelper('isAdmin', function () {
  return Meteor.user() && isAdmin(Meteor.user());
});
Template.registerHelper('getSetting', function (setting) {
  return getSetting(setting);
});