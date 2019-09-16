import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
const addRequestId = require('express-request-id')();
const morgan = require('morgan');
const logger = require('./logging/logger');


//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {
    // Create a new express application instance
    const app = express();

    
    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // setup logging
    app.use(addRequestId);

    morgan.token('id', function getId(req) {
      return req.id
    });

    var loggerFormat = ':id [:date[web]]" :method :url" :status :responsetime';

    app.use(morgan(loggerFormat, {
      skip: function (req, res) {
          return res.statusCode < 400
      },
      stream: process.stderr
    }));
    app.use(morgan(loggerFormat, {
      skip: function (req, res) {
          return res.statusCode >= 400
      },
      stream: process.stdout
    }));

    app.use(function (req, res, next){
      var log = logger.loggerInstance.child({
          id: req.id,
          body: req.body
      }, true)
      log.info({req: req})
      next();
    });
    app.use(function (req, res, next) {
      function afterResponse() {
          res.removeListener('finish', afterResponse);
          res.removeListener('close', afterResponse);
          var log = logger.loggerInstance.child({
              id: req.id
          }, true)
          log.info({res:res}, 'response')
      }
      res.on('finish', afterResponse);
      res.on('close', afterResponse);
      next();
    });
    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(3000, () => {
      logger.info('Server started on port 3000');
    });
  })
  .catch(error => logger.console.info(error));

