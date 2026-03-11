import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdAdd, MdClose, MdDelete, MdPersonAdd, MdPersonRemove } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const WardenCouncil = () => {
    const { user } = useAuth();
    
    // Function to get fresh token
    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    };
    
    const [positions, setPositions] = useState([]);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAddPositionModalOpen, setIsAddPositionModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    
    const [positionData, setPositionData] = useState({ name: '', description: '' });
    
    // For assigning students
    const [searchStudent, setSearchStudent] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, []);

    // Prevent scrolling when modals are open
    useEffect(() => {
        if (isAddPositionModalOpen || isAssignModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isAddPositionModalOpen, isAssignModalOpen]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const currentToken = await getToken();
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            
            const [posRes, stuRes] = await Promise.all([
                axios.get(`${baseUrl}/api/council/positions`, { headers: { Authorization: `Bearer ${currentToken}` } }),
                axios.get(`${baseUrl}/api/students`, { headers: { Authorization: `Bearer ${currentToken}` } })
            ]);
            
            setPositions(posRes.data);
            setStudents(stuRes.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load council database.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPosition = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const currentToken = await getToken();
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/council/positions`, positionData, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setIsAddPositionModalOpen(false);
            setPositionData({ name: '', description: '' });
            fetchData();
            toast.success("Position created successfully.");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to create position: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePosition = async (id) => {
        if (!window.confirm("Are you sure you want to delete this position?")) return;
        try {
            const currentToken = await getToken();
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/council/positions/${id}`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            fetchData();
            toast.success("Position deleted successfully.");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to delete position: ${err.response?.data?.message || err.message}`);
        }
    };

    const openAssignModal = (position) => {
        setSelectedPosition(position);
        setSearchStudent('');
        setSelectedStudentId('');
        setIsAssignModalOpen(true);
    };

    const handleAssignStudent = async (e) => {
        e.preventDefault();
        if (!selectedStudentId) {
            toast.error("Please select a student first.");
            return;
        }
        setSubmitting(true);
        try {
            const currentToken = await getToken();
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/council/assign`, {
                studentId: selectedStudentId,
                positionId: selectedPosition.id
            }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setIsAssignModalOpen(false);
            fetchData();
            toast.success("Student assigned successfully.");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to assign student: ${err.response?.data?.message || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnassignStudent = async (studentId, positionId) => {
        if (!window.confirm("Are you sure you want to unassign this student?")) return;
        try {
            const currentToken = await getToken();
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/council/unassign`, {
                studentId,
                positionId
            }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            fetchData();
            toast.success("Student unassigned successfully.");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to unassign student: ${err.response?.data?.message || err.message}`);
        }
    };

    const filteredStudents = students.filter(s => 
        `${s.firstName} ${s.lastName} ${s.rollNumber}`.toLowerCase().includes(searchStudent.toLowerCase())
    );

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display min-h-screen flex flex-col pt-10">
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
                                        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                                            HALL COUNCIL
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Manage Positions & Assignments | Warden Portal
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
                <div className="max-w-[1200px] w-full flex flex-col gap-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-md border-t-4 border-gold">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-primary">Council Positions</h3>
                            <p className="text-gray-500 text-sm mt-1">Create positions and assign students to form the hall council.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddPositionModalOpen(true)}
                            className="cursor-pointer px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm"
                        >
                            <MdAdd size={20} /> Add Position
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center p-20 bg-white rounded-xl shadow-md">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500 font-bold bg-white rounded-xl shadow-md">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {positions.length === 0 ? (
                                <div className="col-span-full p-12 text-center text-gray-400 bg-white rounded-xl shadow-md">
                                    <p className="text-lg font-medium">No positions created yet.</p>
                                </div>
                            ) : (
                                positions.map((pos) => {
                                    // Filter active assignments (endDate is null)
                                    const activeAssignments = pos.studentPositions?.filter(sp => !sp.endDate) || [];
                                    
                                    return (
                                        <div key={pos.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                                            <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-lg text-primary">{pos.name}</h4>
                                                    {pos.description && <p className="text-xs text-gray-500 mt-1">{pos.description}</p>}
                                                </div>
                                                <button 
                                                    className="hidden text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    title="Delete Position"
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                            </div>
                                            <div className="p-5 flex-grow flex flex-col gap-3">
                                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Assigned Students</h5>
                                                {activeAssignments.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic py-2">No students assigned.</p>
                                                ) : (
                                                    <div className="flex flex-col gap-2">
                                                        {activeAssignments.map(sp => (
                                                            <div key={sp.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-sm text-gray-800">{sp.student.firstName} {sp.student.lastName}</span>
                                                                    <span className="text-xs text-gray-500">{sp.student.rollNumber}</span>
                                                                </div>
                                                                <button 
                                                                    onClick={() => handleUnassignStudent(sp.studentId, pos.id)}
                                                                    className="text-red-400 hover:text-red-600 p-1 bg-white rounded shadow-sm border border-red-100"
                                                                    title="Unassign Student"
                                                                >
                                                                    <MdPersonRemove size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                                <button 
                                                    onClick={() => openAssignModal(pos)}
                                                    className="w-full py-2 bg-white border border-primary text-primary font-bold rounded hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <MdPersonAdd size={18} /> Assign Student
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Modal: Add Position */}
            {isAddPositionModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold font-serif text-primary">Add Council Position</h3>
                            <button onClick={() => setIsAddPositionModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500"><MdClose size={24}/></button>
                        </div>
                        <form onSubmit={handleAddPosition} className="p-6">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Position Name *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. Cultural Secretary"
                                        value={positionData.name} 
                                        onChange={e => setPositionData({...positionData, name: e.target.value})} 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                    <textarea 
                                        placeholder="Brief description of the role..."
                                        value={positionData.description} 
                                        onChange={e => setPositionData({...positionData, description: e.target.value})} 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold min-h-[100px]" 
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsAddPositionModalOpen(false)} disabled={submitting} className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                                <button type="submit" disabled={submitting} className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed">
                                    {submitting ? "Creating..." : "Create Position"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Assign Student */}
            {isAssignModalOpen && selectedPosition && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold font-serif text-primary">Assign Student</h3>
                                <p className="text-sm text-gray-500 mt-1">To: <span className="font-bold text-gray-800">{selectedPosition.name}</span></p>
                            </div>
                            <button onClick={() => setIsAssignModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500"><MdClose size={24}/></button>
                        </div>
                        <form onSubmit={handleAssignStudent} className="p-6 flex flex-col gap-4 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Search Student</label>
                                <input 
                                    type="text" 
                                    placeholder="Search by name or roll number..."
                                    value={searchStudent} 
                                    onChange={e => setSearchStudent(e.target.value)} 
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold mb-2" 
                                />
                                <div className="max-h-[200px] overflow-y-auto border rounded-lg border-gray-200">
                                    {filteredStudents.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">No students found.</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {filteredStudents.map(student => (
                                                <label 
                                                    key={student.id} 
                                                    className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedStudentId === student.id ? 'bg-gold/10 border-gold' : ''}`}
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
                            
                            <div className="mt-4 flex justify-end gap-2 flex-shrink-0">
                                <button type="button" onClick={() => setIsAssignModalOpen(false)} disabled={submitting} className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                                <button type="submit" disabled={submitting || !selectedStudentId} className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed">
                                    {submitting ? "Assigning..." : "Confirm Assignment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardenCouncil;
