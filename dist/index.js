"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("URL Shortener API is running...");
});
// Generate a short unique slug
const generateSlug = () => crypto_1.default.randomBytes(3).toString("hex");
// Shorten URL Endpoint
app.post("/shorten", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { longUrl } = req.body;
    if (!longUrl) {
        return res.status(400).json({ error: "URL is required" });
    }
    const shortUrl = generateSlug();
    try {
        const newUrl = yield prisma.uRL.create({
            data: { longUrl, shortUrl },
        });
        res.json({ shortUrl: newUrl.shortUrl });
    }
    catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
