Errors = {
  'default': 'Sorry, something went wrong.',
  'no-permission': 'Sorry, looks like we can\'t let you continue.',
  'not-exists': 'Oops, looks like what you were looking for does not exist anymore.',
  'already-finalized': 'Sorry, the event is already over! Try to sign up earlier next time.',
  'already-attending': 'Looks like you are already attending the event.',
  'already-full': 'Sorry, the event can\'t take anymore signups. Check back later to see if someone drops out.',
  'not-attending': 'Looks like you are already not attending the event.',
  'no-picture': 'Please either select an existing picture or upload a new one.',
  'logged-out': 'Please login before continuing. Thanks!'
};

getError = function (error) {
  if (error && typeof Errors[error] !== 'undefined')
    return Errors[error];
  else
    return error || Errors['default'];
};