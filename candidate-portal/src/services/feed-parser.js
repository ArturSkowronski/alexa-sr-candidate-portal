'use strict';

const _ = require('lodash');
const striptags = require('striptags');

exports.parseFeed = function (feed) {
    const messageObject = messagesParser(feed);
    const offerObject = offerParse(feed);

    return {
        messageItems: messageObject,
        offerItems: offerObject
    };
};

function messagesParser(data) {
    const messages = [];
    let replyAction;
    let response = "";
    let responseReplyAction;
    let index = 1;
    const feed = data.feed;
    const elements = _.flatten(feed.map(feed => feed.elements));

    elements.forEach(element => {
        if (element.type === "message" && element.sender.type === "EMPLOYEE") {
            messages.push({
                message: striptags(element.message, []),
                subject: striptags(element.subject, []),
                date: element.date
            });
        }

        if (element['@actions']) {
            if (element['@actions'].reply) {
                replyAction = {
                    sender: element.sender,
                    url: element['@actions'].reply.url.replace("/api", "")
                };
            }
        }

    });

    messages.forEach(x => {
        if (messages.length > 1) {
            response += `${index}. `;
        }
        if (x.subject) {
            response += `with subject: <break time='0.25s'/> ${x.subject}. `;
        }
        response += `with message:<break time='0.25s'/> ${x.message}. <break time='0.5s'/>`;
        index++;
    });

    if (replyAction) {
        responseReplyAction = `<break time='0.5s'/>You can reply to ${replyAction.sender.firstName} ${replyAction.sender.lastName}.`;
    }

    return {
        messages: messages,
        replyAction: replyAction,
        response: response,
        responseReplyAction: responseReplyAction
    };
}

function offerParse(data) {
    const offers = [];
    let offerAction;
    const feed = data.feed;
    const elements = _.flatten(feed.map(feed => feed.elements));

    elements.forEach(element => {
        if (element.type === "offer") {
            offers.push({
                status: element.status,
                date: element.date,
                message: striptags(element.message, []),
                title: element.attachments.files[0].title
            });
        }

        if (element['@actions']) {
            if (element['@actions'].accept) {
                offerAction = {
                    message: striptags(element.message, []),
                    title: element.attachments.files[0].title,
                    url: element['@actions'].accept.url.replace("/api", "")
                };
            }
        }

    });

    let response = "";
    let responseOfferAction;
    let index = 1;

    offers.forEach(x => {
        if (offers.length > 1) {
            response += `${index}. `;
        }
        response += ` Offer with message content: <break time='0.5s'/> ${x.message}  <break time='0.5s'/> in status: ${x.status}. `;
        index++;
    });

    if (offerAction) {
        responseOfferAction = "You can accept offer.";
    }

    return {
        offers: offers,
        offerAction: offerAction,
        response: response,
        responseOfferAction: responseOfferAction
    };
}
