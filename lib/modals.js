// maps modal id's to associated modal headings
Modals = {
  'default': 'Cool Form',
  'addEventModal': 'Add New Event',
  'addMemberModal': 'Add Member to Event',
  'editEventModal': 'Edit Event',
  'suggestEventModal': 'Suggest An Event',
  'finalizeEventModal': 'Finalize Event',
  'showEmailsModal': 'Attending Member Emails',

  'addPostModal': 'Add New Post',
  'editPostModal': 'Edit Post'
};

getModalName = function (modal) {
  if (modal && typeof Modals[modal] !== 'undefined')
    return Modals[modal];
  else
    return modal || Modals['default'];
};

displayModal = function (modal) {
  Session.set('currentModal', modal);
  Tracker.afterFlush(function () {
    $('#' + modal).modal('show');
  });
};