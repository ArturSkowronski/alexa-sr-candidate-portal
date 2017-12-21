'use strict';

const PortalClient = require('../client/portal-client.js');
const FeedAnswerIntent = require('./feed-intent.js');
const Promise = require('bluebird');
const _ = require('lodash');

exports.do = function (session, response) {
    const userPromise = PortalClient.get("user");
    const companiesPromise = PortalClient.get("companies");

    Promise.all([userPromise, companiesPromise])
    .then(function(results) {
        const userResponse = results[0];
        const companiesResponse = results[1];
        session.attributes.companies = companiesResponse.companies;

        const companies = companiesResponse.companies.map(y1 => y1.name);
        let string = `Hello ${userResponse.firstName} ${userResponse.lastName}. Welcome in your Candidate Portal! `;

        if (companies.length > 1) {
            string += `You have applied for jobs in ${companies.length} companies: `;

            _.forEach(companies, function (val, index) {
                string += ` ${(index + 1)} - ${val}.`;
            });

            string += " Which one details you would like to hear?";
            response.ask(
            {
                speech: `<speak>${string}</speak>`,
                type: 'SSML'
            });
        } else if (companies[0]) {
            FeedAnswerIntent.do(null, session, response, session.attributes.companies[0], string);
        } else {
            response.tell(`${string} You didn't apply for any jobs. Maybe it's good time to do that?`);
        }
    });
};
