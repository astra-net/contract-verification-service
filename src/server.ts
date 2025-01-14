'use strict';
require('../env');

import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { InitServices } from './services/init';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

// comment for update - 1

const startServer = async () => {
  const app = express();

  app.use(cors());

  app.get('/', (req, res) => {
    res.send('Hello from App Engine! - API Support');
  });

  app.use(bodyParser.json({ limit: '1mb' })); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded())

  app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: +process.env.MAX_FILE_UPLOAD_LIMIT || 1024 * 1024 }
  }));
  // Init services
  const services = await InitServices();

  // Init routes
  routes(app, services);

  // send errors response
  app.use(function (err, req, res, next) {
    if (err) {
      res.status(err.status || 500).json({ status: err.status, message: err.message });
    } else {
      next();
    }
  });

  const PORT = process.env.PORT || 8080;

  // Listen to the App Engine-specified port, or 8080 otherwise
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
};

startServer();
