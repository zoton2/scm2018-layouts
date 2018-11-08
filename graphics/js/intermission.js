'use strict';

// triggered from layout-style.js due to current limitations in NodeCG
function intermissionCodeForceRefresh() {
	updateUpcomingRuns(); // update info on request
}

//$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	var runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
	
	runDataArray.on('change', (newVal, oldVal) => {
		if (!oldVal) {
			updateUpcomingRuns(); // update info on page load
		}
	});
	
	var upNextBox = $('#upNextBox');
	
	var onDeckInterval;
	var next4Runs = [];
	var onDeckIndex = 0;
	
	function updateUpcomingRuns() {
		var indexOfCurrentRun = findIndexInRunDataArray(runDataActiveRun.value, runDataArray.value);
		
		var nextRun = runDataArray.value[indexOfCurrentRun+1];
		if (nextRun) {
			updateInformationInBox(nextRun, $('#upNextBox'));
		}
		
		next4Runs = [];
		onDeckIndex = 0;
		clearInterval(onDeckInterval);
		for (var i = 2; i <= 5; i++) {
			if (!runDataArray.value[indexOfCurrentRun+i]) break;
			next4Runs.push(runDataArray.value[indexOfCurrentRun+i]);
		}
		if (next4Runs.length) {
			cycleOnDeck();
			onDeckInterval = setInterval(cycleOnDeck, 10000);
		}
	}
	
	function cycleOnDeck() {
		if (onDeckIndex >= next4Runs.length) onDeckIndex = 0;
		updateInformationInBox(next4Runs[onDeckIndex], $('#onDeckBox'));
		onDeckIndex++;
	}
	
	function updateInformationInBox(runData, element) {
		animationSetField($('.gameName', element), runData.game);
		var catAndRunner = runData.category;
		if (runData.players.length > 1) catAndRunner += ' - Race';
		else if (runData.players.length === 1) catAndRunner += ' - '+runData.players[0].names.international;
		animationSetField($('.gameCatAndRunner', element), catAndRunner);
		animationSetField($('hr', element)); // also fade the divider
	}
	
	function findIndexInRunDataArray(run, runDataArray) {
		var indexOfRun = -1;
		
		// Completely skips this if the run variable isn't defined.
		if (run) {
			for (var i = 0; i < runDataArray.length; i++) {
				if (run.runID === runDataArray[i].runID) {
					indexOfRun = i;
					break;
				}
			}
		}
		
		return indexOfRun;
	}
//});