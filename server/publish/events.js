Meteor.publish("events", function (limit) {
  if (limit > EventsModel.find().count()) {
    limit = 0;
  }
  return EventsModel.find({}, {limit: limit, sort: {"date": -1}});
});