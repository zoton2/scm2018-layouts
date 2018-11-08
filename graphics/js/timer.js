'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var timerText = $('#currentTimer');
	//var finishTimeContainers = $('.finishTimeContainer'); // Array
	
	// Declaring other variables.
	var currentTime = '';
	
	var stopWatchReplicant = nodecg.Replicant('stopwatch', speedcontrolBundle);
	stopWatchReplicant.on('change', (newVal, oldVal) => {
		if (!newVal) return;
		var time = newVal.time || '88:88:88';
		
		// Change class on the timer to change the colour if needed.
		if (oldVal) timerText.toggleClass('timer_'+oldVal.state, false);
		timerText.toggleClass('timer_'+newVal.state, true);
		
		timerText.html(time);
		timerText.lettering(); // Makes each character into a <span>.
		currentTime = time;
	});
	
	// Used to hide finish times for everyone.
	nodecg.listenFor('resetTime', speedcontrolBundle, () => {
		/*finishTimeContainers.each(function(index, element) {
			$('#finishTime', element).html('');
			$(element).css('opacity', '0');
		});*/
	});
	
	// Used to hide finish timers just for the specified index.
	nodecg.listenFor('timerReset', speedcontrolBundle, index => {
		//var container = finishTimeContainers.eq(index);
		//$('#finishTime', container).html('');
		//container.addClass('hideFinishTime');
		//container.css('opacity', '0');
	});
	
	// Used to show finish timers for the specified index.
	nodecg.listenFor('timerSplit', speedcontrolBundle, index => {
		/*if (finishTimeContainers.length > 1) {
			var container = finishTimeContainers.eq(index);
			$('#finishTime', container).html(currentTime);
			container.css('opacity', '100');
		}*/
	});
});