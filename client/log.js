Octagon.PointsLog = {
	create: function (date, officer, members, points, occasion) {
		PointsModel.insert({"date": date, "name": officer, "members": members, "points": points, "occasion": occasion});
	}
}