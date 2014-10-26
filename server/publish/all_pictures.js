Meteor.publish('allPictures', function () {
  return Pictures.find();
});