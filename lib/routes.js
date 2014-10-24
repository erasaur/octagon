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