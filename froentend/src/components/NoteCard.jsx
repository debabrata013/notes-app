import { useState } from 'react';
import { 
    Edit3, 
    Trash2, 
    Eye, 
    Star, 
    Sparkles, 
    Calendar,
    MoreVertical,
    Copy,
    Share
} from 'lucide-react';

export default function NoteCard({ note, viewMode, onView, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const truncateContent = (content, maxLength = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const getCategoryColor = (category) => {
        const colors = {
            general: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            work: 'bg-green-500/20 text-green-400 border-green-500/30',
            personal: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            study: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            meeting: 'bg-red-500/20 text-red-400 border-red-500/30',
            creative: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
        };
        return colors[category] || colors.general;
    };

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(note.content);
            // You could add a toast notification here
            console.log('Content copied to clipboard');
        } catch (error) {
            console.error('Failed to copy content:', error);
        }
        setShowMenu(false);
    };

    if (viewMode === 'list') {
        return (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <h3 
                                className="text-lg font-semibold text-white truncate cursor-pointer hover:text-purple-300 transition-colors"
                                onClick={onView}
                            >
                                {note.title}
                            </h3>
                            
                            {note.is_ai_generated && (
                                <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                                    <Sparkles className="w-3 h-3" />
                                    <span>AI</span>
                                </div>
                            )}
                            
                            {note.is_favorite && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            )}
                            
                            <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(note.category)}`}>
                                {note.category}
                            </span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {truncateContent(note.content)}
                        </p>
                        
                        <div className="flex items-center text-xs text-gray-400 space-x-4">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(note.created_at)}</span>
                            </div>
                            {note.updated_at !== note.created_at && (
                                <span>• Updated {formatDate(note.updated_at)}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                        <button
                            onClick={onView}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="View Note"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onEdit}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="Edit Note"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete Note"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                    {note.is_ai_generated && (
                        <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs border border-purple-500/30">
                            <Sparkles className="w-3 h-3" />
                            <span>AI</span>
                        </div>
                    )}
                    
                    {note.is_favorite && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    )}
                </div>
                
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-gray-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showMenu && (
                        <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[120px]">
                            <button
                                onClick={onView}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
                            >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                            </button>
                            <button
                                onClick={onEdit}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={handleCopyContent}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            >
                                <Copy className="w-4 h-4" />
                                <span>Copy</span>
                            </button>
                            <button
                                onClick={onDelete}
                                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-b-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <h3 
                className="text-lg font-semibold text-white mb-3 cursor-pointer hover:text-purple-300 transition-colors line-clamp-2"
                onClick={onView}
            >
                {note.title}
            </h3>
            
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {truncateContent(note.content)}
            </p>
            
            <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(note.category)}`}>
                    {note.category}
                </span>
                
                <div className="flex items-center text-xs text-gray-400 space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(note.created_at)}</span>
                </div>
            </div>
            
            {/* Click overlay for mobile */}
            <div 
                className="absolute inset-0 md:hidden"
                onClick={onView}
            />
        </div>
    );
}
