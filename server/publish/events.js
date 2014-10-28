Meteor.publish('events', function (limit) {
  if (limit > Events.find().count()) {
    limit = 0;
  }

  var fields = { 'profile': 1, 'isAdmin': 1 };

  if (this.userId && isAdminById(this.userId))
    fields.emails = 1;

  publishWithRelations(this, Events.find({}, {
    limit: limit, sort: { 'info.date': -1 }
  }), function (id, doc) {
    if (doc.members) {
      this.cursor(Meteor.users.find({ 
        '_id': { $in: doc.members }, 
        'isDeleted': false 
      }, { fields: fields }));
    }

    this.cursor(Pictures.find(doc.pictureId));
  });

  return this.ready();
});