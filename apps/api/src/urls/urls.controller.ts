import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('urls')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private configService: ConfigService,
  ) {}

  @Get()
  async findAll() {
    return this.urlsService.findAll();
  }

  @Post('shorten')
  async create(@Body('url') originalUrl: string) {
    const slug = await this.urlsService.shortenUrl(originalUrl);
    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3001'; // TODO: move to env
    return { shortenedUrl: `${baseUrl}/urls/${slug}` };
  }

  @Get(':slug')
  async redirect(@Param('slug') slug: string, @Res() res: Response) {
    const originalUrl = await this.urlsService.getOriginalUrl(slug);
    if (!originalUrl) throw new NotFoundException('URL not found');
    res.redirect(originalUrl);
  }
}
