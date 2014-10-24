Meteor.publish("suggests", function () {
  return SuggestsModel.find();
});