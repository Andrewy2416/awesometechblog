const express = require('express');
const expressHandlebars = require('express-handlebars');
const session = require("express-session");
const path = require('path');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require('./config/connection');
const controllers = require('./controllers');
const helpers = require('./utils/helpers');
const handlebars = expressHandlebars.create({helpers});


const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions
const sess = {
    secret: "Secret",
    cookie: {// Stored in milliseconds (86,400,000 === 1 day)
      //28800000 = 8 hours
      maxAge: 28800000,},
      
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
    }),
};
app.use(session(sess));
// set up handlebars with express
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//use the middlewares
app.use(express.json());-
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// turn on routes
app.use(controllers);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});