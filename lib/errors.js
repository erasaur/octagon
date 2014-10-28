// SimpleSchema.debug = true

Errors = {
  'default': 'Sorry, something went wrong.',
  'no-permission': 'Sorry, looks like we can\'t let you continue.',
  'not-exists': 'Oops, looks like what you were looking for does not exist anymore.',
  'logged-out': 'Please login before continuing. Thanks!',

  'already-finalized': 'Sorry, the event is already over!',
  'already-attending': 'Looks like you are already attending the event.',
  'already-full': 'How eventful, the event is full! Check back later to see if someone drops out.',
  'not-attending': 'Looks like you already dropped out from the event.',

  'account-success': 'Success! Your account has been created.',
  'duplicate-name': 'Oops! There is another user with the same name. For purposes of identification, please include a middle/last/nick name.',
  'duplicate-email': 'That email already exists. You should log in (or reset your password).',
  'password-mismatch': 'Sorry, your passwords don\'t match. Try again!',
  'login-error': 'Oops, something went wrong when you were logging in. Please try again!',

  'invalid-email': 'Sorry, we don\'t recognize that email. Did you mistype it?',
  'check-email': 'Please check your email (including junk and spam folders) for a verification link.',
  'reset-done': 'Your password has been reset!',

  'password-success': 'Success! Your password has been changed.',

  'suggest-success': 'Thanks for your input! \n\nYour event will be taken into consideration; upon approval, you will receive 5 points.\n\nDon\'t get your hopes too high though.',

  // event statuses
  // 'logged-out-complete': 'Completed',
  // 'logged-out-progress': 'In Progress',
  // 'logged-out-unstarted': 'Not Started',
  // 'logged-in-complete': 'This event has been completed',
  // 'logged-in-attending-progress': 'Sit tight while we distribute your points :)',
  // 'logged-in-attending': 'You are attending.',
  // 'logged-in-no-slots': 'Sorry, no more slots available!',

  'after-delete': 'Farewell, old sport ;(',
  'cannot-delete': 'Sorry, General. You\'re the last admin standing, so we can\'t let you go.',
  'confirm-delete': 'Are you sure you want to delete this precious gem?',
  
  // admin specific
  'already-admin': 'Looks like this user is already an admin.',
  'confirm-promote': 'Are you sure this is the chosen one?',
  'after-promote': 'Success! This user has ascended!',
  'confirm-clear-log': 'Are you sure you want to destroy this historically significant log?', 
  'picture-success': 'Success! The picture has been updated.',
  'no-picture': 'Please either select an existing picture or upload a new one.',
  // 'no-caption': 'Please enter a brief caption for the picture.',

  'invalid-event': 'Sorry, looks like the event you are looking for doesn\'t exist.',
  'invalid-user': 'Sorry, looks like the user you are looking for doesn\'t exist.',
  'user-attending': 'The user is already attending the event.',
  'event-full': 'This event has no more slots. Edit the event and try again.',

  'finalize-success': 'Success! The event has been finalized.',

  'post-success': 'Success! Your post has been created.',
  'update-post-success': 'Success! Your post has been updated.',

  'event-success': 'Success! The event has been created.',
  'update-event-success': 'Success! The event has been updated.',

  'points-success': 'Success! The points have been assigned.',
  'strikes-success': 'Success! The strikes have been assigned.',

  'settings-success': 'Success! The settings have been saved.',
  // 'suggest-alter-success': 'Success! The suggestion has been altered.'
};

getError = function (error) {
  if (error && typeof Errors[error] !== 'undefined')
    return Errors[error];
  else
    return error || Errors['default'];
};