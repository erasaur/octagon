Meteor.publish("pictures", function () {
  return PicturesModel.find(); 
});