Template.showAllEmailsModal.helpers({
  members: function () {
    return Meteor.users.find();
  }
});

Template.addPointsModal.rendered = initTypeahead;

// use server-side search so we can limit user publication in future
Template.addPointsModal.helpers({
  search: search
});

Template.addPointsModal.events({
  'click #js-add-member': function (event, template) {
    var member = template.$('#js-typeahead');
    var members = template.$('#js-members');

    if (members.val() === '')
      members.val(member.val());
    else {
      members.val(function (index, current) {
        return current + ', ' + member.val();
      });
    }
    member.val('');
  }
});

Template.addStrikesModal.rendered = initTypeahead;

Template.addStrikesModal.helpers({
  search: search
});