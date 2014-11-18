Template.recovery.helpers({
  resetPassword: function () {
    return Session.get('resetPassword');
  }
});

Template.recovery.events({
  'submit #js-recover-pass': function (event, template) {
    event.preventDefault();

    var email = template.find('#js-email').value;
    email = stripHTML(email);

    if (!email.trim())
      alert('invalid-email', getError('invalid-email'));
    else {
      Accounts.forgotPassword({ 'email': email }, function (error) {
        if (error)
          alert(getError('invalid-email'));
        else
          alert(getError('check-email'));
      });
    }
  },
  'submit #js-change-pass': function (event, template) {
    event.preventDefault();

    var password = template.find('#js-password').value;

    if (password.length < 6) 
      alert(getError('weak-password'));
    
    Accounts.resetPassword(Session.get('resetPassword'), password, function (error) {
      if (error)
        alert(error.reason);
      else {
        Session.set('resetPassword', null);
        alert(getError('reset-done'));
      }
    });
  }
});