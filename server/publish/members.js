Meteor.publish('members', function () {
  var fields = { 'profile': 1, 'isAdmin': 1 };
  
  if (this.userId)
    fields.emails = 1;

  return [ Meteor.users.find({ 'isDeleted': false }, { fields: fields }), Logs.find() ];
});