import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from '@google/genai';

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
  private ai: GoogleGenAI | null = null;

  constructor(config: ConfigService) {
    const key = config.get<string>('GEMINI_API_KEY');
    if (key) this.ai = new GoogleGenAI({ apiKey: key });
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

    if (!this.ai) {
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

    const result = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        responseSchema: this.buildSchema() as any,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const p: Record<string, any> = JSON.parse(result.text || '{}');

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
    if (!this.ai) return { searchTerm: query };

    const str = { type: Type.STRING };
    const num = { type: Type.NUMBER };
    const strArr = {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    };

    const schema = {
      type: Type.OBJECT,
      properties: {
        cardTypes: {
          type: Type.ARRAY,
          items: { type: Type.STRING, enum: CARD_TYPES },
        },
        intents: {
          type: Type.ARRAY,
          items: { type: Type.STRING, enum: INTENTS },
        },
        tags: strArr,
        searchTerm: str,
        dateRange: {
          type: Type.OBJECT,
          properties: { start: str, end: str },
        },
        priceRange: {
          type: Type.OBJECT,
          properties: { min: num, max: num },
        },
        rating: { type: Type.OBJECT, properties: { min: num } },
      },
    };

    const result = await this.ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Parse this search query into structured filters for a link-saving app. Today's date: ${new Date().toISOString().split('T')[0]}. Query: "${query}"`,
      config: {
        responseMimeType: 'application/json',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        responseSchema: schema as any,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(result.text || '{}');
  }

  private buildSchema() {
    const str = { type: Type.STRING };
    const num = { type: Type.NUMBER };
    const bool = { type: Type.BOOLEAN };
    const strArr = {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    };

    return {
      type: Type.OBJECT,
      properties: {
        description: str,
        cardType: { type: Type.STRING, enum: CARD_TYPES },
        intent: { type: Type.STRING, enum: INTENTS },
        tags: strArr,
        source: str,
        shoppingDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            price: str,
            rating: num,
            reviewsCount: num,
            topPositiveReview: str,
            topNegativeReview: str,
          },
        },
        recipeDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            ingredients: strArr,
            instructions: strArr,
            prepTime: str,
            cookTime: str,
            totalTime: str,
            servings: str,
            difficulty: str,
            calories: str,
          },
        },
        readLaterDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: { author: str, readTime: str, subject: str },
        },
        travelDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            address: str,
            googleMapsUrl: str,
            category: str,
            rating: num,
            phoneNumber: str,
            ticketPrice: str,
            openingHours: strArr,
          },
        },
        restaurantDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            address: str,
            googleMapsUrl: str,
            category: str,
            rating: num,
            phoneNumber: str,
            reservationLink: str,
            priceLevel: str,
            cuisine: strArr,
            openingHours: strArr,
          },
        },
        healthFitnessDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            activityType: str,
            duration: str,
            difficulty: str,
            caloriesBurned: str,
            equipmentNeeded: strArr,
          },
        },
        educationDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            topic: str,
            level: str,
            provider: str,
            duration: str,
            certification: bool,
          },
        },
        diyCraftsDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            projectType: str,
            materials: strArr,
            estimatedTime: str,
            difficulty: str,
          },
        },
        parentingDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: { activityType: str, ageGroup: str, itemsNeeded: strArr },
        },
        financeDetails: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            category: str,
            promoCode: str,
            expiryDate: str,
            savings: str,
          },
        },
      },
      required: ['description', 'cardType', 'intent', 'tags', 'source'],
    };
  }
}
