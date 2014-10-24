Handlebars.registerHelper('onPage', function (path) {
  var pathname = window.location.pathname.split('/')[1];
  return pathname === path;
});
Handlebars.registerHelper('username', function() {
  if(Meteor.user()) return Meteor.user().username;
});
Handlebars.registerHelper('email', function() {
  if(Meteor.user() && Meteor.user().emails) return Meteor.user().emails[0].address;
});
Handlebars.registerHelper('profile', function() {
  if(Meteor.user()) return Meteor.user().profile;
});
Handlebars.registerHelper('officer', function() {
  if(Meteor.user()) return Meteor.users.find({$and: [{"_id": Meteor.userId()}, {"profile.officer": true}]}).count() > 0 ? true : false;
});
Handlebars.registerHelper('allMembers', function () {
  var users = new Array();

  for (var i=0; i<Meteor.users.find().count(); i++) {
    users.push(Meteor.users.find({}, {sort: {"profile.officer": -1}}).fetch()[i]);
  }
  
  return users;
});
Handlebars.registerHelper('allNames', function() {
  var users = new Array();

  for (var i=0; i<Meteor.users.find().count(); i++) {
    users.push("\"" + Meteor.users.find({}, {sort: {"profile.officer": -1}}).fetch()[i].profile.name + "\"");
  }
  
  return users;
});
Handlebars.registerHelper('')

Template.members.helpers({
  hasMembers: function () {
    return Meteor.users.find();
  },
  hasAssigned: function () {
    return PointsModel.find().count();
  },
  pointsLog: function () {
    return PointsModel.find();
  }
});