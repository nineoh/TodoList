var activeTheme = '';

var initPage = function () {
	// Load theme
	activeTheme = localStorage['theme'] != null ? localStorage['theme'] : '#08C';
	changeTheme(activeTheme);

	// TODO: Load Tasks
	
}

var showCreateTaskBar = function () {
	$(this).children().slideDown(300, function() {
		$(this).fadeTo(300, 1.0);
		$(this).stop();
	});
}

var hideCreateTaskBar = function () {
	if ($('div#subHeader2').children().css('opacity') == 0.0)
		return;

	$('div#subHeader2').children().fadeTo(300, 0.0, function() {
		$(this).slideUp(300, function () {
			$(this).stop();
		});
	});
}

var highlightRow = function () {
	//$(this).addClass('selected');
	$(this).css('box-shadow', '0 0 10px 10px ' + activeTheme);
	$(this).css('border-color', activeTheme);
	$(this).css('border-radius', '10px');

	// Show delete button
	$(this).children('.deleteButton').removeClass('hiddenButton');
	// Show Task in info box
	var text = $(this).children('.taskText').text();
	if (text.length > 16)
		text = text.substring(0, 15) + "...";

	$('#infoBox').text(text);
};

var unhighlightRow = function () {
	//$(this).removeClass('selected');
	$(this).css('box-shadow', 'none');
	$(this).css('border-color', '#000');
	$(this).css('border-radius', '');
	// Hide delete button
	$(this).children('.deleteButton').addClass('hiddenButton');
	// Empty info box
	$('#infoBox').text('');
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

var createNewTask = function () {
	var prio = $('#prioSelect').val();
	var date = $('#txtDate').val();
	var task = $('#txtTask').val();

	$('#taskList').prepend('<div class="row-fluid task"><div class="span3">' + prio + '</div><div class="span3">' + date + '</div><div class="span3 taskText">' + task + '</div><div class="span1 offset2 deleteButton hiddenButton"><input type="button" /></div></div>');

	// TODO: store task into localStorage
}

var clearInputFields = function () {
	$('#prioSelect').val('-1');
	$('#txtDate').val('');
	$('#txtTask').val('');
}

var changeTheme = function(themeColor) {
	activeTheme = themeColor;
	$('div#header div#subHeader1 div#navigation a, div#header div#subHeader1 div#navigation a:visited').css('color', themeColor);
	$('div#themeSelection div').css('box-shadow', 'none');

	// Store theme setting into lacal storage
	localStorage['theme'] = activeTheme;
};

var storeUserData = function () {
	if (Modernizr.localstorage) {
		// window.localStorage is available!
		alert('Your browser is able to store your data!');
	}
	else {
		// no native support for HTML5 storage
		alert('Your browser is NOT able to store your data!');
   }
}

var createMockTasks = function () {
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		
	for (var i = 0; i < 30; i++) {
		var text = '';
		var len = Math.floor((Math.random()*20)+1); 
		
		for (var j = 0; j < len; j++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		$('#taskList').prepend('<div class="row-fluid task"><div class="span3">1</div><div class="span3">25.05.2013</div><div class="span3 taskText">'+ text +'</div><div class="span1 offset2 deleteButton hiddenButton"><input type="button" /></div></div>');
	}
};


$(function() {
	// Initialize Page
	initPage();

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

	$('div#subHeader2').hover(showCreateTaskBar);
	$('div#content').click(hideCreateTaskBar);
	$('div#taskList').on('mouseover', 'div.task', highlightRow);
	$('div#taskList').on('mouseleave', 'div.task', unhighlightRow);
	$('div#footer').click(createMockTasks);
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

	/*
	 * Create task on button click
	 */
	$('#btnCreate').click(function () {
		if (!isValid())
			return;

		createNewTask();
		clearInputFields();
	});

	/*
	 * Delete button click
	 */
	$('#taskList').on('click', '.deleteButton', function () {
		$(this).parent().remove();
	});

	$('div.hiddenRow').children().children('select, input').change(function () {
		$(this).removeClass('errorFocus');
	});

});
