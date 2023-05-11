require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        const additionalMessage = {
            role: 'system',
            content: 'You are a chatbot named ChatGPT created by Duy Long, your task is to answer all user questions about everything, if users need to find out more information, you will tell them to ask more at the channel. this chatbot.'
        };

        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [additionalMessage, ...messages],
        });
        res.json(completion.data.choices[0].message);
    } catch (error) {
        console.error('Error in /api/chat:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));