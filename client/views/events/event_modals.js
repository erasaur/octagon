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