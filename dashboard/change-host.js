'use strict';
$(() => {
	var hostName = nodecg.Replicant('hostName', {defaultValue: ''});
	hostName.on('change', (newVal, oldVal) => {
		$('#hostName').val(newVal);
	});
	
	var tickTimeout;
	$('#changeHostName').click(event => {
		event.preventDefault();
		hostName.value = $('#hostName').val();
		clearTimeout(tickTimeout);
		$('#tick').show();
		tickTimeout = setTimeout(() => {$('#tick').hide();}, 5000);
	});
});