//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Add the required modules
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const express        = require('express');
const app            = express();
const http           = require('http').Server(app);
const session        = require('express-session');
const validator      = require('express-validator');
const bodyParser     = require('body-parser');
const cookieParser   = require('cookie-parser');
const flash          = require('connect-flash');
const morgan         = require('morgan');
const methodOverride = require('method-override');
const helmet         = require('helmet');
const dotEnv         = require('dotenv').config();
const favicon        = require('serve-favicon');
const csurf           = require('csurf');
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set database connection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const databaseConfig = require('./config/mysql-db-context');
const env = process.env.NODE_EN || 'dev';
console.log(`NODE_EN: ${env}`);
databaseConfig.pickEnv(env, app);
		
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set view engine and session
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Morgan is use for development to test what are the request and response that's being handle
app.use(morgan('dev')); 
// Set helmet
app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'The Force' }));
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use(helmet.noSniff());
app.use(helmet.frameguard());

app.use(cookieParser());
app.use(validator()); // Validator is a backend validator by express 
app.use(flash()); // Flash can be use to store messages or notification on session

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs'); ///Set the view engine to EJS
app.set('views', __dirname + '/views'); ///Set the views directory
app.use(express.static(__dirname));
//app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Get the bootstrap, jquery, and font-awesome inside the node_module 
app.use('/js'     , express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js'     , express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css'    , express.static(__dirname + '/node_modules/bootstrap/dist/css')); 
app.use('/css'    , express.static(__dirname + '/node_modules/selectize/dist/css'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/fonts/' , express.static(__dirname + '/node_modules/font-awesome/fonts'));
app.use('/css/'   , express.static(__dirname + '/node_modules/font-awesome/css'));


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Anti csurf attack protection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* uncomment if you want to add csurf protection, 
   csurf will be stored in cookies and local variable */

app.use(csurf());

app.use(function(req, res, next) {
	res.cookie('XSRF-TOKEN', req.csrfToken());
  	res.locals._csrf = req.csrfToken();
 	next();
}); 


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set locals variable
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const localVariables = require('./config/initialize-local-variables');
app.use((req, res, next) => localVariables.initializeVariable(req, res, next));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set up CORS
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.all('*' , (req, res, next) => {
	var origin = req.get('origin'); 

  	res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization, content-type, application/json' 
    			+ ', '+ 'X-XSRF-TOKEN, CSRF-Token, X-CSRF-Token');
  	next();
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set and Initialize Routes
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const setRoutes = require('./config/routes-initialization');
setRoutes.initializeRoutes(app);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Error Handler
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let errorHandler = require('./config/error-handler');

app.use((req, res, next) => errorHandler.getError(req, res, next));
app.use((err, req, res, next) => errorHandler.showError(err, req, res, next));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create Server
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
http.listen(app.get('port'), () => {
	console.log(`Server Listening to Port: ${app.get('port')}`);
});
