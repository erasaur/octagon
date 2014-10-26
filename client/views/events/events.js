Template.events.helpers({
  moreEvents: function () {
    return !(Events.find().count() < Session.get('eventsLimit'));
  },
  events: function () {
    return Events.find({}, { $sort: { 'info.date': -1 } });
  }
});