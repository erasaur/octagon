Meteor.publish('events', function (limit) {
  if (limit > Events.find().count()) {
    limit = 0;
  }

  publishWithRelations(this, Events.find({}, { limit: limit }), function (id, doc) {
    this.cursor(Meteor.users.find({ '_id': { $in: doc.members } }, { fields: { 'profile': 1 } }));
  });

  return this.ready();
});