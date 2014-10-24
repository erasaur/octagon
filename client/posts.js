Octagon.Posts = {
	create: function (id, title, date, content) {
		PostsModel.insert({"id": id, "title": title, "date": date, "content": content});
	},
	update: function (id, new_id, title, content) {
		PostsModel.update({_id: PostsModel.findOne({"id": id})['_id']}, {$set: {"id": new_id, "title": title, "content": content}});
	},
	delete: function(id) {
		PostsModel.remove({"_id": id});
	}
}