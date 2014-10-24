//startup code, subscriptions

Meteor.startup(function() {
	Session.setDefault('eventsLimit', 5); //start with 5 events showing
	Session.setDefault('currentPage', 'home');
	/*
	if(!Session.get('currentPage')) {
		Session.set('currentPage', 'home');
	}*/
	
	if(!Meteor.users.find().count()) {
	  Accounts.createUser({"username": "admin", "email": "marklee.lhs@gmail.com", "password": "password", "profile": {"name": "Mark", "points": 0, "officer": true, "events": [], "mic": 0, "carpool": 0, "strikes": 0, "suggests": 0}});
	}
	if(Accounts._resetPasswordToken) {
		Session.set('resetPassword', Accounts._resetPasswordToken);
	}
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

//router
Router.configure({
	layout: 'main', //define main as a layout, which allows for multiple yields
	renderTemplates: { //for the yields
		'nav': {to: 'nav'},
		'footer': {to: 'footer'}
	}
});

Router.map(function() {
	this.route('home', { path: '/' });
	this.route('home', { path: '/home' });
	this.route('events');
	this.route('members');
	this.route('contact');
	this.route('admin');
	this.route('suggestions', {
		path: '/admin/suggestions'
	});
	this.route('pictures', {
		path: '/admin/pictures'
	});
	this.route('profile');
	this.route('recovery');
	this.route('notfound', { path: '*' });
});




