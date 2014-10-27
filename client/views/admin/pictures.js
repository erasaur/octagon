var currentPicture;

Template.pictures.helpers({
  pictures: function () {
    return Pictures.find();
  }
});

Template.pictures.events({
  'click .js-btn-edit-picture': function (event, template) {
    currentPicture = this._id;

    if (this.metadata) {
      template.$('#js-edit-caption').val(this.metadata.caption);
      console.log
      template.$('#js-edit-featured').prop('checked', this.metadata.featured);
    }
  },
  'click #js-edit': function (event, template) {
    var caption = template.find('#js-edit-caption').value;
    var featured = template.find('#js-edit-featured').checked;

    if (!stripHTML(caption))
      return alert(getError('no-caption'));

    var metadata = {
      caption: caption,
      featured: featured
    };

    Pictures.update(currentPicture, { $set: { 'metadata': metadata } });
    alert(getError('picture-success'));
    template.$('#editPictureModal').modal('hide');
  },
  'click .deletePicture': function () {
    var user = Meteor.user();
    
    if (!user || !isAdmin(user))
      return alert(getError('no-permission'));

    if (confirm(getError('confirm-delete')))
      Pictures.remove(this._id);
  }
});