Template.mainLayout.helpers({
  currentModal: function () {
    var currentModal = Session.get('currentModal');
    return { template: currentModal, name: getModalName(currentModal) };
  }
});

Template.mainLayout.events({
  'submit form': function (event, template) {
    event.preventDefault();
    $('.modal').modal('hide');
  },
  'click .js-toggle-modal': function (event, template) {
    displayModal(event.target.getAttribute('data-toggle'));
  }
});