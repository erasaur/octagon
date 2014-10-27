var eventMembers = function () {
  var currentEvent = Session.get('currentEvent');
  return currentEvent && currentEvent.members;
};

Template.editEventModal.helpers({
  currentEvent: function () {
    return Session.get('currentEvent');
  }
});

// finalize event modal ------------------------------

Template.finalizeEventModal.helpers({
  members: eventMembers
});

Template.finalizeEventModal.events({
  'click #js-finalize-event': function (event, template)  {
    var currentEvent = Session.get('currentEvent');
    var members = currentEvent && currentEvent.members;

    members = _.map(members, function (member) {
      var hours = parseFloat(template.find("#js-hours-" + member).value);
      var carpool = template.$('#js-carpool-' + member).is(':checked');
      var mic = template.$('#js-mic-' + member).is(':checked');

      return { _id: member, hours: hours, carpool: carpool, mic: mic };
    });

    Meteor.call('finalizeEvent', currentEvent, members, function (error) {
      if (error)
        alert(error.reason);
      else {
        alert(getError('finalize-success'));
        $('#finalizeEventModal').modal('hide');
      }
    });
  }
});

// end finalize event modal --------------------------


// show emails modal ---------------------------------

Template.showEmailsModal.helpers({
  members: eventMembers
});

// end show emails modal -----------------------------


// add member modal ----------------------------------

Template.addMemberModal.rendered = initTypeahead;

Template.addMemberModal.helpers({
  search: search
});

Template.addMemberModal.events({
  'submit form': function (event, template) {
    event.preventDefault();
    var eventId = Session.get('currentEvent')._id;
    var member = template.find('#js-typeahead').value;

    Meteor.call('addEventMember', eventId, member, function (error) {
      if (error)
        alert(error.reason);
    });
  }
});

// end add member modal ------------------------------