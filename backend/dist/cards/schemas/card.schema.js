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
exports.CardSchema = exports.Card = exports.Intent = exports.CardType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var CardType;
(function (CardType) {
    CardType["SHOPPING"] = "SHOPPING";
    CardType["RECIPE"] = "RECIPE";
    CardType["READ_LATER"] = "READ_LATER";
    CardType["VIDEO"] = "VIDEO";
    CardType["TRAVEL"] = "TRAVEL";
    CardType["RESTAURANT"] = "RESTAURANT";
    CardType["HEALTH_FITNESS"] = "HEALTH_FITNESS";
    CardType["EDUCATION"] = "EDUCATION";
    CardType["DIY_CRAFTS"] = "DIY_CRAFTS";
    CardType["PARENTING"] = "PARENTING";
    CardType["FINANCE"] = "FINANCE";
    CardType["OTHER"] = "OTHER";
})(CardType || (exports.CardType = CardType = {}));
var Intent;
(function (Intent) {
    Intent["TO_BUY"] = "TO_BUY";
    Intent["TO_READ"] = "TO_READ";
    Intent["TO_WATCH"] = "TO_WATCH";
    Intent["TO_VISIT"] = "TO_VISIT";
    Intent["TO_COOK"] = "TO_COOK";
    Intent["TO_EAT"] = "TO_EAT";
    Intent["TO_LEARN"] = "TO_LEARN";
    Intent["TO_DO"] = "TO_DO";
    Intent["INSPIRATION"] = "INSPIRATION";
    Intent["REFERENCE"] = "REFERENCE";
})(Intent || (exports.Intent = Intent = {}));
let ShoppingDetails = class ShoppingDetails {
    price;
    rating;
    reviewsCount;
    topPositiveReview;
    topNegativeReview;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ShoppingDetails.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ShoppingDetails.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ShoppingDetails.prototype, "reviewsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ShoppingDetails.prototype, "topPositiveReview", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ShoppingDetails.prototype, "topNegativeReview", void 0);
ShoppingDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ShoppingDetails);
let RecipeDetails = class RecipeDetails {
    ingredients;
    instructions;
    prepTime;
    cookTime;
    totalTime;
    servings;
    difficulty;
    calories;
};
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], RecipeDetails.prototype, "ingredients", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], RecipeDetails.prototype, "instructions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RecipeDetails.prototype, "prepTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RecipeDetails.prototype, "cookTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RecipeDetails.prototype, "totalTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RecipeDetails.prototype, "servings", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RecipeDetails.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RecipeDetails.prototype, "calories", void 0);
RecipeDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RecipeDetails);
let ReadLaterDetails = class ReadLaterDetails {
    author;
    readTime;
    subject;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReadLaterDetails.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReadLaterDetails.prototype, "readTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ReadLaterDetails.prototype, "subject", void 0);
ReadLaterDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ReadLaterDetails);
let TravelDetails = class TravelDetails {
    address;
    googleMapsUrl;
    category;
    rating;
    phoneNumber;
    ticketPrice;
    openingHours;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TravelDetails.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TravelDetails.prototype, "googleMapsUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TravelDetails.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], TravelDetails.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TravelDetails.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TravelDetails.prototype, "ticketPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], TravelDetails.prototype, "openingHours", void 0);
TravelDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TravelDetails);
let RestaurantDetails = class RestaurantDetails {
    address;
    googleMapsUrl;
    category;
    rating;
    phoneNumber;
    reservationLink;
    priceLevel;
    cuisine;
    openingHours;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RestaurantDetails.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RestaurantDetails.prototype, "googleMapsUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RestaurantDetails.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], RestaurantDetails.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RestaurantDetails.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RestaurantDetails.prototype, "reservationLink", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], RestaurantDetails.prototype, "priceLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], RestaurantDetails.prototype, "cuisine", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], RestaurantDetails.prototype, "openingHours", void 0);
RestaurantDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], RestaurantDetails);
let HealthFitnessDetails = class HealthFitnessDetails {
    activityType;
    duration;
    difficulty;
    caloriesBurned;
    equipmentNeeded;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthFitnessDetails.prototype, "activityType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthFitnessDetails.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthFitnessDetails.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HealthFitnessDetails.prototype, "caloriesBurned", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], HealthFitnessDetails.prototype, "equipmentNeeded", void 0);
HealthFitnessDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], HealthFitnessDetails);
let EducationDetails = class EducationDetails {
    topic;
    level;
    provider;
    duration;
    certification;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EducationDetails.prototype, "topic", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EducationDetails.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EducationDetails.prototype, "provider", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], EducationDetails.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], EducationDetails.prototype, "certification", void 0);
EducationDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], EducationDetails);
let DiyCraftsDetails = class DiyCraftsDetails {
    projectType;
    materials;
    estimatedTime;
    difficulty;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DiyCraftsDetails.prototype, "projectType", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], DiyCraftsDetails.prototype, "materials", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DiyCraftsDetails.prototype, "estimatedTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DiyCraftsDetails.prototype, "difficulty", void 0);
DiyCraftsDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], DiyCraftsDetails);
let ParentingDetails = class ParentingDetails {
    activityType;
    ageGroup;
    itemsNeeded;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ParentingDetails.prototype, "activityType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ParentingDetails.prototype, "ageGroup", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], ParentingDetails.prototype, "itemsNeeded", void 0);
ParentingDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ParentingDetails);
let FinanceDetails = class FinanceDetails {
    category;
    promoCode;
    expiryDate;
    savings;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FinanceDetails.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FinanceDetails.prototype, "promoCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FinanceDetails.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FinanceDetails.prototype, "savings", void 0);
FinanceDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FinanceDetails);
let Card = class Card {
    userId;
    url;
    cardType;
    intent;
    title;
    description;
    imageUrl;
    additionalImages;
    source;
    tags;
    date;
    userNote;
    isFavorite;
    shoppingDetails;
    recipeDetails;
    readLaterDetails;
    travelDetails;
    restaurantDetails;
    healthFitnessDetails;
    educationDetails;
    diyCraftsDetails;
    parentingDetails;
    financeDetails;
};
exports.Card = Card;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Card.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "url", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: CardType }),
    __metadata("design:type", String)
], Card.prototype, "cardType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: Intent }),
    __metadata("design:type", String)
], Card.prototype, "intent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Card.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Card.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Card.prototype, "additionalImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Card.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Card.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Card.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Card.prototype, "userNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Card.prototype, "isFavorite", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", ShoppingDetails)
], Card.prototype, "shoppingDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", RecipeDetails)
], Card.prototype, "recipeDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", ReadLaterDetails)
], Card.prototype, "readLaterDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", TravelDetails)
], Card.prototype, "travelDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", RestaurantDetails)
], Card.prototype, "restaurantDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", HealthFitnessDetails)
], Card.prototype, "healthFitnessDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", EducationDetails)
], Card.prototype, "educationDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", DiyCraftsDetails)
], Card.prototype, "diyCraftsDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", ParentingDetails)
], Card.prototype, "parentingDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", FinanceDetails)
], Card.prototype, "financeDetails", void 0);
exports.Card = Card = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Card);
exports.CardSchema = mongoose_1.SchemaFactory.createForClass(Card);
//# sourceMappingURL=card.schema.js.map