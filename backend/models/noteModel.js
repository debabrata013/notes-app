// Temporary in-memory notes list
let notes = [];

class Note {
    constructor(id, userId, title, content) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
    }
}

module.exports = { Note, notes };
