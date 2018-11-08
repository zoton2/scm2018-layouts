'use strict';

// Simple fade out/in animation by using opacity.
function animationSetField(selector, newHTML) {
	$(selector).animate({'opacity': '0'}, 500, 'linear', () => {
		if (newHTML) selector.html(newHTML);
		$(selector).animate({'opacity': '1'}, 500, 'linear');
	});
}

// Used to clean player containers that are not needed.
// (This doesn't actually clear them, just hides the elements for now).
function animationCleanPlayerData(selector) {
	$(selector).animate({'opacity': '0'}, 500, 'linear');
}

function animationChangePlayerData(selector, playerData, twitch, hideCoop, showCoop) {
	// Do the actual fading out by going to opacity 0.
	$(selector).animate({'opacity': '0'}, 500, 'linear');
	
	// Triggers once everything from the above animate is done.
	$(selector).promise().done(() => {
		if (twitch) {
			var name = (playerData.twitch) ? '/'+playerData.twitch : '???';
			$('.runnerLogo', selector).removeClass('nameLogo').addClass('twitchLogo');
		}
		
		else {
			var name = playerData.name;
			$('.runnerLogo', selector).removeClass('twitchLogo').addClass('nameLogo');
		}
		
		$('.runnerName', selector).html(name);
		
		// Do the actual fading in by going to opacity 1.
		$(selector).animate({'opacity': '1'}, 500, 'linear');
	});
}