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
    type: Number,
    min: 0
  },
  meetings: {
    type: Number,
    min: 0
  },
  mic: {
    type: Number,
    min: 0
  },
  points: {
    type: Number,
    min: 0
  },
  strikes: {
    type: Number,
    min: 0
  },
  suggests: {
    type: Number,
    min: 0
  }
});

Schema.User = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
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
    defaultValue: false
  },
  profile: { // public and not editable
    type: Schema.UserProfile
  },
  services: {
    type: Object,
    blackbox: true
  },
  isDeleted: {
    type: Boolean,
    defaultValue: false
  }
});

// non-collection schema used for signupForm only
SignupSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Full Name',
    min: 3
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: 'Email'
  },
  password: {
    type: String,
    label: 'Enter password',
    min: 6
  },
  repeatPassword: {
    type: String,
    label: 'Repeat password',
    min: 6,
    custom: function () {
      if (this.value !== this.field('password').value)
        return 'passwordMismatch';
    }
  }
});

// non-collection schema used for changePassForm only
ChangePassSchema = new SimpleSchema({
  password: {
    type: String,
    label: 'New password',
    min: 6
  },
  repeatPassword: {
    type: String,
    label: 'Repeat password',
    min: 6,
    custom: function () {
      if (this.value !== this.field('password').value)
        return 'passwordMismatch';
    }
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