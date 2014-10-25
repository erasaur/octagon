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

Template.finalizeEventModal.helpers({
  members: eventMembers
});

Template.showEmailsModal.helpers({
  members: eventMembers
});