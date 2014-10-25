LogSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  },
  userId: {
    type: String
  },
  members: {
    type: [String]
  },
  points: {
    type: Number
  },
  description: {
    type: String
  }
});

Logs = new Mongo.Collection('logs');
Logs.attachSchema(LogSchema);

Logs.allow({
  insert: isAdminById,
  remove: isAdminById
});

Meteor.methods({
  createLog: function (log) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    _.extend(log, { userId: userId, createdAt: new Date() });

    return Logs.insert(log);
  },
  clearLog: function (log) {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    if (!this.isSimulation)
      Logs.remove();
  }
});