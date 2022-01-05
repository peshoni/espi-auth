import { Router } from 'express';

export interface Controller {
  readonly router: Router;
  readonly path: string;
  initializeRoutes(): void;
  initializeMeddleware(): void;
}
