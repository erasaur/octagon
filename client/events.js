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