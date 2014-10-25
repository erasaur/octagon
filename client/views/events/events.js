Template.finalizeTemplate.helpers({
  memberList: function () {
    //need the if because without it the template can't render the modal on startup
    if(Session.get('currentEvent')) {
      if(Events.findOne({"id": Session.get('currentEvent').id})) {
        var members = Events.findOne({"id": Session.get('currentEvent').id}).members;
        if(members) {
          var names = new Array();
          for(var i=0; i< members.length; i++) {
            names.push(members[i].name);
          }
          return names;
        }
      }
    }
  },
  memberID: function () {
    return formatID(this);
  }
});

// Template.showEmails.helpers({
//   presMembers: function () {
//     return Session.get('currentEvent') && Session.get('currentEvent').members.length;
//   },
//   getMembers: function () {
//     var users = new Array();

//     for (var i=0; i < Session.get('currentEvent').members.length; i++){
//       users.push(Meteor.users.findOne({"_id": Session.get('currentEvent').members[i].id}).emails[0].address);
//     }
//     console.log(users);
//     return users;
//   },
//   getEvent: function () {
//     return Session.get('currentEvent').name;
//   }
// });

Template.events.helpers({
  moreEvents: function () {
    return !(Events.find().count() < Session.get('eventsLimit'));
  },
  eventsList: function () {
    return Events.find();
  },
  currentEvent: function () {
    return Session.get('currentEvent');
  }
});

Template.events.events({
  'submit form': function () {
    $('.modal').modal('hide');
  },
  // 'click #addEventMember': function (event, template) {
  //   var member = template.find('#eventMemberToAdd').value;

  //   if(member) {
  //     if(Session.get('currentEvent').slots > 0) {
  //       if(Meteor.users.find({"profile.name": member}).count() > 0) {
  //         if(Events.find({$and: [{"name": Session.get('currentEvent').name}, {"members.name": member}]}).count() > 0) {
  //           alert("The user is already attending the event!");
  //         } else {
  //           Octagon.Events.addMember(Session.get('currentEvent').id, member, Meteor.users.findOne({"profile.name": member})['_id']);
  //           alert("Success! '" + member + "' has been added.");
  //           $('#addMemberModal').modal('hide');
  //         }
  //       } else {
  //         alert("The user does not exist!");
  //       }
  //     } else {
  //       alert("There are no more slots. Edit the event and try again.");
  //     }
  //   } else {
  //     alert("Please fill in all the fields!");
  //   }
  // },
  'click #suggestEvent': function (event, template) {
    var eventName = template.find('#suggestName').value,
      eventDescription = template.find('#suggestDescription').value,
      eventLocation = template.find('#suggestLocation').value,
      eventCost = template.find('#suggestMoney').value,
      eventContact = template.find('#suggestContact').value,
      errors = [];

    if(eventName && eventDescription && eventLocation && eventContact) {
      if(Suggests.find({"contact": eventContact}).count() > 0 || Suggests.find({"name": eventName}).count() > 0 || Suggests.find({"location": eventLocation}).count() > 0) {
        errors.push("Oops! We believe the event has already been suggested.")
      }
    } else {
      errors.push("Please fill in all fields!");
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Octagon.Suggests.create(eventName, getDate(), convertNewLines(eventDescription), eventLocation, eventCost, eventContact, Meteor.user().username, Meteor.user().profile.name, Meteor.userId());
      alert("Thanks for your input! \n\nYour event will be taken into consideration; upon approval, you will receive 5 points.\n\nDon't get your hopes too high though.");
      $('#suggestEventModal').modal('hide');
    }
  },
  'click .attendEvent': function () {
    Octagon.Events.addMember(this.id, Meteor.user().profile.name, Meteor.userId());
  },
  'click .cancelAttend': function () {
    Octagon.Events.removeMember(this.id, Meteor.user().profile.name);
  },
  'click .finalizeEventButton': function () {
    Session.set('currentEvent', this);
    $('#finalizeMemberList').html(Meteor.render(Template.finalizeTemplate));
  },
  'click #finalizeEvent': function (event, template)  {
    var members = Events.findOne({"id": Session.get('currentEvent').id}).members,
    points, hours, mic = false, carpool = false, membersArray = new Array(), errors = [];

    if(members) {
      for(var i=0; i< members.length; i++) {
        //append name to array so we can use it in the log
        if(i > 0) {
          membersArray.push(" " + members[i].name);
        } else {
          membersArray.push(members[i].name);
        }

        //get the value of the text box whose id is the current member's name (aka the "hours" input)
        hours = parseFloat(template.find("#" + formatID(members[i].name)).value);
        points = hours*POINTS_PER_HOUR;
        console.log(points);
        if($('#' + members[i].name + 'c').is(":checked")) {
          points += POINTS_FOR_CARPOOL;
          //update carpool count
          Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.carpool": 1}});
          carpool = true;
        }
        if($('#' + members[i].name + 'm').is(":checked")) {
          points += POINTS_FOR_MIC;
          //update mic count
          Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.mic": 1}});
          mic = true;
        }

        if(points > 0) {
          //update profile total points
          Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.points": points}});
          //update profile events array
          Meteor.users.update({"_id": members[i].id}, {$addToSet: {"profile.events": {"id": Session.get('currentEvent').id, "name": Session.get('currentEvent').name, "date": Session.get('currentEvent').date, "hours": hours, "mic": mic, "carpool": carpool}}});
        } else {
          Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.strikes": 1}});
          Meteor.users.update({"_id": members[i].id}, {$addToSet: {"profile.events": {"id": Session.get('currentEvent').id, "name": Session.get('currentEvent').name, "date": Session.get('currentEvent').date, "hours": 0, "mic": mic, "carpool": carpool}}});
          if(Meteor.users.findOne({"_id": members[i].id}).profile.strikes % 3 == 0) {
            Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.points": -THREE_STRIKES_PENALTY}});
            if(Meteor.users.findOne({"_id": members[i].id}).profile.points < 0) {
              Meteor.users.update({"_id": members[i].id}, {$set: {"profile.points": 0}});
            }
          }
        }
      }
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Octagon.PointsLog.create(getDate(), Meteor.user().profile.name, membersArray, "event", Session.get('currentEvent').name + " [" + Session.get('currentEvent').date + "]");
      Octagon.Events.finalize(Session.get('currentEvent').id);
      alert("Success! The event has been finalized.");
      $('#finalizeEventModal').modal('hide');
    }
  },
  'click #finalizeAnyway': function () {
    Octagon.Events.finalize(Session.get('currentEvent').id);
    alert("I see you have no choice. It has been done.");
    $('#finalizeEventModal').modal('hide');
  }
});