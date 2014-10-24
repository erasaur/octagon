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













