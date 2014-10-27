var addMember = function (event, template) {
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
};

Template.showAllEmailsModal.helpers({
  members: function () {
    return Meteor.users.find();
  }
});


// add points modal ----------------------------------

Template.addPointsModal.rendered = initTypeahead;

// use server-side search so we can limit user publication in future
Template.addPointsModal.helpers({
  search: search
});

Template.addPointsModal.events({
  'click #js-add-member': addMember
});

// end add points modal ------------------------------


// add strikes modal ---------------------------------

Template.addStrikesModal.rendered = initTypeahead;

Template.addStrikesModal.helpers({
  search: search
});

Template.addStrikesModal.events({
  'click #js-add-member': addMember,
  // 'click #js-add-strikes': function (event, template) {
  //   var members = template.$('#js-members').value;

  //   members = members
  //   Meteor.call('assignStrikes', )
  // }
});

// end add strikes modal -----------------------------