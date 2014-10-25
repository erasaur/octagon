AutoForm.addHooks(['newEventForm', 'editEventForm'], {
  onSubmit: function (insertDoc, updateDoc, currentDoc) {
    var self = this;
    var fileIds = {
      'newEventForm': '#js-create-picture',
      'editEventForm': '#js-edit-picture'
    };

    self.event.preventDefault();
    var file = self.template.find(fileIds[self.formId]).files[0];
    
    var metadata = {
      caption: insertDoc.info && insertDoc.info.name || '',
      featured: false
    };

    var file = new FS.File(file);
    file.metadata = metadata;

    Pictures.insert(file, function (error, file) {
      if (error) {
        alert(error.reason);
        return false;
      }
      else {
        insertDoc.pictureId = file._id;
        Meteor.call('createEvent', insertDoc, function (error) {
          if (error) {
            alert(error.reason);
            return false;
          }
          else
            self.done();
        });
      }
    });
    self.resetForm();
  }
});