Meteor.publish('currentUser', function () {
  if (!this.userId) return;

  var user = Meteor.users.findOne(this.userId);
  var events = [];

  if (user.profile && user.profile.events)
    events = _.pluck(user.profile.events, '_id');

  return [ 
    Meteor.users.find(this.userId, { 
      fields: { 'profile': 1, 'emails': 1, 'isAdmin': 1 } 
    }), 
    Events.find({ '_id': { $in: events }}),
    Suggests.find({ 'userId': this.userId })
  ];
});