Meteor.publish('currentUser', function () {
  return Meteor.users.find(this.userId, { 
    fields: { 'profile': 1, 'emails': 1, 'isAdmin': 1 } 
  });
});