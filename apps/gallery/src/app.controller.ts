import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  home(@Res() res: Response) {
    res.send('Hello Dude');
  }
}
