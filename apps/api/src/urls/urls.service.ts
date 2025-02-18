import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './entities/url.entity';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class UrlsService {
  constructor(@InjectRepository(Url) private urlsRepo: Repository<Url>) {}

  async shortenUrl(originalUrl: string): Promise<string> {
    let slug = randomStringGenerator().slice(0, 6);
    while (await this.urlsRepo.findOne({ where: { slug } })) {
      slug = randomStringGenerator().slice(0, 6);
    }
    const urlEntry = this.urlsRepo.create({ slug, originalUrl });
    await this.urlsRepo.save(urlEntry);
    return slug;
  }

  async getOriginalUrl(slug: string): Promise<string | null> {
    const urlEntry = await this.urlsRepo.findOne({ where: { slug } });
    return urlEntry ? urlEntry.originalUrl : null;
  }

  async findAll(): Promise<Url[]> {
    return this.urlsRepo.find();
  }
}
