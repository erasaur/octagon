//startup code, subscriptions

Session.setDefault('eventsLimit', 5); //start with 5 events showing
Session.setDefault('currentPage', 'home');

Accounts.onResetPasswordLink(function (token, done) {
  Session.set('resetPassword', token);
  done();
});

//automatically reruns when dependencies change
Deps.autorun(function() {
	Meteor.subscribe("events", Session.get('eventsLimit'));
});
Meteor.subscribe("posts");
Meteor.subscribe("suggests");
Meteor.subscribe("members");
Meteor.subscribe("likes");
Meteor.subscribe("pictures");
Meteor.subscribe("points");




