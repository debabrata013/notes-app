const db = require('../config/db');

class Note {
    constructor(id, userId, title, content, isAIGenerated = false, noteType = 'general') {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.isAIGenerated = isAIGenerated;
        this.noteType = noteType;
    }

    // Create new note
    static async create(noteData) {
        try {
            const { 
                userId, 
                title, 
                content, 
                isAIGenerated = false, 
                noteType = 'general',
                originalPrompt = null,
                improvementType = null
            } = noteData;

            const [result] = await db.execute(
                `INSERT INTO notes (user_id, title, content, is_ai_generated, note_type, original_prompt, improvement_type) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, title, content, isAIGenerated, noteType, originalPrompt, improvementType]
            );

            return {
                id: result.insertId,
                userId,
                title,
                content,
                isAIGenerated,
                noteType,
                originalPrompt,
                improvementType
            };
        } catch (error) {
            throw error;
        }
    }

    // Get all notes for a user
    static async findByUserId(userId) {
        try {
            const [rows] = await db.execute(
                `SELECT id, user_id as userId, title, content, is_ai_generated as isAIGenerated, 
                        note_type as noteType, original_prompt as originalPrompt, 
                        improvement_type as improvementType, created_at as createdAt, 
                        updated_at as updatedAt, last_improved as lastImproved,
                        title_generated as titleGenerated
                 FROM notes WHERE user_id = ? ORDER BY created_at DESC`,
                [userId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Find note by ID and user ID
    static async findByIdAndUserId(noteId, userId) {
        try {
            const [rows] = await db.execute(
                `SELECT id, user_id as userId, title, content, is_ai_generated as isAIGenerated, 
                        note_type as noteType, original_prompt as originalPrompt, 
                        improvement_type as improvementType, created_at as createdAt, 
                        updated_at as updatedAt, last_improved as lastImproved,
                        title_generated as titleGenerated
                 FROM notes WHERE id = ? AND user_id = ?`,
                [noteId, userId]
            );
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Update note
    static async update(noteId, userId, updateData) {
        try {
            const { title, content, improvementType } = updateData;
            
            let query = 'UPDATE notes SET ';
            let params = [];
            let updates = [];

            if (title !== undefined) {
                updates.push('title = ?');
                params.push(title);
            }
            if (content !== undefined) {
                updates.push('content = ?');
                params.push(content);
            }
            if (improvementType !== undefined) {
                updates.push('improvement_type = ?, last_improved = NOW()');
                params.push(improvementType);
            }

            updates.push('updated_at = NOW()');
            query += updates.join(', ') + ' WHERE id = ? AND user_id = ?';
            params.push(noteId, userId);

            const [result] = await db.execute(query, params);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Update note title
    static async updateTitle(noteId, userId, title) {
        try {
            const [result] = await db.execute(
                'UPDATE notes SET title = ?, title_generated = NOW(), updated_at = NOW() WHERE id = ? AND user_id = ?',
                [title, noteId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete note
    static async delete(noteId, userId) {
        try {
            const [result] = await db.execute(
                'DELETE FROM notes WHERE id = ? AND user_id = ?',
                [noteId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get note statistics for user
    static async getStats(userId) {
        try {
            const [rows] = await db.execute(
                `SELECT 
                    COUNT(*) as totalNotes,
                    COUNT(CASE WHEN is_ai_generated = true THEN 1 END) as aiNotes,
                    COUNT(CASE WHEN is_ai_generated = false THEN 1 END) as manualNotes,
                    COUNT(CASE WHEN note_type = 'study' THEN 1 END) as studyNotes,
                    COUNT(CASE WHEN note_type = 'meeting' THEN 1 END) as meetingNotes
                 FROM notes WHERE user_id = ?`,
                [userId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { Note };
