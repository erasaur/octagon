getCurrentRoute = function () {
  return Router && Router.current() && Router.current().route.name;
};
getSiteUrl = function () {
  return Meteor.absoluteUrl();
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
getDate = function () {
  var date = new Date();
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  var month = date.getMonth() + 1; //january is 0
  if (month < 10) {
    month = '0' + month;
  }
  var year = date.getFullYear();
  var realdate = year + '/' + month + '/' + day;
  return realdate;
};
//todo format all ids
formatID = function (str) {
  str = str.replace(/[^\w\s]|_/g, ""); //remove all punctuation (allows only letters, numbers, and spaces)
  str = str.replace(/ /g,''); //removes all spaces from string
  return str;
};

convertNewLines = function (str) { //bool = convert from new lines to <br>, or vice versa. true = first case.
  return str.replace(/(\r\n|\n|\r)/gm, "<br>");
};

getMembers = function (bool) {
  var users = new Array();

  for (var i=0; i<Meteor.users.find().count(); i++) {
    users.push(Meteor.users.find({"profile.officer": bool}).fetch()[i].profile);
  }
  
  return users;
};

isNumber = function (num) {
  return ! isNaN (num-0) && num !== null && num.replace(/^\s\s*/, '') !== "" && num !== false;
};

validEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email); 
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