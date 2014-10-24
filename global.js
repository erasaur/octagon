(function(){PostsModel = new Meteor.Collection("posts");
EventsModel = new Meteor.Collection("events");
SuggestsModel = new Meteor.Collection("suggests");
LikesModel = new Meteor.Collection("likes");
PicturesModel = new Meteor.Collection("pictures");
PointsModel = new Meteor.Collection("points");

Meteor.users.allow({
	update: function (userId, user, fields, modifier) {
  		var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
  		if(userId && officer) {
  			return true; //if logged in and officer, allow
  		} else {
  			if(userId === user._id) { //if the logged in user is editing his own account
	  			var allowed = ["password"]; //fields allowed to be changed
		   		if (_.difference(fields, allowed).length)
		    		return false; //don't allow change to another field

		    	return true;
		    }
		}
    }
});

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

SuggestsModel.allow({
	insert: function (userId, doc) {
		//if logged in, allow
		if (userId) return true;
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






})();
