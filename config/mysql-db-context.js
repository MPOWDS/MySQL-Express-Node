const session = require('express-session');
const mysql   = require('mysql')
const async   = require('async')

const PRODUCTION_DB = 'books';
const TEST_DB       = 'books-test';

const MODE_TEST = 'test';
const MODE_PRODUCTION = 'dev';

const state = { pool: null, mode: null }

const connect = function(mode, done) {
	state.pool = mysql.createPool({
	    connectionLimit : 100,
	    host     : process.env.dbHost,
	    port     : process.env.dbPort,
	    user     : process.env.dbUser,
	    password : process.env.dbPassword,
	    database : process.env.databaseName,
	    debug    :  false
	});

	state.mode = mode
	done()
}

module.exports.get = function() {
  return state.pool
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Session storage and database configuration 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.pickEnv = (env, app) => {
	switch (env) {
	    case 'dev':
	        connect(this.MODE_PRODUCTION, function(err) {
				if (err) {
			    	console.log('Unable to connect to MySQL.')
			    	process.exit(1);
				} else {
					console.log('Connected to MySQL.')
			    	app.set('port', process.env.PORT || 9001);
			  	}
			})
	    break;

        case 'test':
            connect(this.MODE_TEST, function(err) {
    			if (err) {
    		    	console.log('Unable to connect to MySQL.')
    		    	process.exit(1);
    			} else {
    				console.log('Connected to MySQL.')
    		    	app.set('port', process.env.PORT || 9002);
    		  	}
    		})
        break;
	};

	// Set session and cookie max life, store session in mongo database
	app.use(session({
		secret : process.env.sessionKey,    
		httpOnly: true,
		resave : true,
	  	saveUninitialized: false, 
		cookie : { maxAge: 60 * 60 * 1000}
	}));
};

