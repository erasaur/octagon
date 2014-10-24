Meteor.publish('events', function (limit) {
  if (limit > Events.find().count()) {
    limit = 0;
  }
  return Events.find({}, { limit: limit, sort: { 'date': -1 } });
});