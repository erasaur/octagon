Template.members.helpers({
  members: function () {
    return Meteor.users.find();
  }
});

Template.memberItem.events({
  'click .js-delete-user': function (event, template) {
    if (confirm(getError('confirm-delete'))) {
      Meteor.call('removeUser', this._id);
      alert(getError('after-delete'));
    }
  }
});