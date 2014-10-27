//startup code, subscriptions

Session.setDefault('eventsLimit', 5); //start with 5 events showing
Session.setDefault('currentPage', 'home');
Session.set('currentEvent');
Session.set('currentPost');

Accounts.onResetPasswordLink(function (token, done) {
  Session.set('resetPassword', token);
  done();
});

$(window).scroll(function() {
  //run function when scroll
  showMoreEvents();
});
