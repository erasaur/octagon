Meteor.publish('suggests', function () {
  return Suggests.find();
});