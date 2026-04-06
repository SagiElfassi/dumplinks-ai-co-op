"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const genai_1 = require("@google/genai");
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
let LinksService = class LinksService {
    ai = null;
    constructor(config) {
        const key = config.get('GEMINI_API_KEY');
        if (key)
            this.ai = new genai_1.GoogleGenAI({ apiKey: key });
    }
    async processLink(url) {
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        }
        catch {
            throw new common_1.BadRequestException('Invalid URL');
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
                responseSchema: this.buildSchema(),
            },
        });
        const p = JSON.parse(result.text || '{}');
        return {
            url,
            cardType: p['cardType'] || 'OTHER',
            intent: p['intent'] || 'REFERENCE',
            title: metadata?.title || p['title'] || hostname,
            description: p['description'] || metadata?.description || '',
            imageUrl: metadata?.image || '',
            additionalImages: metadata?.additionalImages || [],
            source: p['source'] || metadata?.siteName || hostname,
            tags: p['tags'] || [],
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
    }
    async fetchMetadata(url) {
        try {
            const response = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DumplinksBot/1.0)' },
                signal: AbortSignal.timeout(8000),
            });
            if (!response.ok)
                return null;
            const html = await response.text();
            const getMeta = (patterns) => {
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
            const title = getMeta([
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
            let image = null;
            if (rawImage) {
                try {
                    image = new URL(rawImage, url).href;
                }
                catch {
                }
            }
            const additionalImages = [];
            const seenImages = new Set(image ? [image] : []);
            const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
            let imgMatch;
            while ((imgMatch = imgRegex.exec(html)) !== null &&
                additionalImages.length < 5) {
                try {
                    const src = new URL(imgMatch[1], url).href;
                    if (!seenImages.has(src) &&
                        !src.endsWith('.svg') &&
                        !/logo|icon|pixel/i.test(src)) {
                        additionalImages.push(src);
                        seenImages.add(src);
                    }
                }
                catch {
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
        }
        catch {
            return null;
        }
    }
    async parseSearchQuery(query) {
        if (!this.ai)
            return { searchTerm: query };
        const str = { type: genai_1.Type.STRING };
        const num = { type: genai_1.Type.NUMBER };
        const strArr = {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
        };
        const schema = {
            type: genai_1.Type.OBJECT,
            properties: {
                cardTypes: {
                    type: genai_1.Type.ARRAY,
                    items: { type: genai_1.Type.STRING, enum: CARD_TYPES },
                },
                intents: {
                    type: genai_1.Type.ARRAY,
                    items: { type: genai_1.Type.STRING, enum: INTENTS },
                },
                tags: strArr,
                searchTerm: str,
                dateRange: {
                    type: genai_1.Type.OBJECT,
                    properties: { start: str, end: str },
                },
                priceRange: {
                    type: genai_1.Type.OBJECT,
                    properties: { min: num, max: num },
                },
                rating: { type: genai_1.Type.OBJECT, properties: { min: num } },
            },
        };
        const result = await this.ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Parse this search query into structured filters for a link-saving app. Today's date: ${new Date().toISOString().split('T')[0]}. Query: "${query}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            },
        });
        return JSON.parse(result.text || '{}');
    }
    buildSchema() {
        const str = { type: genai_1.Type.STRING };
        const num = { type: genai_1.Type.NUMBER };
        const bool = { type: genai_1.Type.BOOLEAN };
        const strArr = {
            type: genai_1.Type.ARRAY,
            items: { type: genai_1.Type.STRING },
        };
        return {
            type: genai_1.Type.OBJECT,
            properties: {
                description: str,
                cardType: { type: genai_1.Type.STRING, enum: CARD_TYPES },
                intent: { type: genai_1.Type.STRING, enum: INTENTS },
                tags: strArr,
                source: str,
                shoppingDetails: {
                    type: genai_1.Type.OBJECT,
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
                    type: genai_1.Type.OBJECT,
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
                    type: genai_1.Type.OBJECT,
                    nullable: true,
                    properties: { author: str, readTime: str, subject: str },
                },
                travelDetails: {
                    type: genai_1.Type.OBJECT,
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
                    type: genai_1.Type.OBJECT,
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
                    type: genai_1.Type.OBJECT,
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
                    type: genai_1.Type.OBJECT,
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
                    type: genai_1.Type.OBJECT,
                    nullable: true,
                    properties: {
                        projectType: str,
                        materials: strArr,
                        estimatedTime: str,
                        difficulty: str,
                    },
                },
                parentingDetails: {
                    type: genai_1.Type.OBJECT,
                    nullable: true,
                    properties: { activityType: str, ageGroup: str, itemsNeeded: strArr },
                },
                financeDetails: {
                    type: genai_1.Type.OBJECT,
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
};
exports.LinksService = LinksService;
exports.LinksService = LinksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LinksService);
//# sourceMappingURL=links.service.js.map