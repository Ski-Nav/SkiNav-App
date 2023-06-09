# SkiNav Frontend

![image](https://user-images.githubusercontent.com/59634395/234620096-4492d45f-b598-4bff-87db-bab2582ba28b.png)

This application contains the frontend application for SkiNav. It provides a user interface for the (SkiNav routing algorithm)[https://github.com/Ski-Nav/SkiNav-Algorithm] and the (SkiNav API)[https://github.com/Ski-Nav/SkiNav-Server]. The app pulls ski resort data from the SkiNav server (pulled from the services folder) and routes using the SkiNav algorithm (in the routing folder). There are two screens in this app, the Home Screen and the Map Screen. The Home Screen pulls the list of ski resorts from the SkiNav server and prompts the user to select one resort. The Map Screen uses the SkiNav algorithm to pull a selected ski resort and display the map in a MapView component. The user can choose where they want to start from and where they want to end. They can then initiate a route, which uses the ski nav algorithm to find the fastest path based on their selected difficulty.

To run the app make sure you have node version `16.16.0`

Run `npm i` if you do not have `node_modules`

Run `expo start` to run the app in development mode
