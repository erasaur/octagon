Template.homeHeader.helpers({
  isActive: function () { // set the first item to be active by default
    return this.index === 0 ? 'active': '';
  },
  pictures: function () {
    var pictures = Pictures.find({ 'metadata.featured': true }).fetch();
    pictures = _.map(pictures, function (picture, index) {
      picture.index = index;
      return picture;
    });

    return pictures;
  }
});

Template.home.helpers({
  posts: function () {
    return Posts.find({}, { sort: { 'date': -1 } });
  }
});

Template.home.events({
  'click .js-edit-post': function (event, template) {
    Session.set('currentPost', this);
  },
  'click .js-delete-post': function () {
    if(confirm('Are you sure you want to delete ' + this.title + '?')) {
      Meteor.call('deletePost', this._id, function (error) {
        if (error)
          alert(error.reason);
      });
      $('#editPostModal').modal('hide');
    }
  }
});