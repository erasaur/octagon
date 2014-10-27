//router
var subs = new SubsManager({
  cacheLimit: 80, // cache 80 subs
  expireIn: 10 // 10 minutes
});

Router.configure({
  layoutTemplate: 'mainLayout',
  waitOn: function () {
    subs.subscribe('settings');
  }
});

Router.plugin('loading', { loadingTemplate: 'loading' });
Router.plugin('dataNotFound', { dataNotFoundTemplate: 'notFound' });

Router.onBeforeAction(function () { // logged in
  if (!Meteor.loggingIn() && !Meteor.user())
    this.redirect('home');
  else
    this.next();
}, { only: ['profile', 'admin', 'suggestions'] });

Router.onBeforeAction(function () { // admin
  if (!isAdmin(Meteor.user()))
    this.redirect('home');
  else
    this.next();
}, { only: ['admin', 'suggestions'] });

Router.onBeforeAction(function () {
  if (Meteor.user())
    this.redirect('home');
  else
    this.next();
}, { only: ['recovery'] });

subs.subscribe('currentUser');

Router.route('/', {
  name: 'home',
  waitOn: function () {
    subs.subscribe('home');
  }
});
Router.route('/events', {
  waitOn: function () {
    subs.subscribe('events', Session.get('eventsLimit'));
  }
});
Router.route('/members', {
  waitOn: function () {
    subs.subscribe('members');
  },
  data: function () {
    return Meteor.users.find();
  }
});
Router.route('/contact');
Router.route('/admin');
Router.route('/admin/suggestions', {
  name: 'suggestions',
  waitOn: function () {
    subs.subscribe('suggests');
  }
});
Router.route('/admin/pictures', {
  name: 'pictures',
  waitOn: function () {
    subs.subscribe('allPictures');
  }
})
Router.route('/profile', {
  waitOn: function () {
    subs.subscribe('currentUser');
  },
  data: function () {
    return Meteor.user();
  }
});
Router.route('/recovery');