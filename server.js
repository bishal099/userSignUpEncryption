import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/routes.js';
import userModel from './models/userModel.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import {
    uri
} from './models/userModel.js';

import {} from "dotenv/config";

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

const sessionStore = new MongoStore({
    mongoUrl: uri,
    dbName: "week6Users",
    collectionName: "usersSession"
});

app.use(session({
    secret: "My-Secret-Key",
    resave: false,
    saveUninitialized: false,
    sessionStore
}));

app.set("view engine", "ejs");
app.use(express.static('public'));

const port = process.env.PORT || 4050;

console.log("URI: ", port);

app.listen(port, () => {
    console.log(`\nApp is Listening to Port: ${port} \nLink: http://localhost:${port}/`);
});



app.use("/", router)