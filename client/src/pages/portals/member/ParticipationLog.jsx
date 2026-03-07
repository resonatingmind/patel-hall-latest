import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdCheckCircle, MdPending, MdHistory, MdAdd, MdClose, MdCloudUpload } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const formatStatus = (status) => {
    if (!status) return 'Pending';
    const lower = status.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const formatCategory = (category) => {
    if (!category) return '';
    const lower = category.toLowerCase();
    if (lower === 'technical' || lower === 'tech') return 'Technical';
    if (lower === 'cultural') return 'Cultural';
    if (lower === 'sports') return 'Sports';
    return category;
};

const EVENT_CATEGORIES = [
    { value: 'TECHNICAL', label: 'Technical' },
    { value: 'CULTURAL', label: 'Cultural' },
    { value: 'SPORTS', label: 'Sports' },
];

const getStatusStyle = (status) => {
    const normalized = status || 'PENDING';
    if (normalized === 'APPROVED') {
        return {
            classes: 'bg-green-100 text-green-700 border border-green-200',
            Icon: MdCheckCircle
        };
    }
    if (normalized === 'REJECTED') {
        return {
            classes: 'bg-red-100 text-red-700 border border-red-200',
            Icon: MdClose
        };
    }
    return {
        classes: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        Icon: MdPending
    };
};

const ParticipationLog = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { user } = useAuth();
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        category: EVENT_CATEGORIES[0].value,
        eventId: '',
        role: '',
        year: '2024-25',
        proof: null
    });
    const getAcademicSessions = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        // If we are before July, the 'current' academic year started last year
        const startYear = now.getMonth() < 6 ? currentYear - 1 : currentYear;

        const sessions = [];
        for (let i = 0; i < 4; i++) {
            const year = startYear - i;
            const nextYearShort = (year + 1).toString().slice(-2);
            sessions.push(`${year}-${nextYearShort}`);
        }
        return sessions;
    };

    const sessions = getAcademicSessions();

    const [participationData, setParticipationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    };

    const fetchMyParticipations = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            if (!token) {
                toast.error("You must be logged in to view your participation log.");
                setIsLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE}/api/participation/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setParticipationData(response.data || []);
        } catch (error) {
            console.error("Failed to fetch participation log:", error);
            toast.error("Failed to load your participation log.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchMyParticipations();
    }, []);

    const fetchEventsForCategory = async (category) => {
        setIsLoadingEvents(true);
        try {
            const token = await getToken();
            if (!token) {
                toast.error("You must be logged in to load events.");
                setIsLoadingEvents(false);
                return;
            }

            const response = await axios.get(`${API_BASE}/api/events`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { category },
            });

            setEvents(response.data || []);
        } catch (error) {
            console.error("Failed to fetch events:", error);
            toast.error("Failed to load events for the selected category.");
        } finally {
            setIsLoadingEvents(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'category') {
            setFormData(prev => ({
                ...prev,
                category: value,
                eventId: '', // reset selected event when category changes
            }));
            fetchEventsForCategory(value);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, proof: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.eventId) {
            toast.error("Please select an event.");
            return;
        }

        if (!formData.role.trim()) {
            toast.error("Please enter your role/position.");
            return;
        }

        const submitParticipation = async () => {
            setIsSubmitting(true);
            let proofUrl = null;

            try {
                if (formData.proof) {
                    const file = formData.proof;

                    if (file.size > 5 * 1024 * 1024) {
                        toast.error("File size should be less than 5MB.");
                        setIsSubmitting(false);
                        return;
                    }

                    const fileExt = file.name.split('.').pop();
                    const fileName = `${user?.id || 'anonymous'}_${Date.now()}.${fileExt}`;
                    const filePath = `participations/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('Patelhall')
                        .upload(filePath, file, {
                            cacheControl: '3600',
                            upsert: false
                        });

                    if (uploadError) {
                        throw new Error(`File upload failed: ${uploadError.message}`);
                    }

                    const { data: publicUrlData } = supabase.storage
                        .from('Patelhall')
                        .getPublicUrl(filePath);

                    proofUrl = publicUrlData?.publicUrl || null;
                }

                const token = await getToken();
                if (!token) {
                    toast.error("You must be logged in to submit participation.");
                    setIsSubmitting(false);
                    return;
                }

                const payload = {
                    eventId: formData.eventId,
                    role: formData.role,
                    category: formData.category || null,
                    year: formData.year || null,
                    proof: proofUrl
                };

                const response = await axios.post(`${API_BASE}/api/participation`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                toast.success(response.data?.message || "Participation submitted successfully.");
                setIsModalOpen(false);
                setFormData({
                    category: EVENT_CATEGORIES[0].value,
                    eventId: '',
                    role: '',
                    year: sessions[0] || '2024-25',
                    proof: null
                });
                await fetchMyParticipations();
            } catch (error) {
                console.error("Failed to submit participation:", error);
                const message = error.response?.data?.message || error.message || "Failed to submit participation.";
                toast.error(message);
            } finally {
                setIsSubmitting(false);
            }
        };

        submitParticipation();
    };

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
            
            {/* Header Section */}
            <section className="relative w-full">
                <div className="flex flex-col w-full">
                    <div className="w-full">
                        <div className="flex flex-col w-full">
                            <div className="@container">
                                <div className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                                    
                                    {/* Background Layer */}
                                    <div 
                                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110" 
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")'
                                        }}
                                    ></div>

                                    {/* Content Layer */}
                                    <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                             <Link to="/portal" className="flex items-center gap-1 text-gold/80 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest">
                                                <MdArrowBack /> Back to Portal
                                             </Link>
                                        </div>
                                        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                                            PARTICIPATION LOG
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Your Contribution Journey | Patel Hall
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Log List Section */}
            <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center relative z-20 -mt-26">
                <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
                    <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                        <div>
                             <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                                <MdHistory className="text-gold" /> Activity History
                             </h3>
                             <p className="text-gray-500 text-sm mt-1">Track your verified hall activities and events.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-primary text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:bg-deep-maroon transition-all transform hover:scale-105"
                            >
                                <MdAdd size={18} /> Add New
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Activities:</span>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{participationData.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="min-h-[200px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : participationData.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <p>No participation records found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-primary/5 border-b border-primary/10">
                                            <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Academic Year</th>
                                            <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Event Name</th>
                                            <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Role</th>
                                            <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participationData.map((item, index) => {
                                            const { classes, Icon } = getStatusStyle(item.status);
                                            return (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                                    <td className="p-5">
                                                        <span className="font-mono text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{item.year}</span>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">
                                                            {item.event?.name || 'Unknown Event'}
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                                                            {formatCategory(item.event?.category || item.category)}
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <div className="font-medium text-gray-700">{item.role}</div>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${classes}`}>
                                                            <Icon size={14} />
                                                            {formatStatus(item.status)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </section>

             {/* Add Participation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-serif font-bold text-primary">Add Participation</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <MdClose size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Category</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 bg-white"
                                >
                                    {EVENT_CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Event</label>
                                <select
                                    name="eventId"
                                    value={formData.eventId}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 bg-white"
                                >
                                    <option value="">Select event</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.name}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingEvents && (
                                    <p className="text-xs text-gray-400 mt-1">Loading events...</p>
                                )}
                                {!isLoadingEvents && events.length === 0 && (
                                    <p className="text-xs text-gray-400 mt-1">No events available for this category.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Academic Year</label>
                                    <select 
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 bg-white"
                                    >{sessions.map((session) => (
                                        <option key={session} value={session}>
                                            {session}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Role / Position</label>
                                <input 
                                    type="text" 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Captain, Member, Volunteer"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700"
                                />
                            </div>

                            {false && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Proof of Participation</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gold hover:bg-gold/5 transition-all cursor-pointer relative group">
                                        <input 
                                            type="file" 
                                            name="proof"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <MdCloudUpload size={32} className="mb-2 text-gray-300 group-hover:text-gold transition-colors" />
                                        <p className="text-sm font-medium">{formData.proof ? formData.proof.name : "Click to upload file"}</p>
                                        <p className="text-xs text-gray-400 mt-1">Images or PDF (Max 5MB)</p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all uppercase text-sm tracking-wide"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-deep-maroon shadow-lg shadow-primary/20 transition-all uppercase text-sm tracking-wide"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipationLog;
