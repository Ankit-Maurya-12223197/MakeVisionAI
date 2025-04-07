import express from 'express';
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const gemini = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


router.get("/", (req, res) => {
    res.send("Hello from Gemini from backend");
})

// Frontend send request on this url to generate image
router.post("/generate-image", async (req, res) => {

    try {
        const { prompt } = req.body;
        

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }


        const response = await gemini.models.generateContent({
            model: "gemini-2.0-flash-exp-image-generation",
            contents: prompt,
            config: {
                responseModalities: ["Text", "Image"],
            },
        });
        

        const parts = response.candidates[0].content.parts;
        const imagePart = parts.find(p => p.inlineData);

        if (imagePart) {
            const base64Image = imagePart.inlineData.data;
            const dataUrl = `data:image/png;base64,${base64Image}`;
            
            // Send this in response to frontend
            res.json({ imageUrl: dataUrl });
        } else {
            res.status(500).json({ error: "Image not generated." });
        }

    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Backend Error" });
    }
});

export default router;