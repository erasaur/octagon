Template.profile.helpers({
  suggested: function () {
    return Suggests.find({ 'userId': Meteor.userId() }); 
  },
  event: function () {
    return this && Events.findOne(this._id);  
  }
});

Template.profile.events({
  'click #changePass': function (event, template) {
    var pass = template.find('#newPassword').value,
      again = template.find('#newPasswordVerify').value,
      errors = [];
    
    if(pass && again) {
      if(pass != again) {
        errors.push('The passwords do not match.');
      } else {
        if(pass.length < 6) {
          errors.push('Your password must be at least 6 characters long.');
        }
      }
    } else {
      errors.push('Please fill in all the fields!');
    }
    
    if(errors.length > 0) {
      for(var i=0; i<errors.length; i++) {
        alert(errors[i]);
      }
      errors = [];
    } else {
      Meteor.call('changePass', Meteor.userId(), pass);
      alert('Success! Your password has been changed.');
      $('#changePassModal').modal('hide');
    }
  },
  'click #deleteAccount': function () {
    if(confirm('Are you sure you want to delete your account?')) {
      Meteor.call('removeUser');
      alert('Farewell, old sport.');
      Router.go('home');
    }
  }
});