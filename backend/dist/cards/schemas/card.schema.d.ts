import { HydratedDocument, Types } from 'mongoose';
export type CardDocument = HydratedDocument<Card>;
export declare enum CardType {
    SHOPPING = "SHOPPING",
    RECIPE = "RECIPE",
    READ_LATER = "READ_LATER",
    VIDEO = "VIDEO",
    TRAVEL = "TRAVEL",
    RESTAURANT = "RESTAURANT",
    HEALTH_FITNESS = "HEALTH_FITNESS",
    EDUCATION = "EDUCATION",
    DIY_CRAFTS = "DIY_CRAFTS",
    PARENTING = "PARENTING",
    FINANCE = "FINANCE",
    OTHER = "OTHER"
}
export declare enum Intent {
    TO_BUY = "TO_BUY",
    TO_READ = "TO_READ",
    TO_WATCH = "TO_WATCH",
    TO_VISIT = "TO_VISIT",
    TO_COOK = "TO_COOK",
    TO_EAT = "TO_EAT",
    TO_LEARN = "TO_LEARN",
    TO_DO = "TO_DO",
    INSPIRATION = "INSPIRATION",
    REFERENCE = "REFERENCE"
}
declare class ShoppingDetails {
    price: string;
    rating?: number;
    reviewsCount?: number;
    topPositiveReview?: string;
    topNegativeReview?: string;
}
declare class RecipeDetails {
    ingredients: string[];
    instructions: string[];
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    servings?: string;
    difficulty?: string;
    calories?: string;
}
declare class ReadLaterDetails {
    author?: string;
    readTime?: string;
    subject?: string;
}
declare class TravelDetails {
    address: string;
    googleMapsUrl?: string;
    category?: string;
    rating?: number;
    phoneNumber?: string;
    ticketPrice?: string;
    openingHours?: string[];
}
declare class RestaurantDetails {
    address: string;
    googleMapsUrl?: string;
    category?: string;
    rating?: number;
    phoneNumber?: string;
    reservationLink?: string;
    priceLevel?: string;
    cuisine?: string[];
    openingHours?: string[];
}
declare class HealthFitnessDetails {
    activityType?: string;
    duration?: string;
    difficulty?: string;
    caloriesBurned?: string;
    equipmentNeeded?: string[];
}
declare class EducationDetails {
    topic?: string;
    level?: string;
    provider?: string;
    duration?: string;
    certification?: boolean;
}
declare class DiyCraftsDetails {
    projectType?: string;
    materials?: string[];
    estimatedTime?: string;
    difficulty?: string;
}
declare class ParentingDetails {
    activityType?: string;
    ageGroup?: string;
    itemsNeeded?: string[];
}
declare class FinanceDetails {
    category?: string;
    promoCode?: string;
    expiryDate?: string;
    savings?: string;
}
export declare class Card {
    userId: Types.ObjectId;
    url: string;
    cardType: CardType;
    intent: Intent;
    title: string;
    description: string;
    imageUrl: string;
    additionalImages: string[];
    source: string;
    tags: string[];
    date: string;
    userNote: string;
    isFavorite: boolean;
    shoppingDetails?: ShoppingDetails;
    recipeDetails?: RecipeDetails;
    readLaterDetails?: ReadLaterDetails;
    travelDetails?: TravelDetails;
    restaurantDetails?: RestaurantDetails;
    healthFitnessDetails?: HealthFitnessDetails;
    educationDetails?: EducationDetails;
    diyCraftsDetails?: DiyCraftsDetails;
    parentingDetails?: ParentingDetails;
    financeDetails?: FinanceDetails;
}
export declare const CardSchema: import("mongoose").Schema<Card, import("mongoose").Model<Card, any, any, any, any, any, Card>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Card, import("mongoose").Document<unknown, {}, Card, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cardType?: import("mongoose").SchemaDefinitionProperty<CardType, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    intent?: import("mongoose").SchemaDefinitionProperty<Intent, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    imageUrl?: import("mongoose").SchemaDefinitionProperty<string, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    additionalImages?: import("mongoose").SchemaDefinitionProperty<string[], Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<string, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<string, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userNote?: import("mongoose").SchemaDefinitionProperty<string, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isFavorite?: import("mongoose").SchemaDefinitionProperty<boolean, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    shoppingDetails?: import("mongoose").SchemaDefinitionProperty<ShoppingDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recipeDetails?: import("mongoose").SchemaDefinitionProperty<RecipeDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readLaterDetails?: import("mongoose").SchemaDefinitionProperty<ReadLaterDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    travelDetails?: import("mongoose").SchemaDefinitionProperty<TravelDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    restaurantDetails?: import("mongoose").SchemaDefinitionProperty<RestaurantDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    healthFitnessDetails?: import("mongoose").SchemaDefinitionProperty<HealthFitnessDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    educationDetails?: import("mongoose").SchemaDefinitionProperty<EducationDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    diyCraftsDetails?: import("mongoose").SchemaDefinitionProperty<DiyCraftsDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    parentingDetails?: import("mongoose").SchemaDefinitionProperty<ParentingDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    financeDetails?: import("mongoose").SchemaDefinitionProperty<FinanceDetails | undefined, Card, import("mongoose").Document<unknown, {}, Card, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Card & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Card>;
export {};
