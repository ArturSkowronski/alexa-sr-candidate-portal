'use strict';
var Alexa = require("alexa-sdk");
var rp = require('request-promise');
const log = require('winston');
const LaunchIntent = require('./intents/launch-intent.js');
const FeedAnswerIntent = require('./intents/feed-intent.js');
const AnswerIntent = require('./intents/answer-intent.js');
const OfferIntent = require('./intents/offer-intent.js');
const MoreDetailsIntent = require('./intents/more-intent.js');
// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('LaunchIntent');
    },
    'HelloWorldIntent': function () {
        this.emit('SayHello');
    },
    'MyNameIsIntent': function () {
        this.emit('SayHelloName');
    },
    'LaunchIntent': function () {
        const intent = this.event.request.intent
        const session = this.event.request.intent
        const response = this.response

        LaunchIntent.do(session, response);
        this.emit(':responseReady');        
    },
    'FeedIntent': function () {
        const intent = this.event.request.intent
        const session = this.event.request.intent
        const response = this.response

        FeedAnswerIntent.do(intent, session, response);        
        this.emit(':responseReady');        
    },
    'MessageIntent': function () {
        const message = intent.slots.Message.value;
        session.attributes.message = message;
        response.ask(
        {
            speech: `<speak>Ok. I heard message <break time="1s" /> : ${message}. <break time="1s" /> If you want to send it, say send.  <break time="1s" />If you want to correct your message, say Correct.   <break time="1s" /> What is your decision?</speak>`,
            type: 'SSML'
        })
        this.emit(':responseReady');        
    },
    'AcceptIntent': function () {
        const intent = this.event.request.intent
        const session = this.event.request.intent
        const response = this.response
        
        OfferIntent.do(intent, session, response);        
        this.emit(':responseReady');        
    },
    'MoreDetailsIntent': function () {
        const intent = this.event.request.intent
        const session = this.event.request.intent
        const response = this.response
        
        MoreDetailsIntent.do(intent, session, response);        
        this.emit(':responseReady');        
    },
    'SendIntent': function () {
        const intent = this.event.request.intent
        const session = this.event.request.intent
        const response = this.response
        
        AnswerIntent.do(intent, session, response);        
        this.emit(':responseReady');        
    },
    'SayHello': function () {
        const intent = this.event.request.intent
        const session = this.event.request.intent
        const response = this.response

        var url = 'https://my-int.smartrecruiters.com/api/companies?access_token=' + this.event.session.user.accessToken
        var options = {
            uri: url,
            headers : {
                "Authorization" : "Basic " + new Buffer("smartuser:69WBevA").toString("base64")
            },
            json: true // Automatically parses the JSON string in the response
        };
        console.log(url)
        const that = this
        rp(options)
            .then(function (cpResponse) {
                console.log('Session token: ' + JSON.stringify(cpResponse));
                response.speak('Hello World Candidate Portal! ' + cpResponse.companies[0].name)
                    .cardRenderer('hello world', 'hello world');
                that.emit(':responseReady');
            })
            .catch(function (err) {
                console.log('Wyjebało token: ' + JSON.stringify(err));            
                response.speak('E-rror Error Allalujah!')
                that.emit(':responseReady');                
            });
        
    },
    'SayHelloName': function () {
        var name = this.event.request.intent.slots.name.value;
        this.response.speak('Hello ' + name)
            .cardRenderer('hello world', 'hello ' + name);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, candidate portal' or 'alexa, ask candidate portal'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },

    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, candidate portal'" +
            " or 'alexa, ask candidate portal my name is awesome Aaron'");
    }
};
