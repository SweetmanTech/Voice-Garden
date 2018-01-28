var fs = require('fs');
var admin = require('firebase-admin');
const gardenID = "proof-of-concept-garden";
const arduinoPort = '/dev/ttyACM3';

//Firebase Setup
var admin = require('firebase-admin');

var serviceAccount = require('../serial-to-web/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://personalchef-5c9a3.firebaseio.com/'
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("gardens");
var gardenRef = ref.child(gardenID);

const SerialPort = require ("serialport");

const port = new SerialPort(arduinoPort);

port.on('data', function(data) {
  postData(data);
})

function postData(data) {
  let dataArray = data.toString();
  dataArray2 = dataArray.split(",");
  if (dataArray2.length > 2) {
    gardenRef.set({
      airHumidity: dataArray2[0] ? dataArray2[0] : 0,
      airTemperature: dataArray2[1] ? dataArray2[1] : 0,
      soilHumidity: dataArray2[2].toString() ? dataArray2[2].toString()  : 0,
    });
  }
}
