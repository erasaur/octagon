var Schema = {};

Schema.EventInfo = new SimpleSchema({
  name: {
    type: String,
    label: 'Name'
  },
  date: {
    type: Date,
    label: 'Date'
  },
  description: {
    type: String,
    label: 'Brief description of the event'
  },
  location: {
    type: String,
    label: 'Location'
  },
  cost: { // omitted if zero
    type: Number,
    min: 0,
    defaultValue: 0,
    optional: true,
    label: 'Cost'
  },
  slots: {
    type: Number,
    optional: true,
    label: 'Slots available'
  }
});

Schema.Events = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
    // , autoValue: function () {
    //   if (this.isInsert) {
    //     return new Date;
    //   } else {
    //     this.unset();
    //   }
    // }
  },
  info: {
    type: Schema.EventInfo
  },
  members: {
    type: [String],
    optional: true
  },
  finalized: {
    type: Boolean,
    optional: true
  },
  pictureId: {
    type: String,
    optional: true
  }
});

Events = new Mongo.Collection("events");
Events.attachSchema(Schema.Events);

Events.allow({
  insert: isAdminById,
  update: function (userId, event, fields) {
    if (!userId) return false;

    if (isAdminById(userId))
      return true;
  
    return (_.without(fields, 'members').length === 0);
  },
  remove: isAdminById
});

Events.before.insert(function (userId, doc) {
  if (Meteor.isServer && doc.description)
    doc.description = sanitize(marked(doc.description));
});

Events.before.update(function (userId, doc, fields, modifier, options) {
  // sanitize before update
  if (Meteor.isServer && modifier.$set && modifier.$set.description) {
    modifier.$set = modifier.$set || {};
    modifier.$set.description = sanitize(marked(modifier.$set.description));
  }
});

Meteor.methods({
  createEvent: function (event) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    if (!this.isSimulation) {
      Schema.Events.clean(event);
      check(event, Schema.Events);
    }

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

    if (!this.isSimulation) {
      Schema.Events.clean(event);
      check(event, Schema.Events);
    }

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
  attendEvent: function (eventId) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !canAttendEvent(user))
      throw new Meteor.Error('logged-out', getError('logged-out'));

    var eventObj = Events.findOne(eventId);
    if (typeof eventObj === 'undefined')
      throw new Meteor.Error('not-exists', getError('not-exists'));

    if (eventObj.finalized)
      throw new Meteor.Error('already-finalized', getError('already-finalized'));

    if (_.contains(eventObj.members, userId))
      throw new Meteor.Error('already-attending', getError('already-attending'));

    if (eventObj.slots <= 0)
      throw new Meteor.Error('already-full', getError('already-full'));

    Events.update(eventId, { $addToSet: { 'members': userId } });
  },
  unattendEvent: function (eventId) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !canAttendEvent(user))
      throw new Meteor.Error('logged-out', getError('logged-out'));

    var eventObj = Events.findOne(eventId);
    if (typeof eventObj === 'undefined')
      throw new Meteor.Error('not-exists', getError('not-exists'));

    if (eventObj.finalized)
      throw new Meteor.Error('already-finalized', getError('already-finalized'));

    if (!_.contains(eventObj.members, userId))
      throw new Meteor.Error('not-attending', getError('not-attending'));

    Events.update(eventId, { $pull: { 'members': userId } });
  }
});
















