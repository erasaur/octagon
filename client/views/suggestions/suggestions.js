Template.suggestions.helpers({
  hasPending: function () {
    return SuggestsModel.find().count() > 0 ? true : false;
  },
  pending: function () {  
    return SuggestsModel.find();
  },
  approved: function () {
    return SuggestsModel.findOne({name: this.name}).status == "approved" ? true : false;
  },
  rejected: function () {
    return SuggestsModel.findOne({name: this.name}).status == "rejected" ? true : false;
  }
});

Template.suggestions.events({
  'click .approveEvent': function () {
    //todo put this stuff on meteor.methods
    Meteor.users.update({"_id": this.userid}, {$inc: {"profile.suggests": 1}});
    Meteor.users.update({"_id": this.userid}, {$inc: {"profile.points": 5}});
    Octagon.Suggests.approve(this.name);
  },
  'click .unApproveEvent': function () {
    Meteor.users.update({"_id": this.userid}, {$inc: {"profile.suggests": -1}});
    Meteor.users.update({"_id": this.userid}, {$inc: {"profile.points": -5}});
    Octagon.Suggests.unApprove(this.name);
  },
  'click .rejectEvent': function () {
    Octagon.Suggests.reject(this.name);
  },
  'click .unRejectEvent': function () {
    Octagon.Suggests.unReject(this.name);
  },
  'click .deleteEvent': function () {
    if(confirm("Are you sure you want to delete '" + this.name + "'?")) {
      Octagon.Suggests.delete(this.name);
    }
  }
});