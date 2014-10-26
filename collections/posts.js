PostSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else {
        this.unset();
      }
    }
  },
  title: {
    type: String,
    label: 'Post title'
  },
  content: {
    type: String,
    label: 'Post content',
    autoform: {
      rows: 5
    }
  }
});

Posts = new Meteor.Collection("posts");
Posts.attachSchema(PostSchema);

Posts.before.insert(function (userId, doc) {
  if (Meteor.isServer && doc.content)
    doc.content = sanitize(marked(doc.content));
});

Posts.before.update(function (userId, doc, fields, modifier, options) {
  // sanitize before update
  if (Meteor.isServer && modifier.$set && modifier.$set.content) {
    modifier.$set = modifier.$set || {};
    modifier.$set.content = sanitize(marked(modifier.$set.content));
  }
});

Posts.allow({
  insert: isAdminById,
  update: isAdminById,
  remove: isAdminById
});

Meteor.methods({
  deletePost: function (postId) {
    var user = Meteor.user();

    if (!user || !isAdminById(user))
      throw new Meteor.Error('no-permission', getError('no-permission'));

    Posts.remove(postId);
  }
});