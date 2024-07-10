"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newBits = exports.generateOtp = void 0;
const generateOtp = () => {
    let num = "";
    for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    }
    return num;
};
exports.generateOtp = generateOtp;
const newBits = () => {
    let num = "";
    for (let i = 0; i < 10; i++) {
        num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    }
    return num;
};
exports.newBits = newBits;
//# sourceMappingURL=generate.js.map