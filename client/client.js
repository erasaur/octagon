//startup code, subscriptions

Session.setDefault('eventsLimit', 5); //start with 5 events showing
Session.setDefault('currentPage', 'home');

Accounts.onResetPasswordLink(function (token, done) {
  Session.set('resetPassword', token);
  done();
});