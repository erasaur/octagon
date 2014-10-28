//router
var subs = new SubsManager({
  cacheLimit: 80, // cache 80 subs
  expireIn: 10 // 10 minutes
});

Router.configure({
  layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    subs.subscribe('settings');
  }
});

Router.plugin('loading', { loadingTemplate: 'loading' });
Router.plugin('dataNotFound', { dataNotFoundTemplate: 'notFound' });

Router.onBeforeAction(function () {
  if (Session.get('resetPassword'))
    this.redirect('recovery');
  else
    this.next();
}, { except: ['recovery'] });

Router.onBeforeAction(function () { // logged in
  if (!Meteor.loggingIn() && !Meteor.user())
    this.render('notFound');
  else
    this.next();
}, { only: ['profile', 'admin', 'suggestions', 'settings'] });

Router.onBeforeAction(function () { // admin
  if (!isAdmin(Meteor.user()))
    this.render('notFound');
  else
    this.next();
}, { only: ['admin', 'suggestions', 'settings'] });

Router.onBeforeAction(function () {
  if (Meteor.user())
    this.redirect('home');
  else
    this.next();
}, { only: ['recovery'] });

Router.onAfterAction(function () {
  // set title of site
  var title = getSetting('schoolName') + ' ' + getSetting('clubName');
  document.title = title || '';
});

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
});
Router.route('/admin/settings', {
  name: 'settings',
  waitOn: function () {
    subs.subscribe('settings');
  }
});
Router.route('/profile', {
  waitOn: function () {
    subs.subscribe('currentUser');
  },
  data: function () {
    return Meteor.user();
  }
});
Router.route('/recovery');