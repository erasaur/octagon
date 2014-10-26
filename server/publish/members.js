Meteor.publish('members', function () {
  var fields = { 'profile': 1 };
  
  if (isAdminById(this.userId))
    fields.emails = 1;

  return [ Meteor.users.find({}, { fields: fields }), Logs.find() ];
});