Template.nav.events({
  'click #logout': function () {
    Meteor.logout(function(error) {
      Router.go('home');
    });
  },
  'submit #loginForm': function (event, template) {
    event.preventDefault();
    var userName = template.find('#username').value,
      userPass = template.find('#password').value;
    
    Meteor.loginWithPassword(userName, userPass, function(error) {
      if (error) { 
        alert(error); 
      }
    });
  },
  'click #create': function (event, template) {
    var userMail = template.find('#createEmail').value,
      userName = template.find('#createUsername').value,
      name = template.find('#createName').value,
      userPass = template.find('#createPassword').value,
      repeatPass = template.find('#repeatPassword').value,
      errors = [];
    
    //if all fields are filled in
    if(userMail && userName && name && userPass && repeatPass) {

      var name = name.trim();
      
      if(validEmail(userMail)) {
        if(Meteor.users.find({"profile.name": name}).count() > 0) {
          errors.push("Oops! There is another user with the same name. For the purposes of identification, please include a middle/last/nick name.");
        } else {
          if(userPass.length >= 6) {
            if(userPass != repeatPass) {
              //passwords don't match
              errors.push("The passwords do not match.");
            }
          } else {
            //password too short
            errors.push("Your password must be at least 6 characters long.");
          }
        }
      } else {
        //invalid email
        errors.push("The email entered is invalid.");
      }
    } else {
      //fields not filled in
      errors.push("Please fill in all of the fields!");
    }
    
    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Accounts.createUser({"username": userName, "email": userMail, "password": userPass, "profile": {"name": name, "points": 0, "officer": false, "events": [], "mic": 0, "carpool": 0, "strikes": 0, "suggests": 0, "meetings": 0}}, function(error) {
        if (error) { 
          alert(error); 
        } else {
          alert("Success! Your account '" + userName + "' has been created.");
          $('#signUpModal').modal('hide');
        }
      });
    }
  }
});