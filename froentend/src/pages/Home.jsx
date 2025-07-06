import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, 
    Grid, 
    List, 
    BookOpen,
    TrendingUp,
    Star,
    Sparkles,
    User,
    LogOut
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import AIModal from '../components/AIModal';
import StatsCard from '../components/StatsCard';
import SearchBar from '../components/SearchBar';

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
    const [modalMode, setModalMode] = useState('create'); // create, edit, view

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

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                note.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
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
                alert('Failed to delete note');
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading your notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="w-8 h-8 text-purple-400" />
                                <h1 className="text-2xl font-bold text-white">AI Notes</h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-white">
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">{user?.username}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Notes"
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
                        title="Favorites"
                        value={stats.favoriteNotes || 0}
                        icon={Star}
                        color="yellow"
                    />
                    <StatsCard
                        title="This Week"
                        value={stats.weeklyNotes || 0}
                        icon={TrendingUp}
                        color="green"
                    />
                </div>

                {/* Controls */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Search and Filter */}
                        <div className="flex-1">
                            <SearchBar
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                filterCategory={filterCategory}
                                onFilterChange={setFilterCategory}
                                notes={notes}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4">
                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-white/10 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'grid' 
                                            ? 'bg-purple-600 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-purple-600 text-white' 
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Create Buttons */}
                            <button
                                onClick={() => setShowAIModal(true)}
                                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <Sparkles className="w-5 h-5" />
                                <span>AI Note</span>
                            </button>
                            
                            <button
                                onClick={handleCreateNote}
                                className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                <span>New Note</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes Grid/List */}
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-white mb-2">
                            {searchTerm || filterCategory !== 'all' ? 'No notes found' : 'No notes yet'}
                        </h3>
                        <p className="text-gray-400 mb-8">
                            {searchTerm || filterCategory !== 'all' 
                                ? 'Try adjusting your search or filter criteria'
                                : 'Create your first note to get started'
                            }
                        </p>
                        {!searchTerm && filterCategory === 'all' && (
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleCreateNote}
                                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Create Note</span>
                                </button>
                                <button
                                    onClick={() => setShowAIModal(true)}
                                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>Generate AI Note</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid' 
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4'
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
