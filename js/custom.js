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
	 $('#txtDate').datepicker().hover(function() {
	 	$(this).css('cursor', 'pointer');
	 });


	 // Different event handlers are defined here.
	 $('div#subHeader2').hover(showCreateTaskBar);
	 $('div#content').click(hideCreateTaskBar);
	 $('div#taskList').on('mouseover', 'div.task', highlightRow);
	 $('div#taskList').on('mouseleave', 'div.task', unhighlightRow);
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
	$('#subHeader2').keydown(function(e){    
	    if(e.keyCode==13){
	    	$(this).children().children().children().change()
	    	$('#btnCreate').trigger('click');
	    }
	});
	$('#taskTitle div').hover(function() {
		$(this).css('cursor', 'pointer');
	});

	// Load theme
	activeTheme = localStorage['theme'] != null ? localStorage['theme'] : '#08C';
	changeTheme(activeTheme);

	defaultLogo = $('#infoBox').html();

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
};

/**
 ** TaskListViewModel class
 **/
 var TaskListViewModel = function(localTasks) {
    var self = this;
    self.tasks = ko.observableArray(localTasks);
    self.tasks.subscribe(function () {
    	self.storeAllTasks();
    });
    self.newTaskPrio = ko.observable();
    self.newTaskDate = ko.observable();
    self.newTaskText = ko.observable();

    self.sortColumn = ko.observable("prioTitle");
	self.isSortAsc = ko.observable(true);

    for (var i = 0; i < self.tasks().length; i++) {
    	self.tasks()[i].isDone = ko.observable(self.tasks()[i].isDone);
    }

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
        hideCreateTaskBar();
    };

    self.removeTask = function(task) {
    	self.tasks.remove(task);
    	$('#infoBox').html(defaultLogo);
    };

	self.cssClass = function(task) {
		self.storeAllTasks();
		return task.isDone() ? 'done' : '';
    };

	self.prioCssClass = function(task) {
		try {
			if (task.prio() == '1')
				return 'red';
			if (task.prio() == '2')
				return 'orange';
		} catch (ex) {
			if (task.prio == '1')
				return 'red';
			if (task.prio == '2')
				return 'orange';	
		}

		return 'green';
    };

    self.sortListByPrio = function() {
    	if(self.sortColumn === event.target.id)
    		self.isSortAsc = !self.isSortAsc;
    	else {
    		self.sortColumn = event.target.id;
    		self.isSortAsc = true;
    	}               

    	self.tasks.sort(function (a, b) {
    		if (self.isSortAsc)
    			return a.prio < b.prio ? -1 : 1;
    		else
    			return a.prio < b.prio ? 1 : -1;
    	});
    };

    self.sortListByDate = function() {
    	if(self.sortColumn === event.target.id)
    		self.isSortAsc = !self.isSortAsc;
    	else {
    		self.sortColumn = event.target.id;
    		self.isSortAsc = true;
    	}               

    	self.tasks.sort(function (a, b) {
    		if (self.isSortAsc)
    			return a.date < b.date ? -1 : 1;
    		else
    			return a.date < b.date ? 1 : -1;
    	});
    };

    self.sortListByTask = function() {
    	if(self.sortColumn === event.target.id)
    		self.isSortAsc = !self.isSortAsc;
    	else {
    		self.sortColumn = event.target.id;
    		self.isSortAsc = true;
    	}               

    	self.tasks.sort(function (a, b) {
    		if (self.isSortAsc)
    			return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
    		else
    			return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1;
    	});
    };

    self.storeAllTasks = function() {
 		localStorage['tasks'] = ko.toJSON(self.tasks());
 	};

	var isValid = function () {
		var isValid = true;

		if ($('#txtTask').val() == '') {
			$('#txtTask').addClass('errorFocus');
			// $('#txtTask').focus();
			isValid = false;
		}
		if ($('#txtDate').val() == '') {
			$('#txtDate').addClass('errorFocus');
			// $('#txtDate').focus();
			isValid = false;
		}
		if ($('#prioSelect').val() == -1) {
			$('#prioSelect').addClass('errorFocus');
			// $('#prioSelect').focus();
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
var defaultLogo;

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
	$(this).children('.doneButton').removeClass('hidden-desktop');
	$(this).children('.deleteButton').removeClass('hidden-desktop');
	// Show Task in info box
	var text = $(this).children('.taskText').text();
	if (text.length > 16)
		text = text.substring(0, 15) + "...";

	$('#infoBox').html(text);
};

var unhighlightRow = function () {
	$(this).css('box-shadow', 'none');
	$(this).css('border-color', '#fff');
	$(this).css('border-radius', '');
	// Hide delete button
	$(this).children('.doneButton').addClass('hidden-desktop');
	$(this).children('.deleteButton').addClass('hidden-desktop');
	// Empty info box
	$('#infoBox').html(defaultLogo);
};

var changeTheme = function(themeColor) {
	activeTheme = themeColor;
	$('a, a:visited').css('color', themeColor);
	$('div#themeSelection div').css('box-shadow', 'none');

	// Store theme setting into lacal storage
	localStorage['theme'] = activeTheme;
};

var getAllTasks = function() {
	return (localStorage['tasks'] != null && localStorage['tasks'] !== "undefined") ? JSON.parse(localStorage['tasks']) : new Array();
};
