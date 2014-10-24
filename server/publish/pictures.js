Meteor.publish('pictures', function () {
  return Pictures.find(); 
});