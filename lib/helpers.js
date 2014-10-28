getCurrentRoute = function () {
  return Router.current().route.getName();
};
getSiteUrl = function () {
  return Meteor.absoluteUrl();
};
getSetting = function (setting, defaultSetting) {
  var settings = Settings.find().fetch()[0];

  if (settings && (typeof settings[setting] !== 'undefined'))
    return settings[setting];
  else
    return typeof defaultSetting === 'undefined' ? '' : defaultSetting;
};
sanitize = function (s) {
  if(Meteor.isServer){
    var s = sanitizeHtml(s, {
      allowedTags: [ 
        'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 
        'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 
        'em', 'strike', 'code', 'hr', 'br', 'pre'
      ]
    });
  }
  return s;
};
stripHTML = function (s) {
  return s.replace(/<(?:.|\n)*?>/gm, '');
};
//handles infinite scrolling on events page
showMoreEvents = function () {
  var scrolled, target = $('#showMoreEvents');
  //ensure that the dom element with id showMoreEvents exists
  if(!target.length) return;

  //distance from the top
  scrolled = $(window).scrollTop() + $(window).height() - target.height();

  //if we scrolled to the bottom (where the "target" is)
  if(target.offset().top < scrolled) {
    if(!target.data('visible')) { //show the target (loading message)
      target.data('visible', true);
      Session.set('eventsLimit', Session.get('eventsLimit') + 2); //fetch some more events
    } else {
      if(target.data('visible')) {
        target.data('visible', false); //hide the target otherwise
      }
    }
  }
};
search = function (query, callback) {
  Meteor.call('search', query, { fields: { 'profile.name': 1 } }, function (error, result) {
    if (error) {
      console.log(error.reason);
      return;
    }
    callback(result.map(function (v) { 
      return { value: v.profile.name }; 
    }));
  });
};
initTypeahead = function () {
  Meteor.typeahead($('#js-typeahead'));
};