import {Router} from 'express';
import user from './routes/UserRoute';
import listItem from './routes/ListItemRoute';
import list from './routes/ListRoute';
import listUser from './routes/ListUserRoute';

export default () => {
  const app = Router();
  user(app);
  list(app);
  listItem(app);
  listUser(app);
  return app;
};
