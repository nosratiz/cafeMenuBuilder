import 'dotenv/config';
import 'module-alias/register';
import AccountController from './controllers/account.controller';

import App from './app';
import validateEnv from './utils/validateEnv';


validateEnv();

const app = new App([new AccountController()], Number(process.env.PORT));

app.listen();
