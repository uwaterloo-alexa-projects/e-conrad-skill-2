//require ask-sdk-core node module.
const Alexa = require('ask-sdk-core');
const AWS = require("aws-sdk");

// user state
let userName = '';
let userEmail = '';

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const {serviceClientFactory, responseBuilder} = handlerInput;
        try {
            const upsServiceClient = serviceClientFactory.getUpsServiceClient();
            const profileName = await upsServiceClient.getProfileName();
            const profileEmail = await upsServiceClient.getProfileEmail();
            userName = profileName;
            userEmail = profileEmail;
            
            let speechResponse = "Hello, Welcome to the monthly conrad report skill";

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
    YesHandler
)
/*.addErrorHandlers(ErrorHandler)
.withApiClient(new Alexa.DefaultApiClient())
.lambda();*/
.addRequestInterceptors(RequestLog)
.addResponseInterceptors(ResponseLog)
.addErrorHandlers(ErrorHandler)
.withApiClient(new Alexa.DefaultApiClient())
.lambda();
