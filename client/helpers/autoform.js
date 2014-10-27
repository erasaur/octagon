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

      callMethodWithFile.call(self, 'createEvent', file, insertDoc, function (error) {
        if (error)
          alert(error.reason);
        else {
          alert(getError('event-success'));  
          onSuccessCallback.call(self);
        }
        self.done();
      });
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
            alert(error.reason);
          else {
            alert(getError('update-event-success'));
            onSuccessCallback.call(self);
          }
          self.done();
        });
      } else {
        var metadata = {
          caption: insertDoc.info && insertDoc.info.name || '',
          featured: false
        };

        // uploading new file, delete the old one and upload new
        Pictures.remove(updateDoc.pictureId);

        var file = new FS.File(file);
        file.metadata = metadata;
        
        callMethodWithFile.call(self, 'updateEvent', file, currentDoc, function (error) {
          if (error)
            alert(error.reason);
          else {
            alert(getError('update-event-success'));  
            onSuccessCallback.call(self);
          }
          self.done();
        });
      }
    }
  },
  suggestEventForm: {
    onSuccess: function (operation, result, template) {
      // TODO: send notification
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
  },
  addPointsForm: {
    onSuccess: function (insertDoc, updateDoc, currentDoc) {
      alert(getError('points-success'));
    },
    docToForm: docToForm,
    formToDoc: formToDoc
  },
  addStrikesForm: {
    onSuccess: function (insertDoc, updateDoc, currentDoc) {
      alert(getError('strikes-success'));
    },
    docToForm: docToForm,
    formToDoc: formToDoc
  },
  changePassForm: {
    onSuccess: function (insertDoc, updateDoc, currentDoc) {
      alert(getError('password-success'));
    }
  },
  signupForm: {
    onError: function (method, error, template) {
      console.log(this, template);
      Meteor.users.simpleSchema().namedContext('signupForm').addInvalidKeys([
        { name: 'name', type: 'duplicateName' }
      ]);
      alert(error.reason);
    },
    onSuccess: function (insertDoc, updateDoc, currentDoc) {
      alert(getError('account-success'));
    }
  },
  addPictureForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var self = this;
      self.event.preventDefault();

      var user = Meteor.user();
      var file = self.template.find('#js-create-picture').files[0];
      var caption = insertDoc.caption;
      var featured = insertDoc.featured;

      if (!user || !isAdmin(user))
        return alert(getError('no-permission'));

      if (typeof file === 'undefined')
        return alert(getError('no-picture'));

      var metadata = {
        caption: caption,
        featured: featured
      };

      var file = new FS.File(file);
      file.metadata = metadata;

      Pictures.insert(file, function (error, file) {
        if (error) 
          alert(error.reason);
        else {
          alert(getError('picture-success'));
          onSuccessCallback.call(self);
        }
        self.done();
      });
    }
  },
  editPictureForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      var pictureId = currentDoc._id;

      var metadata = {
        caption: insertDoc.caption,
        featured: insertDoc.featured
      };

      Pictures.update(currentDoc._id, { $set: { 'metadata': metadata } });
      alert(getError('picture-success'));
      
      onSuccessCallback.call(this);
      this.done();
    }
  }
});

// for all forms except onSubmit forms
AutoForm.addHooks(null, { 
  onSuccess: function () {
    onSuccessCallback.call(this);
  }
});

function onSuccessCallback () {
  $('.modal').modal('hide');
  this.resetForm(); // don't reset form on failure
}

function callMethodWithFile (method, fsFile, doc, callback) {
  var self = this;

  Pictures.insert(fsFile, function (error, file) {
    if (error)
      callback(error);
    else {
      doc.pictureId = file._id;
      Meteor.call(method, doc, function (error) {
        callback(error);
      });
    }
  });
}

function docToForm (doc) {
  if (_.isArray(doc.members))
    doc.members = doc.members.join(', ');
  return doc;
}

function formToDoc (doc) {
  if (typeof doc.members === 'string')
    doc.members = doc.members.split(',');
  return doc;
}







