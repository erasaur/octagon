SuggestsSchema = new SimpleSchema({
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
Suggests.attachSchema(SuggestsSchema);

Suggests.allow({
  insert: canSuggestEventById,
  update: isAdminById,
  remove: isAdminById
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

    suggestion._id = Suggests.insert(suggestion);

    // TODO: send notifications

    return suggestion._id;
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






