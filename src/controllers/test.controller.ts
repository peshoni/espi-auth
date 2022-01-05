import { NextFunction, Request, Response, Router } from 'express';
import { Controller } from '../interfaces/controller.interface';

class TestController implements Controller {
  readonly path: string = '/test';
  readonly router: Router = Router();

  constructor() {
    this.initializeMeddleware();
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.initializeControllerRoutes();
  }

  initializeMeddleware(): void {
    this.initializeMeddleWare();
  }

  /**
   * @override base class
   */
  protected initializeMeddleWare(): void {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      if (req.baseUrl === '/test') {
        return next();
      }
      return res.status(403).json({
        status: 'Error',
        message: `Forbiden from path ${req.baseUrl}`,
      });
    });
  }

  protected initializeControllerRoutes(): void {
    this.router.get('/', this.sayHello);
  }

  private sayHello(req: Request, res: Response): Response {
    return res.status(200).json({
      status: 'ok',
      message: `Working Great from Controller from ${req.baseUrl}`,
    });
  }
}

export default TestController;
