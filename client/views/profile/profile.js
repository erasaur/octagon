Template.profile.helpers({
  suggested: function () {
    return Suggests.find({ 'userId': Meteor.userId() }); 
  },
  event: function () {
    return this && Events.findOne(this._id);  
  }
});

Template.profileHeader.events({
  'click #js-delete-account': function () {
    if(confirm(getError('confirm-delete'))) {
      Meteor.call('removeUser');
      alert(getError('after-delete'));
      Router.go('home');
    }
  }
});