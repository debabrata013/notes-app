import { useState } from 'react';
import { 
    Edit3, 
    Trash2, 
    Eye, 
    Star, 
    Sparkles, 
    Calendar,
    MoreHorizontal
} from 'lucide-react';

export default function NoteCard({ note, viewMode, onView, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateContent = (content, maxLength = 120) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const getCategoryColor = (category) => {
        const colors = {
            general: 'bg-gray-100 text-gray-700',
            work: 'bg-blue-100 text-blue-700',
            personal: 'bg-green-100 text-green-700',
            study: 'bg-purple-100 text-purple-700',
            meeting: 'bg-orange-100 text-orange-700',
            creative: 'bg-pink-100 text-pink-700'
        };
        return colors[category] || colors.general;
    };

    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={onView}>
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-base font-medium text-gray-900 truncate">
                                {note.title}
                            </h3>
                            
                            {note.is_ai_generated && (
                                <div className="flex items-center space-x-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                                    <Sparkles className="w-3 h-3" />
                                    <span>AI</span>
                                </div>
                            )}
                            
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                                {note.category}
                            </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {truncateContent(note.content)}
                        </p>
                        
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(note.created_at)}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-4">
                        <button
                            onClick={onEdit}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    {note.is_ai_generated && (
                        <div className="flex items-center space-x-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                            <Sparkles className="w-3 h-3" />
                            <span>AI</span>
                        </div>
                    )}
                    
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                        {note.category}
                    </span>
                </div>
                
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {showMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px] py-1">
                                <button
                                    onClick={() => { onView(); setShowMenu(false); }}
                                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View</span>
                                </button>
                                <button
                                    onClick={() => { onEdit(); setShowMenu(false); }}
                                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => { onDelete(); setShowMenu(false); }}
                                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            <div className="cursor-pointer" onClick={onView}>
                <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                    {note.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateContent(note.content)}
                </p>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(note.created_at)}</span>
                    </div>
                    
                    {note.is_favorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                </div>
            </div>
        </div>
    );
}
