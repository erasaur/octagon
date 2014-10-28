Template.settings.helpers({
  currentSettings: function () {
    return Settings.findOne();
  }
});