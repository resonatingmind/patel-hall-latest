import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdSearch, MdWarning, MdReportProblem, MdDateRange } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const WardenGrievance = () => {
    const { user } = useAuth();
    
    // Function to get fresh token
    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    };

    const [allGrievances, setAllGrievances] = useState([]);
    const [grievances, setGrievances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        search: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchGrievances();
    }, []);

    const fetchGrievances = async () => {
        setIsLoading(true);
        try {
            const currentToken = await getToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/grievances`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            const fetchedData = response.data;
            setAllGrievances(fetchedData);
            setGrievances(fetchedData);
        } catch (err) {
            console.error("Failed to fetch grievances:", err);
            setError("Failed to load grievances.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        let filtered = allGrievances;

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(g => 
                (g.student?.firstName || '').toLowerCase().includes(searchLower) ||
                (g.student?.lastName || '').toLowerCase().includes(searchLower) ||
                (g.problem || '').toLowerCase().includes(searchLower)
            );
        }

        setGrievances(filtered);
    }, [filters, allGrievances]);

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
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
                                            <MdReportProblem className="text-gold" /> GRIEVANCES
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            View Student Complaints | Warden Portal
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
                <div className="max-w-[1200px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
                    
                    <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex flex-col gap-6">
                         <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                                    <MdWarning className="text-gold" /> Student Grievances
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Review feedback and issues raised by students.</p>
                            </div>
                         </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 w-full pt-4 border-t border-gray-100">
                            <div className="relative w-full md:w-1/3">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold" />
                                <input 
                                    type="text" 
                                    placeholder="Search by student name or problem..."
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Grievance List */}
                    <div className="overflow-x-auto min-h-[400px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : error ? (
                            <div className="p-10 text-center text-red-500 font-bold">{error}</div>
                        ) : grievances.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-primary/5 border-b border-primary/10">
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-1/4">Student Details</th>
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Problem Description</th>
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest whitespace-nowrap">Image</th>
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-right whitespace-nowrap">Date Reported</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grievances.map((g) => {
                                        const reportedDate = new Date(g.date || g.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        });

                                        return (
                                        <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                            <td className="p-5 align-top">
                                                <div className="font-bold text-gray-800 text-lg">{g.student?.firstName} {g.student?.lastName}</div>
                                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">Roll No: {g.student?.rollNumber}</div>
                                                <div className="text-sm font-medium text-primary mt-1">
                                                    Block {g.student?.block} - Room {g.student?.roomNumber}
                                                </div>
                                            </td>
                                            <td className="p-5 align-top">
                                                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{g.problem}</p>
                                            </td>
                                            <td className="p-5 align-top">
                                                {g.image ? (
                                                    <a href={g.image} target="_blank" rel="noopener noreferrer" className="inline-block relative rounded overflow-hidden border border-gray-200 hover:border-gold transition-colors">
                                                        <img src={g.image} alt="Grievance Attachment" className="w-16 h-16 object-cover" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No attachment</span>
                                                )}
                                            </td>
                                            <td className="p-5 text-right align-top">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-gray-50 text-gray-600 border-gray-200">
                                                    <MdDateRange size={14} className="text-gray-400" />
                                                    {reportedDate}
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center justify-center">
                                <div className="bg-gray-50 p-6 rounded-full mb-4">
                                    <MdReportProblem size={48} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No Grievances Found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">There are currently no grievances reported by students.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WardenGrievance;
