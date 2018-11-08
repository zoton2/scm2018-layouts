'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	var $donationTotal = $('#donationTotal');
	
	var donationTotal = nodecg.Replicant('tiltifyDonationTotal', speedcontrolBundle);
	donationTotal.on('change', (newVal, oldVal) => {
		// On initial page load so no animation is needed.
		if (!oldVal) {
			var value = newVal.toLocaleString('en-US', {minimumFractionDigits: 0});
			$donationTotal.html('$'+value);
		}
		
		else {
			animationUpdateDonationTotal($donationTotal, oldVal, newVal);
		}
	});
	
	function animationUpdateDonationTotal(selector, oldVal, newVal) {
		$(selector)
		.prop('number', oldVal)
		.animateNumber({
			number: newVal,
			numberStep: function(now, tween) {
				var flooredNumber = Math.floor(now);
				var target = $(tween.elem);
				var value = flooredNumber.toLocaleString('en-US', {minimumFractionDigits: 0});
				target.html('$'+value);
			}
		}, 4000, 'linear');
	}
});