#include <Arduino.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>

//------------------------------------------------Definitions and Variables----------------------------------------------------------------------

//================================================= Motor Define Setup and Instructions ====================================================================
//----User Start Here----User Start Here----User Start Here----User Start Here----User Start Here----User Start Here----User Start Here----User Start Here
/*
The 5 #define pares below are used to identify the pins of the esp32 used to control the robot arm. 

-Assign each #define to its corresponding pins 
*/
  
  //Griper
  //  +When A is HIGH and B is LOW the griper will Open
  #define M1A 2
  #define M1B 4

  //Wrist
  //  +When A is HIGH and B is LOW the Writs will Raise
  #define M2A 18
  #define M2B 19

  //Elbow
  //  +When A is HIGH and B is LOW the Elbow will Raise
  #define M3A 22
  #define M3B 23

  //Shoulder
  //  +When A is HIGH and B is LOW the Shoulder will move Forward
  #define M4A 26
  #define M4B 27

  //Base
  //  +When A is HIGH and B is LOW the Base will move Clockwise
  #define M5A 32
  #define M5B 33

  //Name Of the Robot
  //  -Give your robot a unique name, Please not Spaces
  String robotName = "Zach";

//----User End Here----User End Here----User End Here----User End Here----User End Here----User End Here----User End Here----User End Here----

/*
You’re all done, Just make shore you’ve:
  + Assigned pines to all the pairs, 10 pins in total
  + Given your robot a name, make shore you share the name with the operator exactly as you’ve assigned it. 

Take a look at the rest of the Code if you’d like
*/

/*
  Robot Motor class, Just needs the pins when Defined
      Motor 'NameOfMotor'(byte pinA, byte pinB);
  
  Class will: 
   -activate the pins
   -Set pins acording to desired action
   -Set pins to stop the motor
*/
  class Motor
  {
    public:
      //Devise pins used for this Spacific instanse of a Motor
        byte A; //Devise pin conected to H-bridge pin A
        byte B; //Devise pin conected to H-bridge pin B
    //This Methode is used to 
    //  -Asigne the passed pin values to the motor instanse
    //  -Activate the Pins
    //  -Ensure thos pins are in a zero state
      Motor(byte a, byte b)
      {
        //Set class instanses variables to pased pins
        A=a;
        B=b;

        //Activates the pins as outputes
        pinMode(A, OUTPUT);
        pinMode(B, OUTPUT);

        //Ensures the pins start in a zero state untill first time they are called
        digitalWrite(A, LOW); digitalWrite(B, LOW);

      }
      
    //Methods to set the states of the Motor
    // - Positive Motion
    // - Negative Motion
    // - Stpped All Motion

      //Positive Motion
      void SetPositive()
      {
        digitalWrite(A, HIGH); digitalWrite(B, LOW);
      }

      //Negative Motion
      void SetNegative()
      {
        digitalWrite(A, LOW); digitalWrite(B, HIGH);
      }

      //Stopped All Motion
      void SetStopped()
      {
        digitalWrite(A, LOW); digitalWrite(B, LOW);
      }

  };

  //Making a motor object from the above Motor class for each Robot Motor 
    //Griper
    Motor M1(M1A, M1B);
 
    //Wrist
    Motor M2(M2A, M2B);  

    //Elbow
    Motor M3(M3A, M3B);

    //Shoulder
    Motor M4(M4A, M4B);
  
    //Base
    Motor M5(M5A, M5B);
  
/*
  Initiates actions based on passed message string from WebSocket
    +Called from the WebSocket message event handler
*/
    void MotorControl(uint8_t *data)
    {
     String read = (char*)data;
     String Part = read.substring(0,2);
     String action = read.substring(3,4);
     
     if(Part == "M1")
     {
        if(action == "P")
        {
          M1.SetPositive();
        }
        else if(action =="N")
        {
          M1.SetNegative();

        }
        else
        {
          M1.SetStopped();

        }
     }
     else if(Part == "M2")
     {
        if(action == "P")
        {
          M2.SetPositive();
        }
        else if(action =="N")
        {
          M2.SetNegative();

        }
        else
        {
          M2.SetStopped();

        }
     }
     else if(Part == "M3")
     {
        if(action == "P")
        {
          M3.SetPositive();
        }
        else if(action =="N")
        {
          M3.SetNegative();

        }
        else
        {
          M3.SetStopped();

        }
     }
     else if(Part == "M4")
     {
        if(action == "P")
        {
          M4.SetPositive();
        }
        else if(action =="N")
        {
          M4.SetNegative();

        }
        else
        {
          M4.SetStopped();

        }
     }
     else if(Part == "M5")
     {
        if(action == "P")
        {
          M5.SetPositive();
        }
        else if(action =="N")
        {
          M5.SetNegative();

        }
        else
        {
          M5.SetStopped();

        }
     }
    
     Serial.println(Part);
     Serial.println(action);
    }      


//================================================ Network Configuring, Event Handaling, and Activating ====================================================================

  //Configuring 
    //Network Login credentials 
    const char* password = "Spring2022";
    const char* ssid     = "ECET_IoT_2G_334_434";

    //Utilized Network Channel
    AsyncWebServer server(80);

    //The ‘/ws’ is a marker in a received string that helps to identify what event handlers to pass the collected data to. 
    AsyncWebSocket ws("/ws");
    //For this program were only using one channel but if you wanted to you could connect to multiple devises or servers and assign specific markers to each to call to customized event handlers. 
  
  //Event Handaling

  void SocketEvents(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
  {

    switch (type) {
      
      //Handler for when the Socket initialy conects
      case WS_EVT_CONNECT:
        Serial.printf("WebSocket client #%u connected from %s\n", client->id(), client->remoteIP().toString().c_str());
        client ->text(robotName);

          break;
      
      //Handler for when socket is disconecter
      case WS_EVT_DISCONNECT:
        Serial.printf("WebSocket client #%u disconnected\n", client->id());
          break;
      
      //Function To proces Receved Messages
      case WS_EVT_DATA:        
        MotorControl(data);      
        break;
    
    case WS_EVT_PONG:
    case WS_EVT_ERROR:
        break;
  }

  }
  //Activating

  void ActivateNetwork()
  {
  //Conecting to network portal
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    //wait for conection
    Serial.print("Connecting");

    while (WiFi.status() != WL_CONNECTED)
    {
      Serial.print('.');
      delay(500);
    }

    Serial.println(' '); Serial.println(' ');
    Serial.println("Success");
    Serial.print("Your IP: ");Serial.print(WiFi.localIP());

  //Setup the WebSocket
    //Link Events 
    ws.onEvent(SocketEvents);
    //Tie Server events with Socket Events
    server.addHandler(&ws);

  //Server New Conection Event Handler 
    server.on("/",HTTP_GET, [](AsyncWebServerRequest *request)
      {
        //on conection send succes code and name of this robot
        request -> send(200, "text/plain", robotName);
      });

  //Avtivat the Server with the preveyusley defined seting
    server.begin();
    
  }


//------------------------------------------------Controlers Starting Setup Point and Infinet Loop----------------------------------------------------------------------
void setup() 
{
 
 Serial.begin(115200);

  ActivateNetwork();

}

void loop() 
{
  delay(250);
  //removes unconected clients from client list. 
  ws.cleanupClients();
  
}