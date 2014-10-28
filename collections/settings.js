SettingsSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  },
  clubName: { // name of the club
    type: String,
    autoform: {
      label: 'Name of your club'
    }
  },
  schoolName: { // name of the school
    type: String,
    autoform: {
      label: 'Name of your school'
    }
  },
  defaultEmail: { // sent from email
    type: String,
    autoform: {
      label: 'Email address that outgoing emails will be sent from'
    }
  },
  pointsPerHour: {
    type: String,
    autoform: {
      label: 'Points awarded per hour of service'
    }
  },
  pointsForCarpool: {
    type: String,
    autoform: {
      label: 'Points awarded for carpooling'
    }
  },
  pointsForMIC: {
    type: String,
    autoform: {
      label: 'Points awarded for being the member in charge'
    }
  },
  strikesPerPenalty: {
    type: String,
    autoform: {
      label: 'Number of strikes before penalty is given'
    }
  },
  pointsPerPenalty: {
    type: String,
    autoform: {
      label: 'Points deducted for a penalty'
    }
  },
  pointsPerSuggest: {
    type: String,
    autoform: {
      label: 'Points awarded for suggesting an approved event'
    }
  },
  backgroundColor: {
    type: String,
    autoform: {
      label: 'Background Color (hex or rgb)'
    }
  },
  headerColor: {
    type: String,
    autoform: {
      label: 'Header Color (hex or rgb)'
    }
  },
  bodyColor: {
    type: String,
    autoform: {
      label: 'Body Color (hex or rgb)'
    }
  },
  footerColor: {
    type: String,
    autoform: {
      label: 'Footer Color (hex or rgb)'
    }
  },
  primaryColor: {
    type: String,
    autoform: {
      label: 'Primary Color (hex or rgb)'
    }
  },
  mutedColor: {
    type: String,
    autoform: {
      label: 'Muted Color (hex or rgb)'
    }
  },
  grayColor: {
    type: String,
    autoform: {
      label: 'Gray Color (hex or rgb)'
    }
  },
  borderColor: {
    type: String,
    autoform: {
      label: 'Border Color (hex or rgb)'
    }
  },
  mainPadding: {
    type: String,
    autoform: {
      label: 'Main Padding (px, em, or %)'
    }
  },
  largePadding: {
    type: String,
    autoform: {
      label: 'Large Padding (px, em, or %)'
    }
  },
  mainRadius: {
    type: String,
    autoform: {
      label: 'Main Radius (px, em, or %)'
    }
  },
  navHeight: {
    type: String,
    autoform: {
      label: 'Navbar Height (px, em, or %)'
    }
  },
  eventImageWidth: {
    type: String,
    autoform: {
      label: 'Event Image Width (px, em, or %)'
    }
  },
  likes: { // number of likes the site received
    type: Number,
    min: 0
  }
});

Settings = new Mongo.Collection('settings');
Settings.attachSchema(SettingsSchema);

Settings.allow({
  update: function (userId, setting, fields) {
    if (!userId) return false;

    if (isAdminById(userId))
      return true;
  
    return (_.without(fields, 'likes').length === 0);
  }
});

Meteor.methods({
  like: function () {
    var setting = Settings.findOne();
    Settings.update(setting._id, { $inc: { 'likes': 1 } });
  }
});