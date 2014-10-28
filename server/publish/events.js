Meteor.publishComposite('events', function (limit) {
  if (limit > Events.find().count()) {
    limit = 0;
  }

  var fields = { 'profile': 1, 'isAdmin': 1 };

  if (this.userId && isAdminById(this.userId))
    fields.emails = 1;

  return {
    find: function () {
      return Events.find({}, { limit: limit, sort: { 'info.date': -1 } });
    },
    children: [
      {
        find: function (event) {
          return Meteor.users.find({ 
            '_id': { $in: event.members }, 
            'isDeleted': false 
          }, { fields: fields });
        }  
      },
      {
        find: function (event) {
          return Pictures.find(event.pictureId);
        }
      }
    ]
  }
});