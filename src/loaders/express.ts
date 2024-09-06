import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';

export default ({app}: {app: express.Application}) => {
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(cors());
  //add test route
  app.get('/test', (req, res) => {
    //send code 200 and message 'Hello World'
    res.status(200).send('Hello World');
  }
  );
  app.use(bodyParser.json());
  app.use(routes());
  return app;
};
