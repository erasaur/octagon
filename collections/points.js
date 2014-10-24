PointsModel = new Meteor.Collection("points");

Octagon.PointsLog = {
  create: function (date, officer, members, points, occasion) {
    PointsModel.insert({"date": date, "name": officer, "members": members, "points": points, "occasion": occasion});
  }
}

PointsModel.allow({
  insert: function (userId, doc) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  },
  remove: function () {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  }
});