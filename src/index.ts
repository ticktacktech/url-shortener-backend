import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { Request, Response } from "express";


dotenv.config();

const app = express();
const prisma = new PrismaClient();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL Shortener API is running...");
});

// Generate a short unique slug
const generateSlug = () => crypto.randomBytes(3).toString("hex");

// Shorten URL Endpoint
app.post("/shorten", async (req: Request, res: Response): Promise<void> => {
    try {
      const { longUrl } = req.body;
  
      if (!longUrl) {
        res.status(400).json({ error: "URL is required" });
        return;
      }
  
      const shortUrl = generateSlug(); // Ensure generateSlug() is correctly defined
  
      const newUrl = await prisma.uRL.create({
        data: { longUrl, shortUrl },
      });
  
      res.json({ shortUrl: newUrl.shortUrl });
    } catch (error) {
      console.error("Error shortening URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
app.get("/:shortUrl", async (req: Request<{ shortUrl: string }>, res: Response):  Promise<any> => {
    try {
      const { shortUrl } = req.params;
  
      const urlEntry = await prisma.uRL.findUnique({
        where: { shortUrl },
      });
  
      if (!urlEntry) {
        return res.status(404).json({ error: "Short URL not found" });
      }
  
      res.redirect(urlEntry.longUrl);
    } catch (error) {
      console.error("Error retrieving URL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
