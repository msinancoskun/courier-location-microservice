import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request) {
    console.log(`${req.method} ${req.baseUrl}`);
  }
}
