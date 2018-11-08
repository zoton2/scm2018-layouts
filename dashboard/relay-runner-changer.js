'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	var tickTimeout;
	
	var notApplicableText = $('#notApplicableText');
	var isApplicable = $('#isApplicable');
	var team1Buttons = $('#team1Buttons');
	var team2Buttons = $('#team2Buttons');
	
	var team1RunnerIndex = nodecg.Replicant('team1RunnerIndex', {defaultValue:0,persistent:false});
	var team2RunnerIndex = nodecg.Replicant('team2RunnerIndex', {defaultValue:0,persistent:false});
	
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		// If we're on the relay...
		if (newVal && (newVal.game === 'All Souls Games' || newVal.category.toLowerCase().indexOf('relay') >= 0)) {
			notApplicableText.hide();
			isApplicable.show();
			var team1 = newVal.teams[0];
			var team2 = newVal.teams[1];
			
			team1Buttons.html('');
			team2Buttons.html('');
			var team1ButtonsHTML = '';
			var team2ButtonsHTML = '';
			
			for (var i = 0; i < team1.members.length; i++) {
				team1ButtonsHTML += '<input type="radio" name="team1" value="'+i+'"> '+team1.members[i].names.international;
				if (i < team1.members.length-1) team1ButtonsHTML += '<br>';
			}
			
			for (var i = 0; i < team2.members.length; i++) {
				team2ButtonsHTML += '<input type="radio" name="team2" value="'+i+'"> '+team2.members[i].names.international;
				if (i < team2.members.length-1) team2ButtonsHTML += '<br>';
			}
			
			team1Buttons.html(team1ButtonsHTML);
			team2Buttons.html(team2ButtonsHTML);
			
			$('input[name=team1][value=\''+team1RunnerIndex.value+'\']').prop('checked', true);
			$('input[name=team2][value=\''+team2RunnerIndex.value+'\']').prop('checked', true);
		}
		
		else {
			notApplicableText.show();
			isApplicable.hide();
		}
	});
	
	$('#runnerChangeSubmit').click(() => {
		team1RunnerIndex.value = $('input[name=team1]:checked').val();
		team2RunnerIndex.value = $('input[name=team2]:checked').val();
		
		clearTimeout(tickTimeout);
		$('#tick').show();
		tickTimeout = setTimeout(() => {$('#tick').hide();}, 5000);
	});
});