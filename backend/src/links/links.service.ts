import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const CARD_TYPES = [
  'SHOPPING',
  'RECIPE',
  'READ_LATER',
  'VIDEO',
  'TRAVEL',
  'RESTAURANT',
  'HEALTH_FITNESS',
  'EDUCATION',
  'DIY_CRAFTS',
  'PARENTING',
  'FINANCE',
  'OTHER',
];
const INTENTS = [
  'TO_BUY',
  'TO_READ',
  'TO_WATCH',
  'TO_VISIT',
  'TO_COOK',
  'TO_EAT',
  'TO_LEARN',
  'TO_DO',
  'INSPIRATION',
  'REFERENCE',
];

@Injectable()
export class LinksService {
  private apiKey: string | null = null;

  constructor(config: ConfigService) {
    this.apiKey = config.get<string>('GEMINI_API_KEY') ?? null;
  }

  private async gemini(prompt: string, schema: object): Promise<Record<string, any>> {
    const res = await fetch(`${GEMINI_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
    });
    const data = await res.json() as Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}') as Record<string, any>;
  }

  async processLink(url: string) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new BadRequestException('Invalid URL');
    }

    const metadata = await this.fetchMetadata(url);
    const hostname = parsedUrl.hostname.replace('www.', '');

    if (!this.apiKey) {
      return {
        url,
        cardType: 'OTHER',
        intent: 'REFERENCE',
        title: metadata?.title || hostname,
        description: metadata?.description || '',
        imageUrl: metadata?.image || '',
        additionalImages: metadata?.additionalImages || [],
        source: metadata?.siteName || hostname,
        tags: [hostname.split('.')[0]],
      };
    }

    const prompt = `Analyze this URL and page content. Return a JSON object.
URL: ${url}
Page Title: ${metadata?.title || 'N/A'}
Page Description: ${metadata?.description || 'N/A'}
Site Name: ${metadata?.siteName || hostname}
Page Text Excerpt: ${metadata?.rawText?.substring(0, 3000) || 'N/A'}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const p = await this.gemini(prompt, this.buildSchema());

    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    return {
      url,
      cardType: (p['cardType'] as string) || 'OTHER',
      intent: (p['intent'] as string) || 'REFERENCE',
      title: metadata?.title || (p['title'] as string) || hostname,
      description: (p['description'] as string) || metadata?.description || '',
      imageUrl: metadata?.image || '',
      additionalImages: metadata?.additionalImages || [],
      source: (p['source'] as string) || metadata?.siteName || hostname,
      tags: (p['tags'] as string[]) || [],
      shoppingDetails: p['shoppingDetails'],
      recipeDetails: p['recipeDetails'],
      readLaterDetails: p['readLaterDetails'],
      travelDetails: p['travelDetails'],
      restaurantDetails: p['restaurantDetails'],
      healthFitnessDetails: p['healthFitnessDetails'],
      educationDetails: p['educationDetails'],
      diyCraftsDetails: p['diyCraftsDetails'],
      parentingDetails: p['parentingDetails'],
      financeDetails: p['financeDetails'],
    };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  private async fetchMetadata(url: string) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DumplinksBot/1.0)' },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return null;

      const html = await response.text();

      const getMeta = (patterns: RegExp[]) => {
        for (const re of patterns) {
          const m = html.match(re);
          if (m?.[1])
            return m[1]
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .trim();
        }
        return null;
      };

      const title =
        getMeta([
          /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
          /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
          /<title[^>]*>([^<]+)<\/title>/i,
        ]) || new URL(url).hostname;

      const description = getMeta([
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i,
      ]);

      const rawImage = getMeta([
        /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:secure_url["']/i,
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      ]);

      const siteName = getMeta([
        /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i,
      ]);

      let image: string | null = null;
      if (rawImage) {
        try {
          image = new URL(rawImage, url).href;
        } catch {
          /* ignore */
        }
      }

      const additionalImages: string[] = [];
      const seenImages = new Set<string>(image ? [image] : []);
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      let imgMatch: RegExpExecArray | null;
      while (
        (imgMatch = imgRegex.exec(html)) !== null &&
        additionalImages.length < 5
      ) {
        try {
          const src = new URL(imgMatch[1], url).href;
          if (
            !seenImages.has(src) &&
            !src.endsWith('.svg') &&
            !/logo|icon|pixel/i.test(src)
          ) {
            additionalImages.push(src);
            seenImages.add(src);
          }
        } catch {
          /* ignore */
        }
      }

      const rawText = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 8000);

      return { title, description, image, additionalImages, siteName, rawText };
    } catch {
      return null;
    }
  }

  async parseSearchQuery(query: string) {
    if (!this.apiKey) return { searchTerm: query };

    const schema = {
      type: 'OBJECT',
      properties: {
        cardTypes: { type: 'ARRAY', items: { type: 'STRING', enum: CARD_TYPES } },
        intents: { type: 'ARRAY', items: { type: 'STRING', enum: INTENTS } },
        tags: { type: 'ARRAY', items: { type: 'STRING' } },
        searchTerm: { type: 'STRING' },
        dateRange: {
          type: 'OBJECT',
          properties: { start: { type: 'STRING' }, end: { type: 'STRING' } },
        },
        priceRange: {
          type: 'OBJECT',
          properties: { min: { type: 'NUMBER' }, max: { type: 'NUMBER' } },
        },
        rating: { type: 'OBJECT', properties: { min: { type: 'NUMBER' } } },
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.gemini(
      `Parse this search query into structured filters for a link-saving app. Today's date: ${new Date().toISOString().split('T')[0]}. Query: "${query}"`,
      schema,
    );
  }

  private buildSchema() {
    return {
      type: 'OBJECT',
      properties: {
        description: { type: 'STRING' },
        cardType: { type: 'STRING', enum: CARD_TYPES },
        intent: { type: 'STRING', enum: INTENTS },
        tags: { type: 'ARRAY', items: { type: 'STRING' } },
        source: { type: 'STRING' },
        shoppingDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            price: { type: 'STRING' }, rating: { type: 'NUMBER' },
            reviewsCount: { type: 'NUMBER' }, topPositiveReview: { type: 'STRING' },
            topNegativeReview: { type: 'STRING' },
          },
        },
        recipeDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            ingredients: { type: 'ARRAY', items: { type: 'STRING' } },
            instructions: { type: 'ARRAY', items: { type: 'STRING' } },
            prepTime: { type: 'STRING' }, cookTime: { type: 'STRING' },
            totalTime: { type: 'STRING' }, servings: { type: 'STRING' },
            difficulty: { type: 'STRING' }, calories: { type: 'STRING' },
          },
        },
        readLaterDetails: {
          type: 'OBJECT', nullable: true,
          properties: { author: { type: 'STRING' }, readTime: { type: 'STRING' }, subject: { type: 'STRING' } },
        },
        travelDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            address: { type: 'STRING' }, googleMapsUrl: { type: 'STRING' },
            category: { type: 'STRING' }, rating: { type: 'NUMBER' },
            phoneNumber: { type: 'STRING' }, ticketPrice: { type: 'STRING' },
            openingHours: { type: 'ARRAY', items: { type: 'STRING' } },
          },
        },
        restaurantDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            address: { type: 'STRING' }, googleMapsUrl: { type: 'STRING' },
            category: { type: 'STRING' }, rating: { type: 'NUMBER' },
            phoneNumber: { type: 'STRING' }, reservationLink: { type: 'STRING' },
            priceLevel: { type: 'STRING' },
            cuisine: { type: 'ARRAY', items: { type: 'STRING' } },
            openingHours: { type: 'ARRAY', items: { type: 'STRING' } },
          },
        },
        healthFitnessDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            activityType: { type: 'STRING' }, duration: { type: 'STRING' },
            difficulty: { type: 'STRING' }, caloriesBurned: { type: 'STRING' },
            equipmentNeeded: { type: 'ARRAY', items: { type: 'STRING' } },
          },
        },
        educationDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            topic: { type: 'STRING' }, level: { type: 'STRING' },
            provider: { type: 'STRING' }, duration: { type: 'STRING' },
            certification: { type: 'BOOLEAN' },
          },
        },
        diyCraftsDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            projectType: { type: 'STRING' },
            materials: { type: 'ARRAY', items: { type: 'STRING' } },
            estimatedTime: { type: 'STRING' }, difficulty: { type: 'STRING' },
          },
        },
        parentingDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            activityType: { type: 'STRING' }, ageGroup: { type: 'STRING' },
            itemsNeeded: { type: 'ARRAY', items: { type: 'STRING' } },
          },
        },
        financeDetails: {
          type: 'OBJECT', nullable: true,
          properties: {
            category: { type: 'STRING' }, promoCode: { type: 'STRING' },
            expiryDate: { type: 'STRING' }, savings: { type: 'STRING' },
          },
        },
      },
      required: ['description', 'cardType', 'intent', 'tags', 'source'],
    };
  }
}
