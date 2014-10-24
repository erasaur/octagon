LikesModel = new Meteor.Collection("likes");

LikesModel.allow({
  insert: function (userId, doc) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  },
  update: function (userId, doc, fields, modifier) {
    if(userId) {var officer = Meteor.users.findOne({"_id": userId}).profile.officer;}

    if (userId && officer) {
      return true;
    } else {
      var allowed = ["likes"]; //fields allowed to be changed
        if (_.difference(fields, allowed).length)
          return false; //don't allow change to another field

        return true; //otherwise allow
    }
  },
  remove: function (userId, doc) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  }
});