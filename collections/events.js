EventsModel = new Meteor.Collection("events");

Octagon.Events = {
  create: function (id, name, date, time, description, location, money, slots) {
    EventsModel.insert({"id": id, "name": name, "date": date, "time": time, "description": description, "location": location, "money": money, "slots": slots, "members": [], "finalized": false});
  },
  addUrl: function (id, url) {
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$set: {"image": url}});
  },
  update: function (id, new_id, name, date, time, description, location, money, slots) {
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$set: {"id": new_id, "name": name, "date": date, "time": time, "description": description, "location": location, "money": money, "slots": slots}});
  },
  editUrl: function (id, url) {
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$set: {"image": url}});
  },
  addMember: function (id, member, memberid) {
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$push: {"members": {"name": member, "id": memberid}}});
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$inc: {"slots": -1}});
  },
  removeMember: function (id, member) {
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$pull: {"members": {"name": member}}});
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$inc: {"slots": 1}});
  },
  finalize: function (id) {
    EventsModel.update({_id: EventsModel.findOne({"id": id})['_id']}, {$set: {"finalized": true}});
  },
  delete: function(id) {
    EventsModel.remove({"_id": id});
  }
}

EventsModel.allow({
  insert: function (userId, doc) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer);
  },
  update: function (userId, doc, fields, modifier) {
    if(!userId) return false; //not logged in, return false (don't allow)

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    if (userId && officer) {
      return true;
    } else {
      var allowed = ["members", "slots"]; //fields allowed to be changed
        if (_.difference(fields, allowed).length)
          return false; //don't allow change to another field

        return true;
    }
  },
  remove: function (userId, doc) {
    if(!userId) return false;

    var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
    return (userId && officer); //only if officer & logged in, allow
  }
});