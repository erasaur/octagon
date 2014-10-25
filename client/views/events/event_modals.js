Template.editEventModal.helpers({
  currentEvent: function () {
    return Session.get('currentEvent');
  }
});

Template.suggestEventModal.events({
  'submit form': function () {
    alert(getError('suggest-success'));
  }
});

var eventMembers = function () {
  var currentEvent = Session.get('currentEvent');
  return currentEvent && currentEvent.members;
};


// finalize event modal ------------------------------

Template.finalizeEventModal.helpers({
  members: eventMembers
});

// end finalize event modal --------------------------


// show emails modal ---------------------------------

Template.showEmailsModal.helpers({
  members: eventMembers
});

// end show emails modal -----------------------------


// add member modal ----------------------------------

Template.addMemberModal.helpers({
  members: function () { // TODO: use easy search instead
    var members = Meteor.users.find().fetch();
    return _.map(members, function (member) {
      return member.profile && member.profile.name;
    });
  }
});

Template.addMemberModal.events({
  'click #js-add-member': function (event, template) {
    var eventId = Session.get('currentEvent')._id;
    var member = template.find('#js-member').value;

    Meteor.call('addEventMember', eventId, member);
  }
});

// end add member modal ------------------------------