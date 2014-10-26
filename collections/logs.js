LogSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  },
  userId: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  members: {
    type: [String],
    label: 'Members'
  },
  points: {
    type: Number,
    optional: true,
    label: 'Points to give'
  },
  description: {
    type: String,
    label: 'Occassion'
  },
  isMeeting: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    label: 'Normal Meeting?'
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

    // don't use schema clean because this method is usually
    // called from other meteor methods
    _.extend(log, { userId: userId, createdAt: new Date() });
    check(log, LogSchema);

    return Logs.insert(log);
  },
  clearLog: function () {
    var user = Meteor.user();
    var userId = this.userId;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    if (!this.isSimulation)
      Logs.remove();
  }
});