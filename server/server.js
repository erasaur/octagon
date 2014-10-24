//publications
Meteor.publish("posts", function () {
	return PostsModel.find({}, {sort: {"date": -1}});
});
Meteor.publish("events", function (limit) {
	if (limit > EventsModel.find().count()) {
		limit = 0;
	}
	return EventsModel.find({}, {limit: limit, sort: {"date": -1}});
});
Meteor.publish("suggests", function () {
	return SuggestsModel.find();
});
Meteor.publish("members", function () {
  return Meteor.users.find({}, {fields: {username: 1, emails: 1, profile: 1}});
});
Meteor.publish("likes", function () {
	return LikesModel.find(); 
});
Meteor.publish("pictures", function () {
	return PicturesModel.find(); 
});
Meteor.publish("points", function () {
	return PointsModel.find({}, {sort: {"date": -1}});
});

Accounts.emailTemplates.siteName = "Lynbrook Octagon";
Accounts.emailTemplates.from = "LHS Octagon Officers <lhs8octagon@gmail.com>"
Accounts.emailTemplates.resetPassword.text = function (user, url) {
	return "Hey there " + user.profile.name + "!\n\n So I heard you lost your password! No worries. To reset your password, simply click on the link below: \n\n" + url + "\n\nCheers,\n\nYour officers";
};

Meteor.methods({
	removeUser: function (id) {
		Meteor.users.remove({"_id": id});
	},
	changePass: function (id, password) {
		Accounts.setPassword(id, password);
	},
	clearLog: function () {
		PointsModel.remove({});
	}
});













