'use strict';

const PortalClient = require('../client/portal-client.js');

exports.do = function(intent, session, response) {
	const offerObject = session.attributes.actions.offer;

	PortalClient
	.post(offerObject.url, {})
	.then(function() {
		response.tell(
		{
			speech: `<speak><say-as interpret-as='interjection'>As you wish</say-as>. Offer Accepted. Thank You.</speak>`,
			type: 'SSML'
		})
	});
};
