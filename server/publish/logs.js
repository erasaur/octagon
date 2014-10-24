Meteor.publish('logs', function () {
  return Logs.find({}, { sort: { 'date': -1 } });
});