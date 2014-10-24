Template.contact.likes = function () {
  if(LikesModel.findOne({"id": "contact"})) return LikesModel.findOne({"id": "contact"}).likes;
  else return 0;
};

Template.contact.events({
  'click #like': function () {
    if(LikesModel.find({"id": "contact"}).count() == 0)
      LikesModel.insert({"id": "contact", "likes": 0});
    else
      LikesModel.update({_id:LikesModel.findOne({"id": "contact"})['_id']}, {$inc: {"likes": 1}});
  }
});