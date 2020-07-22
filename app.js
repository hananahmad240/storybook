const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const methodOverride = require('method-override');


require('./config/passport')(passport)
dotenv.config({
    path: './config/config.env',
});
const connectDB = require('./config/db');


// create app
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(expressLayouts);

// express session
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}))

// authentication
app.use(passport.initialize());
app.use(passport.session());

// gloabal variable
app.use(function (req, res, next) {
    res.locals.USER = req.user || null;
    next();
})



// bodyParse
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}))



// database connecttion
connectDB();


// logging
if (process.env.NODE_ENV = 'developement') {
    app.use(morgan('dev'));
}

// route
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/story'));

// create PORT
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`server is running on localhost ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});