# FolderCompare

Directory compare tool made using node.js and vue.js

Libraries and plugins used:
- Fast, unopinionated, minimalist web framework for node - https://github.com/expressjs/express
- Node JS directory compare - https://github.com/gliviu/dir-compare
- Promise based HTTP client for the browser and node.js - https://github.com/axios/axios
- A tree plugin for vue2 - https://github.com/zdy1988/vue-jstree

The project is setup as 2 folders - Node 'backend' and vue 'frontend'.
Navigate to respective folders and install using 

    npm install
To start the backend use 

    npm start
    - or -
    node app.js
To compile and hot-reload for development and serve the frontend use 

    npm run serve

Generally, it's a good idea to start the backend first, as it is setup to use http://localhost/api:8080 and the frontend will be served from http://localhost:8081 (it will take the next free port).

If any problems should arise during the install, try deleting node_modules folder and package-lock.json file and try again.

## IMPORTANT
Comparison folders are not included!
You need to add them to 'backend' folder - 'backend/dir1' and 'backend/dir2'
