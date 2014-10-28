Template.suggestions.helpers({
  pending: function () {  
    return Suggests.find({}, { sort: { 'createdAt': -1 } });
  }
});

Template.suggestItem.helpers({
  approved: function () {
    return this.status === 'approved';
  },
  rejected: function () {
    return this.status === 'rejected';
  }
});

Template.suggestItem.events({
  'click .js-approve': function () {
    Meteor.call('approveSuggestion', this, function (error) {
      if (error)
        alert(error.reason)
    });
  },
  'click .js-reset': function () {
    Meteor.call('resetSuggestion', this, function (error) {
      if (error)
        alert(error.reason)
    });
  },
  'click .js-reject': function () {
    Meteor.call('rejectSuggestion', this, function (error) {
      if (error)
        alert(error.reason)
    });
  },
  'click .js-delete': function () {
    if(confirm('Are you sure you want to delete this ever so helpful suggestion?')) {
      Meteor.call('deleteSuggestion', this, function (error) {
        if (error)
          alert(error.reason)
      });
    }
  }
});