Template.pointsLog.helpers({
  logs: function () {
    return Logs.find();
  }
});

Template.pointsLog.events({
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
});