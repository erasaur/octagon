var currentPost;

Template.home.rendered = function () {
  if (Session.get('resetPassword')) {
    //redirect if has token to reset pass
    Router.go('/recovery');
  } else {
    $('#homeCarousel').find('.item:first').addClass('active');
  }
};

Template.home.helpers({
  hasPosts: function () {
    return PostsModel.find().count(); 
  },
  posts: function () {
    return PostsModel.find({}, { sort: { 'date': -1 } });
  },
  hasPictures: function () {
    return PicturesModel.find({"featured": true}).count();
  },
  pictures: function () {
    return PicturesModel.find({"featured": true});
  }
});

Template.home.events({
  'click #createPost': function (event, template) {
    var postID = formatID(template.find('#createID').value),
      postTitle = template.find('#createTitle').value,
      postContent = template.find('#createContent').value,
      postDate = getDate(),
      errors = [];

    if(postID && postTitle && postContent && postDate) {
      if(PostsModel.find({"id": postID}).count() > 0) {
        errors.push("The post ID already exists.")
      }
    } else {
      errors.push("Please fill in all of the fields!");
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Octagon.Posts.create(postID, postTitle, postDate, postContent);
      alert("Success! Your post '" + postTitle + "' has been created.");
      $('#addPostModal').modal('hide');
    }
  },
  'click #editPostButton': function (event, template) {
    currentPost = this;

    template.find('#editID').value = this.id;
    template.find('#editTitle').value = this.title;
    template.find('#editContent').value = this.content;
  },
  'click #editPost': function (event, template) {
    var postID = formatID(template.find('#editID').value),
      postTitle = template.find('#editTitle').value,
      postContent = template.find('#editContent').value,
      errors = [];

    if(postID && postTitle && postContent) {
      if(currentPost.id != postID) {
        if(PostsModel.find({"id": postID}).count() > 0) {
          errors.push("The post ID '" + postID + "' already exists.")
        }
      }   
    } else {
      errors.push("Please fill in all fields!");
    }

    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Octagon.Posts.update(currentPost.id, postID, postTitle, postContent);
      alert("Success! Your post '" + postTitle + "' has been updated.");
      $('#editPostModal').modal('hide');
    }
  },
  'click .deletePost': function () {
    if(confirm("Are you sure you want to delete '" + this.title + "'?")) {
      Octagon.Posts.delete(this._id);
      $('#editPostModal').modal('hide');
    }
  }
});