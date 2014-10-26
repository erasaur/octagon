Meteor.publish('events', function (limit) {
  if (limit > Events.find().count()) {
    limit = 0;
  }

  var fields = { 'profile': 1 };

  if (isAdminById(this.userId))
    fields.emails = 1;

  publishWithRelations(this, Events.find({}, { limit: limit }), function (id, doc) {
    this.cursor(Meteor.users.find({ '_id': { $in: doc.members } }, { fields: fields }));
  });

  return this.ready();
});