Meteor.publish('settings', function () {
  return Settings.find(); // all site-wide settings
});