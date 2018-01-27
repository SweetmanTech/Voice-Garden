var fs = require('fs');
var admin = require('firebase-admin');
const gardenID = "proof-of-concept-garden";

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
gardenRef.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});

const SerialPort = require ("serialport");

const port = new SerialPort('/dev/ttyACM0');

port.on('data', function(data) {
  //fs.writeFile('/tmp/test.txt', data, function(err) {})
  fs.appendFile('/tmp/test.txt', data, (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });
})
