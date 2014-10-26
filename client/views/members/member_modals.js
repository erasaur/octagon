// Template.showAllEmailsModal.helpers({
//   members: function () {
//     return Meteor.users.find();
//   }
// });

Template.addPointsModal.rendered = function () {
  var members = Meteor.users.find().fetch();
  Meteor.typeahead($('.typeahead'), members.map(function (v) {
    return { value: v.profile.name }
  }));
};

// Template.addPointsModal.helpers({
//   members: function () {
//     return Meteor.users.find();
//   }
// })