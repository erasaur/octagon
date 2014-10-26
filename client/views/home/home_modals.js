Template.editPostModal.events({
  'click #editPost': function (event, template) {
    var postID = formatID(template.find('#editID').value),
      postTitle = template.find('#editTitle').value,
      postContent = template.find('#editContent').value,
      errors = [];

    if(postID && postTitle && postContent) {
      if(currentPost.id != postID) {
        if(Posts.find({"id": postID}).count() > 0) {
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
  }  
});
