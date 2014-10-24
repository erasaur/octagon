Octagon.Pictures = {
	create: function (url, caption, featured) {
		PicturesModel.insert({"source": url, "caption": caption, "featured": featured});
	},
	update: function (url, new_url, caption, featured) {
		PicturesModel.update({"_id": PicturesModel.findOne({"source": url})._id}, {$set: {"source": new_url, "caption": caption, "featured": featured}});
	},
	delete: function (url) {
		PicturesModel.remove({"_id": PicturesModel.findOne({"source": url})._id});
	}
}