Meteor.publish("posts", function () {
  return PostsModel.find({}, {sort: {"date": -1}});
});