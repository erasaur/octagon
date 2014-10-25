Meteor.publish('logs', function () {
  return Logs.find();
});