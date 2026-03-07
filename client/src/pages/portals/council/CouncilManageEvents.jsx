import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEvent, MdAdd, MdEdit, MdDelete, MdClose, MdWarning } from "react-icons/md";
import axios from 'axios';
import { supabase } from '../../../lib/supabaseClient';

const EVENT_CATEGORIES = [
    { value: 'SPORTS', label: 'Sports' },
    { value: 'SOCIAL_AND_CULTURAL', label: 'Social and Cultural' },
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'HALL_AFFAIRS', label: 'Hall Affairs' },
];

const CouncilManageEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Action data state
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [secretPassword, setSecretPassword] = useState('');
    const [newEventData, setNewEventData] = useState({ name: '', category: 'SPORTS' });
    const [editEventData, setEditEventData] = useState({ name: '', category: '' });
    const [actionError, setActionError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Get auth token
    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    };

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const response = await axios.get(`${API_BASE_URL}/api/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            setActionError('');
            const token = await getToken();
            await axios.post(`${API_BASE_URL}/api/events`, newEventData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowCreateModal(false);
            setNewEventData({ name: '', category: 'SPORTS' });
            fetchEvents();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            setActionError('');
            const token = await getToken();
            await axios.put(`${API_BASE_URL}/api/events/${selectedEvent.id}`, {
                name: editEventData.name,
                category: editEventData.category,
                secretPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            setSecretPassword('');
            fetchEvents();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to update event (incorrect password?)');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            setActionError('');
            const token = await getToken();
            await axios.delete(`${API_BASE_URL}/api/events/${selectedEvent.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { secretPassword }
            });
            setShowDeleteModal(false);
            setSecretPassword('');
            fetchEvents();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to delete event (incorrect password?)');
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (e, event) => {
        e.stopPropagation();
        setSelectedEvent(event);
        setEditEventData({ name: event.name, category: event.category });
        setSecretPassword('');
        setActionError('');
        setShowEditModal(true);
    };

    const openDeleteModal = (e, event) => {
        e.stopPropagation();
        setSelectedEvent(event);
        setSecretPassword('');
        setActionError('');
        setShowDeleteModal(true);
    };

    const groupedEvents = events.reduce((acc, event) => {
        if (!acc[event.category]) acc[event.category] = [];
        acc[event.category].push(event);
        return acc;
    }, {});

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display min-h-screen flex flex-col pt-10 pb-20">
            {/* Header Section */}
            <section className="relative w-full">
                <div className="flex flex-col w-full">
                    <div className="w-full">
                        <div className="flex flex-col w-full">
                            <div className="@container">
                                <div className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                                    <div 
                                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110" 
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")'
                                        }}
                                    ></div>
                                    <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                             <Link to="/portal" className="flex items-center gap-1 text-gold/80 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest">
                                                <MdArrowBack /> Back to Portal
                                             </Link>
                                        </div>
                                        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg flex items-center justify-center gap-4">
                                             MANAGE EVENTS
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Council Management | Patel Hall
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center relative z-20">
                <div className="max-w-[1200px] w-full">
                    
                    <div className="flex justify-between items-center mb-8 flex-wrap gap-4 bg-white p-6 rounded-xl shadow-md border-t-2 border-gold">
                        <div>
                            <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                                <MdEvent className="text-gold" /> Event Directory
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Manage all upcoming and past events for the hall.</p>
                        </div>
                        <button 
                            onClick={() => { setShowCreateModal(true); setActionError(''); }}
                            className="cursor-pointer px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm shadow-md"
                        >
                            <MdAdd size={20} /> Create New Event
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 flex justify-between items-center border border-red-200">
                            <span className="font-medium flex items-center gap-2"><MdWarning /> {error}</span>
                            <button onClick={fetchEvents} className="text-red-700 hover:underline">Retry</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-100 flex flex-col items-center">
                            <MdEvent size={64} className="text-gray-200 mb-4" />
                            <h4 className="text-xl font-bold text-gray-700 mb-2">No Events Found</h4>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">Create the first event to get started.</p>
                            <button 
                                onClick={() => { setShowCreateModal(true); setActionError(''); }}
                                className="cursor-pointer px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                Submit Your First Event
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {EVENT_CATEGORIES.map(category => (
                                groupedEvents[category.value] && groupedEvents[category.value].length > 0 && (
                                    <div key={category.value} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                                        <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b border-gray-100 pb-4">
                                            {category.label}
                                            <span className="ml-3 bg-primary/10 text-primary text-sm py-1 px-3 rounded-full font-bold">
                                                {groupedEvents[category.value].length}
                                            </span>
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {groupedEvents[category.value].map(event => (
                                                <div 
                                                    key={event.id}
                                                    onClick={() => navigate(`/portal/council/manage-events/${event.id}`)}
                                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all cursor-pointer group flex flex-col focus-within:ring-2 focus-within:ring-gold relative"
                                                >
                                                    <div className="h-32 bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center p-4 overflow-hidden relative">
                                                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                                                        <MdEvent className="text-white/20 w-24 h-24 transform group-hover:scale-110 transition-transform duration-500" />
                                                        <div className="absolute bottom-3 left-4">
                                                            <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-2 py-1 rounded shadow-sm hidden">
                                                                {category.label}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-5 flex flex-col flex-grow bg-white relative">
                                                        {/* EDIT / DELETE buttons are hidden based on user feedback */}
                                                        {/*
                                                        <div className="absolute top-2 right-2 flex gap-1 z-10 bg-white/80 backdrop-blur-sm rounded-lg p-1">
                                                            <button 
                                                                onClick={(e) => openEditModal(e, event)}
                                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                title="Edit Event"
                                                            >
                                                                <MdEdit size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => openDeleteModal(e, event)}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                title="Delete Event"
                                                            >
                                                                <MdDelete size={16} />
                                                            </button>
                                                        </div>
                                                        */}

                                                        <h5 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-gold transition-colors break-words line-clamp-2 leading-snug">
                                                            {event.name}
                                                        </h5>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-auto">
                                                            Added on {new Date(event.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 fade-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                                <MdAdd className="text-gold"/> Create New Event
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-200">
                                <MdClose size={24}/>
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateSubmit} className="flex flex-col p-6 overflow-y-auto">
                            {actionError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200 flex items-center gap-2">
                                    <MdWarning className="flex-shrink-0" />
                                    <span>{actionError}</span>
                                </div>
                            )}
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Name *</label>
                                    <input 
                                        type="text"
                                        required
                                        value={newEventData.name}
                                        onChange={(e) => setNewEventData({...newEventData, name: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all"
                                        placeholder="e.g. Inter-Hall Cricket"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                    <select
                                        required
                                        value={newEventData.category}
                                        onChange={(e) => setNewEventData({...newEventData, category: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all bg-white"
                                    >
                                        {EVENT_CATEGORIES.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={actionLoading}
                                    className="cursor-pointer px-5 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="cursor-pointer px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-gold transition-colors disabled:opacity-50 shadow-md shadow-primary/20 flex items-center gap-2"
                                >
                                    {actionLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    {actionLoading ? 'Creating...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal (Hidden per user request, but code intact for future) */}
            {/*
            {showEditModal && selectedEvent && (
                ... (Edit Modal logic)
            )}
            */}

            {/* Delete Modal (Hidden) */}
            {/*
            {showDeleteModal && selectedEvent && (
                ... (Delete Modal Logic)
            )}
            */}
        </div>
    );
};

export default CouncilManageEvents;
