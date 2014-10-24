SuggestSchema = new SimpleSchema({
  userId: { // _id of user who suggested
    type: String
  },
  createdAt: {
    type: Date
  },
  name: {
    type: String
  },
  date: { // date of the event
    type: Date
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  cost: {
    type: Number,
    min: 0,
    optional: true
  },
  contact: {
    type: String
  },
  status: {
    type: String,
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






