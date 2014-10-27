Template.eventItemHeader.helpers({
  canFinalize: function () {
    var user = Meteor.user();
    var now = new Date();
    return user && isAdmin(user) && now > this.info.date && !this.finalized;
  },
  canAttend: function () {
    var user = Meteor.user();
    var attending = this.members && _.contains(this.members, Meteor.userId());
    var slotsLeft = !!this.info.slots;
    var tooLate = new Date() > this.info.date;

    return user && !attending && slotsLeft && !tooLate;
  },
  canCancel: function () {
    var user = Meteor.user();
    var tooLate = new Date() > this.info.date;
    var attending = this.members && _.contains(this.members, Meteor.userId());
    return user && attending && !tooLate && !this.finalized;
  }
});

Template.eventItemHeader.events({
  'click .js-delete-event': function () {
    if (confirm(getError('confirm-delete'))) {
      Meteor.call('deleteEvent', this._id, function (error) {
        if (error)
          alert(error.reason)
      });
    }
  },
  'click .js-toggle-modal': function (event, template) {
    Session.set('currentEvent', this);
  },
  'click .js-cancel-attend': function () {
    Meteor.call('unattendEvent', this._id, function (error) {
      if (error)
        alert(error.reason);
    });
  },
  'click .js-attend': function () {
    Meteor.call('attendEvent', this._id, function (error) {
      if (error)
        alert(error.reason);
    });
  }
});

Template.eventItem.helpers({
  eventStatus: function () {
    var userId = Meteor.userId();
    var tooLate = new Date() > this.info.date;
    var finalized = this.finalized;
    var attending = this.members && _.contains(this.members, userId);
    var noSlots = this.info.slots === 0;

    if (!userId) { // not logged in
      if (tooLate)
        return finalized ? 'Completed': 'In Progress';
      else
        return 'Not Started';
    }
    
    // logged in and attending
    if (attending) {
      if (tooLate)
        return finalized ? 'This event has been completed': 'Sit tight while we distribute your points :)'
      else
        return 'You are attending.';
    } 
    else { // not attending
      if (finalized)
        return 'This event has been completed.';
      else if (tooLate)
        return 'This event is in process/has been completed';
      else if (noSlots)
        return 'Sorry, no more slots available!';
    }
  },
  tooLate: function () {
    var now = new Date();
    return now > this.info.date;
  },
  url: function () {
    var picture = Pictures.findOne(this.pictureId);
    return picture && picture.url();
  }
});