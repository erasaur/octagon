Accounts.emailTemplates.siteName = getSetting('clubName');
Accounts.emailTemplates.from = getSetting('defaultEmailName') + ' <' + getSetting('defaultEmail') + '>';
Accounts.emailTemplates.resetPassword.text = function (user, url) {
	return 'Hey there ' + user.profile.name + 
  '!\n\n So I heard you lost your password! No worries. ' + 
  'To reset your password, simply click on the link below: \n\n' + 
  url + '\n\nCheers,\n\nYour loving webmaster';
};
