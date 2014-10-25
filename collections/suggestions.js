SuggestSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  userId: { // _id of user who suggested
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else {
        this.unset();
      }
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
    label: 'Brief description of the event'
  },
  location: {
    type: String,
    label: 'Location'
  },
  cost: {
    type: Number,
    min: 0,
    defaultValue: 0,
    optional: true,
    label: 'Cost'
  },
  contact: {
    type: String,
    label: 'Event contact info'
  },
  status: {
    type: String,
    optional: true,
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
  suggestEvent: function (suggestion) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !canSuggestEvent(user))
      throw new Meteor.Error('logged-out', getError('logged-out'));

    _.extend(suggestion, {
      userId: userId,
      createdAt: new Date(),
      status: 'pending'
    });

    if (!this.isSimulation)
      check(suggestion, SuggestSchema);

    // TODO: send notifications
    return Suggests.insert(suggestion);
  },
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






