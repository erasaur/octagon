Template.eventItem.helpers({
  eventStatus: function () {
    var userId = Meteor.userId();
    var tooLate = new Date() > this.info.date;
    var finalized = this.finalized;
    var attending = this.members && _.contains(this.members, userId);
    var noSlots = this.slots === 0;

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
    var slotsLeft = !!this.slots;
    var tooLate = new Date() > this.info.date;

    return !attending && slotsLeft && !tooLate;
  },
  attending: function () {
    return this.members && _.contains(this.members, Meteor.userId());
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
  'click .js-event-modal': function (event, template) {
    Session.set('currentEvent', this);
    displayModal(event.target.getAttribute('data-toggle'));
  },
  'click .js-cancel-attend': function () {

  },
  'click .js-attend': function () {

  }
});