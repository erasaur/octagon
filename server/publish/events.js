Meteor.publish('events', function (limit) {
  if (limit > Events.find().count()) {
    limit = 0;
  }

  var fields = { 'profile': 1 };

  if (this.userId && isAdminById(this.userId))
    fields.emails = 1;

  publishWithRelations(this, Events.find({}, { limit: limit }), function (id, doc) {
    if (doc.members)
      this.cursor(Meteor.users.find({ '_id': { $in: doc.members } }, { fields: fields }));

    this.cursor(Pictures.find(doc.pictureId));
  });

  return this.ready();
});