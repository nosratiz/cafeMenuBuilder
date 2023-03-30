import 'dotenv/config';
import 'module-alias/register';
import AccountController from './controllers/account.controller';
import FileController from './controllers/file.controller';
import UserController from './controllers/user.controller';

import App from './app';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App(
    [new AccountController(), new FileController(), new UserController()],
    Number(process.env.PORT)
);

app.listen();
