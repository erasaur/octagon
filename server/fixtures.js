if (Settings.find().count() === 0) {
  Settings.insert({ 
    'clubName': 'Octagon', 
    'schoolName': 'Lynbrook',
    'aboutLink': 'http://en.wikipedia.org/wiki/Optimist_International',
    'contactEmail': 'lhs8octagon@gmail.com',
    'facebookPage': 'https://www.facebook.com/groups/140021596038905/',
    'defaultEmail': 'greetings@lhsoctagon.org',
    'defaultEmailName': 'Lynbrook Octagon Officers',
    'pointsPerHour': 4,
    'pointsForCarpool': 1,
    'pointsForMIC': 2,
    'strikesPerPenalty': 3,
    'pointsPerPenalty': 10,
    'pointsPerSuggest': 5,
    'likes': 0 
  });
}