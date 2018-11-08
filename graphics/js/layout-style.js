'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	var runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
	var sceneID = $('html').attr('data-sceneid');
	
	if (sceneID === 'intermission') {
		nodecg.listenFor('forceRefreshIntermission', speedcontrolBundle, () => {
			intermissionCodeForceRefresh();
			setIntermissionStyle();
		});
	}
	
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (sceneID !== 'intermission') changeLayoutStyle(newVal);
	});
	
	runDataArray.on('change', (newVal, oldVal) => {
		if (!oldVal && sceneID === 'intermission') setIntermissionStyle();
	});
	
	function setIntermissionStyle() {
		var indexOfCurrentRun = findIndexInRunDataArray(runDataActiveRun.value, runDataArray.value);
		if (!runDataArray.value[indexOfCurrentRun+1])
			changeLayoutStyle(null, true);
		else
			changeLayoutStyle(runDataArray.value[indexOfCurrentRun+1]);
	}
	
	function changeLayoutStyle(runData, defaultStyle) {
		var flatName = (runData) ? flattenGameName(runData.game) : '';
		
		if (!defaultStyle && flatName.startsWith('darksouls') && !flatName.startsWith('darksoulsi')) {
			switch(sceneID) {
				case '1-player':
				case '3-player':
				case 'intermission':
					setBackground('darksouls1_1');
					setColourScheme('blue');
					break;
				case '2-player':
				case '4-player':
					setBackground('darksouls1_2');
					setColourScheme('blue');
					break;
			}
		}
		
		else if (!defaultStyle && flatName.startsWith('darksoulsii') && !flatName.startsWith('darksoulsiii')) {
			switch(sceneID) {
				case '1-player':
				case '3-player':
				case 'intermission':
					setBackground('darksouls2_1');
					setColourScheme('orange');
					break;
				case '2-player':
				case '4-player':
					setBackground('darksouls2_2');
					setColourScheme('orange');
					break;
			}
		}
		
		else if (!defaultStyle && flatName.startsWith('darksoulsiii')) {
			switch(sceneID) {
				case '1-player':
				case 'intermission':
					var random = randomInt(1,3); // actually 1 or 2
					setBackground('darksouls3_'+random);
					setColourScheme('blue');
					break;
				case '3-player':
					setBackground('darksouls3_4');
					setColourScheme('blue');
					break;
				case '2-player':
				case '4-player':
					setBackground('darksouls3_3');
					setColourScheme('blue');
					break;
			}
		}
		
		else if (!defaultStyle && flatName.startsWith('bloodborne')) {
			switch(sceneID) {
				case '1-player':
				case '3-player':
				case 'intermission':
					setBackground('bloodborne_1');
					setColourScheme('blue');
					break;
				case '2-player':
				case '4-player':
					setBackground('bloodborne_2');
					setColourScheme('blue');
					break;
			}
		}
		
		else if (!defaultStyle && flatName.startsWith('demonssouls')) {
			switch(sceneID) {
				case '1-player':
				case '3-player':
				case '4-player':
				case 'intermission':
					var random = randomInt(1,3); // actually 1 or 2
					setBackground('demonsouls_'+random);
					setColourScheme('orange');
					break;
				case '2-player':
					setBackground('demonsouls_3');
					setColourScheme('orange');
					break;
			}
		}
		
		// Default style if game isn't found.
		else {
			setBackground('darksouls1_2');
			setColourScheme('blue');
		}
	}
	
	// Removes all whitespace, punctuation and makes everything lowercase.
	function flattenGameName(name) {
		return name.toLowerCase().replace(/\s/g,'').replace(/(_|\W)/g,'');
	}
	
	function setBackground(bgname) {
		$('#background').css('background-image', 'url(\'images/backgrounds/'+bgname+'.jpg\')');
	}
	
	function setColourScheme(colour) {
		$('#colourScheme').attr('href', 'css/'+colour+'.css');
	}
	
	// Function to return a random integer.
	function randomInt(low, high) {
		return Math.floor(Math.random() * (high - low) + low);
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
});