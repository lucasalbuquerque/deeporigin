import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('UrlsController', () => {
  let controller: UrlsController;
  let urlsService: UrlsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            findAll: jest.fn(),
            shortenUrl: jest.fn(),
            getOriginalUrl: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    urlsService = module.get<UrlsService>(UrlsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all urls', async () => {
      const result = [
        {
          id: 1,
          originalUrl: 'https://meet.google.com/',
          slug: 'abc123',
          createdAt: new Date(),
        },
        {
          id: 2,
          originalUrl: 'https://google.com/',
          slug: 'def456',
          createdAt: new Date(),
        },
      ];
      jest.spyOn(urlsService, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a shortened url', async () => {
      const originalUrl = 'https://google.com/';
      const slug = 'abc123';
      const baseUrl = 'http://localhost:3001';

      jest.spyOn(urlsService, 'shortenUrl').mockResolvedValue(slug);
      jest.spyOn(configService, 'get').mockReturnValue(baseUrl);

      const result = await controller.create(originalUrl);

      expect(result).toEqual({
        shortenedUrl: `${baseUrl}/urls/${slug}`,
      });
    });
  });

  describe('redirect', () => {
    it('should redirect to original url', async () => {
      const slug = 'abc123';
      const originalUrl = 'https://google.com/';
      const mockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      jest.spyOn(urlsService, 'getOriginalUrl').mockResolvedValue(originalUrl);

      await controller.redirect(slug, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should throw NotFoundException when url not found', async () => {
      const slug = 'nonexistent';
      const mockResponse = {
        redirect: jest.fn(),
      } as unknown as Response;

      jest.spyOn(urlsService, 'getOriginalUrl').mockResolvedValue(null);

      await expect(controller.redirect(slug, mockResponse)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
