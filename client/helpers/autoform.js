// TODO: find a better way of picture uploading
AutoForm.hooks({
  newEventForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      var self = this;

      self.event.preventDefault();
      var file = self.template.find('#js-create-picture').files[0];

      if (typeof file === 'undefined')
        return onErrorCallback.call(self, getError('no-picture'));
      
      var metadata = {
        caption: insertDoc.info && insertDoc.info.name || '',
        featured: false
      };

      var file = new FS.File(file);
      file.metadata = metadata;

      callMethodWithFile.call(self, 'createEvent', file, insertDoc, function (error) {
        if (error)
          return onErrorCallback.call(self, error.reason);
        else
          onSuccessCallback.call(self, getError('event-success'));
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
            return onErrorCallback.call(self, error.reason);
          else
            onSuccessCallback.call(self, getError('update-event-success'));
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
            return onErrorCallback.call(self, error.reason);
          else {
            onSuccessCallback.call(self, getError('update-event-success'));
          }
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
        return onErrorCallback.call(self, getError('no-permission'));

      if (typeof file === 'undefined')
        return onErrorCallback.call(self, getError('no-picture'));

      var metadata = {
        caption: caption,
        featured: featured
      };

      var file = new FS.File(file);
      file.metadata = metadata;

      Pictures.insert(file, function (error, file) {
        if (error) 
          return onErrorCallback.call(self, error.reason);
        else
          onSuccessCallback.call(self, getError('picture-success'));
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

      onSuccessCallback.call(this, getError('picture-success'))
    }
  },
  editSettingsForm: {
    onSuccess: function (insertDoc, updateDoc, currentDoc) {
      alert(getError('settings-success'));
    }
  }
});

// for all forms except onSubmit forms
AutoForm.addHooks(null, { 
  onSuccess: function () {
    onSuccessCallback.call(this);
  }
});

function onErrorCallback (error) {
  alert(error);
  this.done();
  return false; // don't reset form on failure
}

function onSuccessCallback (message) {
  if (message)
    alert(message);

  $('.modal').modal('hide');
  this.done();
  this.resetForm(); 
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







