Errors = {
  'default': 'Sorry, something went wrong.',
  'no-permission': 'Sorry, looks like we can\'t let you continue.',
  'not-exists': 'Oops, looks like what you were looking for does not exist anymore.',
  'already-finalized': 'Sorry, the event is already over! Try to sign up earlier next time.',
  'already-attending': 'Looks like you are already attending the event.',
  'already-full': 'Sorry, the event can\'t take anymore signups. Check back later to see if someone drops out.',
  'not-attending': 'Looks like you are already not attending the event.',
  'no-picture': 'Please either select an existing picture or upload a new one.',
  'logged-out': 'Please login before continuing. Thanks!',

  'account-success': 'Success! Your account has been created.',
  'invalid-name': 'Please make sure you enter your name.',
  'duplicate-name': 'Oops! There is another user with the same name. For purposes of identification, please include a middle/last/nick name.',
  'weak-password': 'Your password must have at least 6 characters.',
  'unmatch-passwords': 'Sorry, your passwords don\'t match. Try again!',
  'login-error': 'Oops, something went wrong when you were logging in. Please try again in a moment. Thank you!'
};

getError = function (error) {
  if (error && typeof Errors[error] !== 'undefined')
    return Errors[error];
  else
    return error || Errors['default'];
};