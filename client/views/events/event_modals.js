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

Template.addMemberModal.rendered = function () {
  Meteor.typeahead($('#js-member'));
};

Template.addMemberModal.helpers({
  members: function () {
    var members = Meteor.users.find().fetch();
    return _.map(members, function (member) {
      return member.profile && member.profile.name;
    });
  }
});

Template.addMemberModal.events({
  'submit form': function (event, template) {
    event.preventDefault();
    var eventId = Session.get('currentEvent')._id;
    var member = template.find('#js-member').value;

    Meteor.call('addEventMember', eventId, member, function (error) {
      if (error)
        alert(error.reason);
    });
  }
});

// end add member modal ------------------------------