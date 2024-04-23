# Software Report

WhereTo is an application designed to solve the problem of locating parking and navigating complex parking restrictions. By leveraging Google Street View image data and machine learning, WhereTo aims to deliver real-time parking regulation information to its users.

## Table of Contents
1. [High Level System Overview](#High-Level-System-Overview)
2. [Modular Overview Frontend](#Modular-Overview-Frontend)
3. [Modular Overview Backend](#Modular-Overview-Backend)
4. [Frontend Dev Tool Information](#Frontent-Dev-Tool-Information)
5. [Backend Dev Tool Information](#Backend-Dev-Tool-Information)
6. [Frontend Installation and Use](#Frontend-Installation-and-Use)
7. [Backend Installation and Use](#Backend-Installation-and-Use)

## High Level System Overview
![Alt text](./Assets/HighLevelOverview.png)  
Figure 1 - WhereTo software system diagram  

The system design approach of WhereTo is quite simple from a high level perspective.  

The WhereTo software ecosystem consists of three components: 
- The React Native UI: a multi-platform mobile application for which the user is able to interact with to locate parking regulations in a desired area
- The Python Server: computes the expected parking regulations of the desired area, also acts as a way for the frontend to access specific detections from the cache
- The SQL database: used for caching of parking regulations in a desired area  

Given that there are only three components to WhereTo itself, understanding a simple request and how it flows through at a high level should be quite clear. The following is the general process with no errors:  
1. The user enters an address and radius value into the React Native user interface on either iOS or Android, and presses “Find Parking”
2. The React Native user interface makes a request to the Park API in the Python server, to compute the parking regulations at the requested location and radius
3. The Python server’s Park API computes the regulations using machine learning in addition to interactions with various Google APIs and the Bunting Labs OSM Extract API (Further elaborated on in section III)
4. The Python server sends each parking regulation detection to the SQL cache, to be used in the future instead of the APIs and machine learning process
5. The Python server sends a list of detections to the React Native UI
6. The React Native UI presents the list of detections to the user in map format, giving a visual representation of parking information to the user
7. The user is able to press on any marker representing a detection, in order to view detailed information about it, this detailed information comes from the other API within the Python server, the Detail API  

If there is an error at any point in the process, the Python server sends such information to the user interface, which will update the user with the information.  

The last important thing to remember from a high level perspective is what is meant by the word “detection”. A detection in our system is wherever our machine learning object detection models recognize one of three things: a single-space parking meter, a multi-space parking meter, and a road sign. Each of these has different implications and displays on the frontend.

## Modular Overview Frontend
## Modular Overview Backend  

Below are simple descriptions of each module in the backend:  
- Database Access Module:
    - This module is responsible for defining the models for the data being stored in the SQL cache. Additionally, this module implements the functions necessary for interacting with the SQL cache, which are used by other modules.
- Detail API Module:
    - The DetailAPI is the module for an API which allows the requester to input a detection id  and receive a response containing detailed information about that detection.
- OSM Module:
    - This module is responsible for loading extract data from Open Street Maps and formatting it to our specifications. It utilizes an external API to get the street information, and formats the response into a list of streets.
- Machine Learning Module:
    - This module is responsible for utilizing the loaded PyTorch file in our applications machine learning workflow. It traverses over an area, scanning images with the model to detect regulations and meters.
- Park API Module:
    - This module is responsible for running the main algorithm pipeline for analyzing parking information in a given area. This module calls functions from the OSM and Machine Learning Modules in order to complete its workflow.
- Text Processing Module:
    - This module is a completely independent module, responsible for implementing a single function in order to detect text in an image 
- WhereTo Module:
    - This module is responsible for defining many application constants.
- Testing Module:
    - This test/ folder is responsible for holding the functionality unit tests for each module.
- app.py Module:
    - This module is the main driver module for the backend, it adds the resource APIs to the application and begins running it.
- config.py Module:
    - This module is defined separately for each instance where the WhereTo backend is hosted. Elaborated on later.  

Below is a high level diagram, showing the relationships between each of these modules in the backend.

## Frontend Dev Tool Information
## Backend Dev Tool Information
## Frontend Installation and Use
## Backend Installation and Use