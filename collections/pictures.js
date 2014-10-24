PictureSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  imageUrl: {
    type: String
  },
  caption: {
    type: String
  },
  featured: {
    type: Boolean
  }
});

Pictures = new Mongo.Collection('pictures');
Pictures.attachSchema(PictureSchema);

Pictures.allow({
  insert: isAdminById,
  update: isAdminById,
  remove: isAdminById
});

Meteor.methods({
  createPicture: function (picture) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    return Pictures.insert(picture);
  },
  updatePicture: function (picture) {
    var user = Meteor.user();
    var pictureId = picture._id;

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Pictures.update(pictureId, { $set: picture });
  },
  deletePicture: function (pictureId) {
    var user = Meteor.user();

    if (!user || !isAdmin(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Pictures.remove(pictureId);
  }
});