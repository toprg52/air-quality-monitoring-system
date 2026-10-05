# AirWatch – Air Quality Monitoring System

AirWatch is a real-time air quality monitoring system built as a student IoT project to understand how environmental data can be collected from physical sensors, sent to the cloud, and presented in a way that is easy to understand.

The project combines an ESP32-based sensor setup with Firebase and a web dashboard. We also added a map-based view to compare our local readings with air-quality information available from external monitoring stations.

This project was developed as a hands-on exploration of IoT, sensor integration, cloud data handling, and real-time visualization.

---

## What does the project do?

The basic idea is simple:

**Sense → Send → Store → Visualize**

Environmental sensors connected to an ESP32 collect readings such as temperature, humidity, and pollution-related measurements. The ESP32 connects to Wi-Fi and sends the data to Firebase Realtime Database.

The web application then uses this data to display the current readings through a dashboard.

We also integrated a Bangalore air-quality map using the WAQI network so that the local sensor reading could be viewed alongside readings from other locations.

---

## System Flow

```text
Environmental Sensors
        ↓
      ESP32
        ↓
      Wi-Fi
        ↓
Firebase Realtime Database
        ↓
   Web Dashboard
        ↓
AQI / Sensor Visualization
        ↓
Bangalore AQI Map
```

The map also retrieves air-quality data from the WAQI API independently.
Hardware Components
ESP32

The ESP32 acts as the main microcontroller of the system.

It is responsible for:

Reading values from the connected sensors
Processing the sensor readings
Connecting to Wi-Fi
Sending data to the cloud

We chose the ESP32 mainly because its built-in Wi-Fi makes it convenient for IoT applications.

### DHT22

The DHT22 is used to measure:

### Temperature
### Humidity

These readings provide additional environmental context alongside the air-quality measurements.

### MQ135

The MQ135 is a gas sensor commonly used for detecting changes associated with several air pollutants and gases.

In our setup, it was used as one of the pollution-related sensing inputs.

### MQ2

The MQ2 is a gas/smoke sensor. It is sensitive to several combustible gases and smoke.

It was included to experiment with additional pollution-related measurements.

### PM2.5 Sensor

A particulate matter sensor was also part of the intended setup for measuring fine particles in the air.

During development and the final demonstration, we encountered reliability and power-related issues with the PM sensor. Because of this, its readings were not treated as a consistently reliable source of AQI data.

This was one of the practical lessons from the project: getting a sensor to physically connect is different from getting stable, usable data from it.

## Software & Technologies
ESP32 – Microcontroller and Wi-Fi connectivity
Embedded C/C++ – Sensor-side programming
Firebase Realtime Database – Cloud data storage
React – Web dashboard
JavaScript – Application logic
Leaflet – Interactive map
WAQI API – External air-quality station data
Vercel – Web application deployment
Dashboard

The web dashboard provides a simple interface for viewing the collected environmental data.

The dashboard was designed around the idea that raw sensor readings are not very useful to most users on their own. They need to be presented in a form that makes the current air-quality situation easier to understand.

The interface includes:

Current AQI information
Environmental readings
Pollution-related measurements
Real-time data display
Air-quality trends/visualization
Interactive map
Bangalore AQI Map

One of the features we added was an interactive Bangalore AQI map.

The map combines:

Our local sensor reading
AQI readings from external WAQI monitoring stations

This gives us a simple way to compare our local measurement with air-quality information from another location.

The map uses Leaflet for visualization and the WAQI API to retrieve station information.

Example flow:

WAQI API
   ↓
Station AQI + Location
   ↓
Leaflet Map
   ↓
AQI Marker

Each station is represented using a marker whose appearance changes according to the AQI range.

## AQI Calculation

For the prototype, AQI visualization was implemented using a simplified conversion from particulate concentration to an AQI-like value.

The purpose was primarily to make the sensor output understandable through the dashboard rather than to build a complete regulatory AQI calculation engine.

This is an important limitation of the current prototype.

A production-ready version should use the appropriate pollutant-specific AQI breakpoints and handle multiple pollutants according to the relevant standard.

## Firebase Integration

Firebase Realtime Database acts as the bridge between the physical sensor system and the web application.

The general data flow is:

ESP32
  ↓
Wi-Fi
  ↓
Firebase Realtime Database
  ↓
React Dashboard

This allowed the dashboard to access sensor readings without requiring the ESP32 and the web application to communicate directly.

It also made the project easier to demonstrate because the sensor data could be accessed remotely through the deployed dashboard.

## Challenges We Faced

The project was not just about connecting components and getting a final output. A large part of the work involved dealing with issues that appear when hardware and software meet.

### 1. Sensor reliability

Some sensors did not always produce stable or valid readings.

This made it important to distinguish between:

A sensor being connected
A sensor producing a value
A value actually being reliable
### 2. Power limitations

The particulate matter sensor required more power than our setup could reliably provide at certain points.

This resulted in situations where the sensor appeared connected but did not provide usable readings.

### 3. Invalid readings

We encountered unexpected values during testing, including invalid/negative AQI outputs.

This highlighted the importance of validating sensor data before displaying or using it.

### 4. Frontend and deployment issues

Getting the dashboard to work locally was different from getting the deployed version to work correctly.

We had to deal with:

JavaScript module paths
React application structure
Deployment configuration
API requests
External data sources

These issues helped us understand that a working prototype involves more than just writing individual pieces of code.

## Project Architecture
             ┌─────────────────────┐
             │ Environmental       │
             │ Sensors             │
             │                     │
             │ DHT22               │
             │ MQ135               │
             │ MQ2                 │
             │ PM2.5               │
             └──────────┬──────────┘
                        │
                        ↓
             ┌─────────────────────┐
             │       ESP32         │
             │ Sensor acquisition  │
             │ + Wi-Fi             │
             └──────────┬──────────┘
                        │
                        ↓
             ┌─────────────────────┐
             │ Firebase Realtime   │
             │ Database            │
             └──────────┬──────────┘
                        │
                        ↓
             ┌─────────────────────┐
             │ React Dashboard     │
             │                     │
             │ AQI                 │
             │ Sensor readings     │
             │ Visualization       │
             └─────────────────────┘

             External data
                   │
                   ↓
             ┌───────────────┐
             │   WAQI API    │
             └───────┬───────┘
                     ↓
             ┌───────────────┐
             │ Leaflet Map   │
             └───────────────┘
## What I Worked On

My main contribution was on the technical side of the system, particularly around the sensor-to-dashboard pipeline.

I worked with:

ESP32 sensor integration
Sensor-side programming
Sending data through Wi-Fi
Firebase integration
AQI/dashboard logic
Map-based air-quality visualization
Debugging sensor and application issues
Testing the system during the final demonstration

The project also gave me experience explaining a technical system to people who had never seen it before, as we demonstrated it during our college technical expo.

## What We Learned

The biggest takeaway from this project was understanding the complete flow of a real-world IoT system.

Before working on it, it is easy to think of an IoT project as:

Sensor → Code → Output

In practice, it is closer to:

Sensor
  ↓
Hardware connections
  ↓
Sensor readings
  ↓
Validation
  ↓
Microcontroller
  ↓
Network
  ↓
Cloud
  ↓
Backend/data handling
  ↓
Frontend
  ↓
User

A problem at any point in this chain can affect the final result.

We also learned that sensor data cannot simply be trusted because a number was returned. Real-world sensing requires calibration, validation, filtering, and handling of missing or abnormal values.

## Future Scope

There are several directions in which we would like to take the project further.

## Better sensor reliability

Use properly calibrated particulate-matter sensors and improve the power supply and hardware design to obtain more consistent readings.

## Backend AQI processing

Move AQI calculation and data validation away from the frontend and into a dedicated backend/data-processing layer.

This would make the system more reliable and prevent invalid sensor values from directly affecting the user interface.

## Anomaly Detection

A future version could automatically identify unusual sensor readings caused by:

Sensor malfunction
Sudden spikes
Communication errors
Environmental anomalies
Machine Learning

We are interested in extending the system with a lightweight ML model, potentially using TensorFlow Lite, to analyze historical sensor data and explore short-term air-quality prediction.

## Larger Monitoring Network

Multiple ESP32-based sensor nodes could be deployed at different locations and connected to the same backend, creating a distributed air-quality monitoring network.

## Current Limitations

This is a student prototype and should not be treated as a certified air-quality measurement system.

Some of the main limitations are:

Low-cost gas sensors require calibration for accurate quantitative measurements.
Sensor readings can vary with environmental conditions.
The PM2.5 sensor was not consistently reliable during our final setup.
The current AQI conversion is simplified.
The system does not yet implement a complete pollutant-specific regulatory AQI calculation.
The prototype uses a relatively small number of sensing locations.

These limitations are also what make the project useful as a learning platform for improving the system further.

## Demonstration

The system was presented as part of our college technical expo, where we demonstrated the physical sensor setup, live monitoring dashboard, and Bangalore AQI map.

The demonstration gave us an opportunity to explain the complete system to students, faculty, and visitors and to see how the prototype behaved outside a controlled development environment.

## Team

Developed as a team project by:

-Ryan
-Abhinaya
-Varsha

## Final Note

AirWatch started as a simple idea: collect air-quality data using inexpensive sensors and make that information easier to understand.

Building it taught us that the difficult part of an IoT system is not any single component. It is making the hardware, data, cloud services, application, and user interface work together reliably.

This repository represents the first phase of the project, with future improvements planned around data validation, better sensing, anomaly detection, and machine-learning-based analysis.
<!-- Contributed by Varsha -->
