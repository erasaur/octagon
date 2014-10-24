if(!Meteor.users.find().count()) {
  Accounts.createUser({
    'username': 'admin', 
    'email': 'erasaur@gmail.com', 
    'password': 'password', 
    'profile': {
      'name': 'Mark', 
      'points': 0, 
      'officer': true, 
      'events': [], 
      'mic': 0, 
      'carpool': 0, 
      'strikes': 0, 
      'suggests': 0
    }
  });
}