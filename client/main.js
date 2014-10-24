var currentPost, currentPicture, reader = new FileReader(), errors = new Array();
var POINTS_PER_HOUR = 4, POINTS_FOR_CARPOOL = 1, POINTS_FOR_MIC = 2, THREE_STRIKES_PENALTY = 10;

$(window).scroll(function() {
	//run function when scroll
	showMoreEvents();
});

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
}
//todo format all ids
function formatID (str) {
	str = str.replace(/[^\w\s]|_/g, ""); //remove all punctuation (allows only letters, numbers, and spaces)
	str = str.replace(/ /g,''); //removes all spaces from string
	return str;
}

function convertNewLines (str) { //bool = convert from new lines to <br>, or vice versa. true = first case.
	return str.replace(/(\r\n|\n|\r)/gm, "<br>");
}

function getMembers (bool) {
	var users = new Array();

	for (var i=0; i<Meteor.users.find().count(); i++) {
		users.push(Meteor.users.find({"profile.officer": bool}).fetch()[i].profile);
	}
	
	return users;
}

function isNumber (num) {
	return ! isNaN (num-0) && num !== null && num.replace(/^\s\s*/, '') !== "" && num !== false;
}

function validEmail (email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email); 
}

//handles infinite scrolling on events page
function showMoreEvents () {
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
}

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

Template.home.rendered = function () {
	if (Session.get('resetPassword')) {
		//redirect if has token to reset pass
		Router.go('/recovery');
	} else {
		$('#homeCarousel').find('.item:first').addClass('active');
	}
};

Template.home.helpers({
	hasPosts: function () {
		return PostsModel.find().count();	
	},
	posts: function () {
		return PostsModel.find({}, { sort: { 'date': -1 } });
	},
	hasPictures: function () {
		return PicturesModel.find({"featured": true}).count();
	},
	pictures: function () {
		return PicturesModel.find({"featured": true});
	}
});

Template.finalizeTemplate.helpers({
	memberList: function () {
		//need the if because without it the template can't render the modal on startup
		if(Session.get('currentEvent')) {
			if(EventsModel.findOne({"id": Session.get('currentEvent').id})) {
				var members = EventsModel.findOne({"id": Session.get('currentEvent').id}).members;
				if(members) {
					var names = new Array();
					for(var i=0; i< members.length; i++) {
						names.push(members[i].name);
					}
					return names;
				}
			}
		}
	},
	memberID: function () {
		return formatID(this);
	}
});

Template.showEmails.helpers({
	presMembers: function () {
		return Session.get('currentEvent') && Session.get('currentEvent').members.length;
	},
	getMembers: function () {
		var users = new Array();

		for (var i=0; i < Session.get('currentEvent').members.length; i++){
			users.push(Meteor.users.findOne({"_id": Session.get('currentEvent').members[i].id}).emails[0].address);
		}
		console.log(users);
		return users;
	},
	getEvent: function () {
		return Session.get('currentEvent').name;
	}
});

Template.events.helpers({
	hasEvents: function () {
		return EventsModel.find().count() > 0 ? true: false;
	},
	moreEvents: function () {
		return !(EventsModel.find().count() < Session.get('eventsLimit'));
	},
	eventsList: function () {
		return EventsModel.find();
	},
	paid: function () {
		return EventsModel.findOne({"id": this.id}).money > 0 ? true : false;
	},
	attendingEvent: function () {
		return EventsModel.find({$and: [{"id": this.id}, {"members.name": Meteor.user().profile.name}]}).count() > 0 ? true : false;
	},
	slotsLeft: function () {
		return EventsModel.findOne({"id": this.id}).slots > 0 ? true : false;
	},
	tooLate: function () {
		console.log(getDate());
		console.log(this.date);
		return getDate() >= this.date ? true : false;
	},
	finalized: function () {
		return this.finalized;
	}
});

Template.suggestions.helpers({
	hasPending: function () {
		return SuggestsModel.find().count() > 0 ? true : false;
	},
	pending: function () {	
		return SuggestsModel.find();
	},
	approved: function () {
		return SuggestsModel.findOne({name: this.name}).status == "approved" ? true : false;
	},
	rejected: function () {
		return SuggestsModel.findOne({name: this.name}).status == "rejected" ? true : false;
	}
});

Template.contact.likes = function () {
	if(LikesModel.findOne({"id": "contact"})) return LikesModel.findOne({"id": "contact"}).likes;
	else return 0;
};

Template.profile.helpers({
	hasSuggested: function () {
		//typically would want to limit collection in publish (server.js), but its safe to send all suggestions to the client
		return SuggestsModel.find({"uname": Meteor.user().username}).count() > 0 ? true : false; 
	},
	suggestedEvents: function () {
		//typically would want to limit collection in publish (server.js), but its safe to send all suggestions to the client
		return SuggestsModel.find({"uname": Meteor.user().username}); 
	}
});

Template.pictures.helpers({
	hasPictures: function () {
		return PicturesModel.find().count();
	},
	pictures: function () {
		return PicturesModel.find({});
	}
});

Template.recovery.rendered = function () {
	if (Meteor.user()) {
		Router.go('/');
	}
}

Template.recovery.helpers({
	resetPassword: function () {
		return Session.get('resetPassword');
	}
});

Template.nav.events({
	'click #logout': function () {
		Meteor.logout(function(error) {
			Router.go('home');
		});
	},
	'submit #loginForm': function (event, template) {
		event.preventDefault();
		var userName = template.find('#username').value,
			userPass = template.find('#password').value;
		
		Meteor.loginWithPassword(userName, userPass, function(error) {
			if (error) { 
				alert(error); 
			}
		});
	},
	'click #create': function (event, template) {
		var userMail = template.find('#createEmail').value,
			userName = template.find('#createUsername').value,
			name = template.find('#createName').value,
			userPass = template.find('#createPassword').value,
			repeatPass = template.find('#repeatPassword').value,
			errors = [];
		
		//if all fields are filled in
		if(userMail && userName && name && userPass && repeatPass) {

			var name = name.trim();
			
			if(validEmail(userMail)) {
				if(Meteor.users.find({"profile.name": name}).count() > 0) {
					errors.push("Oops! There is another user with the same name. For the purposes of identification, please include a middle/last/nick name.");
				} else {
					if(userPass.length >= 6) {
						if(userPass != repeatPass) {
							//passwords don't match
							errors.push("The passwords do not match.");
						}
					} else {
						//password too short
						errors.push("Your password must be at least 6 characters long.");
					}
				}
			} else {
				//invalid email
				errors.push("The email entered is invalid.");
			}
		} else {
			//fields not filled in
			errors.push("Please fill in all of the fields!");
		}
		
		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			Accounts.createUser({"username": userName, "email": userMail, "password": userPass, "profile": {"name": name, "points": 0, "officer": false, "events": [], "mic": 0, "carpool": 0, "strikes": 0, "suggests": 0, "meetings": 0}}, function(error) {
				if (error) { 
					alert(error); 
				} else {
					alert("Success! Your account '" + userName + "' has been created.");
					$('#signUpModal').modal('hide');
				}
			});
		}
	}
});

Template.home.events({
	'click #createPost': function (event, template) {
		var postID = formatID(template.find('#createID').value),
			postTitle = template.find('#createTitle').value,
			postContent = template.find('#createContent').value,
			postDate = getDate(),
			errors = [];

		if(postID && postTitle && postContent && postDate) {
			if(PostsModel.find({"id": postID}).count() > 0) {
				errors.push("The post ID already exists.")
			}
		} else {
			errors.push("Please fill in all of the fields!");
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			Octagon.Posts.create(postID, postTitle, postDate, postContent);
			alert("Success! Your post '" + postTitle + "' has been created.");
			$('#addPostModal').modal('hide');
		}
	},
	'click #editPostButton': function (event, template) {
		currentPost = this;

		template.find('#editID').value = this.id;
		template.find('#editTitle').value = this.title;
		template.find('#editContent').value = this.content;
	},
	'click #editPost': function (event, template) {
		var postID = formatID(template.find('#editID').value),
			postTitle = template.find('#editTitle').value,
			postContent = template.find('#editContent').value,
			errors = [];

		if(postID && postTitle && postContent) {
			if(currentPost.id != postID) {
				if(PostsModel.find({"id": postID}).count() > 0) {
					errors.push("The post ID '" + postID + "' already exists.")
				}
			}		
		} else {
			errors.push("Please fill in all fields!");
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			Octagon.Posts.update(currentPost.id, postID, postTitle, postContent);
			alert("Success! Your post '" + postTitle + "' has been updated.");
			$('#editPostModal').modal('hide');
		}
	},
	'click .deletePost': function () {
		if(confirm("Are you sure you want to delete '" + this.title + "'?")) {
			Octagon.Posts.delete(this._id);
			$('#editPostModal').modal('hide');
		}
	}
});

Template.events.events({
	//todo format all ids
	'click #createEvent': function (event, template) {
		var eventID = template.find('#createID').value,
			eventName = template.find('#createEventName').value,
			eventMonth = template.find('#createMonth').value,
			eventDay = template.find('#createDay').value,
			eventYear = template.find('#createYear').value,
			eventDate,
			eventTime = template.find('#createBeginTime').value + ' ' + template.find('#createBegin').innerHTML + ' - ' + template.find('#createEndTime').value + ' ' + template.find('#createEnd').innerHTML,
			eventDescription = template.find('#createDescription').value,
			eventLocation = template.find('#createLocation').value,
			eventMoney = template.find('#createMoney').value,
			eventSlots = parseInt(template.find('#createSlots').value),
			file = template.find('#createPicture').files[0],
			errors = [];

		if(eventID && eventName && eventMonth && eventDay && eventYear && eventTime && eventDescription && eventLocation && eventMoney && eventSlots && file) {
			if(EventsModel.find({"id": eventID}).count() != 0) {
				errors.push("The event ID '" + eventID + "' already exists.");
			}
		} else {
			errors.push("Please fill in all fields!");
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			if(eventDay < 10 && eventDay.toString().length < 2) {
				eventDay = '0' + eventDay;
			}
			if(eventMonth < 10 && eventMonth.toString().length >= 2) {
				eventMonth = parseInt(eventMonth.toString().replace(/^0+/, ''));
				eventMonth = '0' + eventMonth;
			}

			eventDate = eventYear + '/' + eventMonth + '/' + eventDay;

			Octagon.Events.create(eventID, eventName, eventDate, eventTime, convertNewLines(eventDescription), eventLocation, eventMoney, eventSlots);
		    
	    reader.onload = function (event) {
	    	Octagon.Events.addUrl(eventID, event.target.result);
	    }
	    reader.readAsDataURL(file);

			alert("Success! Your event '" + eventName + "' has been created.");
			$('#addEventModal').modal('hide');
		}
	},
	'click .modalAddMember': function (event, template) {
		Session.set('currentEvent', this);
	},
	//-----------------------------------------------EDITED---------------------
	'click .modalShowEmails': function (event, template) {
		console.log("helloModal");
		Session.set('currentEvent', this);
		console.log(Session.get('currentEvent'));
	},//---------------------------------------------/EDITED--------------------
	'click #addEventMember': function (event, template) {
		var member = template.find('#eventMemberToAdd').value;

		if(member) {
			if(Session.get('currentEvent').slots > 0) {
				if(Meteor.users.find({"profile.name": member}).count() > 0) {
					if(EventsModel.find({$and: [{"name": Session.get('currentEvent').name}, {"members.name": member}]}).count() > 0) {
						alert("The user is already attending the event!");
					} else {
						Octagon.Events.addMember(Session.get('currentEvent').id, member, Meteor.users.findOne({"profile.name": member})['_id']);
						alert("Success! '" + member + "' has been added.");
						$('#addMemberModal').modal('hide');
					}
				} else {
					alert("The user does not exist!");
				}
			} else {
				alert("There are no more slots. Edit the event and try again.");
			}
		} else {
			alert("Please fill in all the fields!");
		}
	},
	'click .deleteEvent': function () {
		if(confirm("Are you sure you want to delete '" + this.name + "'? (This is highly advised against, even if the event is already over.)")) {
			Octagon.Events.delete(this._id);
		}
	},
	'click .editEventButton': function (event, template) {
		Session.set('currentEvent', this);

		var dateArray = this.date.split('/');
		var timeArray = this.time.split(' '); //3:00, am - 6:00, pm

		template.find('#editID').value = this.id;
		template.find('#editName').value = this.name;
		template.find('#editYear').value = dateArray[0];
		template.find('#editMonth').value = dateArray[1];
		template.find('#editDay').value = dateArray[2];
		template.find('#editBeginTime').value = timeArray[0];
		template.find('#editBegin').innerHTML = timeArray[1];
		template.find('#editEndTime').value = timeArray[3];
		template.find('#editEnd').innerHTML = timeArray[4];
		//convert the <br> to \n
		template.find('#editDescription').value = this.description.replace(/\<br\\?>/g, "\n");
		template.find('#editLocation').value = this.location;
		template.find('#editMoney').value = this.money;
		template.find('#editSlots').value = this.slots;
	},
	'click #editEvent': function (event, template) {
		var eventID = template.find('#editID').value,
			eventName = template.find('#editName').value,
			eventMonth = template.find('#editMonth').value,
			eventDay = template.find('#editDay').value,
			eventYear = template.find('#editYear').value,
			eventDate,
			eventTime = template.find('#editBeginTime').value.trim() + ' ' + template.find('#editBegin').innerHTML + ' - ' + template.find('#editEndTime').value.trim() + ' ' + template.find('#editEnd').innerHTML,
			eventDescription = convertNewLines(template.find('#editDescription').value),
			eventLocation = template.find('#editLocation').value,
			eventMoney = template.find('#editMoney').value,
			eventSlots = parseInt(template.find('#editSlots').value),
			file = template.find('#editPicture').files[0];
			errors = [];

		if(eventID && eventName && eventMonth && eventDay && eventYear && eventTime && eventDescription && eventLocation && eventMoney && eventSlots != null) {
			if(eventID != Session.get('currentEvent').id) {
				if(EventsModel.find({"id": eventID}).count() > 0) {
					errors.push("The event ID '" + eventID + "' already exists.");
				}
			}
		} else {
			errors.push("Please fill in all fields!");
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			if(eventDay < 10 && eventDay.toString().length < 2) {
				eventDay = '0' + eventDay;
			}
			if(eventMonth < 10 && eventMonth.toString().length < 2) {
				eventMonth = parseInt(eventMonth.toString().replace(/^0+/, ''));
				eventMonth = '0' + eventMonth;
			}

			eventDate = eventYear + '/' + eventMonth + '/' + eventDay;

		    Octagon.Events.update(Session.get('currentEvent').id, eventID, eventName, eventDate, eventTime, convertNewLines(eventDescription), eventLocation, eventMoney, eventSlots);
		    
		    if(file) {
			    reader.onload = function (event) {
			    	Octagon.Events.editUrl(eventID, event.target.result);
			    }
			    reader.readAsDataURL(file);
			}
			
			alert("Success! Your post '" + eventName + "' has been updated.");
			$('#editEventModal').modal('hide');
		}
	},
	'click #suggestEvent': function (event, template) {
		var eventName = template.find('#suggestName').value,
			eventDescription = template.find('#suggestDescription').value,
			eventLocation = template.find('#suggestLocation').value,
			eventCost = template.find('#suggestMoney').value,
			eventContact = template.find('#suggestContact').value,
			errors = [];

		if(eventName && eventDescription && eventLocation && eventContact) {
			if(SuggestsModel.find({"contact": eventContact}).count() > 0 || SuggestsModel.find({"name": eventName}).count() > 0 || SuggestsModel.find({"location": eventLocation}).count() > 0) {
				errors.push("Oops! We believe the event has already been suggested.")
			}
		} else {
			errors.push("Please fill in all fields!");
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			Octagon.Suggests.create(eventName, getDate(), convertNewLines(eventDescription), eventLocation, eventCost, eventContact, Meteor.user().username, Meteor.user().profile.name, Meteor.userId());
			alert("Thanks for your input! \n\nYour event will be taken into consideration; upon approval, you will receive 5 points.\n\nDon't get your hopes too high though.");
			$('#suggestEventModal').modal('hide');
		}
	},
	'click .attendEvent': function () {
		Octagon.Events.addMember(this.id, Meteor.user().profile.name, Meteor.userId());
	},
	'click .cancelAttend': function () {
		Octagon.Events.removeMember(this.id, Meteor.user().profile.name);
	},
	'click .finalizeEventButton': function () {
		Session.set('currentEvent', this);
		$('#finalizeMemberList').html(Meteor.render(Template.finalizeTemplate));
	},
	'click #finalizeEvent': function (event, template)  {
		var members = EventsModel.findOne({"id": Session.get('currentEvent').id}).members,
		points, hours, mic = false, carpool = false, membersArray = new Array(), errors = [];

		if(members) {
			for(var i=0; i< members.length; i++) {
				//append name to array so we can use it in the log
				if(i > 0) {
					membersArray.push(" " + members[i].name);
				} else {
					membersArray.push(members[i].name);
				}

				//get the value of the text box whose id is the current member's name (aka the "hours" input)
				hours = parseFloat(template.find("#" + formatID(members[i].name)).value);
				points = hours*POINTS_PER_HOUR;
				console.log(points);
				if($('#' + members[i].name + 'c').is(":checked")) {
					points += POINTS_FOR_CARPOOL;
					//update carpool count
					Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.carpool": 1}});
					carpool = true;
				}
				if($('#' + members[i].name + 'm').is(":checked")) {
					points += POINTS_FOR_MIC;
					//update mic count
					Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.mic": 1}});
					mic = true;
				}

				if(points > 0) {
					//update profile total points
					Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.points": points}});
					//update profile events array
					Meteor.users.update({"_id": members[i].id}, {$addToSet: {"profile.events": {"id": Session.get('currentEvent').id, "name": Session.get('currentEvent').name, "date": Session.get('currentEvent').date, "hours": hours, "mic": mic, "carpool": carpool}}});
				} else {
					Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.strikes": 1}});
					Meteor.users.update({"_id": members[i].id}, {$addToSet: {"profile.events": {"id": Session.get('currentEvent').id, "name": Session.get('currentEvent').name, "date": Session.get('currentEvent').date, "hours": 0, "mic": mic, "carpool": carpool}}});
					if(Meteor.users.findOne({"_id": members[i].id}).profile.strikes % 3 == 0) {
						Meteor.users.update({"_id": members[i].id}, {$inc: {"profile.points": -THREE_STRIKES_PENALTY}});
						if(Meteor.users.findOne({"_id": members[i].id}).profile.points < 0) {
							Meteor.users.update({"_id": members[i].id}, {$set: {"profile.points": 0}});
						}
					}
				}
			}
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			Octagon.PointsLog.create(getDate(), Meteor.user().profile.name, membersArray, "event", Session.get('currentEvent').name + " [" + Session.get('currentEvent').date + "]");
			Octagon.Events.finalize(Session.get('currentEvent').id);
			alert("Success! The event has been finalized.");
			$('#finalizeEventModal').modal('hide');
		}
	},
	'click #finalizeAnyway': function () {
		Octagon.Events.finalize(Session.get('currentEvent').id);
		alert("I see you have no choice. It has been done.");
		$('#finalizeEventModal').modal('hide');
	}
});

Template.profile.events({
	'click #changePass': function (event, template) {
		var pass = template.find('#newPassword').value,
			again = template.find('#newPasswordVerify').value,
			errors = [];
		
		if(pass && again) {
			if(pass != again) {
				errors.push("The passwords do not match.");
			} else {
				if(pass.length < 6) {
					errors.push("Your password must be at least 6 characters long.");
				}
			}
		} else {
			errors.push("Please fill in all the fields!");
		}
		
		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			Meteor.call('changePass', Meteor.userId(), pass);
			alert("Success! Your password has been changed.");
			$('#changePassModal').modal('hide');
		}
	},
	'click #deleteAccount': function () {
		if(confirm("Are you sure you want to delete your account?")) {
			Meteor.call('removeUser', Meteor.userId());
			alert("Farewell, old sport.");
			Router.go('home');
		}
	}
});

Template.suggestions.events({
	'click .approveEvent': function () {
		//todo put this stuff on meteor.methods
		Meteor.users.update({"_id": this.userid}, {$inc: {"profile.suggests": 1}});
		Meteor.users.update({"_id": this.userid}, {$inc: {"profile.points": 5}});
		Octagon.Suggests.approve(this.name);
	},
	'click .unApproveEvent': function () {
		Meteor.users.update({"_id": this.userid}, {$inc: {"profile.suggests": -1}});
		Meteor.users.update({"_id": this.userid}, {$inc: {"profile.points": -5}});
		Octagon.Suggests.unApprove(this.name);
	},
	'click .rejectEvent': function () {
		Octagon.Suggests.reject(this.name);
	},
	'click .unRejectEvent': function () {
		Octagon.Suggests.unReject(this.name);
	},
	'click .deleteEvent': function () {
		if(confirm("Are you sure you want to delete '" + this.name + "'?")) {
			Octagon.Suggests.delete(this.name);
		}
	}
});

Template.contact.events({
	'click #like': function () {
		if(LikesModel.find({"id": "contact"}).count() == 0)
			LikesModel.insert({"id": "contact", "likes": 0});
		else
			LikesModel.update({_id:LikesModel.findOne({"id": "contact"})['_id']}, {$inc: {"likes": 1}});
	}
});

Template.pictures.events({
	'click #addPicture': function (event, template) {
		var file = template.find('#createPicture').files[0],
			caption = template.find('#createCaption').value,
			featured = template.find('#createFeatured').checked;
		    
		if(file && caption){
		    reader.onload = function (event) {
		    	Octagon.Pictures.create(event.target.result, caption, featured);
		    }
		    reader.readAsDataURL(file);

		    alert("Success! The picture has been added.");
		    $('#addPictureModal').modal('hide');
		} else {
			alert("Please fill in all the fields!");
		}
	},
	'click .editPictureButton': function (event, template) {
		currentPicture = this;
		
		template.find('#editCaption').value = this.caption;
	},
	'click #savePicture': function (event, template) {
		var file = template.find('#editPicture').files[0],
			caption = template.find('#editCaption').value,
			featured = template.find('#editFeatured').checked;

		if(caption) {
			if(file) {
				reader.onload = function (event) {
		    	Octagon.Pictures.update(currentPicture.source, event.target.result, caption, featured);
		    	}
		    	reader.readAsDataURL(file);

		    	alert("Success! The picture has been edited.");
		    	$('#editPictureModal').modal('hide');
			} else {
				Octagon.Pictures.update(currentPicture.source, currentPicture.source, caption, featured);

				alert("Success! The picture has been edited.");
		    	$('#editPictureModal').modal('hide');
			}
		} else {
			alert("Please fill in all the fields!");
		}
	},
	'click .deletePicture': function () {
		if(confirm("Are you sure you want to delete this picture?")) {
			Octagon.Pictures.delete(this.source);
		}
	}
});

Template.members.events({
	'click #appendName': function () {
		var users = $('#membersToAdd');
		if(users.val() == "") {
			users.val(users.val() + $('#addToMembers').val());
		} else {
			users.val(users.val() + ", " + $('#addToMembers').val());
		}
		$('#addToMembers').val("");
	},
	'click #addPoints': function (event, template) {
		var members = template.find('#membersToAdd').value,
			points = template.find('#pointsToAdd').value,
			occasion = template.find('#occasion').value,
			meeting = $('#isMeeting').is(':checked'),
			errors = [];

		if (members && points && occasion) {
			if(!isNumber(points)) {
				errors.push("Please enter a number for the points.");
			} else {
				var usersArray = members.split(',');
				for(var i=0; i< usersArray.length; i++) {
					usersArray[i] = usersArray[i].trim();
					if(Meteor.users.find({"profile.name": usersArray[i]}).count() == 0) {
						errors.push("The name '" + usersArray[i] + "' does not exist.\n\nNote: Names are case sensitive!");
					}
				}
			}
		} else {
			errors.push("Please fill in all the fields!");
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			for(var i=0; i< usersArray.length; i++) {
				Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": usersArray[i]})['_id']}, {$inc: {"profile.points": parseInt(points)}});
				if(Meteor.users.findOne({"profile.name": usersArray[i]}).profile.points < 0) {
					Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": usersArray[i]})['_id']}, {$set: {"profile.points": 0}});
				}

				if(meeting) {
					Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": usersArray[i]})['_id']}, {$inc: {"profile.meetings": 1}});
				}
			}

			Octagon.PointsLog.create(getDate(), Meteor.user().profile.name, members, points, occasion);
			alert("Success! The points have been assigned.");
			$('#addPointsModal').modal('hide');
		}
	},
	'click #clearLog': function () {
		if (confirm("Are you sure you want to clear the log?")) {
			Meteor.call('clearLog');
			alert("Log has been cleared!");
		}
	},
	'click .delUser': function (event, template) {
		var user = this.profile.name;
		if (confirm("Are you sure you want to delete " + user + "?")) {
			Meteor.call('removeUser', Meteor.users.findOne({"profile.name": user})['_id']);
			alert(user + " has been deleted.");
		}
	},
	'click #addStrikes': function (event, template) {
		var member = template.find('#memberToStrike').value,
			strikes = template.find('#strikesToAdd').value,
			errors = [];

		if (member && strikes) {
			if(!isNumber(strikes)) {
				errors.push("Please enter a number for the strikes.");
			} else {
				if(Meteor.users.find({"profile.name": member}).count() == 0) {
					errors.push("The name '" + member + "' does not exist.\n\nNote: Names are case sensitive!");
				}
			}
		} else {
			errors.push("Please fill in all the fields!");
		}

		if(errors.length > 0) {
			for(var i=0; i<errors.length; i++) {
				alert(errors[i]);
			}
			errors = [];
		} else {
			Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": member})['_id']}, {$inc: {"profile.strikes": parseInt(strikes)}});
			if(Meteor.users.findOne({"profile.name": member}).profile.strikes < 0) {
				Meteor.users.update({"_id": Meteor.users.findOne({"profile.name": member})['_id']}, {$set: {"profile.strikes": 0}});
			}
			alert("Success! The strikes have been assigned.");
			$('#addStrikesModal').modal('hide');
		}
	}
});

Template.recovery.events({
	'submit #recoverPass': function (e, t) {
		e.preventDefault();
		var email = t.find('#inputEmail').value;
		if (validEmail(email)) {
			Session.set('loading', true);
			Accounts.forgotPassword({"email": email}, function (error) {
				if (error) {
					alert(error);
				} else {
					alert("Please check your email (including junk and spam folders) for a verification link.");
				}
				Session.set('loading', false);
			});
		}
	},
	'submit #newPass': function (e, t) {
		e.preventDefault();
		var pass = t.find('#inputPass').value;
		if (pass) {
			Session.set('loading', true);
			Accounts.resetPassword(Session.get('resetPassword'), pass, function (error) {
				if (error) {
					alert(error);
				} else {
					Session.set('resetPassword', null);
					alert("Done!");
				}
				Session.set('loading', false);
			});
		}
	}
});









