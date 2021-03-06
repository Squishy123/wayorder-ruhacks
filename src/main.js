const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//plugins
import connectDB from './modules/connectDB';
import RouteLoader from './modules/routeLoader';
import initTransporter from './modules/initTransporter';

//get env vars
require('dotenv').config();

//create server
let server = express();

server.use(require('cors')());

server.use(bodyParser.json());

server.use(
    bodyParser.urlencoded({
        extended: true,
        type: 'application/*',
    })
);

(async function() {
    //setup nodemailer
    let transporter = initTransporter();

    //load all routes
    let routeLoader = new RouteLoader(server, {
        dir: path.join(__dirname, './routes'),
        verbose: true,
        strict: false,
        binds: {
            transporter: transporter,
        },
    });
    await routeLoader.loadDir();

    //connect to DB
    await connectDB();

    server.listen(3000, function() {
        console.log(`${server.name} listening at http://localhost:3000`);
    });
})();
