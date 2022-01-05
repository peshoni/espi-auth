import cors from 'cors';
import express, { Application } from 'express';
import { Controller } from './interfaces/controller.interface';

class App {
  private PORT: number;
  private HOST: string;
  // private TOKEN_SECRET: string = process.env.TOKEN_SECRET;
  private app: Application;

  constructor(controllers: Controller[], port: number) {
    console.log(process.env.TOKEN_SECRET);
    if (!process.env.TOKEN_SECRET) {
      throw new Error('Missing critical configurations!');
    }

    this.PORT = port;
    this.HOST = process.env.HOST ?? '127.0.0.1';
    this.app = express();
    this.app.set('trust proxy', true); // to get proxied IP

    this.initializeMiddleWare();
    // console.log(controllers);
    this.initializeControllers(controllers);
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use(controller.path, controller.router);
    });

    this.app.get('*', (req, res) => {
      console.log(res);
      res.status(404).send('what???');
    });
  }

  private initializeMiddleWare(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(
      cors({
        allowedHeaders:
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        origin: '*',
      })
    );
  }

  public listen(): void {
    this.app.listen(this.PORT, this.HOST, () => {
      console.log(`whe are here at ${this.HOST}:${this.PORT}`);
    });
  }
}

export default App;
