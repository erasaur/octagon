Meteor.publish('suggests', function () {
  if (this.userId && isAdminById(this.userId))
    return Suggests.find();
});