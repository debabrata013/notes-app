import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, 
    Search,
    Grid3X3,
    List,
    BookOpen,
    Sparkles,
    User,
    LogOut,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import AIModal from '../components/AIModal';
import StatsCard from '../components/StatsCard';

export default function Home() {
    const { user, logout } = useAuth();
    const [notes, setNotes] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [modalMode, setModalMode] = useState('create');

    useEffect(() => {
        fetchNotes();
        fetchStats();
    }, []);

    useEffect(() => {
        filterNotes();
    }, [notes, searchTerm, filterCategory]);

    const fetchNotes = async () => {
        try {
            const response = await axiosInstance.get('/notes');
            setNotes(response.data.notes || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/notes/stats');
            setStats(response.data.stats || {});
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const filterNotes = () => {
        let filtered = notes;

        if (searchTerm) {
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== 'all') {
            if (filterCategory === 'ai') {
                filtered = filtered.filter(note => note.is_ai_generated);
            } else if (filterCategory === 'favorites') {
                filtered = filtered.filter(note => note.is_favorite);
            } else {
                filtered = filtered.filter(note => note.category === filterCategory);
            }
        }

        setFilteredNotes(filtered);
    };

    const handleCreateNote = () => {
        setSelectedNote(null);
        setModalMode('create');
        setShowNoteModal(true);
    };

    const handleEditNote = (note) => {
        setSelectedNote(note);
        setModalMode('edit');
        setShowNoteModal(true);
    };

    const handleViewNote = (note) => {
        setSelectedNote(note);
        setModalMode('view');
        setShowNoteModal(true);
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await axiosInstance.delete(`/notes/${noteId}`);
                fetchNotes();
                fetchStats();
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
    };

    const handleNoteSaved = () => {
        fetchNotes();
        fetchStats();
        setShowNoteModal(false);
    };

    const handleAINoteSaved = () => {
        fetchNotes();
        fetchStats();
        setShowAIModal(false);
    };

    const categories = [
        { value: 'all', label: 'All' },
        { value: 'general', label: 'General' },
        { value: 'work', label: 'Work' },
        { value: 'personal', label: 'Personal' },
        { value: 'study', label: 'Study' },
        { value: 'ai', label: 'AI Generated' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-semibold text-gray-900">Notes</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-2 text-gray-700">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">{user?.username}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        title="Total"
                        value={stats.totalNotes || 0}
                        icon={BookOpen}
                        color="blue"
                    />
                    <StatsCard
                        title="AI Generated"
                        value={stats.aiNotes || 0}
                        icon={Sparkles}
                        color="purple"
                    />
                    <StatsCard
                        title="This Week"
                        value={stats.weeklyNotes || 0}
                        icon={BookOpen}
                        color="green"
                    />
                    <StatsCard
                        title="Favorites"
                        value={stats.favoriteNotes || 0}
                        icon={BookOpen}
                        color="yellow"
                    />
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filters and Actions */}
                        <div className="flex items-center space-x-3">
                            {/* Category Filter */}
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                {categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>

                            {/* View Toggle */}
                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-md transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-md transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <button
                                onClick={() => setShowAIModal(true)}
                                className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>AI Note</span>
                            </button>
                            
                            <button
                                onClick={handleCreateNote}
                                className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                <span>New Note</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm || filterCategory !== 'all' ? 'No notes found' : 'No notes yet'}
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            {searchTerm || filterCategory !== 'all' 
                                ? 'Try adjusting your search or filter criteria'
                                : 'Create your first note to get started with organizing your thoughts'
                            }
                        </p>
                        {!searchTerm && filterCategory === 'all' && (
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={handleCreateNote}
                                    className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Note</span>
                                </button>
                                <button
                                    onClick={() => setShowAIModal(true)}
                                    className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Generate with AI</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid' 
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                            : 'space-y-3'
                    }>
                        {filteredNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                viewMode={viewMode}
                                onView={() => handleViewNote(note)}
                                onEdit={() => handleEditNote(note)}
                                onDelete={() => handleDeleteNote(note.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showNoteModal && (
                <NoteModal
                    isOpen={showNoteModal}
                    onClose={() => setShowNoteModal(false)}
                    note={selectedNote}
                    mode={modalMode}
                    onSave={handleNoteSaved}
                />
            )}

            {showAIModal && (
                <AIModal
                    isOpen={showAIModal}
                    onClose={() => setShowAIModal(false)}
                    onSave={handleAINoteSaved}
                />
            )}
        </div>
    );
}
