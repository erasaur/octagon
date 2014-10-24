Template.registerHelper('currentPage', function (page) {
  return getCurrentRoute() === page;
});
Template.registerHelper('formatDate', function (date) {
  return moment(date);
});
Template.registerHelper('formatName', function (userId) {
  return getDisplayNameById(userId);
});
Template.registerHelper('isAdmin', function () {
  return isAdmin(Meteor.user());
});