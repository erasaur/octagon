Template.showAllEmailsModal.helpers({
  members: function () {
    return Meteor.users.find();
  }
});

Template.addPointsModal.rendered = function () {
  Meteor.typeahead($('#js-member'));
};

// use server-side search so we can limit user publication in future
Template.addPointsModal.helpers({
  search: function (query, callback) {
    Meteor.call('search', query, { fields: { 'profile.name': 1 } }, function (error, result) {
      if (error) {
        console.log(error.reason);
        return;
      }
      callback(result.map(function (v) { 
        return { value: v.profile.name }; 
      }));
    });
  }
});

Template.addPointsModal.events({
  'click #js-add-member': function (event, template) {
    var member = template.$('#js-member');
    var members = template.$('#js-members');

    if (members.val() === '')
      members.val(member.val());
    else {
      members.val(function (_, current) {
        return current + ', ' + member.val();
      });
    }
    member.val('');
  }
});