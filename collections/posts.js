PostSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  title: {
    type: String
  },
  createdAt: {
    type: Date
  },
  content: {
    type: String
  }
});

PostsModel = new Meteor.Collection("posts");

Posts.before.insert(function (userId, doc) {
  if (Meteor.isServer && doc.description)
    doc.description = sanitize(marked(doc.description));
});

Posts.before.update(function (userId, doc, fields, modifier, options) {
  // sanitize before update
  if (Meteor.isServer && modifier.$set && modifier.$set.description) {
    modifier.$set = modifier.$set || {};
    modifier.$set.description = sanitize(marked(modifier.$set.description));
  }
});

PostsModel.allow({
  insert: isAdminById,
  update: isAdminById,
  remove: isAdminById
});

Meteor.methods({
  createPost: function (post) {
    var user = Meteor.user();

    if (!user || !isAdminById(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    return Posts.insert(post);
  },
  updatePost: function (post) {
    var user = Meteor.user();
    var postId = post._id;

    if (!user || !isAdminById(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Posts.update(postId, { $set: post });
  },
  deletePost: function (postId) {
    var user = Meteor.user();

    if (!user || !isAdminById(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Posts.remove(postId);
  }
});