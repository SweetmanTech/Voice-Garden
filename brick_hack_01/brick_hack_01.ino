#include <dht11.h>
dht11 DHT;
#define MOISTURE_PIN A2  //soil Moisture sensor/
#define DHT11_PIN    9   //DHT11

int airHumidity;   //environment humidity
int airTemperature;  // environment temperature
int soilHumidity;   //soil moisture

void setup(){
  Serial.begin(9600);
}

void loop(){
  int chk;
  chk = DHT.read(DHT11_PIN);   //Read Data
  switch (chk){
    case DHTLIB_OK:  
                Serial.print("OK,\t"); 
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
  soilHumidity=analogRead(MOISTURE_PIN);
  
  Serial.print("airHumidity:");
  Serial.print(airHumidity);
  Serial.print(",\t");
  Serial.print("airTemperature:");
  Serial.print(airTemperature);
  Serial.print(",\t");
  Serial.print("soilHumidity:");
  Serial.println(soilHumidity);
  
  delay(1000);
}
