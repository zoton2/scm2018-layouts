'use strict';
$(() => {
	var sceneID = $('html').attr('data-sceneid');
	var fontSizeMax = 29;
	if (sceneID === '2-player') fontSizeMax = 26;
	if (sceneID === '4-player') fontSizeMax = 20;
	
	var hostName = nodecg.Replicant('hostName', {defaultValue: ''});
	hostName.on('change', (newVal, oldVal) => {
		var hostBoxWidth = $('#hostBox').width();
		var fontSize = get_size(newVal, hostBoxWidth-30);
		if (fontSize > fontSizeMax) fontSize = fontSizeMax;
		animationSetHost(newVal, fontSize);
	});
	
	// Canvas and function to help fit host text inside box.
	const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
	ctx.font = '25px OptimusPrinceps';
	function get_size(text, width) {
		return 25 * width / ctx.measureText(text).width;
	}
	
	// Simple fade out/in animation by using opacity, and font size changing.
	function animationSetHost(newHost, fontSize) {
		$('#hostBox span').animate({'opacity': '0'}, 500, 'linear', () => {
			$('#hostText').html(newHost);
			$('#hostBox span').css('fontSize', fontSize);
			$('#hostBox span').animate({'opacity': '1'}, 500, 'linear');
		});
	}
});