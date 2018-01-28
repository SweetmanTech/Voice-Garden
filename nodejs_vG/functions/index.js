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
// Import Admin SDK
//var admin = require("firebase-admin");
var firebase = require("firebase");
firebase.initializeApp({
    databaseURL : 'https://personalchef-5c9a3.firebaseio.com/',
    serviceAccount: '../../serial-to-web/serviceAccountKey.json',
});
// Get a database reference to our posts
var db = firebase.database();
var ref = db.ref("gardens/proof-of-concept-garden");


// a. the action name from the Dialogflow intent
const HUMIDITY_OF_PLANT_INTENT = 'plant.humidity';
const HUMIDITY_OF_ROOM_INTENT = 'room.humidity';
const WATER_PLANT_INTENT = 'water.plant'
const TEMP_OF_ROOM_INTENT = 'room.temp'

const WATER_CONTEXT = 'water-bro'
//b. parameters

ref.on("value", function(snapshot){
    plantHumidityValue = snapshot.child("soilHumidity").val();
    roomHumidityValue = snapshot.child("airHumidity").val();
    roomTempValue =  snapshot.child("airTemperature").val();
  });  

exports.voiceGarden = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  var plantHumidityValue; //= get reading from arduino
  const waterThreshHold = 50;
  var roomHumidityValue; // = roomHumidity reading
  var roomTempValue;// = roomTemp reading in farenheit
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));


  function plantHumidity (app) {
        const waterSomeTimeSoon = 40;
        const waterSoon = 30;
        const waterNow = 20;
        const yourPlantIsProbablyDying = 10;
        var homeResponse = 'The humidity of the soil is ' + plantHumidityValue + ' percent.';
        if (plantHumidityValue > waterThreshHold){
            homeResponse += "Your plant's humidity levels are good.";
            app.tell(homeResponse);
        }else{
            homeResponse += 'You should probably water your plant ';
            switch(true){
                case plantHumidityValue <= waterSomeTimeSoon:
                    homeResponse += "sometime soon, no rush.";
                    break;
                case plantHumidityValue <= waterSoon:
                    homeResponse += "soon.";
                    break;
                case plantHumidityValue <= waterNow:
                    homeResponse += "now.";
                    break;
                case plantHumidityValue <= yourPlantIsProbablyDying:
                    homeResponse += "your plant is probably dying, water as soon as possible."
                    break;
            }
            //homeResponse += " Do you want to water now?"
        }
        
        app.ask(homeResponse + ". Do you want to water?");
  }

  function roomHumidity(app){
        app.tell("The humidity of the room your plant is in is " + roomHumidityValue);
  }

  function waterPlant(app){
        var homeResponse;
        if (plantHumidityValue > waterThreshHold){
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
        var homeResponse = "The temperature of the room your plant is in is " + roomTempValue + '.';
        switch(true){
            case roomTempValue >= hot:
                homeResponse += "I hope it isn't melting!"
                break;
            case roomTempValue >= warm:
                homeResponse += "Time to sunbathe!"
                break;
            case roomTempValue >= average:
                homeResponse += "A nice fall day."
                break;
            case roomTempValue >= chilly:
                homeResponse += "I hope its wearing a sweatshirt!"
                break;
            case roomTempValue >= cold:
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
  app.handleRequest(actionMap);
});