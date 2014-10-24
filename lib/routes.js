//router
Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.plugin('loading', { loadingTemplate: 'loading' });
Router.plugin('dataNotFound', { dataNotFoundTemplate: 'notFound' });

Router.onBeforeAction(function () { // logged in
  if (!Meteor.isLoggingIn() && !Meteor.user())
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

var subs = new SubsManager({
  cacheLimit: 30, // cache 30 subs
  expireIn: 10 // 10 minutes
})

Router.route('/', {
  name: 'home',
  waitOn: function () {
    subs.subscribe('posts');
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
Router.route('/profile');
Router.route('/recovery');