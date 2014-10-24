PicturesModel = new Meteor.Collection("pictures");

Octagon.Pictures = {
  create: function (url, caption, featured) {
    PicturesModel.insert({"source": url, "caption": caption, "featured": featured});
  },
  update: function (url, new_url, caption, featured) {
    PicturesModel.update({"_id": PicturesModel.findOne({"source": url})._id}, {$set: {"source": new_url, "caption": caption, "featured": featured}});
  },
  delete: function (url) {
    PicturesModel.remove({"_id": PicturesModel.findOne({"source": url})._id});
  }
}

PicturesModel.allow({
  insert: function (userId, doc) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  },
  update: function (userId, doc, fields, modifier) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  },
  remove: function (userId, doc) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  }
});