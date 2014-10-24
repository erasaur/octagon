Template.recovery.rendered = function () {
  if (Meteor.user()) {
    Router.go('/');
  }
}

Template.recovery.helpers({
  resetPassword: function () {
    return Session.get('resetPassword');
  }
});

Template.recovery.events({
  'submit #recoverPass': function (e, t) {
    e.preventDefault();
    var email = t.find('#inputEmail').value;
    if (validEmail(email)) {
      Session.set('loading', true);
      Accounts.forgotPassword({"email": email}, function (error) {
        if (error) {
          alert(error);
        } else {
          alert("Please check your email (including junk and spam folders) for a verification link.");
        }
        Session.set('loading', false);
      });
    }
  },
  'submit #newPass': function (e, t) {
    e.preventDefault();
    var pass = t.find('#inputPass').value;
    if (pass) {
      Session.set('loading', true);
      Accounts.resetPassword(Session.get('resetPassword'), pass, function (error) {
        if (error) {
          alert(error);
        } else {
          Session.set('resetPassword', null);
          alert("Done!");
        }
        Session.set('loading', false);
      });
    }
  }
});