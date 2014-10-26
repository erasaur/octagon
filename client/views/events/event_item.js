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
    
    // logged in
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
  canAttend: function () {
    var attending = this.members && _.contains(this.members, Meteor.userId());
    var slotsLeft = !!this.info.slots;
    var tooLate = new Date() > this.info.date;

    return !attending && slotsLeft && !tooLate;
  },
  canCancel: function () {
    var tooLate = new Date() > this.info.date;
    var attending = this.members && _.contains(this.members, Meteor.userId());
    return attending && !tooLate;
  },
  tooLate: function () {
    var now = new Date();
    return now > this.info.date;
  },
  url: function () {
    var picture = Pictures.findOne(this.pictureId);
    return picture && picture.url;
  }
});

Template.eventItem.events({
  'click .js-toggle-modal': function (event, template) {
    Session.set('currentEvent', this);
  },
  'click .js-cancel-attend': function () {
    Meteor.call('unattendEvent', this._id);
  },
  'click .js-attend': function () {
    Meteor.call('attendEvent', this._id);
  }
});