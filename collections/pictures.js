Pictures = new FS.Collection('pictures', {
  stores: [ new FS.Store.FileSystem('pictures') ],
  filter: {
    allow: {
      contentTypes: ['image/*'] // allow only images in this FS.Collection
    }
  }
});

Pictures.allow({
  insert: isAdminById,
  update: isAdminById,
  remove: isAdminById,
  download: canViewById
});

// PictureSchema = new SimpleSchema({
//   _id: {
//     type: String,
//     optional: true
//   },
//   imageId: {
//     type: String
//   },
//   caption: {
//     type: String
//   },
//   featured: {
//     type: Boolean
//   }
// });

// Pictures = new Mongo.Collection('pictures');
// Pictures.attachSchema(PictureSchema);

// Pictures.allow({
//   insert: isAdminById,
//   update: isAdminById,
//   remove: isAdminById
// });

// Meteor.methods({
//   createPicture: function (picture) {
//     var user = Meteor.user();

//     if (!user || !isAdmin(user))
//       throw new Meteor.Error('no-permission', getError('no-permission'));

//     // if (!caption)
//     //   throw new Meteor.Error('no-caption', getError('no-caption'));

//     // if (typeof file === 'undefined')
//     //   throw new Meteor.Error('no-picture', getError('no-picture'));

//     // var picture = {
//     //   caption: caption,
//     //   featured: featured
//     // };

//     // Images.insert(file, function (error, file) {
//     //   if (error)
//     //     throw new Meteor.Error('default', getError('default'));
//     //   else
//     //     picture.imageId = file._id;
//     // });

//     return Pictures.insert(picture);
//   },
//   updatePicture: function (pictureId, file, caption, featured) {
//     var user = Meteor.user();

//     if (!user || !isAdmin(user))
//       throw new Meteor.Error('no-permission', getError('no-permission'));

//     var picture = {
//       caption: caption,
//       featured: featured
//     };

//     if (typeof file !== 'undefined') {
//       Images.insert(file, function (error, file) {
//         if (error)
//           throw new Meteor.Error('default', getError('default'));
//         else
//           picture.imageId = file._id;
//       });

//       var imageId = Pictures.findOne(pictureId).imageId;
//       // storage adapter auto removes the corresponding file in fs
//       Images.remove(imageId); 
//     }

//     Pictures.update(pictureId, { $set: picture });
//   },
//   deletePicture: function (pictureId) {
//     var user = Meteor.user();

//     if (!user || !isAdmin(user))
//       throw new Meteor.Error('no-permission', getError('no-permission'));

//     var imageId = Pictures.findOne(pictureId).imageId;
//     Images.remove(imageId);

//     Pictures.remove(pictureId);
//   }
// });