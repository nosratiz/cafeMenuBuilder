import 'dotenv/config';
import 'module-alias/register';
import AccountController from './controllers/account.controller';
import FileController from './controllers/file.controller';
import UserController from './controllers/user.controller';
import RestaurantController from './controllers/restaurant.controller';
import MenuController from './controllers/menu.controller';
import RoleController from './controllers/role.controller';

import App from './app';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [
        new AccountController(),
        new FileController(),
        new UserController(),
        new RestaurantController(),
        new MenuController(),
        new RoleController(),
    ],
    Number(process.env.PORT)
);

app.listen();
