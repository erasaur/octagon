Template.recovery.helpers({
  resetPassword: function () {
    return Session.get('resetPassword');
  }
});

Template.recovery.events({
  'submit #recoverPass': function (event, template) {
    event.preventDefault();

    var email = template.find('#js-email').value;
    email = stripHTML(email);

    if (!email.trim())
      alert('invalid-email', getError('invalid-email'));
    else {
      Accounts.forgotPassword({ 'email': email }, function (error) {
        if (error)
          alert(error.reason);
        else
          alert(getError('check-email'));
      });
    }
  },
  'submit #newPass': function (event, template) {
    event.preventDefault();

    var password = template.find('#js-password').value;

    if (password.length < 6) 
      throw new Meteor.Error('weak-password', getError('weak-password'));
    
    else {
      Accounts.resetPassword(Session.get('resetPassword'), password, function (error) {
        if (error)
          alert(error.reason);
        else {
          Session.set('resetPassword', null);
          alert(getError('reset-done'));
        }
      });
    }
  }
});