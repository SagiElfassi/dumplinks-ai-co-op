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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const card_schema_1 = require("./schemas/card.schema");
let CardsService = class CardsService {
    cardModel;
    constructor(cardModel) {
        this.cardModel = cardModel;
    }
    toResponse(card) {
        const obj = card.toObject();
        return {
            ...obj,
            id: obj._id.toString(),
            _id: undefined,
            userId: undefined,
            __v: undefined,
        };
    }
    async findAll(userId) {
        const cards = await this.cardModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 });
        return cards.map((c) => this.toResponse(c));
    }
    async create(userId, data) {
        const card = await this.cardModel.create({
            ...data,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        return this.toResponse(card);
    }
    async update(userId, cardId, data) {
        const card = await this.cardModel.findById(cardId);
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        if (card.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        const updated = await this.cardModel.findByIdAndUpdate(cardId, data, {
            new: true,
        });
        return this.toResponse(updated);
    }
    async delete(userId, cardId) {
        const card = await this.cardModel.findById(cardId);
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        if (card.userId.toString() !== userId)
            throw new common_1.ForbiddenException();
        await this.cardModel.findByIdAndDelete(cardId);
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(card_schema_1.Card.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CardsService);
//# sourceMappingURL=cards.service.js.map