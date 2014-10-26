Template.events.helpers({
  moreEvents: function () {
    return !(Events.find().count() < Session.get('eventsLimit'));
  },
  events: function () {
    return Events.find({}, { $sort: { 'info.date': -1 } });
  }
});

Template.eventsHeader.events({
  'click .js-event-modal': function (event, template) {
    displayModal(event.target.getAttribute('data-toggle'));
  }
});