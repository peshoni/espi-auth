import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controller.interface';

class UtilsController implements Controller {
  router: Router = Router();
  path = '/utils';
  url: string;

  constructor() {
    // if (!process.env.HASURA_URL) {
    //   throw new Error('Missing configuration setting!');
    // }

    // this.url = process.env.HASURA_URL;
    this.initializeMeddleware();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    // this.router.post('/check-vat', this.checkVat);
    // this.router.post(
    //   '/generate-export-schetovodstvo-plus',
    //   this.generateExportSchetovodstvoPlus
    // );
    // this.router.post('/email-invoice', this.emailInvoice);
  }

  initializeMeddleware(): void {
    this.initializeMeddleWare();
  }

  protected initializeMeddleWare(): void {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      // console.log(req.path, req.url, req.route);

      // if (req.url === '/check-vat') {
      return next();
      // }
      // return res
      //   .status(403)
      //   .json({status: 'Error', message: `Forbiden from path ${req.baseUrl}`});
    });
  }
}

export default UtilsController;
