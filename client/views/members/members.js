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
  'click .delUser': function (event, template) {
    var user = this.profile.name;
    if (confirm('Are you sure you want to delete ' + user + '?')) {
      Meteor.call('removeUser', Meteor.users.findOne({'profile.name': user})['_id']);
      alert(user + ' has been deleted.');
    }
  },
  'click #addStrikes': function (event, template) {
    var member = template.find('#memberToStrike').value,
      strikes = template.find('#strikesToAdd').value,
      errors = [];

    if (member && strikes) {
      if(!isNumber(strikes)) {
        errors.push('Please enter a number for the strikes.');
      } else {
        if(Meteor.users.find({'profile.name': member}).count() == 0) {
          errors.push('The name ' + member + ' does not exist.\n\nNote: Names are case sensitive!');
        }
      }
    } else {
      errors.push('Please fill in all the fields!');
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Meteor.users.update({'_id': Meteor.users.findOne({'profile.name': member})['_id']}, {$inc: {'profile.strikes': parseInt(strikes)}});
      if(Meteor.users.findOne({'profile.name': member}).profile.strikes < 0) {
        Meteor.users.update({'_id': Meteor.users.findOne({'profile.name': member})['_id']}, {$set: {'profile.strikes': 0}});
      }
      alert('Success! The strikes have been assigned.');
      $('#addStrikesModal').modal('hide');
    }
  }
});