Template.nav.helpers({
  currentPage: function (page) {
    return getCurrentRoute() === page ? 'active' : '';
  }
});

Template.nav.events({
  'click #js-logout': function () {
    Meteor.logout(function () {
      Router.go('home');
    });
  },
  'submit #loginForm': function (event, template) {
    event.preventDefault();
    var email = template.find('#js-email').value;
    var password = template.find('#js-password').value;
    
    Meteor.loginWithPassword(email, password, function (error) {
      if (error)
        alert(error);
    });
  },
  'click #create': function (event, template) {
    var name = template.find('#js-create-name').value;
    var email = template.find('#js-create-email').value;
    var password = template.find('#js-create-password').value;
    var rpassword = template.find('#js-create-rpassword').value;
    
    Meteor.call('signup', name, email, password, rpassword, function (error) {
      if (error) 
        alert(error.reason);
      else {
        alert(getError('account-success'));
        template.$('#signUpModal').modal('hide');

        Meteor.loginWithPassword(email, password, function (error) {
          if (error)
            alert(error.reason);
          else
            Router.go('home');
        });
      }
    });
  }
});