var currentPost;

Template.home.rendered = function () {
  $('#homeCarousel').find('.item:first').addClass('active');
};

Template.home.helpers({
  posts: function () {
    return Posts.find({}, { sort: { 'date': -1 } });
  },
  pictures: function () {
    return Pictures.find({ 'featured': true });
  }
});

Template.home.events({
  'click .js-edit-post': function (event, template) {
    Session.set('currentPost', this);
  },
  'click .js-delete-post': function () {
    if(confirm('Are you sure you want to delete ' + this.title + '?')) {
      Octagon.Posts.delete(this._id);
      $('#editPostModal').modal('hide');
    }
  }
});