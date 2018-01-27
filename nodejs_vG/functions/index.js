// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');


// a. the action name from the Dialogflow intent
const HUMIDITY_OF_PLANT_INTENT = 'plant.humidity';
const HUMIDITY_OF_ROOM_INTENT = 'room.humidity';
const WATER_PLANT_INTENT = 'water_plan'
const TEMP_OF_ROOM_INTENT = 'room.temp'
const HUMIDITY_OF_PLANT_INTENT_FOLLOWUP = 'plant.humidity_followUp'

const WATER_CONTEXT = 'water-bro'
//b. parameters

exports.voiceGarden = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  const plantHumidityReading = 75; //= get reading from arduino
  const waterThreshHold = 50;
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));


  function plantHumidity (app) {
        const waterSomeTimeSoon = 40;
        const waterSoon = 30;
        const waterNow = 20;
        const yourPlantIsProbablyDying = 10;
        var homeResponse = 'The humidity of the soil is ' + humidity + ' percent.';
        if (plantHumidityReading > waterThreshHold){
            homeResponse += "Your plant's humidity levels are good.";
            
        }else{
            homeResponse += 'You should probably water your plant ';
            switch(true){
                case plantHumidityReading <= waterSomeTimeSoon:
                    homeResponse += "sometime soon, no rush";
                    break;
                case plantHumidityReading <= waterSoon:
                    homeResponse += "soon";
                    break;
                case plantHumidityReading <= waterNow:
                    homeResponse += "now";
                    break;
                case plantHumidityReading <= yourPlantIsProbablyDying:
                    homeResponse += "your plant is probably dying, water as soon as possible"
                    break;
            }
        }
        app.tell(homeResponse);
        app.setContext(WATER_CONTEXT);
        app.ask("Do you want to water now?");
        waterPlant(app);
  }

  function roomHumidity(app){
        let roomHumidity = 50; // = roomHumidity reading
        app.tell("The humidity of the room your plant is in is " + roomHumidity);
  }

  function waterPlant(app){
        
        var homeResponse;
        if (plantHumidityReading > waterThreshHold){
            homeResponse = "Plant currently doesn't need to be watered";
        }
        else{
            homeResponse = 'Plant watered';
            //PLANT WATERING EVENT
        }
        app.tell(homeResponse);
  }

  function roomTemperature(app){
        const cold = 15;
        const chilly = 32;
        const average = 50;
        const warm = 72;
        const hot = 90;
        let roomTemp = 75;// = roomTemp reading in farenheit 
        var homeResponse = "The temperature of the room your plant is in is " + roomTemp + '.';
        switch(true){
            case roomTemp >= hot:
                homeResponse += "I hope it isn't melting!"
                break;
            case roomTemp >= warm:
                homeResponse += "Time to sunbathe!"
                break;
            case roomTemp >= average:
                homeResponse += "A nice fall day."
                break;
            case roomTemp >= chilly:
                homeResponse += "I hope its wearing a sweatshirt!"
                break;
            case roomTemp >= cold:
                homeResponse += "Brrrrr"
                break;
        }
        app.tell(homeResponse);
  }
  
  
  
  
  
  // d. build an action map, which maps intent names to functions
  let actionMap = new Map();
  actionMap.set(HUMIDITY_OF_PLANT_INTENT, plantHumidity);
  actionMap.set(HUMIDITY_OF_ROOM_INTENT, roomHumidity);
  actionMap.set(WATER_PLANT_INTENT, waterPlant);
  actionMap.set(TEMP_OF_ROOM_INTENT, roomTemperature);
  actionMap.set(HUMIDITY_OF_PLANT_INTENT_FOLLOWUP,waterPlant);
  app.handleRequest(actionMap);
});