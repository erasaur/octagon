SettingsSchema = new SimpleSchema({
  name: { // name of the club
    type: String,
    optional: true
  },
  likes: { // number of likes the site received
    type: Number,
    min: 0
  }
});

Settings = new Mongo.Collection('settings');
Settings.attachSchema(SettingsSchema);

Settings.allow({
  update: function (userId, setting, fields) {
    if (!userId) return false;

    if (isAdminById(userId))
      return true;
  
    return (_.without(fields, 'likes').length === 0);
  }
});