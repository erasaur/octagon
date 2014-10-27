Template.members.helpers({
  members: function () {
    return Meteor.users.find();
  },
  logs: function () {
    return Logs.find();
  }
});

Template.members.events({
  'click #js-clear-log': function () {
    if (confirm(getError('confirm-clear-log'))) {
      Meteor.call('clearLog', function (error) {
        if (error)
          alert(error.reason)
        else
          alert('Log has been cleared!');
      });
    }
  },
  'click .js-delete-user': function (event, template) {
    if (confirm(getError('confirm-delete'))) {
      Meteor.call('removeUser', this._id);
      alert(getError('after-delete'));
    }
  }
});