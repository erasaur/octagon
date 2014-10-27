var currentPicture;
var _pictureDep = new Tracker.Dependency();

Template.pictures.helpers({
  pictures: function () {
    return Pictures.find();
  }
});

Template.editPictureModal.helpers({
  currentPicture: function () {
    _pictureDep.depend();
    return currentPicture;
  }
})

Template.pictures.events({
  'click .js-toggle-modal': function (event, template) {
    currentPicture = this.metadata;
    currentPicture._id = this._id;
    _pictureDep.changed();
  },
  'click .js-delete-picture': function () {
    if (confirm(getError('confirm-delete')))
      Meteor.call('deletePicture', this._id);
  }
});