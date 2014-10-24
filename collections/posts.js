PostsModel = new Meteor.Collection("posts");

Octagon.Posts = {
  create: function (id, title, date, content) {
    PostsModel.insert({"id": id, "title": title, "date": date, "content": content});
  },
  update: function (id, new_id, title, content) {
    PostsModel.update({_id: PostsModel.findOne({"id": id})['_id']}, {$set: {"id": new_id, "title": title, "content": content}});
  },
  delete: function(id) {
    PostsModel.remove({"_id": id});
  }
}

PostsModel.allow({
  insert: function (userId, doc) {
    //precaution against them trying to do stuff when not logged in and generating internal server errors from profile being undefined
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    //if logged in and is officer
    return (userId && officer);
  },
  update: function (userId, doc, fields, modifier) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer);
  },
  remove: function (userId, doc) {
    if(!userId) return false;
    
    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer);
  }
});