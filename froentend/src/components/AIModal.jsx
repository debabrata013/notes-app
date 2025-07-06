import { useState, useEffect } from 'react';
import { 
    X, 
    Sparkles, 
    Lightbulb, 
    BookOpen, 
    Briefcase, 
    GraduationCap,
    Users,
    Palette,
    Wand2
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function AIModal({ isOpen, onClose, onSave }) {
    const [prompt, setPrompt] = useState('');
    const [noteType, setNoteType] = useState('general');
    const [autoTitle, setAutoTitle] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noteTypes, setNoteTypes] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchNoteTypes();
        }
    }, [isOpen]);

    const fetchNoteTypes = async () => {
        try {
            const response = await axiosInstance.get('/ai-notes/types');
            setNoteTypes(response.data.noteTypes || []);
        } catch (error) {
            console.error('Error fetching note types:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate your note');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axiosInstance.post('/ai-notes/generate', {
                prompt: prompt.trim(),
                noteType,
                autoTitle
            });
            onSave();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to generate AI note');
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            general: Lightbulb,
            summary: BookOpen,
            study: GraduationCap,
            meeting: Users,
            creative: Palette
        };
        return icons[type] || Lightbulb;
    };

    const promptSuggestions = [
        "Write a summary of the key benefits of renewable energy",
        "Create study notes about photosynthesis process",
        "Draft meeting notes for a project kickoff meeting",
        "Explain the basics of machine learning for beginners",
        "Create a creative story about time travel",
        "Write a guide on healthy eating habits"
    ];

    const handleSuggestionClick = (suggestion) => {
        setPrompt(suggestion);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">AI Note Generator</h2>
                            <p className="text-sm text-gray-500">Let AI create intelligent notes for you</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Note Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Choose Note Type
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {noteTypes.map((type) => {
                                    const IconComponent = getTypeIcon(type.type);
                                    return (
                                        <button
                                            key={type.type}
                                            type="button"
                                            onClick={() => setNoteType(type.type)}
                                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                                                noteType === type.type
                                                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <IconComponent className="w-5 h-5" />
                                                <span className="font-medium">{type.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">{type.description}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Prompt Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What would you like me to write about?
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                placeholder="Describe what you want the AI to write about. Be as specific as possible for better results..."
                                required
                            />
                        </div>

                        {/* Prompt Suggestions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Or try these suggestions:
                            </label>
                            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                                {promptSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="text-left p-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="text-gray-900 font-medium">Auto-generate title</h4>
                                    <p className="text-sm text-gray-500">Let AI create a suitable title for your note</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAutoTitle(!autoTitle)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        autoTitle ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            autoTitle ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
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
                                disabled={loading || !prompt.trim()}
                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" />
                                        <span>Generate AI Note</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
