// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const ANOTHER_SPRING = ' ¿Quieres tirar otro muelle?';

const data = [
    "<audio src='soundbank://soundlibrary/home/amzn_sfx_toilet_flush_01'/>",
    "<audio src='soundbank://soundlibrary/home/amzn_sfx_toilet_flush_02'/>"
    ];

function randomFlushAudio(){
    return data[Math.floor(Math.random() * 2)];
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        var attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.springs = 1;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        const speechText = '<say-as interpret-as="interjection">Có jo <break time="0.1s"/> un mue lle, lo tiro por el retrete. Y ya es un muelle <break time="0.01s"/> que el retrete se ha tragado </say-as>' + randomFlushAudio() + ANOTHER_SPRING;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('¿Quieres tirar otro muelle?')
            .getResponse();
    }
};

const ThrowSpringIntentHandler = {
    canHandle(handlerInput) { 
         return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ThrowSpringIntent';
    },
    handle(handlerInput){
         var attributes = handlerInput.attributesManager.getSessionAttributes();
         var speechText = '';
         if (!attributes.springs){
             attributes.springs = 1;
             speechText = '<say-as interpret-as="interjection">Co jo <break time="0.1s"/> un mue lle, lo tiro por el retrete. Y ya es un muelle <break time="0.01s"/> que el retrete se ha tragado </say-as>' + randomFlushAudio() + ANOTHER_SPRING;
         }else {
             attributes.springs += 1;
             speechText = `<say-as interpret-as="interjection">Co jo <break time="0.1s"/> o tro mue lle, lo tiro por el retrete. Y ya son ${attributes.springs} muelles los que el retrete se ha tragado </say-as>` + randomFlushAudio() + ANOTHER_SPRING;
         }
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder.speak(speechText).reprompt(ANOTHER_SPRING).getResponse();
    }
};

const ThrowNumberSpringsIntentHandler = {
    canHandle(handlerInput) { 
         return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ThrowNumberSpringsIntent' 
            && handlerInput.requestEnvelope.request.intent.slots.number.value
            && handlerInput.requestEnvelope.request.intent.slots.number.value <= 43
            && handlerInput.requestEnvelope.request.intent.slots.number.value !== '?';
    },
    handle(handlerInput){
        const number = handlerInput.requestEnvelope.request.intent.slots.number.value;
        console.log("Número de muelles" + number);
        var speechText = '';
        for (var i=1; i<= number; i++){
            if (i === 1){
                speechText += `<say-as interpret-as="interjection">Có jo <break time="0.1s"/> un mue lle, lo tiro por el retrete. Y ya es un muelle <break time="0.01s"/> que el retrete se ha tragado </say-as>` + "<break time='1s'/>";
            }else{
                speechText += `<say-as interpret-as="interjection">Co jo <break time="0.1s"/> o tro mue lle, lo tiro por el retrete. Y ya son ${i} muelles los que el retrete se ha tragado </say-as>` + "<break time='1s'/>";
            }
        }
        speechText += randomFlushAudio();
        return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
};

const ThrowTooMuchSpringsIntentHandler = {
    canHandle(handlerInput) { 
         return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ThrowNumberSpringsIntent' 
            && handlerInput.requestEnvelope.request.intent.slots.number
            && (handlerInput.requestEnvelope.request.intent.slots.number.value > 43 || handlerInput.requestEnvelope.request.intent.slots.number.value === '?');
    },
    handle(handlerInput){
        return handlerInput.responseBuilder.speak('Esos son demasiados muelles, el retrete se ha atascado. <audio src="soundbank://soundlibrary/scifi/amzn_sfx_scifi_explosion_02"/>').getResponse();
    }
};

const YesIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput){
        var attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.springs += 1;
        const speechText = `<say-as interpret-as="interjection">Co jo <break time="0.1s"/> o tro mue lle, lo tiro por el retrete. Y ya son ${attributes.springs} muelles los que el retrete se ha tragado </say-as>` + randomFlushAudio() + ANOTHER_SPRING;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder.speak(speechText).reprompt(ANOTHER_SPRING).getResponse();
    }
};

const NoIntentHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
    },
    handle(handlerInput){
        const speechText = 'No <lang xml:lang="en-US">Marge</lang>, no estoy tirando muelles por el retrete ' + randomFlushAudio();
        return handlerInput.responseBuilder.speak(speechText).getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Puedes pedirme tirar un muelle, o puedes atreverte y pedirme tirar una cierta cantidad de muelles por el retrete. ¿Qué puedo hacer por ti?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = '¡Adiós!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Lo siento, no he entendido lo que me has dicho.\n Por favor, repítelo de nuevo`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ThrowSpringIntentHandler,
        ThrowNumberSpringsIntentHandler,
        ThrowTooMuchSpringsIntentHandler,
        HelpIntentHandler,
        YesIntentHandler,
        NoIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
