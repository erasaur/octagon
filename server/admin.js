Meteor.methods({
  createEvent: function (event) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    check(event, Schema.Events);

    var eventObj = {
      userId: userId,
      createdAt: new Date(),
      info: event.info,
      members: [],
      finalized: false,
      pictureId: event.pictureId
    };

    // TODO: send notifications
    return Events.insert(eventObj);  
  },
  updateEvent: function (event) {
    var user = Meteor.user();
    var eventId = event._id;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    check(event, Schema.Events);

    Events.update(eventId, { $set: { 'info': event.info } });
  },
  finalizeEvent: function (eventId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    // TODO: update points log here

    Events.update(eventId, { $set: { 'finalized': true } });
  },
  deleteEvent: function (eventId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Events.remove(eventId);      
  },
  addEventMember: function (eventId, userId) {
    var currentUser = Meteor.user();
    var user = Meteor.users.findOne(userId);
    var eventObj = Events.findOne(eventId);

    if (!currentUser || !isAdmin(currentUser))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    if (!eventObj)
      throw new Meteor.Error('invalid-event', getError('invalid-event'));

    if (!user)
      throw new Meteor.Error('invalid-user', getError('invalid-user'));

    if (eventObj.members && _.contains(eventObj.members, userId))
      throw new Meteor.Error('user-attending', getError('user-attending'));

    if (eventObj.slots <= 0)
      throw new Meteor.Error('event-full', getError('event-full'));

    Events.update(eventId, { $addToSet: { 'members': userId }, $inc: { 'slots': -1 } });
  }
});
