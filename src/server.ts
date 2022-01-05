import * as dotenv from 'dotenv';
import App from './app';
import * as path from 'path';
import * as fs from 'fs';
import { Controller } from './interfaces/controller.interface';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const PORT = parseInt(process.env.PORT as string, 10);

const normalizedPath = path.join(__dirname, 'controllers');
const controllersArray: Controller[] = [];

fs.readdirSync(normalizedPath).forEach(controller => {
  import(`./controllers/${controller}`).then(cls => {
    const ready = new cls.default();
    controllersArray.push(ready);
  });
});

setTimeout(() => {
  const app = new App(controllersArray, PORT || 5000);
  app.listen();
}, 800);
