'use strict';

exports.do = function(intent, session, response) {
    let responseData = "Here we go. Some details about your progress: ";
    const actions = session.attributes.actions || {};

    const messageObject = actions.messageObject || {};
    const offerObject = actions.offerObject || {};

    if (messageObject.response) {
        if (messageObject.messages.length === 1) {
            responseData += `<break time='1s'/> You have ${messageObject.messages.length} message. `;
        } else {
            responseData += `<break time='1s'/> You have ${messageObject.messages.length} messages. `;
        }
        responseData += messageObject.response;
    }
    if (offerObject.response) {
        if (offerObject.offers.length === 1) {
            responseData += `<break time='1s'/> You have ${offerObject.offers.length} offer.`;
        }
        if (offerObject.offers.length > 1) {
            responseData += `<break time='1s'/>  You have ${offerObject.offers.length} offers.`;
        }
        responseData += offerObject.response;
    }

    const resultAction = [messageObject.responseReplyAction, offerObject.responseOfferAction].filter(x => x);

    if (resultAction.length > 0) {
        if (resultAction.length === 1) {
            responseData += "<break time='1s'/> You have 1 possible action: ";
        }
        if (resultAction.length > 1) {
            responseData += `<break time='1s'/> You have 2 possible actions: `;
        }
        resultAction.forEach(x => {
            responseData += ` ${x}`;
        });
        responseData += ". <break time='1s'/> What do you want to do next?";
    }
    // responseData = "Here we go. Some details about your progress: You are in review, but still waiting for more information. Please come back later. Patience is the virtue. I would keep my finger crossed if I have had any!";

    response.ask(
    {
        speech: `<speak>${responseData}</speak>`,
        type: 'SSML'
    }
    );
};
