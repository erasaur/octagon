Meteor.users.allow({
  update: function (userId, user, fields, modifier) {
      var officer = Meteor.users.findOne({"_id": userId}).profile.officer;
      if(userId && officer) {
        return true; //if logged in and officer, allow
      } else {
        if(userId === user._id) { //if the logged in user is editing his own account
          var allowed = ["password"]; //fields allowed to be changed
          if (_.difference(fields, allowed).length)
            return false; //don't allow change to another field

          return true;
        }
    }
    }
});