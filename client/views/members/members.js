Template.members.helpers({
  members: function () {
    return Meteor.users.find();
  }
});

Template.memberItem.events({
  'click .js-delete-user': function (event, template) {
    if (confirm(getError('confirm-delete'))) {
      Meteor.call('removeUser', this._id, function (error) {
        if (error)
          alert(error.reason);  
        else
          alert(getError('after-delete'));
      });
    }
  },
  'click .js-promote-user': function (event, template) {
    if (confirm(getError('confirm-promote'))) {
      Meteor.call('promoteUser', this, function (error) {
        if (error)
          alert(error.reason);
        else
          alert(getError('after-promote'));
      });
    }
  }
});