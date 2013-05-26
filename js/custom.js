$(function() {
	/*
	 * DatePicker configuration and activation.
	 */
	 $.datepicker.regional['de-CH'] = {
	 	closeText: 'schliessen',
	 	prevText: '&#x3c;zurück',
	 	nextText: 'nächster&#x3e;',
	 	currentText: 'heute',
	 	monthNames: ['Januar','Februar','März','April','Mai','Juni', 'Juli','August','September','Oktober','November','Dezember'],
	 	monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
	 	dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
	 	dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
	 	dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
	 	weekHeader: 'Wo',
	 	dateFormat: 'dd.mm.yy',
	 	firstDay: 1,
	 	isRTL: false,
	 	showMonthAfterYear: false,
	 	yearSuffix: ''
	 };
	 $.datepicker.setDefaults($.datepicker.regional['de-CH']);
	 $('#txtDate').datepicker();

	 // Different event handlers are defined here.
	 $('div#subHeader2').hover(showCreateTaskBar);
	 $('div#content').click(hideCreateTaskBar);
	 $('div#taskList').on('mouseover', 'div.task', highlightRow);
	 $('div#taskList').on('mouseleave', 'div.task', unhighlightRow);
	 $('div#taskList').on('change', 'div.task div.doneButton input', markAsDone);
	 $('div#themeSelection div.blueTheme').click(function () {
	 	changeTheme('#08C');
	 });
	 $('div#themeSelection div.pinkTheme').click(function () {
	 	changeTheme('#F0F');
	 });
	 $('div#themeSelection div.greenTheme').click(function () {
	 	changeTheme('#0F0');
	 });
	 $('div#themeSelection div').hover(function () {
	 	$(this).css('cursor', 'pointer');
	 	$(this).css('box-shadow', '0 0 10px 10px ' + $(this).css('background-color'));
	 }, function () {
	 	$(this).css('box-shadow', 'none');
	 });

	 $('div.hiddenRow').children().children('select, input').change(function () {
	 	$(this).removeClass('errorFocus');
	 });


	// Load theme
	activeTheme = localStorage['theme'] != null ? localStorage['theme'] : '#08C';
	changeTheme(activeTheme);

	// Load tasks
	ko.applyBindings(new TaskListViewModel(getAllTasks()));
});


/**
 ** Task class
 **/
var Task = function(data) {
	this.prio = ko.observable(data.prio);
	this.date = ko.observable(data.date);
    this.title = ko.observable(data.title);
    this.isDone = ko.observable(data.isDone);
}

/**
 ** TaskListViewModel class
 **/
 var TaskListViewModel = function(localTasks) {
    var self = this;
    self.tasks = ko.observableArray(localTasks);
    self.newTaskPrio = ko.observable();
    self.newTaskDate = ko.observable();
    self.newTaskText = ko.observable();

    // Operations
    self.addTask = function() {
    	if (!isValid())
    		return;

        self.tasks.push(new Task({
        	prio: this.newTaskPrio(),
        	date: this.newTaskDate(),
        	title: this.newTaskText(),
        	isDone: false
        }));

        clearInputFields();
        storeAllTasks();
    };

    self.removeTask = function(task) {
    	self.tasks.remove(task);
    	storeAllTasks();
    };

	self.cssClass = function(task) {
		try {
			return task.isDone() ? 'done' : '';
		} catch (ex){
			return task.isDone ? 'done' : '';
		}
    }

 	var storeAllTasks = function() {
 		localStorage['tasks'] = ko.toJSON(self.tasks());
 	};

	var isValid = function () {
		var isValid = true;

		if ($('#prioSelect').val() == -1) {
			$('#prioSelect').addClass('errorFocus');
			isValid = false;
		}
		if ($('#txtDate').val() == '') {
			$('#txtDate').addClass('errorFocus');
			isValid = false;
		}
		if ($('#txtTask').val() == '') {
			$('#txtTask').addClass('errorFocus');
			isValid = false;
		}

		return isValid;
	};

	var clearInputFields = function() {
		self.newTaskPrio(-1);
        self.newTaskDate("");
    	self.newTaskText("");
	};
};


/**
 **
 ** In this section the graphical UI events are handled.
 **
 **/
var activeTheme;

var showCreateTaskBar = function () {
	$(this).children().slideDown(300, function() {
		$(this).fadeTo(300, 1.0);
		$(this).stop();
	});
};

var hideCreateTaskBar = function () {
	if ($('div#subHeader2').children().css('opacity') == 0.0)
		return;

	$('div#subHeader2').children().fadeTo(300, 0.0, function() {
		$(this).slideUp(300, function () {
			$(this).stop();
		});
	});
};

var highlightRow = function () {
	$(this).css('box-shadow', '0 0 10px 10px ' + activeTheme);
	$(this).css('border-color', activeTheme);
	$(this).css('border-radius', '10px');

	// Show delete button
	$(this).children('.doneButton').removeClass('hiddenButton');
	$(this).children('.deleteButton').removeClass('hiddenButton');
	// Show Task in info box
	var text = $(this).children('.taskText').text();
	if (text.length > 16)
		text = text.substring(0, 15) + "...";

	$('#infoBox').text(text);
};

var unhighlightRow = function () {
	$(this).css('box-shadow', 'none');
	$(this).css('border-color', '#000');
	$(this).css('border-radius', '');
	// Hide delete button
	$(this).children('.doneButton').addClass('hiddenButton');
	$(this).children('.deleteButton').addClass('hiddenButton');
	// Empty info box
	$('#infoBox').text('');
};

var markAsDone = function() {
	$(this).parent().parent().toggleClass('done');
};

var changeTheme = function(themeColor) {
	activeTheme = themeColor;
	$('div#header div#subHeader1 div#navigation a, div#header div#subHeader1 div#navigation a:visited').css('color', themeColor);
	$('div#themeSelection div').css('box-shadow', 'none');

	// Store theme setting into lacal storage
	localStorage['theme'] = activeTheme;
};

var checkBrowserCompatibility = function () {
	if (Modernizr.localstorage) {
		// window.localStorage is available!
		alert('Your browser is able to store your data!');
	}
	else {
		// no native support for HTML5 storage
		alert('Your browser is NOT able to store your data!');
	}
}

var getAllTasks = function() {
	return (localStorage['tasks'] != null && localStorage['tasks'] !== "undefined") ? JSON.parse(localStorage['tasks']) : new Array();
};

// var generateGuid = function () {
// 	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
// 	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
// 	    return v.toString(16);
// 	});

// 	return guid;
// }
