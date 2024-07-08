"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./db/database"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)('dev'));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    await (0, database_1.default)();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    app.use('/api/auth', authRoutes_1.default);
    // 404 route
    app.use((req, res) => {
        return res.status(404).json({ data: `Cannot ${req.method} route ${req.path}`, statusCode: 404, msg: "Failure" });
    });
};
startServer();
//# sourceMappingURL=app.js.map