import { CardsService } from './cards.service';
import { Card } from './schemas/card.schema';
interface AuthRequest {
    user: {
        _id: {
            toString(): string;
        };
    };
}
export declare class CardsController {
    private cardsService;
    constructor(cardsService: CardsService);
    getAll(req: AuthRequest): Promise<{
        id: string;
        _id: undefined;
        userId: undefined;
        __v: undefined;
        url: string;
        cardType: import("./schemas/card.schema").CardType;
        intent: import("./schemas/card.schema").Intent;
        title: string;
        description: string;
        imageUrl: string;
        additionalImages: string[];
        source: string;
        tags: string[];
        date: string;
        userNote: string;
        isFavorite: boolean;
        shoppingDetails?: {
            price: string;
            rating?: number;
            reviewsCount?: number;
            topPositiveReview?: string;
            topNegativeReview?: string;
        };
        recipeDetails?: {
            ingredients: string[];
            instructions: string[];
            prepTime?: string;
            cookTime?: string;
            totalTime?: string;
            servings?: string;
            difficulty?: string;
            calories?: string;
        };
        readLaterDetails?: {
            author?: string;
            readTime?: string;
            subject?: string;
        };
        travelDetails?: {
            address: string;
            googleMapsUrl?: string;
            category?: string;
            rating?: number;
            phoneNumber?: string;
            ticketPrice?: string;
            openingHours?: string[];
        };
        restaurantDetails?: {
            address: string;
            googleMapsUrl?: string;
            category?: string;
            rating?: number;
            phoneNumber?: string;
            reservationLink?: string;
            priceLevel?: string;
            cuisine?: string[];
            openingHours?: string[];
        };
        healthFitnessDetails?: {
            activityType?: string;
            duration?: string;
            difficulty?: string;
            caloriesBurned?: string;
            equipmentNeeded?: string[];
        };
        educationDetails?: {
            topic?: string;
            level?: string;
            provider?: string;
            duration?: string;
            certification?: boolean;
        };
        diyCraftsDetails?: {
            projectType?: string;
            materials?: string[];
            estimatedTime?: string;
            difficulty?: string;
        };
        parentingDetails?: {
            activityType?: string;
            ageGroup?: string;
            itemsNeeded?: string[];
        };
        financeDetails?: {
            category?: string;
            promoCode?: string;
            expiryDate?: string;
            savings?: string;
        };
    }[]>;
    create(req: AuthRequest, body: Omit<Card, 'userId'>): Promise<{
        id: string;
        _id: undefined;
        userId: undefined;
        __v: undefined;
        url: string;
        cardType: import("./schemas/card.schema").CardType;
        intent: import("./schemas/card.schema").Intent;
        title: string;
        description: string;
        imageUrl: string;
        additionalImages: string[];
        source: string;
        tags: string[];
        date: string;
        userNote: string;
        isFavorite: boolean;
        shoppingDetails?: {
            price: string;
            rating?: number;
            reviewsCount?: number;
            topPositiveReview?: string;
            topNegativeReview?: string;
        };
        recipeDetails?: {
            ingredients: string[];
            instructions: string[];
            prepTime?: string;
            cookTime?: string;
            totalTime?: string;
            servings?: string;
            difficulty?: string;
            calories?: string;
        };
        readLaterDetails?: {
            author?: string;
            readTime?: string;
            subject?: string;
        };
        travelDetails?: {
            address: string;
            googleMapsUrl?: string;
            category?: string;
            rating?: number;
            phoneNumber?: string;
            ticketPrice?: string;
            openingHours?: string[];
        };
        restaurantDetails?: {
            address: string;
            googleMapsUrl?: string;
            category?: string;
            rating?: number;
            phoneNumber?: string;
            reservationLink?: string;
            priceLevel?: string;
            cuisine?: string[];
            openingHours?: string[];
        };
        healthFitnessDetails?: {
            activityType?: string;
            duration?: string;
            difficulty?: string;
            caloriesBurned?: string;
            equipmentNeeded?: string[];
        };
        educationDetails?: {
            topic?: string;
            level?: string;
            provider?: string;
            duration?: string;
            certification?: boolean;
        };
        diyCraftsDetails?: {
            projectType?: string;
            materials?: string[];
            estimatedTime?: string;
            difficulty?: string;
        };
        parentingDetails?: {
            activityType?: string;
            ageGroup?: string;
            itemsNeeded?: string[];
        };
        financeDetails?: {
            category?: string;
            promoCode?: string;
            expiryDate?: string;
            savings?: string;
        };
    }>;
    update(req: AuthRequest, id: string, body: Partial<Card>): Promise<{
        id: string;
        _id: undefined;
        userId: undefined;
        __v: undefined;
        url: string;
        cardType: import("./schemas/card.schema").CardType;
        intent: import("./schemas/card.schema").Intent;
        title: string;
        description: string;
        imageUrl: string;
        additionalImages: string[];
        source: string;
        tags: string[];
        date: string;
        userNote: string;
        isFavorite: boolean;
        shoppingDetails?: {
            price: string;
            rating?: number;
            reviewsCount?: number;
            topPositiveReview?: string;
            topNegativeReview?: string;
        };
        recipeDetails?: {
            ingredients: string[];
            instructions: string[];
            prepTime?: string;
            cookTime?: string;
            totalTime?: string;
            servings?: string;
            difficulty?: string;
            calories?: string;
        };
        readLaterDetails?: {
            author?: string;
            readTime?: string;
            subject?: string;
        };
        travelDetails?: {
            address: string;
            googleMapsUrl?: string;
            category?: string;
            rating?: number;
            phoneNumber?: string;
            ticketPrice?: string;
            openingHours?: string[];
        };
        restaurantDetails?: {
            address: string;
            googleMapsUrl?: string;
            category?: string;
            rating?: number;
            phoneNumber?: string;
            reservationLink?: string;
            priceLevel?: string;
            cuisine?: string[];
            openingHours?: string[];
        };
        healthFitnessDetails?: {
            activityType?: string;
            duration?: string;
            difficulty?: string;
            caloriesBurned?: string;
            equipmentNeeded?: string[];
        };
        educationDetails?: {
            topic?: string;
            level?: string;
            provider?: string;
            duration?: string;
            certification?: boolean;
        };
        diyCraftsDetails?: {
            projectType?: string;
            materials?: string[];
            estimatedTime?: string;
            difficulty?: string;
        };
        parentingDetails?: {
            activityType?: string;
            ageGroup?: string;
            itemsNeeded?: string[];
        };
        financeDetails?: {
            category?: string;
            promoCode?: string;
            expiryDate?: string;
            savings?: string;
        };
    }>;
    delete(req: AuthRequest, id: string): Promise<void>;
}
export {};
