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
    if (lower === 'technology') return 'Technology';
    if (lower === 'social_and_cultural') return 'Social and Cultural';
    if (lower === 'sports') return 'Sports';
    if (lower === 'hall_affairs') return 'Hall Affairs';
    return category;
};

const EVENT_CATEGORIES = [
    { value: 'TECHNOLOGY', label: 'Technology' },
    { value: 'SOCIAL_AND_CULTURAL', label: 'Social and Cultural' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'HALL_AFFAIRS', label: 'Hall Affairs' },
];

const ROLES = [
    { value: 'MEMBER', label: 'Member' },
    { value: 'CAPTAIN', label: 'Captain' },
    { value: 'VICE_CAPTAIN', label: 'Vice Captain' },
    { value: 'COORDINATOR', label: 'Coordinator' },
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
    const getYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 4; i++) {
            years.push(currentYear - i);
        }
        return years;
    };

    const sessionYears = getYears();

    const [formData, setFormData] = useState({
        category: EVENT_CATEGORIES[0].value,
        eventId: '',
        role: ROLES[0].value,
        year: sessionYears[0],
        proof: null
    });

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
                    year: formData.year ? parseInt(formData.year, 10) : null,
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
                    role: ROLES[0].value,
                    year: sessionYears[0],
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
            <section className="py-12 md:py-16 px-4 md:px-10 lg:px-20 mx-auto max-w-[1200px] w-full flex flex-col gap-10 relative z-20">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center sm:flex-row flex-col gap-4">
                        <div className="flex items-center gap-3">
                             <MdHistory size={32} className="text-primary" />
                             <div>
                                 <h3 className="text-2xl font-serif font-bold text-primary">Activity History</h3>
                                 <p className="text-gray-500 text-sm mt-0.5">Track your verified hall activities and events.</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="cursor-pointer px-4 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm shadow-md uppercase tracking-wider"
                            >
                                <MdAdd size={20} /> Add New
                            </button>
                        </div>
                    </div>

                    <div className="p-0 overflow-x-auto flex-grow min-h-[200px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-16">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            </div>
                        ) : participationData.length === 0 ? (
                            <div className="p-16 text-center text-gray-400 italic">
                                <p>No participation records found.</p>
                            </div>
                        ) : (
                            <table className="w-full text-center table-fixed border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                                        <th className="px-6 py-4 font-bold border-b border-gray-200 text-center w-1/4">Year</th>
                                        <th className="px-6 py-4 font-bold border-b border-gray-200 text-center w-1/4">Event Name</th>
                                        <th className="px-6 py-4 font-bold border-b border-gray-200 text-center w-1/4">Role</th>
                                        <th className="px-6 py-4 font-bold border-b border-gray-200 text-center w-1/4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {participationData.map((item, index) => {
                                        const { classes, Icon } = getStatusStyle(item.status);
                                        return (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-4 text-center font-bold text-primary align-middle">
                                                    {item.year}
                                                </td>
                                                <td className="px-6 py-4 text-center align-middle">
                                                    <div className="font-bold text-gray-800 text-base">
                                                        {item.event?.name || 'Unknown Event'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 uppercase font-medium mt-1 tracking-wider">
                                                        {formatCategory(item.event?.category || item.category)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700 capitalize font-medium text-center align-middle">
                                                    {(item.role || 'MEMBER').replace('_', ' ').toLowerCase()}
                                                </td>
                                                <td className="px-6 py-4 text-center align-middle">
                                                    <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-sm ${classes}`}>
                                                        <Icon size={14} />
                                                        {formatStatus(item.status)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>

             {/* Add Participation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                                <MdAdd className="text-gold" /> Add Participation
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200">
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 font-medium bg-white"
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 font-medium bg-white"
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
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Year</label>
                                    <select 
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 font-medium bg-white"
                                    >
                                        {sessionYears.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Role</label>
                                    <select 
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 font-medium bg-white"
                                    >
                                        {ROLES.map((r) => (
                                            <option key={r.value} value={r.value}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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

                            <div className="pt-2 flex gap-3 flex-shrink-0 justify-end border-t border-gray-100 mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="cursor-pointer px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-gold transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
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
