"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const comparePasswords = async (plainPassword, hashedPassword) => {
    return bcryptjs_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePasswords = comparePasswords;
//# sourceMappingURL=passwordUtils.js.map