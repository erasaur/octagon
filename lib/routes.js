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
}, { only: ['admin', 'pictures', 'suggestions', 'settings'] });

Router.onBeforeAction(function () {
  if (Meteor.user()) {
    if (Session.get('resetPassword')) {
      Meteor.logout();
      this.next();
    } else
      this.redirect('home');
  }
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
  },
  fastRender: true
});
Router.route('/events', {
  waitOn: function () {
    var limit = Meteor.isClient ? Session.get('eventsLimit') : 15;
    subs.subscribe('events', limit);
  },
  fastRender: true
});
Router.route('/members', {
  waitOn: function () {
    subs.subscribe('members');
  },
  data: function () {
    return Meteor.users.find();
  },
  fastRender: true
});
Router.route('/contact', {
  fastRender: true
});
Router.route('/admin', {
  fastRender: true
});
Router.route('/admin/suggestions', {
  name: 'suggestions',
  waitOn: function () {
    subs.subscribe('suggests');
  },
  fastRender: true
});
Router.route('/admin/pictures', {
  name: 'pictures',
  waitOn: function () {
    subs.subscribe('allPictures');
  },
  fastRender: true
});
Router.route('/admin/settings', {
  name: 'settings',
  waitOn: function () {
    subs.subscribe('settings');
  },
  fastRender: true
});
Router.route('/profile', {
  waitOn: function () {
    subs.subscribe('currentUser');
  },
  data: function () {
    return Meteor.user();
  },
  fastRender: true
});
Router.route('/recovery');
