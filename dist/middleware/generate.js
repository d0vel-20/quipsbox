"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    let num = "";
    for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    }
    return num;
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=generate.js.map