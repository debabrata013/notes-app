import { useState, useEffect } from 'react';
import { 
    X, 
    Save, 
    Edit3, 
    Eye, 
    Star, 
    Sparkles,
    Calendar,
    Tag,
    Copy,
    Download
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function NoteModal({ isOpen, onClose, note, mode, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'general'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title || '',
                content: note.content || '',
                category: note.category || 'general'
            });
        } else {
            setFormData({
                title: '',
                content: '',
                category: 'general'
            });
        }
        setError('');
    }, [note, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (mode === 'create') {
                await axiosInstance.post('/notes', formData);
            } else if (mode === 'edit') {
                await axiosInstance.put(`/notes/${note.id}`, formData);
            }
            onSave();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to save note');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(note.content);
        } catch (error) {
            console.error('Failed to copy content:', error);
        }
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([`${note.title}\n\n${note.content}`], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const categories = [
        { value: 'general', label: 'General' },
        { value: 'work', label: 'Work' },
        { value: 'personal', label: 'Personal' },
        { value: 'study', label: 'Study' },
        { value: 'meeting', label: 'Meeting' },
        { value: 'creative', label: 'Creative' }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        {mode === 'view' && <Eye className="w-5 h-5 text-blue-600" />}
                        {mode === 'edit' && <Edit3 className="w-5 h-5 text-green-600" />}
                        {mode === 'create' && <Edit3 className="w-5 h-5 text-blue-600" />}
                        
                        <h2 className="text-lg font-semibold text-gray-900">
                            {mode === 'view' && 'View Note'}
                            {mode === 'edit' && 'Edit Note'}
                            {mode === 'create' && 'Create New Note'}
                        </h2>
                        
                        {note?.is_ai_generated && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                <Sparkles className="w-4 h-4" />
                                <span>AI Generated</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        {mode === 'view' && (
                            <>
                                <button
                                    onClick={handleCopyContent}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Copy Content"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Download Note"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {mode === 'view' ? (
                        <div className="space-y-6">
                            {/* Note Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <div>
                                        <p className="font-medium">Created</p>
                                        <p>{formatDate(note.created_at)}</p>
                                    </div>
                                </div>
                                
                                {note.updated_at !== note.created_at && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <div>
                                            <p className="font-medium">Updated</p>
                                            <p>{formatDate(note.updated_at)}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Tag className="w-4 h-4" />
                                    <div>
                                        <p className="font-medium">Category</p>
                                        <p className="capitalize">{note.category}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Note Title */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{note.title}</h1>
                            </div>
                            
                            {/* Note Content */}
                            <div className="prose max-w-none">
                                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {note.content}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                    {error}
                                </div>
                            )}
                            
                            {/* Title Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter note title..."
                                    required
                                />
                            </div>
                            
                            {/* Category Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                >
                                    {categories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Content Textarea */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={12}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Write your note content here..."
                                    required
                                />
                            </div>
                            
                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>{loading ? 'Saving...' : 'Save Note'}</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
