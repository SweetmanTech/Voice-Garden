#include <dht11.h>
dht11 DHT;
#define MOISTURE_PIN A2  //soil Moisture sensor/
#define DHT11_PIN    9   //DHT11

int airHumidity;   //environment humidity
int airTemperature;  // environment temperature
int soilHumidity;   //soil moisture
int maxSoilHumidity = 800;

void setup(){
  Serial.begin(9600);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);

  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
}

void loop(){
  int chk;
  chk = DHT.read(DHT11_PIN);   //Read Data
  switch (chk){
    case DHTLIB_OK:
                //Serial.print("OK,\t");
                break;
    case DHTLIB_ERROR_CHECKSUM:
                Serial.print("Checksum error,\t");
                break;
    case DHTLIB_ERROR_TIMEOUT:
                Serial.print("Time out error,\t");
                break;
    default:
                Serial.print("Unknown error,\t");
                break;
  }
  airHumidity=DHT.humidity;
  airTemperature=DHT.temperature;

  airTemperature = airTemperature * 2 + 32;

  soilHumidity=analogRead(MOISTURE_PIN);

  if(Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == 'y') {
      Serial.print("watering.. soil humidity: " + soilHumidity);
      pumpOn();
      delay(1000);
      pumpOff();
    }
  } else {
      //Print data
    Serial.print(airHumidity);
    Serial.print(",");
    Serial.print(airTemperature);
    Serial.print(",");
    Serial.println(soilHumidity);
  }

  delay(1000);
}

//open water pump
void pumpOn()
{
  digitalWrite(5, HIGH);
  digitalWrite(6, HIGH);
}
//close water pump
void pumpOff()
{
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
}
