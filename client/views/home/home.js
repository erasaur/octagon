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
  'click #js-create-post': function (event, template) {
    var postID = formatID(template.find('#createID').value),
      postTitle = template.find('#createTitle').value,
      postContent = template.find('#createContent').value,
      postDate = getDate(),
      errors = [];

    if(postID && postTitle && postContent && postDate) {
      if(Posts.find({'id': postID}).count() > 0) {
        errors.push('The post ID already exists.')
      }
    } else {
      errors.push('Please fill in all of the fields!');
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Octagon.Posts.create(postID, postTitle, postDate, postContent);
      alert('Success! Your post ' + postTitle + ' has been created.');
      $('#addPostModal').modal('hide');
    }
  },
  'click .js-edit-post': function (event, template) {
    Session.set('currentPost', this);
  },
  'click .js-delete-post': function () {
    if(confirm('Are you sure you want to delete '' + this.title + ''?')) {
      Octagon.Posts.delete(this._id);
      $('#editPostModal').modal('hide');
    }
  }
});