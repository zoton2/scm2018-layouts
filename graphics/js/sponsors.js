'use strict';
$(() => {
	// JQuery selectors.
	var $sponsorImage = $('#sponsorBox');
	
	var sponsorRotationInit = false;
	var sponsorImages = nodecg.Replicant('assets:sponsors');
	sponsorImages.on('change', (newVal) => {
		if (!sponsorRotationInit && newVal.length > 0) {
			setInterval(rotateNormal, 60000); // 60 seconds
			rotateNormal();
			sponsorRotationInit = true;
		}
	});
	
	var index = 0;
	function rotateNormal() {
		changeSponsorImage($sponsorImage, sponsorImages.value[index].url);
		index++;
		if (index >= sponsorImages.value.length) index = 0;
	}
	
	function changeSponsorImage(element, assetURL) {
		$('.sponsorLogoCurrent', element).animate({'opacity': '0'}, 500, 'linear');
		element.append('<div id="sponsorLogo" class="sponsorLogoNext"></div>');
		$('.sponsorLogoNext', element).css('background-image', (assetURL)?'url("'+assetURL+'")':'none');
		$('.sponsorLogoNext', element).animate({'opacity': '1'}, 500, 'linear', function() {
			$('.sponsorLogoCurrent', element).remove();
			$('.sponsorLogoNext', element).removeClass('sponsorLogoNext').addClass('sponsorLogoCurrent');
		});
	}
});