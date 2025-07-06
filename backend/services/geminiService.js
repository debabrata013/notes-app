const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found in environment variables');
            this.genAI = null;
            return;
        }
        
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Updated model name for current API version
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }

    async generateNote(prompt, noteType = 'general') {
        try {
            if (!this.genAI) {
                return {
                    success: false,
                    error: 'Gemini API not configured'
                };
            }

            const typePrompts = {
                general: `Create a well-organized note about: ${prompt}. Make it informative and easy to read.`,
                summary: `Create a structured summary with key points about: ${prompt}. Use bullet points and clear headings.`,
                study: `Create comprehensive study notes about: ${prompt}. Include definitions, examples, and key concepts.`,
                meeting: `Create professional meeting notes about: ${prompt}. Include agenda items, discussion points, and action items.`,
                creative: `Create an engaging and creative note about: ${prompt}. Make it interesting and visually appealing with good formatting.`
            };

            const fullPrompt = typePrompts[noteType] || typePrompts.general;
            
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            const content = response.text();

            return {
                success: true,
                content: content.trim()
            };

        } catch (error) {
            console.error('Gemini Generate Note Error:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate note'
            };
        }
    }

    async generateTitle(content) {
        try {
            if (!this.genAI) {
                return {
                    success: false,
                    error: 'Gemini API not configured'
                };
            }

            const prompt = `Generate a concise, descriptive title (maximum 60 characters) for this note content: ${content.substring(0, 500)}...`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const title = response.text().trim();

            // Remove quotes if present
            const cleanTitle = title.replace(/^["']|["']$/g, '');

            return {
                success: true,
                title: cleanTitle.substring(0, 60) // Ensure max length
            };

        } catch (error) {
            console.error('Gemini Generate Title Error:', error);
            return {
                success: false,
                error: error.message || 'Failed to generate title'
            };
        }
    }

    async improveNote(content, improvementType = 'enhance') {
        try {
            if (!this.genAI) {
                return {
                    success: false,
                    error: 'Gemini API not configured'
                };
            }

            const improvementPrompts = {
                enhance: `Improve and enhance this note content while keeping the original meaning. Make it more detailed, well-structured, and informative: ${content}`,
                summarize: `Create a concise summary of this note content, keeping only the most important points: ${content}`,
                expand: `Expand this note content with more details, examples, and explanations: ${content}`,
                restructure: `Restructure this note content with better organization, headings, and formatting: ${content}`
            };

            const prompt = improvementPrompts[improvementType] || improvementPrompts.enhance;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const improvedContent = response.text();

            return {
                success: true,
                content: improvedContent.trim()
            };

        } catch (error) {
            console.error('Gemini Improve Note Error:', error);
            return {
                success: false,
                error: error.message || 'Failed to improve note'
            };
        }
    }
}

module.exports = new GeminiService();
