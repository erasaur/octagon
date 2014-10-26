Meteor.publish('suggests', function () {
  if (isAdminById(this.userId))
    return Suggests.find();
});