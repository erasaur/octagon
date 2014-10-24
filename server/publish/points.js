Meteor.publish("points", function () {
  return PointsModel.find({}, {sort: {"date": -1}});
});