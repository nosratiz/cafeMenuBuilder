import 'dotenv/config';
import 'module-alias/register';
import AccountController from './controllers/account.controller';

import App from './app';

const app = new App([new AccountController()], Number(process.env.PORT));

app.listen();
