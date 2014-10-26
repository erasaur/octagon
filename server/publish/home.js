Meteor.publish('home', function () {
  return [ Pictures.find({ 'metadata.featured': true }), Posts.find() ];
});