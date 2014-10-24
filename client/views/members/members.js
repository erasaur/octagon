Template.members.helpers({
  hasMembers: function () {
    return Meteor.users.find();
  },
  hasAssigned: function () {
    return PointsModel.find().count();
  },
  pointsLog: function () {
    return PointsModel.find();
  }
});

Template.members.events({
  'click #appendName': function () {
    var users = $('#membersToAdd');
    if(users.val() == "") {
      users.val(users.val() + $('#addToMembers').val());
    } else {
      users.val(users.val() + ", " + $('#addToMembers').val());
    }
    $('#addToMembers').val("");
  },
  'click #addPoints': function (event, template) {
    var members = template.find('#membersToAdd').value,
      points = template.find('#pointsToAdd').value,
      occasion = template.find('#occasion').value,
      meeting = $('#isMeeting').is(':checked'),
      errors = [];

    if (members && points && occasion) {
      if(!isNumber(points)) {
        errors.push("Please enter a number for the points.");
      } else {
        var usersArray = members.split(',');
        for(var i=0; i< usersArray.length; i++) {
          usersArray[i] = usersArray[i].trim();
          if(Meteor.users.find({"profile.name": usersArray[i]}).count() == 0) {
            errors.push("The name '" + usersArray[i] + "' does not exist.\n\nNote: Names are case sensitive!");
          }
        }
      }
    } else {
      errors.push("Please fill in all the fields!");
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      for(var i=0; i< usersArray.length; i++) {
        Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": usersArray[i]})['_id']}, {$inc: {"profile.points": parseInt(points)}});
        if(Meteor.users.findOne({"profile.name": usersArray[i]}).profile.points < 0) {
          Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": usersArray[i]})['_id']}, {$set: {"profile.points": 0}});
        }

        if(meeting) {
          Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": usersArray[i]})['_id']}, {$inc: {"profile.meetings": 1}});
        }
      }

      Octagon.PointsLog.create(getDate(), Meteor.user().profile.name, members, points, occasion);
      alert("Success! The points have been assigned.");
      $('#addPointsModal').modal('hide');
    }
  },
  'click #clearLog': function () {
    if (confirm("Are you sure you want to clear the log?")) {
      Meteor.call('clearLog');
      alert("Log has been cleared!");
    }
  },
  'click .delUser': function (event, template) {
    var user = this.profile.name;
    if (confirm("Are you sure you want to delete " + user + "?")) {
      Meteor.call('removeUser', Meteor.users.findOne({"profile.name": user})['_id']);
      alert(user + " has been deleted.");
    }
  },
  'click #addStrikes': function (event, template) {
    var member = template.find('#memberToStrike').value,
      strikes = template.find('#strikesToAdd').value,
      errors = [];

    if (member && strikes) {
      if(!isNumber(strikes)) {
        errors.push("Please enter a number for the strikes.");
      } else {
        if(Meteor.users.find({"profile.name": member}).count() == 0) {
          errors.push("The name '" + member + "' does not exist.\n\nNote: Names are case sensitive!");
        }
      }
    } else {
      errors.push("Please fill in all the fields!");
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": member})['_id']}, {$inc: {"profile.strikes": parseInt(strikes)}});
      if(Meteor.users.findOne({"profile.name": member}).profile.strikes < 0) {
        Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": member})['_id']}, {$set: {"profile.strikes": 0}});
      }
      alert("Success! The strikes have been assigned.");
      $('#addStrikesModal').modal('hide');
    }
  }
});