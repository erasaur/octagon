var Schema = {};

Schema.UserProfile = new SimpleSchema({
  name: {
    type: String
  },
  events: {
    type: [Object],
    blackbox: true
  },
  carpool: {
    type: Number
  },
  meetings: {
    type: Number
  },
  mic: {
    type: Number
  },
  points: {
    type: Number
  },
  strikes: {
    type: Number
  },
  suggests: {
    type: Number
  }
});

Schema.User = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  'emails.$.verified': {
    type: Boolean
  },
  isAdmin: {
    type: Boolean,
    optional: true
  },
  profile: { // public and not editable
    type: Schema.UserProfile
  },
  services: {
    type: Object,
    blackbox: true
  }
});

Meteor.users.attachSchema(Schema.User);

Meteor.users.allow({
  update: canEditById,
  remove: canRemoveById
});

Meteor.users.deny({
  update: function (userId, user, fields) {
    if (isAdminById(userId)) return false;

    return _.without(fields, 'password').length > 0;
  }
});