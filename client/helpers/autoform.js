// TODO: find a better way of picture uploading
AutoForm.hooks({
  newEventForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var self = this;

      self.event.preventDefault();
      var file = self.template.find('#js-create-picture').files[0];
      
      var metadata = {
        caption: insertDoc.info && insertDoc.info.name || '',
        featured: false
      };

      var file = new FS.File(file);
      file.metadata = metadata;

      return callMethodWithFile.call(this, 'createEvent', file, insertDoc);
    }
  },
  editEventForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var self = this;

      self.event.preventDefault();
      var file = self.template.find('#js-edit-picture').files[0];

      currentDoc.info = insertDoc.info;

      // not uploading new file, just update event
      if (typeof file === 'undefined') {
        Meteor.call('updateEvent', currentDoc, function (error) {
          if (error)
            console.log(error);
        });
        self.done();
        self.resetForm();
      } else {
        var metadata = {
          caption: insertDoc.info && insertDoc.info.name || '',
          featured: false
        };

        // uploading new file, delete the old one and upload new
        Pictures.remove(updateDoc.pictureId);

        var file = new FS.File(file);
        file.metadata = metadata;
        
        return callMethodWithFile.call(this, 'updateEvent', file, currentDoc);
      }
    }
  },
  suggestEventForm: {
    onSuccess: function (operation, result, template) {
      alert(getError('suggest-success'));
    }
  },
  newPostForm: {
    onSuccess: function (operation, result, template) {
      if (operation === 'insert')
        alert(getError('post-success'));
      else if (operation === 'update')
        alert(getError('update-post-success'));
    }
  }
});

function callMethodWithFile (method, fsFile, doc) {
  var self = this;

  Pictures.insert(fsFile, function (error, file) {
    if (error) {
      console.log(error.reason);
      return false;
    } 
    else {
      doc.pictureId = file._id;
      Meteor.call(method, doc, function (error) {
        if (error) {
          console.log(error.reason);
          return false;
        }
      });
    }
  });
  self.done();
  self.resetForm();
}







