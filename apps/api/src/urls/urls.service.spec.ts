import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { Repository } from 'typeorm';

describe('UrlsService', () => {
  let service: UrlsService;
  let repository: Repository<Url>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        {
          provide: getRepositoryToken(Url),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
    repository = module.get<Repository<Url>>(getRepositoryToken(Url));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should create and return a shortened url', async () => {
      const originalUrl = 'https://meet.google.com/';
      const slug = 'abc123';
      const urlEntry = { slug, originalUrl };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValue(urlEntry as Url);
      jest.spyOn(repository, 'save').mockResolvedValue(urlEntry as Url);

      const result = await service.shortenUrl(originalUrl);

      expect(result).toEqual(expect.any(String));
      expect(repository.save).toHaveBeenCalledWith(urlEntry);
    });

    it('should generate new slug if first one exists', async () => {
      const originalUrl = 'https://meet.google.com/';
      const firstSlug = 'abc123';
      const secondSlug = 'def456';
      const existingUrl = { slug: firstSlug, originalUrl };
      const newUrl = { slug: secondSlug, originalUrl };

      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(existingUrl as Url)
        .mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValue(newUrl as Url);
      jest.spyOn(repository, 'save').mockResolvedValue(newUrl as Url);

      const result = await service.shortenUrl(originalUrl);

      expect(result).toEqual(expect.any(String));
      expect(repository.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original url when slug exists', async () => {
      const urlEntry = {
        slug: 'abc123',
        originalUrl: 'https://meet.google.com/',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(urlEntry as Url);

      const result = await service.getOriginalUrl(urlEntry.slug);

      expect(result).toBe(urlEntry.originalUrl);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { slug: urlEntry.slug },
      });
    });

    it('should return null when slug does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.getOriginalUrl('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all urls', async () => {
      const urls = [
        { slug: 'abc123', originalUrl: 'https://meet.google.com/' },
        { slug: 'def456', originalUrl: 'https://google.com/' },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(urls as Url[]);

      const result = await service.findAll();

      expect(result).toBe(urls);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
