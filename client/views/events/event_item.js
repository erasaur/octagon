Template.eventItem.helpers({
  eventStatus: function () {
    // if logged in
      // if attending
        // if too late && finalized, return 'this event has been completed'
        // if too late && not finalized, return 'sit tight while we distribute your points :)'
        // else if not too late, return you are attending
      // else
        // if finalized, show this event has been completed
        // else if too late, show this event is in process/has been completed
        // else if no slots, show 'sorry, no more slots available!'
    // else
      // if too late
        // if finalized, show completed
        // else show in progress
      // else show not started
  },
  // attendingEvent: function () {
  //   return Events.find({$and: [{"id": this.id}, {"members.name": Meteor.user().profile.name}]}).count() > 0 ? true : false;
  // },
  // slotsLeft: function () {
  //   return Events.findOne({"id": this.id}).slots > 0 ? true : false;
  // },
  // tooLate: function () {
  //   console.log(getDate());
  //   console.log(this.date);
  //   return getDate() >= this.date ? true : false;
  // },
  // finalized: function () {
  //   return this.finalized;
  // },
  image: function () {
    console.log(this.pictureId);
    var picture = Pictures.findOne(this.pictureId);
    return picture && picture.url;
  }
});

Template.eventItem.events({
  'click .js-event-modal': function () {
    Session.set('currentEvent', this);
  },
  'click .js-cancel-attend': function () {

  },
  'click .js-attend': function () {

  }
});