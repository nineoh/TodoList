$(function() {
	/*
	 * Activate date picker
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
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['de-CH']);

	$('#txtDate').datepicker();

	/*
	 * Create hover effect
	 */
	var highlightRow = function () {
		$(this).addClass('selected');

		// Show delete button
		$(this).children('.deleteButton').removeClass('hiddenButton');
		// Show Task in info box
		$('#infoBox').text($(this).children('.task').text());
	};

	var unhighlightRow = function () {
		$(this).removeClass('selected');
		// Hide delete button
		$(this).children('.deleteButton').addClass('hiddenButton');
		// Empty info box
		$('#infoBox').text('');
	};

	/*
	 * Delete button click
	 */
	$('#taskList').on('click', '.deleteButton', function() {
		$(this).parent().remove();
	});

	function createNewTask() {
		var prio = $('#prioSelect').val();
		var date = $('#txtDate').val();
		var task = $('#txtTask').val();

		$('#taskList').append('<div class="row-fluid task"><div class="span3">' + prio + '</div><div class="span3">' + date + '</div><div class="span3 task">' + task + '</div><div class="span1 offset2 deleteButton hiddenButton"><input type="button" value="X" /></div></div>');
	}

	function clearInputFields() {
		$('#prioSelect').val('-1');
		$('#txtDate').val('');
		$('#txtTask').val('');
	}

	/*
	 * Create task on button click
	 */
	$('#btnCreate').click(function(){
		createNewTask();
		clearInputFields();
	});

	$('div#taskList').on('mouseover', 'div.task', highlightRow);
	$('div#taskList').on('mouseleave', 'div.task', unhighlightRow);


});
