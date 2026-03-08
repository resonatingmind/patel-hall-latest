import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack, MdCheck, MdClose, MdDelete, MdPersonAdd, MdAdd, MdEmojiEvents, MdPeople } from "react-icons/md";
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const CouncilEventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedParticipants, setApprovedParticipants] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isStudentsLoaded, setIsStudentsLoaded] = useState(false);

    // Modals
    const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
    const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);

    // Add Participant State
    const [searchStudent, setSearchStudent] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [participantRole, setParticipantRole] = useState('MEMBER');

    // Add Result State
    const [resultData, setResultData] = useState({ year: new Date().getFullYear(), position: '', caption: '' });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
        // Lazily load students data in the background after main data loads
        setTimeout(() => {
            fetchStudents();
        }, 1000);
    }, [id]);

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    };

    const fetchStudents = async () => {
        if (isStudentsLoaded) return;
        try {
            const currentToken = await getToken();
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const stuRes = await axios.get(`${baseUrl}/api/students`, { headers: { Authorization: `Bearer ${currentToken}` } });
            setStudents(stuRes.data);
            setIsStudentsLoaded(true);
        } catch (err) {
            console.error("Failed to fetch students lazily:", err);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const currentToken = await getToken();
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            const [eventRes, pendingRes, approvedRes] = await Promise.all([
                axios.get(`${baseUrl}/api/events/${id}`, { headers: { Authorization: `Bearer ${currentToken}` } }),
                axios.get(`${baseUrl}/api/events/${id}/pending`, { headers: { Authorization: `Bearer ${currentToken}` } }),
                axios.get(`${baseUrl}/api/events/${id}/approved`, { headers: { Authorization: `Bearer ${currentToken}` } })
            ]);
            
            setEvent(eventRes.data);
            setPendingRequests(pendingRes.data);
            setApprovedParticipants(approvedRes.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            toast.error("Failed to load event details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (participantId, status) => {
        setSubmitting(true);
        try {
            const currentToken = await getToken();
            await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${id}/participants/${participantId}`, 
                { status },
                { headers: { Authorization: `Bearer ${currentToken}` } }
            );
            toast.success(`Request ${status.toLowerCase()} successfully.`);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to update status: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        if (!window.confirm("Are you sure you want to remove this participant?")) return;
        setSubmitting(true);
        try {
            const currentToken = await getToken();
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${id}/participants/${participantId}`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            toast.success("Participant removed.");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to remove participant: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddParticipant = async (e) => {
        e.preventDefault();
        if (!selectedStudentId) {
            toast.error("Please select a student.");
            return;
        }
        setSubmitting(true);
        try {
            const selectedStudent = students.find(s => s.id === selectedStudentId);
            const currentToken = await getToken();
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${id}/participants`, {
                rollNumber: selectedStudent.rollNumber,
                role: participantRole,
                year: new Date().getFullYear()
            }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setIsAddParticipantModalOpen(false);
            setSelectedStudentId('');
            setSearchStudent('');
            setParticipantRole('MEMBER');
            toast.success("Participant added successfully.");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to add participant: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddResult = async (e) => {
        e.preventDefault();
        if (!resultData.year || !resultData.position) {
            toast.error("Year and position are required.");
            return;
        }
        setSubmitting(true);
        try {
            const currentToken = await getToken();
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${id}/results`, resultData, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setIsAddResultModalOpen(false);
            setResultData({ year: new Date().getFullYear(), position: '', caption: '' });
            toast.success("Result added/updated successfully.");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to add result: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleDeleteResult = async (resultId) => {
        if (!window.confirm("Are you sure you want to delete this past standing?")) return;
        setSubmitting(true);
        try {
            const currentToken = await getToken();
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${id}/results/${resultId}`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            toast.success("Result deleted successfully.");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to delete result: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const openAddParticipantModal = async () => {
        if (!isStudentsLoaded) {
            const toastId = toast.loading("Loading student directory...");
            await fetchStudents();
            toast.dismiss(toastId);
        }
        setIsAddParticipantModalOpen(true);
    };

    const filteredStudents = students.filter(s => 
        `${s.firstName} ${s.lastName} ${s.rollNumber}`.toLowerCase().includes(searchStudent.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="bg-ivory min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="bg-ivory min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Event not found</h2>
                <Link to="/portal/council/manage-events" className="text-primary hover:underline font-medium flex items-center gap-2">
                    <MdArrowBack /> Back to Events
                </Link>
            </div>
        );
    }

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
                                             <Link to="/portal/council/manage-events" className="flex items-center gap-1 text-gold/80 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest">
                                                <MdArrowBack /> Back to Events
                                             </Link>
                                        </div>
                                        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                                            {event.name}
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest capitalize font-serif">
                                            Category: {event.category?.replace('_AND_', ' & ').replace(/_/g, ' ').toLowerCase()}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 md:py-16 px-4 md:px-10 lg:px-20 mx-auto max-w-[1400px] w-full flex flex-col gap-10 relative z-20">
                
                {/* Participants Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b-2 border-gold pb-2">
                        <MdPeople size={32} className="text-primary" />
                        <h3 className="text-3xl font-serif font-bold text-primary">Participants</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pending Requests Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-5 bg-gray-50 border-b border-gray-100">
                                <h4 className="font-bold text-lg text-primary">Pending Requests</h4>
                            </div>
                            <div className="p-0 overflow-x-auto flex-grow">
                                {pendingRequests.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 italic">No pending requests at the moment.</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                                                <th className="p-3">Name</th>
                                                <th className="p-3">Roll No.</th>
                                                <th className="p-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {pendingRequests.map(req => (
                                                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-3 font-medium text-gray-800">{req.student.firstName} {req.student.lastName}</td>
                                                    <td className="p-3 text-gray-600">{req.student.rollNumber}</td>
                                                    <td className="p-3 flex gap-2">
                                                        <button 
                                                            onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                                            disabled={submitting}
                                                            className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded" title="Approve">
                                                            <MdCheck size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                                            disabled={submitting}
                                                            className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded" title="Reject">
                                                            <MdClose size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Approved Participants Table */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <h4 className="font-bold text-lg text-primary">Approved Participants</h4>
                                <button 
                                    onClick={openAddParticipantModal}
                                    className="cursor-pointer px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdPersonAdd size={18} /> Add Participant
                                </button>
                            </div>
                            <div className="p-0 overflow-x-auto flex-grow">
                                {approvedParticipants.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 italic">No participants approved yet.</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                                                <th className="p-3">Name</th>
                                                <th className="p-3">Role</th>
                                                <th className="p-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[...approvedParticipants].sort((a, b) => {
                                                const roleOrder = { 'CAPTAIN': 1, 'VICE_CAPTAIN': 2, 'COORDINATOR': 3, 'MEMBER': 4 };
                                                return (roleOrder[a.role || 'MEMBER'] || 99) - (roleOrder[b.role || 'MEMBER'] || 99);
                                            }).map(participant => (
                                                <tr key={participant.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-3">
                                                        <div className="font-medium text-gray-800">{participant.student.firstName} {participant.student.lastName}</div>
                                                        <div className="text-xs text-gray-500">{participant.student.rollNumber}</div>
                                                    </td>
                                                    <td className="p-3 text-gray-600 capitalize">
                                                        {(participant.role || 'MEMBER').replace('_', ' ').toLowerCase()}
                                                    </td>
                                                    <td className="p-3 flex gap-2">
                                                        <button 
                                                            onClick={() => handleRemoveParticipant(participant.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove">
                                                            <MdDelete size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Past Standings Section */}
                <div className="flex flex-col gap-6 mt-8">
                    <div className="flex items-center gap-3 border-b-2 border-gold pb-2 justify-between">
                        <div className="flex items-center gap-3">
                            <MdEmojiEvents size={32} className="text-gold" />
                            <h3 className="text-3xl font-serif font-bold text-primary">Past Standings</h3>
                        </div>
                        <button 
                            onClick={() => setIsAddResultModalOpen(true)}
                            className="cursor-pointer px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm shadow-md"
                        >
                            <MdAdd size={20} /> Add Result
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-0 overflow-x-auto">
                            {!event.results || event.results.length === 0 ? (
                                <div className="p-10 text-center text-gray-500 italic">No past standings recorded.</div>
                            ) : (
                                <table className="w-full text-center table-fixed border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                                            <th className="px-6 py-4 font-bold w-1/4 text-center">Year</th>
                                            <th className="px-6 py-4 font-bold w-1/4 text-center">Position</th>
                                            <th className="px-6 py-4 font-bold w-1/4 text-center">Caption</th>
                                            <th className="px-6 py-4 font-bold w-1/4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-800 text-sm">
                                        {event.results.map(r => (
                                            <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                                <td className="px-6 py-4 font-bold text-primary text-center align-middle">{r.year}</td>
                                                <td className="px-6 py-4 text-center align-middle">
                                                    <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold ${
                                                        r.position === 1 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm' :
                                                        r.position === 2 ? 'bg-gray-200 text-gray-800 border border-gray-300 shadow-sm' :
                                                        r.position === 3 ? 'bg-orange-100 text-orange-800 border border-orange-200 shadow-sm' :
                                                        'bg-sky-50 text-sky-800 border border-sky-200 shadow-sm'
                                                    }`}>
                                                        {r.position === 1 ? '🥇 1st Place' : 
                                                         r.position === 2 ? '🥈 2nd Place' : 
                                                         r.position === 3 ? '🥉 3rd Place' : 
                                                         `${r.position}th Place`}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 font-medium text-center align-middle">
                                                    <span className={r.caption ? "" : "italic text-gray-400"}>{r.caption || 'Unspecified'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center align-middle">
                                                     <button 
                                                        onClick={() => handleDeleteResult(r.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                                        title="Delete Result"
                                                    >
                                                        <MdDelete size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

            </section>

            {/* Modal: Add Participant */}
            {isAddParticipantModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                                <MdPersonAdd className="text-gold" /> Add Participant
                            </h3>
                            <button onClick={() => setIsAddParticipantModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200"><MdClose size={24}/></button>
                        </div>
                        <form onSubmit={handleAddParticipant} className="p-6 flex flex-col gap-5 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Search Student</label>
                                <input 
                                    type="text" 
                                    placeholder="Search by name or roll number..."
                                    value={searchStudent} 
                                    onChange={e => setSearchStudent(e.target.value)} 
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gold mb-2 outline-none" 
                                />
                                <div className="max-h-[160px] overflow-y-auto border rounded-xl border-gray-200 bg-gray-50">
                                    {filteredStudents.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">No students found.</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {filteredStudents.map(student => (
                                                <label 
                                                    key={student.id} 
                                                    className={`flex items-center gap-3 p-3 border-b border-gray-100 cursor-pointer hover:bg-white transition-colors ${selectedStudentId === student.id ? 'bg-gold/10 border-gold shadow-inner' : ''}`}
                                                >
                                                    <input 
                                                        type="radio" 
                                                        name="studentSelect" 
                                                        value={student.id}
                                                        checked={selectedStudentId === student.id}
                                                        onChange={() => setSelectedStudentId(student.id)}
                                                        className="text-gold focus:ring-gold"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-gray-800">{student.firstName} {student.lastName}</span>
                                                        <span className="text-xs text-gray-500">{student.rollNumber} | {student.department}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                                <select 
                                    value={participantRole}
                                    onChange={(e) => setParticipantRole(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-gold outline-none bg-white font-medium text-gray-700"
                                >
                                    <option value="MEMBER">Member</option>
                                    <option value="CAPTAIN">Captain</option>
                                    <option value="VICE_CAPTAIN">Vice Captain</option>
                                    <option value="COORDINATOR">Coordinator</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-2 italic">Role cannot be modified after assignment.</p>
                            </div>
                            
                            <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                <button type="button" onClick={() => setIsAddParticipantModalOpen(false)} disabled={submitting} className="cursor-pointer px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={submitting || !selectedStudentId} className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-gold disabled:opacity-50 transition-colors shadow-md flex items-center gap-2">
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    Assign Participant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Add Result */}
            {isAddResultModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                                <MdEmojiEvents className="text-gold" /> Add Result
                            </h3>
                            <button onClick={() => setIsAddResultModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-200"><MdClose size={24}/></button>
                        </div>
                        <form onSubmit={handleAddResult} className="p-6 flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={resultData.year} 
                                        onChange={e => setResultData({...resultData, year: e.target.value})} 
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Position</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        required
                                        placeholder="e.g. 1"
                                        value={resultData.position} 
                                        onChange={e => setResultData({...resultData, position: e.target.value})} 
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none font-medium" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Caption (Optional)</label>
                                <input 
                                    value={resultData.caption} 
                                    onChange={e => setResultData({...resultData, caption: e.target.value})} 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold outline-none resize-none" 
                                />
                            </div>
                            <div className="pt-2 mt-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                <button type="button" onClick={() => setIsAddResultModalOpen(false)} disabled={submitting} className="cursor-pointer px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={submitting} className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-gold disabled:opacity-50 transition-colors shadow-md flex items-center gap-2">
                                    {submitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    Save Result
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouncilEventDetails;
