var currentPicture;

Template.pictures.helpers({
  pictures: function () {
    return Pictures.find({});
  }
});

Template.pictures.events({
  'click #addPicture': function (event, template) {
    var file = template.find('#createPicture').files[0],
      caption = template.find('#createCaption').value,
      featured = template.find('#createFeatured').checked;
        
    if(file && caption){
        reader.onload = function (event) {
          Octagon.Pictures.create(event.target.result, caption, featured);
        }
        reader.readAsDataURL(file);

        alert("Success! The picture has been added.");
        $('#addPictureModal').modal('hide');
    } else {
      alert("Please fill in all the fields!");
    }
  },
  'click .editPictureButton': function (event, template) {
    currentPicture = this;
    
    template.find('#editCaption').value = this.caption;
  },
  'click #savePicture': function (event, template) {
    var reader = new FileReader();
    var file = template.find('#editPicture').files[0],
      caption = template.find('#editCaption').value,
      featured = template.find('#editFeatured').checked;

    if(caption) {
      if(file) {
        reader.onload = function (event) {
          Octagon.Pictures.update(currentPicture.source, event.target.result, caption, featured);
          }
          reader.readAsDataURL(file);

          alert("Success! The picture has been edited.");
          $('#editPictureModal').modal('hide');
      } else {
        Octagon.Pictures.update(currentPicture.source, currentPicture.source, caption, featured);

        alert("Success! The picture has been edited.");
          $('#editPictureModal').modal('hide');
      }
    } else {
      alert("Please fill in all the fields!");
    }
  },
  'click .deletePicture': function () {
    if(confirm("Are you sure you want to delete this picture?")) {
      Octagon.Pictures.delete(this.source);
    }
  }
});