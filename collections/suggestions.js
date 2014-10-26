SuggestSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  userId: { // _id of user who suggested
    type: String,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert)
        return Meteor.userId();
      else
        this.unset();
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert)
        return new Date;
      else
        this.unset();
    }
  },
  name: {
    type: String,
    label: 'Name'
  },
  date: { // date of the event
    type: Date,
    label: 'Date'
  },
  description: {
    type: String,
    label: 'Brief description of the event',
    autoform: {
      rows: 5
    }
  },
  location: {
    type: String,
    label: 'Location'
  },
  cost: {
    type: Number,
    min: 0,
    defaultValue: 0,
    label: 'Cost'
  },
  contact: {
    type: String,
    label: 'Event contact info'
  },
  status: {
    type: String,
    autoform: {
      omit: true
    },
    defaultValue: 'pending'
  }
});

Suggests = new Mongo.Collection('suggests');
Suggests.attachSchema(SuggestSchema);

Suggests.allow({
  insert: canSuggestEventById,
  update: isAdminById,
  remove: isAdminById
});

Suggests.before.insert(function (userId, doc) {
  if (Meteor.isServer && doc.description)
    doc.description = sanitize(marked(doc.description));
});

Suggests.before.update(function (userId, doc, fields, modifier, options) {
  // sanitize before update
  if (Meteor.isServer && modifier.$set && modifier.$set.description) {
    modifier.$set = modifier.$set || {};
    modifier.$set.description = sanitize(marked(modifier.$set.description));
  }
});

Meteor.methods({
  approveSuggestion: function (suggestId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Suggests.update(suggestId, { $set: { 'status': 'approved' } });
  },
  rejectSuggestion: function (suggestId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Suggests.update(suggestId, { $set: { 'status': 'rejected' } });
  },
  resetSuggestion: function (suggestId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Suggests.update(suggestId, { $set: { 'status': 'pending' } });
  },
  deleteSuggestion: function (suggestId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Suggests.remove(suggestId);
  }
});






