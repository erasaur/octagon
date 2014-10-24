Octagon.Suggests = {
	create: function (name, date, description, location, cost, contact, uname, user, userid) {
		SuggestsModel.insert({"name": name, "date": date, "description": description, "location": location, "cost": cost, "contact": contact, "uname": uname, "user": user, "userid": userid, "status": "pending"});
	},
	approve: function (name) {
		SuggestsModel.update({_id: SuggestsModel.findOne({"name": name})['_id']}, {$set: {"status": "approved"}});
	},
	unApprove: function (name) {
		SuggestsModel.update({_id: SuggestsModel.findOne({"name": name})['_id']}, {$set: {"status": "pending"}});
	},
	reject: function (name) {
		SuggestsModel.update({_id: SuggestsModel.findOne({"name": name})['_id']}, {$set: {"status": "rejected"}});
	},
	unReject: function (name) {
		SuggestsModel.update({_id: SuggestsModel.findOne({"name": name})['_id']}, {$set: {"status": "pending"}});
	},
	delete: function (name) {
		SuggestsModel.remove({_id: SuggestsModel.findOne({"name": name})['_id']});
	}
}