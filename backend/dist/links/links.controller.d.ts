import { LinksService } from './links.service';
export declare class LinksController {
    private linksService;
    constructor(linksService: LinksService);
    process(url: string): Promise<{
        url: string;
        cardType: string;
        intent: string;
        title: string;
        description: string;
        imageUrl: string;
        additionalImages: string[];
        source: string;
        tags: string[];
        shoppingDetails?: undefined;
        recipeDetails?: undefined;
        readLaterDetails?: undefined;
        travelDetails?: undefined;
        restaurantDetails?: undefined;
        healthFitnessDetails?: undefined;
        educationDetails?: undefined;
        diyCraftsDetails?: undefined;
        parentingDetails?: undefined;
        financeDetails?: undefined;
    } | {
        url: string;
        cardType: string;
        intent: string;
        title: string;
        description: string;
        imageUrl: string;
        additionalImages: string[];
        source: string;
        tags: string[];
        shoppingDetails: any;
        recipeDetails: any;
        readLaterDetails: any;
        travelDetails: any;
        restaurantDetails: any;
        healthFitnessDetails: any;
        educationDetails: any;
        diyCraftsDetails: any;
        parentingDetails: any;
        financeDetails: any;
    }>;
    parseSearch(query: string): Promise<any>;
}
