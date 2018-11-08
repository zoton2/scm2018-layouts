'use strict';

// Current setup for how teams are treated:
// All teams (teams can be just 1 runner) have their own container
// EXCEPT if there is 1 team and they have >1 player.

$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var sceneID = $('html').attr('data-sceneid');
	var playerContainers = $('.runnerInfoContainer'); // Array
	if (sceneID === '2-player')
		playerContainers = $('.runnerInfoContainer .runnerWrapper'); // Array
	
	// Declaring other variables.
	var displayNameFor = 45000;
	var displayTwitchFor = 15000;
	var teamMemberIndex = []; // Stores what team member of each team is currently being shown.
	var currentTeamsData = []; // All teams data is stored here for reference when changing.
	var rotationTimeout; // Stores the timeout used for switching between name and twitch.
	var init = true; // Tracks if this is the first time things are being shown since changing.
	var relay = false;
	var changingRelay = false;
	
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal) {
			// Runner display is treated differently for the relay race.
			if (newVal.game === 'All Souls Games' || newVal.category.toLowerCase().indexOf('relay') >= 0) {
				relay = true;
				if (!changingRelay)
					setTimeout(() => {updateSceneFields(newVal);}, 1000);
			}
			
			else {
				relay = false;
				updateSceneFields(newVal);
			}
		}
	});
	
	var team1RunnerIndex = nodecg.Replicant('team1RunnerIndex', {defaultValue:0,persistent:false});
	var team2RunnerIndex = nodecg.Replicant('team2RunnerIndex', {defaultValue:0,persistent:false});
	team1RunnerIndex.on('change', (newVal, oldVal) => {
		if (relay) {
			if (!changingRelay)
				setTimeout(() => {updateSceneFields(runDataActiveRun.value);}, 1000);
		}
	});
	team2RunnerIndex.on('change', (newVal, oldVal) => {
		if (relay) {
			if (!changingRelay)
				setTimeout(() => {updateSceneFields(runDataActiveRun.value);}, 1000);
		}
	});
	
	function updateSceneFields(runData) {
		// Reset important stuff.
		currentTeamsData = [];
		teamMemberIndex = [];
		clearTimeout(rotationTimeout);
		init = true;
		
		if (relay) {
			changingRelay = true;
			setTimeout(() => {changingRelay = false;}, 1000);
			
			runData.teams.forEach(function(team) {
				var teamRunnerIndex = (team.name === 'Team 1') ? team1RunnerIndex.value : team2RunnerIndex.value;
				var teamData = {showTeamIcon: false, members: []};
				teamData.members.push(createMemberData(team.members[teamRunnerIndex]));
				currentTeamsData.push(teamData);
			});
		}		
		
		// If there are multiple player info boxes but only 1 team and they have >1 player,
		// puts the names in their own boxes. This is done by making them into "fake" 1 player
		// teams but with a toggle to show the team icon.
		else if (playerContainers.length > 1 && runData.teams.length === 1 && runData.teams[0].members.length > 1) {
			var team = runData.teams[0];
			team.members.forEach(function(member) {
				var teamData = {showTeamIcon: team.members.length > 1, members: []};
				teamData.members.push(createMemberData(member));
				currentTeamsData.push(teamData);
			});
		}
		
		else {
			runData.teams.forEach(function(team) {
				var teamData = {showTeamIcon: team.members.length > 1, members: []};
				team.members.forEach(function(member) {teamData.members.push(createMemberData(member));});
				currentTeamsData.push(teamData);
			});
		}
		
		// Set up team member indices so we can keep track on what team member is being shown.
		for (var i = 0; i < currentTeamsData.length; i++) {teamMemberIndex[i] = 0;}
		
		// Clean out player containers not needed.
		if (currentTeamsData.length < playerContainers.length) {
			for (var i = currentTeamsData.length; i < playerContainers.length; i++) {
				animationCleanPlayerData(playerContainers[i]);
			}
		}
		
		showNames();
	}
	
	// Change to showing usernames.
	function showNames() {
		for (var i = 0; i < teamMemberIndex.length; i++) {
			if (!playerContainers[i]) break; // Skip if there's no container for this team.
			var index = teamMemberIndex[i]; // Who the current player is who should be shown in this team.
			
			if (init)
				animationChangePlayerData(playerContainers[i], currentTeamsData[i].members[index], false, true, currentTeamsData[i].showTeamIcon);
			else
				animationChangePlayerData(playerContainers[i], currentTeamsData[i].members[index], false);
		}
		
		// Toggle to false if this was the first time running this function since a change.
		if (init) {init = false;}
		
		rotationTimeout = setTimeout(showTwitchs, displayNameFor);
	}
	
	// Change to showing Twitch names.
	function showTwitchs() {
		for (var i = 0; i < teamMemberIndex.length; i++) {
			if (!playerContainers[i]) break; // Skip if there's no container for this team.
			var index = teamMemberIndex[i]; // Who the current player is who should be shown in this team.
			animationChangePlayerData(playerContainers[i], currentTeamsData[i].members[index], true);
		}
		
		rotationTimeout = setTimeout(rotateTeamMembers, displayTwitchFor);
	}
	
	// Change settings to go to the next team member, if applicable.
	function rotateTeamMembers() {
		for (var i = 0; i < teamMemberIndex.length; i++) {
			teamMemberIndex[i]++;
			
			// If we've reached the end of the team member array, go back to the start.
			if (teamMemberIndex[i] >= currentTeamsData[i].members.length) teamMemberIndex[i] = 0;
		}
		
		showNames();
	}
	
	// Easy access to create member data object used above.
	function createMemberData(member) {
		// Gets username from URL.
		if (member.twitch && member.twitch.uri) {
			var twitchUsername = member.twitch.uri.split('/');
			twitchUsername = twitchUsername[twitchUsername.length-1];
		}
		
		var memberData = {
			name: member.names.international,
			twitch: twitchUsername,
			region: member.region
		};
		
		return memberData;
	}
});