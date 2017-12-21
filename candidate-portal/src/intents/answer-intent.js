'use strict';

const PortalClient = require('../client/portal-client.js');

exports.do = function(intent, session, response) {
	const replyObject = session.attributes.actions.reply;
	const message = session.attributes.message;

	PortalClient
	.post(replyObject.url, {messageContent: message})
	.then(() =>
		response.tell({
			speech: `<speak><say-as interpret-as='interjection'>Voila.</say-as>. Message Sent.</speak>`,
			type: 'SSML'})
		);
}