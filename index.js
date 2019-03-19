//require ask-sdk-core node module.
const Alexa = require('ask-sdk-core');
const AWS = require("aws-sdk");

const questionData = require('./questions');

// user state
let userName = '';
let userEmail = '';

// alexa interaction variables
let state = 0;
let answerData = {};
let speechResponse = "";
let dataPtr = "project_name";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const {serviceClientFactory, responseBuilder} = handlerInput;
        try {
            console.log("init state");
            const upsServiceClient = serviceClientFactory.getUpsServiceClient();
            const profileName = await upsServiceClient.getProfileName();
            const profileEmail = await upsServiceClient.getProfileEmail();
            console.log("acq user information");
            userName = profileName;
            userEmail = profileEmail;
            
            let speechResponse = "Hello, Welcome to the monthly conrad report skill. Please say start report to get started.";
            
            return responseBuilder
                .speak(speechResponse)
                .reprompt(`Please say "start report" to get started.`)
                .withSimpleCard(APP_NAME, speechResponse)
                .getResponse();
        } catch (error) {
            console.log(JSON.stringify(error));
            if (error.statusCode == 403) {
                return responseBuilder
                    .speak("NOTIFY MISSING PERMISSIONS")
                    .withAskForPermissionsConsentCard("NOTIFY MISSING PERMISSIONS")
                    .getResponse();
            }
            console.log(JSON.stringify(error));
            const response = responseBuilder.speak("Sorry, an error occured").getResponse();
            return response;
        }
    },
};

const ProgressReport = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && request.intent.name === 'ProgressReport'
            && request.dialogState !== 'COMPLETED';  //&& request.dialogState !== 'COMPLETED'; means you have not finished the conversation
    },
    handle(handlerInput) {
        const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
        const slotvalues_notresolved = getSlotValues(filledSlots);
        const content = slotvalues_notresolved.content.resolved;
        
        console.log("progress report intent fired");
        // do some answer content handling here

        if (state == 0) {
            speechResponse = questionData.question.project_name;
        } else if (state == 1) {
            answerData.projectName = content;
            speechResponse = questionData.question.past_milestones.content;
        } 

        state++;
        
        return handlerInput.responseBuilder
                .speak(speechResponse)
                .reprompt('//')
                .addElicitSlotDirective('content')
                .getResponse();

    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
                || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Bye')
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("not implemented")
            .reprompt('//')
            .getResponse();
    },
};

const YesHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
            && request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("not implemented")
            .reprompt('//')
            .getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
    },
};

const RequestLog = {
    process(handlerInput) {
        console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
    },
};

const ResponseLog = {
    process(handlerInput) {
        console.log(`RESPONSE BUILDER = ${JSON.stringify(handlerInput)}`);
    },
};

exports.handler = skillBuilder
.addRequestHandlers(
    LaunchRequestHandler,
    HelpHandler,
    ExitHandler,
    ErrorHandler,
    SessionEndedRequestHandler,
    YesHandler,
    ProgressReport
)
/*.addErrorHandlers(ErrorHandler)
.withApiClient(new Alexa.DefaultApiClient())
.lambda();*/
.addRequestInterceptors(RequestLog)
.addResponseInterceptors(ResponseLog)
.addErrorHandlers(ErrorHandler)
.withApiClient(new Alexa.DefaultApiClient())
.lambda();
