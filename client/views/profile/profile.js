Template.profile.helpers({
  hasSuggested: function () {
    //typically would want to limit collection in publish (server.js), but its safe to send all suggestions to the client
    return SuggestsModel.find({"uname": Meteor.user().username}).count() > 0 ? true : false; 
  },
  suggestedEvents: function () {
    //typically would want to limit collection in publish (server.js), but its safe to send all suggestions to the client
    return SuggestsModel.find({"uname": Meteor.user().username}); 
  }
});

Template.profile.events({
  'click #changePass': function (event, template) {
    var pass = template.find('#newPassword').value,
      again = template.find('#newPasswordVerify').value,
      errors = [];
    
    if(pass && again) {
      if(pass != again) {
        errors.push("The passwords do not match.");
      } else {
        if(pass.length < 6) {
          errors.push("Your password must be at least 6 characters long.");
        }
      }
    } else {
      errors.push("Please fill in all the fields!");
    }
    
    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Meteor.call('changePass', Meteor.userId(), pass);
      alert("Success! Your password has been changed.");
      $('#changePassModal').modal('hide');
    }
  },
  'click #deleteAccount': function () {
    if(confirm("Are you sure you want to delete your account?")) {
      Meteor.call('removeUser', Meteor.userId());
      alert("Farewell, old sport.");
      Router.go('home');
    }
  }
});