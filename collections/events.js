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
    // autoValue: function () {
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
    // autoValue: function () {
    //   if (this.isInsert) {
    //     return [];
    //   } else {
    //     this.unset();
    //   }
    // }
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
  }
});














