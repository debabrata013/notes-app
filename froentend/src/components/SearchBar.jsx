import { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Calendar, Tag, Sparkles } from 'lucide-react';

export default function SearchBar({ 
    searchTerm, 
    onSearchChange, 
    filterCategory, 
    onFilterChange,
    notes = [] 
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchTerm.length > 0) {
            generateSuggestions();
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchTerm, notes]);

    const generateSuggestions = () => {
        const searchLower = searchTerm.toLowerCase();
        const titleSuggestions = notes
            .filter(note => 
                note.title.toLowerCase().includes(searchLower) && 
                note.title.toLowerCase() !== searchLower
            )
            .map(note => ({ type: 'title', text: note.title, note }))
            .slice(0, 3);

        const contentSuggestions = notes
            .filter(note => 
                note.content.toLowerCase().includes(searchLower) && 
                !note.title.toLowerCase().includes(searchLower)
            )
            .map(note => ({ 
                type: 'content', 
                text: extractRelevantContent(note.content, searchLower),
                note 
            }))
            .slice(0, 2);

        const categorySuggestions = [...new Set(notes
            .filter(note => note.category.toLowerCase().includes(searchLower))
            .map(note => note.category))]
            .map(category => ({ type: 'category', text: category }))
            .slice(0, 2);

        setSuggestions([...titleSuggestions, ...contentSuggestions, ...categorySuggestions]);
        setShowSuggestions(true);
    };

    const extractRelevantContent = (content, searchTerm) => {
        const index = content.toLowerCase().indexOf(searchTerm);
        const start = Math.max(0, index - 30);
        const end = Math.min(content.length, index + searchTerm.length + 30);
        const excerpt = content.substring(start, end);
        return start > 0 ? '...' + excerpt : excerpt;
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.type === 'category') {
            onFilterChange(suggestion.text);
            onSearchChange('');
        } else {
            onSearchChange(suggestion.text);
        }
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        onSearchChange('');
        onFilterChange('all');
        setShowSuggestions(false);
    };

    const categories = [
        { value: 'all', label: 'All Notes', icon: null },
        { value: 'general', label: 'General', icon: Tag },
        { value: 'work', label: 'Work', icon: Tag },
        { value: 'personal', label: 'Personal', icon: Tag },
        { value: 'study', label: 'Study', icon: Tag },
        { value: 'meeting', label: 'Meeting', icon: Tag },
        { value: 'creative', label: 'Creative', icon: Tag },
        { value: 'ai', label: 'AI Generated', icon: Sparkles },
        { value: 'favorites', label: 'Favorites', icon: Tag }
    ];

    return (
        <div className="relative">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Search notes by title or content..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => searchTerm && setShowSuggestions(true)}
                        className="w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    {/* Search Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {suggestion.type === 'title' && <Tag className="w-4 h-4 text-blue-400" />}
                                            {suggestion.type === 'content' && <Search className="w-4 h-4 text-green-400" />}
                                            {suggestion.type === 'category' && <Filter className="w-4 h-4 text-purple-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">
                                                {suggestion.type === 'title' && 'Title: '}
                                                {suggestion.type === 'content' && 'Content: '}
                                                {suggestion.type === 'category' && 'Category: '}
                                                {suggestion.text}
                                            </p>
                                            {suggestion.note && (
                                                <p className="text-gray-400 text-xs mt-1">
                                                    {suggestion.type === 'content' ? suggestion.note.title : 
                                                     `in ${suggestion.note.category}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Category Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        value={filterCategory}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none min-w-[150px]"
                    >
                        {categories.map(category => (
                            <option key={category.value} value={category.value} className="bg-gray-800">
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Advanced Search Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`px-4 py-3 rounded-xl border transition-colors ${
                        showAdvanced 
                            ? 'bg-purple-600 border-purple-500 text-white' 
                            : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20'
                    }`}
                >
                    Advanced
                </button>
            </div>

            {/* Advanced Search Panel */}
            {showAdvanced && (
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                    <h4 className="text-white font-medium mb-3">Advanced Search Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Date Range</label>
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <span className="text-gray-400 self-center">to</span>
                                <input
                                    type="date"
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Search In</label>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm text-gray-300">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Title</span>
                                </label>
                                <label className="flex items-center space-x-2 text-sm text-gray-300">
                                    <input type="checkbox" defaultChecked className="rounded" />
                                    <span>Content</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close suggestions */}
            {showSuggestions && (
                <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
}
