Template.contactHeader.helpers({
  likes: function () {
    var settings = Settings.findOne();
    return settings && settings.likes || 0;
  }
});

Template.contactHeader.events({
  'click #js-like': function () {
    Meteor.call('like');
  }
});