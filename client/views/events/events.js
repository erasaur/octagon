Template.finalizeTemplate.helpers({
  memberList: function () {
    //need the if because without it the template can't render the modal on startup
    if(Session.get('currentEvent')) {
      if(EventsModel.findOne({"id": Session.get('currentEvent').id})) {
        var members = EventsModel.findOne({"id": Session.get('currentEvent').id}).members;
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

Template.showEmails.helpers({
  presMembers: function () {
    return Session.get('currentEvent') && Session.get('currentEvent').members.length;
  },
  getMembers: function () {
    var users = new Array();

    for (var i=0; i < Session.get('currentEvent').members.length; i++){
      users.push(Meteor.users.findOne({"_id": Session.get('currentEvent').members[i].id}).emails[0].address);
    }
    console.log(users);
    return users;
  },
  getEvent: function () {
    return Session.get('currentEvent').name;
  }
});

Template.events.helpers({
  hasEvents: function () {
    return EventsModel.find().count() > 0 ? true: false;
  },
  moreEvents: function () {
    return !(EventsModel.find().count() < Session.get('eventsLimit'));
  },
  eventsList: function () {
    return EventsModel.find();
  },
  paid: function () {
    return EventsModel.findOne({"id": this.id}).money > 0 ? true : false;
  },
  attendingEvent: function () {
    return EventsModel.find({$and: [{"id": this.id}, {"members.name": Meteor.user().profile.name}]}).count() > 0 ? true : false;
  },
  slotsLeft: function () {
    return EventsModel.findOne({"id": this.id}).slots > 0 ? true : false;
  },
  tooLate: function () {
    console.log(getDate());
    console.log(this.date);
    return getDate() >= this.date ? true : false;
  },
  finalized: function () {
    return this.finalized;
  }
});

Template.events.events({
  //todo format all ids
  'click #createEvent': function (event, template) {
    var eventID = template.find('#createID').value,
      eventName = template.find('#createEventName').value,
      eventMonth = template.find('#createMonth').value,
      eventDay = template.find('#createDay').value,
      eventYear = template.find('#createYear').value,
      eventDate,
      eventTime = template.find('#createBeginTime').value + ' ' + template.find('#createBegin').innerHTML + ' - ' + template.find('#createEndTime').value + ' ' + template.find('#createEnd').innerHTML,
      eventDescription = template.find('#createDescription').value,
      eventLocation = template.find('#createLocation').value,
      eventMoney = template.find('#createMoney').value,
      eventSlots = parseInt(template.find('#createSlots').value),
      file = template.find('#createPicture').files[0],
      errors = [];

    if(eventID && eventName && eventMonth && eventDay && eventYear && eventTime && eventDescription && eventLocation && eventMoney && eventSlots && file) {
      if(EventsModel.find({"id": eventID}).count() != 0) {
        errors.push("The event ID '" + eventID + "' already exists.");
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
      if(eventDay < 10 && eventDay.toString().length < 2) {
        eventDay = '0' + eventDay;
      }
      if(eventMonth < 10 && eventMonth.toString().length >= 2) {
        eventMonth = parseInt(eventMonth.toString().replace(/^0+/, ''));
        eventMonth = '0' + eventMonth;
      }

      eventDate = eventYear + '/' + eventMonth + '/' + eventDay;

      Octagon.Events.create(eventID, eventName, eventDate, eventTime, convertNewLines(eventDescription), eventLocation, eventMoney, eventSlots);
        
      reader.onload = function (event) {
        Octagon.Events.addUrl(eventID, event.target.result);
      }
      reader.readAsDataURL(file);

      alert("Success! Your event '" + eventName + "' has been created.");
      $('#addEventModal').modal('hide');
    }
  },
  'click .modalAddMember': function (event, template) {
    Session.set('currentEvent', this);
  },
  //-----------------------------------------------EDITED---------------------
  'click .modalShowEmails': function (event, template) {
    console.log("helloModal");
    Session.set('currentEvent', this);
    console.log(Session.get('currentEvent'));
  },//---------------------------------------------/EDITED--------------------
  'click #addEventMember': function (event, template) {
    var member = template.find('#eventMemberToAdd').value;

    if(member) {
      if(Session.get('currentEvent').slots > 0) {
        if(Meteor.users.find({"profile.name": member}).count() > 0) {
          if(EventsModel.find({$and: [{"name": Session.get('currentEvent').name}, {"members.name": member}]}).count() > 0) {
            alert("The user is already attending the event!");
          } else {
            Octagon.Events.addMember(Session.get('currentEvent').id, member, Meteor.users.findOne({"profile.name": member})['_id']);
            alert("Success! '" + member + "' has been added.");
            $('#addMemberModal').modal('hide');
          }
        } else {
          alert("The user does not exist!");
        }
      } else {
        alert("There are no more slots. Edit the event and try again.");
      }
    } else {
      alert("Please fill in all the fields!");
    }
  },
  'click .deleteEvent': function () {
    if(confirm("Are you sure you want to delete '" + this.name + "'? (This is highly advised against, even if the event is already over.)")) {
      Octagon.Events.delete(this._id);
    }
  },
  'click .editEventButton': function (event, template) {
    Session.set('currentEvent', this);

    var dateArray = this.date.split('/');
    var timeArray = this.time.split(' '); //3:00, am - 6:00, pm

    template.find('#editID').value = this.id;
    template.find('#editName').value = this.name;
    template.find('#editYear').value = dateArray[0];
    template.find('#editMonth').value = dateArray[1];
    template.find('#editDay').value = dateArray[2];
    template.find('#editBeginTime').value = timeArray[0];
    template.find('#editBegin').innerHTML = timeArray[1];
    template.find('#editEndTime').value = timeArray[3];
    template.find('#editEnd').innerHTML = timeArray[4];
    //convert the <br> to \n
    template.find('#editDescription').value = this.description.replace(/\<br\\?>/g, "\n");
    template.find('#editLocation').value = this.location;
    template.find('#editMoney').value = this.money;
    template.find('#editSlots').value = this.slots;
  },
  'click #editEvent': function (event, template) {
    var eventID = template.find('#editID').value,
      eventName = template.find('#editName').value,
      eventMonth = template.find('#editMonth').value,
      eventDay = template.find('#editDay').value,
      eventYear = template.find('#editYear').value,
      eventDate,
      eventTime = template.find('#editBeginTime').value.trim() + ' ' + template.find('#editBegin').innerHTML + ' - ' + template.find('#editEndTime').value.trim() + ' ' + template.find('#editEnd').innerHTML,
      eventDescription = convertNewLines(template.find('#editDescription').value),
      eventLocation = template.find('#editLocation').value,
      eventMoney = template.find('#editMoney').value,
      eventSlots = parseInt(template.find('#editSlots').value),
      file = template.find('#editPicture').files[0];
      errors = [];

    if(eventID && eventName && eventMonth && eventDay && eventYear && eventTime && eventDescription && eventLocation && eventMoney && eventSlots != null) {
      if(eventID != Session.get('currentEvent').id) {
        if(EventsModel.find({"id": eventID}).count() > 0) {
          errors.push("The event ID '" + eventID + "' already exists.");
        }
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
      if(eventDay < 10 && eventDay.toString().length < 2) {
        eventDay = '0' + eventDay;
      }
      if(eventMonth < 10 && eventMonth.toString().length < 2) {
        eventMonth = parseInt(eventMonth.toString().replace(/^0+/, ''));
        eventMonth = '0' + eventMonth;
      }

      eventDate = eventYear + '/' + eventMonth + '/' + eventDay;

        Octagon.Events.update(Session.get('currentEvent').id, eventID, eventName, eventDate, eventTime, convertNewLines(eventDescription), eventLocation, eventMoney, eventSlots);
        
        if(file) {
          reader.onload = function (event) {
            Octagon.Events.editUrl(eventID, event.target.result);
          }
          reader.readAsDataURL(file);
      }
      
      alert("Success! Your post '" + eventName + "' has been updated.");
      $('#editEventModal').modal('hide');
    }
  },
  'click #suggestEvent': function (event, template) {
    var eventName = template.find('#suggestName').value,
      eventDescription = template.find('#suggestDescription').value,
      eventLocation = template.find('#suggestLocation').value,
      eventCost = template.find('#suggestMoney').value,
      eventContact = template.find('#suggestContact').value,
      errors = [];

    if(eventName && eventDescription && eventLocation && eventContact) {
      if(SuggestsModel.find({"contact": eventContact}).count() > 0 || SuggestsModel.find({"name": eventName}).count() > 0 || SuggestsModel.find({"location": eventLocation}).count() > 0) {
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
    var members = EventsModel.findOne({"id": Session.get('currentEvent').id}).members,
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