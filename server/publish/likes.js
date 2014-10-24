Meteor.publish("likes", function () {
  return LikesModel.find(); 
});