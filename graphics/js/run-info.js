'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var gameTitle = $('#runGame');
	var gameCategory = $('#runCategory');
	var gameEstimate = $('#estimateTimer');
	var timerText = $('#currentTimer');
	var sponsorBox = $('#sponsorBox');
	var sceneID = $('html').attr('data-sceneid');
	
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal) updateSceneFields(newVal);
		else animationSetField(gameTitle, 'The Beginning');
	});
	
	// Sets information on the layout for the run.
	function updateSceneFields(runData) {
		animationSetField(gameTitle, runData.game);
		animationSetField(gameCategory, runData.category);
		animationSetField(gameEstimate, runData.estimate);
		animationSetField(timerText); // Fade out/in the timer as well.
		if (sceneID === '3-player')
			animationSetField(sponsorBox); // Fade out/in sponsor logos as well.
	}
});