const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateNote(prompt, noteType = 'general') {
        try {
            let enhancedPrompt;

            switch (noteType) {
                case 'summary':
                    enhancedPrompt = `Create a well-structured summary note about: ${prompt}. 
                    Include key points, important details, and organize it in a clear format with headings and bullet points.`;
                    break;
                
                case 'study':
                    enhancedPrompt = `Create comprehensive study notes about: ${prompt}. 
                    Include definitions, key concepts, examples, and organize it for easy learning and revision.`;
                    break;
                
                case 'meeting':
                    enhancedPrompt = `Create professional meeting notes about: ${prompt}. 
                    Include agenda items, key decisions, action items, and next steps in a structured format.`;
                    break;
                
                case 'creative':
                    enhancedPrompt = `Write creative and engaging notes about: ${prompt}. 
                    Make it interesting, add relevant examples, and present it in an engaging format.`;
                    break;
                
                default:
                    enhancedPrompt = `Create well-organized notes about: ${prompt}. 
                    Structure the content clearly with appropriate headings and bullet points.`;
            }

            const result = await this.model.generateContent(enhancedPrompt);
            const response = await result.response;
            const text = response.text();

            return {
                success: true,
                content: text,
                type: noteType
            };

        } catch (error) {
            console.error('Gemini API Error:', error);
            return {
                success: false,
                error: 'Failed to generate note content',
                details: error.message
            };
        }
    }

    async improveNote(existingContent, improvementType = 'enhance') {
        try {
            let prompt;

            switch (improvementType) {
                case 'enhance':
                    prompt = `Improve and enhance the following notes by adding more detail, better structure, and clarity: ${existingContent}`;
                    break;
                
                case 'summarize':
                    prompt = `Summarize the following notes into key points while maintaining important information: ${existingContent}`;
                    break;
                
                case 'expand':
                    prompt = `Expand the following notes with more detailed explanations, examples, and additional relevant information: ${existingContent}`;
                    break;
                
                case 'restructure':
                    prompt = `Restructure and reorganize the following notes for better readability and logical flow: ${existingContent}`;
                    break;
                
                default:
                    prompt = `Improve the following notes: ${existingContent}`;
            }

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                success: true,
                content: text,
                improvementType
            };

        } catch (error) {
            console.error('Gemini API Error:', error);
            return {
                success: false,
                error: 'Failed to improve note content',
                details: error.message
            };
        }
    }

    async generateTitle(content) {
        try {
            const prompt = `Generate a concise and descriptive title for the following note content (max 10 words): ${content.substring(0, 500)}`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const title = response.text().trim();

            return {
                success: true,
                title: title.replace(/['"]/g, '') // Remove quotes if any
            };

        } catch (error) {
            console.error('Gemini API Error:', error);
            return {
                success: false,
                error: 'Failed to generate title',
                title: 'Untitled Note'
            };
        }
    }
}

module.exports = new GeminiService();
