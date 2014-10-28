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
    label: 'Name of your club'
  },
  schoolName: { // name of the school
    type: String,
    label: 'Name of your school'
  },
  aboutLink: {
    type: String,
    optional: true,
    label: 'Link to About Page (optional)'
  },
  contactEmail: { 
    type: SimpleSchema.RegEx.Email,
    label: 'Email address to show in contact page'
  },
  facebookPage: {
    type: String,
    optional: true,
    label: 'Facebook page (optional)'
  },
  defaultEmail: { // sent from email
    type: String,
    label: 'Email displayed for outgoing emails (use real one if you care about responses)'
  },
  defaultEmailName: {
    type: String,
    optional: true,
    label: 'Name to be shown in outgoing emails (optional)',
    defaultValue: 'Your Officers'
  },
  pointsPerHour: {
    type: Number,
    min: 0,
    label: 'Points awarded per hour of service',
    defaultValue: 4
  },
  pointsForCarpool: {
    type: Number,
    min: 0,
    label: 'Points awarded for carpooling',
    defaultValue: 1
  },
  pointsForMIC: {
    type: Number,
    min: 0,
    label: 'Points awarded for being the member in charge',
    defaultValue: 2
  },
  strikesPerPenalty: {
    type: Number,
    min: 1,
    label: 'Number of strikes before penalty is given',
    defaultValue: 3
  },
  pointsPerPenalty: {
    type: Number,
    min: 0,
    label: 'Points deducted for a penalty',
    defaultValue: 10
  },
  pointsPerSuggest: {
    type: Number,
    min: 0,
    label: 'Points awarded for suggesting an approved event',
    defaultValue: 5
  },
  backgroundColor: {
    type: String,
    optional: true,
    label: 'Background Color (hex or rgb, optional)',
    defaultValue: 'rgb(239, 234, 232)'
  },
  headerColor: {
    type: String,
    optional: true,
    label: 'Header Color (hex or rgb, optional)',
    defaultValue: 'rgb(245, 245, 245)'
  },
  bodyColor: {
    type: String,
    optional: true,
    label: 'Body Color (hex or rgb, optional)',
    defaultValue: 'rgb(255, 255, 255)'
  },
  footerColor: {
    type: String,
    optional: true,
    label: 'Footer Color (hex or rgb, optional)',
    defaultValue: 'rgb(245, 245, 245)'
  },
  primaryColor: {
    type: String,
    optional: true,
    label: 'Primary Color (hex or rgb, optional)',
    defaultValue: 'rgb(66, 139, 202)'
  },
  mutedColor: {
    type: String,
    optional: true,
    label: 'Muted Color (hex or rgb, optional)',
    defaultValue: 'rgb(217, 237, 247)'
  },
  grayColor: {
    type: String,
    optional: true,
    label: 'Gray Color (hex or rgb, optional)',
    defaultValue: 'rgb(231, 239, 242)'
  },
  borderColor: {
    type: String,
    optional: true,
    label: 'Border Color (hex or rgb, optional)',
    defaultValue: 'rgb(188, 232, 241)'
  },
  mainPadding: {
    type: String,
    optional: true,
    label: 'Main Padding (px or em, optional)',
    defaultValue: '20px'
  },
  largePadding: {
    type: String,
    optional: true,
    label: 'Large Padding (px or em, optional)',
    defaultValue: '30px'
  },
  mainRadius: {
    type: String,
    optional: true,
    label: 'Main Radius (px or em, optional)',
    defaultValue: '6px'
  },
  navHeight: {
    type: String,
    optional: true,
    label: 'Navbar Height (px or em, optional)',
    defaultValue: '51px'
  },
  likes: { // number of likes the site received
    type: Number,
    min: 0,
    autoform: {
      omit: true
    },
    defaultValue: 0
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