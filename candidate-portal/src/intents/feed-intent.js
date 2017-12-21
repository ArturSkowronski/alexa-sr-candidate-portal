'use strict';

const PortalClient = require('../client/portal-client.js');
const _ = require('lodash');
const log = require('winston');
const FeedParser = require("../services/feed-parser");
const stringSimilarity = require('string-similarity');

exports.do = function(intent, session, response, companyPreserved, prefix) {
    let company;
    prefix = prefix || "";

    if (companyPreserved) {
        company = companyPreserved;
    } else {
        const intentValue = intent.slots.Company.value;

        if (!isNaN(parseInt(intentValue))) {
            company = getCompanyItemForIndex(session, parseInt(intentValue));
        } else {
            company = getCompanyItemForName(session, intentValue);
        }
    }

    PortalClient.get(`companies/${company.id}/feed`)
    .then(function(feedResponse) {
        const parsedFeed = FeedParser.parseFeed(feedResponse);

        const responseData = `
        In company ${company.name} your current application is on job: ${company.applications[0].title}. 
        You are in ${company.applications[0].status.name} status.`;

        const messageObject = parsedFeed.messageItems || {};
        const offerObject = parsedFeed.offerItems || {};
        log.info(parsedFeed);
        session.attributes.feed = parsedFeed;
        session.attributes.actions = {
            reply: messageObject.replyAction,
            messageObject,
            offer: offerObject.offerAction,
            offerObject
        };
        if (company.applications[0].status.name === "New") {
            response.tell(`${prefix}${responseData}. 
                Unfortunately, there is nothing interesting to say yet. 
                Please return where you will be futher in application process.`);
        } else {
            response.ask(`${prefix}${responseData}. Do you want to hear more details?`);
        }
    }).catch(function(error) {
        log.error(error);
        response.tell("There was an error");
    });
};

function getCompanyItemForIndex(session, value) {
    return session.attributes.companies[value - 1];
}

function getCompanyItemForName(session, value) {
    const result = stringSimilarity.findBestMatch(value, session.attributes.companies.map(x => x.name)).bestMatch.target;
    return _.find(session.attributes.companies, function(o) {
        return o.name.toLowerCase() === result.toLowerCase();
    });
}

