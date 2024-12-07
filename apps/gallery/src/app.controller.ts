import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  @Get()
  home(@Res() res: Response) {
    const filePath = join(process.cwd(), 'html', 'home.html');
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    res.type('html').send(htmlContent);
  }
}
