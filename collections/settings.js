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
  aboutLink: {
    type: String,
    optional: true,
    autoform: {
      label: 'Link to About Page (optional)'
    }
  },
  contactEmail: { 
    type: SimpleSchema.RegEx.Email,
    autoform: {
      label: 'Email address to show in contact page'
    }
  },
  facebookPage: {
    type: String,
    optional: true,
    autoform: {
      label: 'Facebook page (optional)'
    }
  },
  defaultEmail: { // sent from email
    type: String,
    autoform: {
      label: 'Email displayed for outgoing emails (use real one if you care about responses)'
    }
  },
  defaultEmailName: {
    type: String,
    optional: true,
    autoform: {
      label: 'Name to be shown in outgoing emails (optional)'
    },
    defaultValue: 'Your Officers'
  },
  pointsPerHour: {
    type: Number,
    min: 0,
    autoform: {
      label: 'Points awarded per hour of service'
    },
    defaultValue: 4
  },
  pointsForCarpool: {
    type: Number,
    min: 0,
    autoform: {
      label: 'Points awarded for carpooling'
    },
    defaultValue: 1
  },
  pointsForMIC: {
    type: Number,
    min: 0,
    autoform: {
      label: 'Points awarded for being the member in charge'
    },
    defaultValue: 2
  },
  strikesPerPenalty: {
    type: Number,
    min: 1,
    autoform: {
      label: 'Number of strikes before penalty is given'
    },
    defaultValue: 3
  },
  pointsPerPenalty: {
    type: Number,
    min: 0,
    autoform: {
      label: 'Points deducted for a penalty'
    },
    defaultValue: 10
  },
  pointsPerSuggest: {
    type: Number,
    min: 0,
    autoform: {
      label: 'Points awarded for suggesting an approved event'
    },
    defaultValue: 5
  },
  backgroundColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Background Color (hex or rgb)'
    },
    defaultValue: 'rgb(239, 234, 232)'
  },
  headerColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Header Color (hex or rgb)'
    },
    defaultValue: 'rgb(245, 245, 245)'
  },
  bodyColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Body Color (hex or rgb)'
    },
    defaultValue: 'rgb(255, 255, 255)'
  },
  footerColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Footer Color (hex or rgb)'
    },
    defaultValue: 'rgb(245, 245, 245)'
  },
  primaryColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Primary Color (hex or rgb)'
    },
    defaultValue: 'rgb(66, 139, 202)'
  },
  mutedColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Muted Color (hex or rgb)'
    },
    defaultValue: 'rgb(217, 237, 247)'
  },
  grayColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Gray Color (hex or rgb)'
    },
    defaultValue: 'rgb(231, 239, 242)'
  },
  borderColor: {
    type: String,
    optional: true,
    autoform: {
      label: 'Border Color (hex or rgb)'
    },
    defaultValue: 'rgb(188, 232, 241)'
  },
  mainPadding: {
    type: String,
    optional: true,
    autoform: {
      label: 'Main Padding (px, em, or %)'
    },
    defaultValue: '20px'
  },
  largePadding: {
    type: String,
    optional: true,
    autoform: {
      label: 'Large Padding (px, em, or %)'
    },
    defaultValue: '30px'
  },
  mainRadius: {
    type: String,
    optional: true,
    autoform: {
      label: 'Main Radius (px, em, or %)'
    },
    defaultValue: '6px'
  },
  navHeight: {
    type: String,
    optional: true,
    autoform: {
      label: 'Navbar Height (px, em, or %)'
    },
    defaultValue: '51px'
  },
  eventImageWidth: {
    type: String,
    optional: true,
    autoform: {
      label: 'Event Image Width (px, em, or %)'
    },
    defaultValue: '45%'
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