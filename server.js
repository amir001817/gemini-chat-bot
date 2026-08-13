import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { message, systemInstruction } = req.body;
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.6-flash",
            systemInstruction: systemInstruction || "تو یک دستیار هوشمند هستی."
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'خطا در پردازش درخواست در سرور' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
