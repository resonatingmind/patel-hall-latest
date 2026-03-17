import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdSearch, MdSchool, MdPerson, MdAdd, MdClose, MdWorkOutline, MdUploadFile, MdCheckCircle, MdError, MdDownload, MdEdit } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import Papa from 'papaparse';
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const allDepartments = ['CS', 'EC', 'EE', 'ME', 'CH', 'CE', 'AE', 'IM', 'IE', 'NA', 'AG', 'MI', 'MT', 'BT', 'MF', 'AR', 'MA', 'PH', 'CY', 'HS', 'GG', 'EX'];
const departments = ['All', ...allDepartments.sort()];

// Generate an array of valid batches from 20 years ago to present year for dropdown
const currentYear = new Date().getFullYear();
const batchYears = Array.from({length: 21}, (_, i) => (currentYear - i).toString());

const WardenAlumni = () => {
    const { user } = useAuth();
    
    // Function to get fresh token
    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    };

    const [allAlumni, setAllAlumni] = useState([]);
    const [alumni, setAlumni] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = React.useRef(null);

    const [filters, setFilters] = useState({
        dept: 'All',
        batch: 'All',
        search: ''
    });

    const [batches, setBatches] = useState(['All']);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    
    // Import state
    const [csvFile, setCsvFile] = useState(null);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
    const [importResults, setImportResults] = useState({
        createdAlumni: [],
        failedAlumni: [],
    });

    const [formData, setFormData] = useState({
        fullName: '',
        department: 'CS',
        batchYear: new Date().getFullYear().toString(),
        profile: '',
        linkedin: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAlumni();
    }, []);

    // Prevent scrolling when modals are open
    useEffect(() => {
        if (isAddModalOpen || isImportModalOpen || isResultsModalOpen || isEditModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isAddModalOpen, isImportModalOpen, isResultsModalOpen, isEditModalOpen]);

    const fetchAlumni = async () => {
        setIsLoading(true);
        try {
            const currentToken = await getToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/alumni`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            const fetchedData = response.data;
            setAllAlumni(fetchedData);
            setAlumni(fetchedData);

            // Dynamically generate batches based on fetched data
            const batchesList = Array.from(new Set(fetchedData.map(a => String(a.batchYear)))).sort((a, b) => Number(b) - Number(a));
            setBatches(['All', ...batchesList]);
        } catch (err) {
            console.error("Failed to fetch alumni:", err);
            setError("Failed to load alumni database.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        let filtered = allAlumni;

        if (filters.dept !== 'All') {
            filtered = filtered.filter(alum => alum.department === filters.dept);
        }

        if (filters.batch !== 'All') {
            filtered = filtered.filter(alum => String(alum.batchYear) === filters.batch);
        }

        if (filters.search) {
            filtered = filtered.filter(alum => 
                alum.fullName.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setAlumni(filtered);
    }, [filters, allAlumni]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.batchYear) {
            toast.error('Name and Batch Year are required.');
            return;
        }

        setAdding(true);
        try {
            const currentToken = await getToken();
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/alumni/create`, formData, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setIsAddModalOpen(false);
            setFormData({
                fullName: '',
                department: 'CS',
                batchYear: new Date().getFullYear().toString(),
                profile: '',
                linkedin: ''
            });
            fetchAlumni(); // Refresh list
            toast.success("Alumnus added successfully.");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to add alumnus: ${err.response?.data?.message || err.message}`);
        } finally {
            setAdding(false);
        }
    };

    const handleEditClick = (alum) => {
        setFormData({
            fullName: alum.fullName || '',
            department: alum.department || 'CS',
            batchYear: alum.batchYear ? alum.batchYear.toString() : new Date().getFullYear().toString(),
            profile: alum.profile || '',
            linkedin: alum.linkedin || ''
        });
        setCurrentEditId(alum.id);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.batchYear) {
            toast.error('Name and Batch Year are required.');
            return;
        }

        setEditing(true);
        try {
            const currentToken = await getToken();
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/alumni/${currentEditId}`, formData, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setIsEditModalOpen(false);
            setFormData({
                fullName: '',
                department: 'CS',
                batchYear: new Date().getFullYear().toString(),
                profile: '',
                linkedin: ''
            });
            setCurrentEditId(null);
            fetchAlumni(); // Refresh list
            toast.success("Alumnus updated successfully.");
        } catch (err) {
            console.error(err);
            toast.error(`Failed to update alumnus: ${err.response?.data?.message || err.message}`);
        } finally {
            setEditing(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCsvFile(e.target.files[0]);
        }
    };

    const handleImportSubmit = async (e) => {
        e.preventDefault();
        if (!csvFile) return toast.error("Please select a CSV file.");

        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            
            Papa.parse(text, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    if (results.errors.length > 0) {
                        toast.error('Error parsing CSV file');
                        setIsUploading(false);
                        return;
                    }

                    const parsedData = results.data.map(row => {
                        const rollNumber = row['rollno'] || '';
                        let batchYear = '';
                        if (rollNumber.length >= 2) {
                            const yy = parseInt(rollNumber.substring(0, 2), 10);
                            if (!isNaN(yy)) {
                                batchYear = (yy < 50 ? 2000 + yy : 1900 + yy).toString();
                            }
                        }
                        
                        let department = '';
                        if (rollNumber.length >= 4) {
                            department = rollNumber.substring(2, 4).toUpperCase();
                        }

                        // Allow explicit overrides from CSV
                        return {
                            fullName: row['name'] || '',
                            department: department || 'Unknown',
                            batchYear: batchYear || new Date().getFullYear().toString(),
                            profile: row['profile'] || '',
                            linkedin: row['linkedin'] || ''
                        };
                    });

                    const validData = parsedData.filter(d => d.fullName && d.batchYear);

                    if (validData.length === 0) {
                        toast.error('No valid alumni data found in CSV');
                        setIsUploading(false);
                        return;
                    }

                    try {
                        const currentToken = await getToken();
                        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/alumni/create-bulk`, validData, {
                            headers: { Authorization: `Bearer ${currentToken}` }
                        });
                        
                        setImportResults({
                            createdAlumni: response.data.createdAlumni || [],
                            failedAlumni: response.data.failedAlumni || [],
                        });
                        toast.success(`Import complete: ${response.data.successCount} added, ${response.data.failedCount} failed.`);
                        setIsImportModalOpen(false);
                        setCsvFile(null);
                        setIsResultsModalOpen(true);
                        fetchAlumni(); // Refresh list
                    } catch (err) {
                        console.error(err);
                        toast.error(`Failed to add bulk alumni: ${err.response?.data?.message || err.message}`);
                    } finally {
                        setIsUploading(false);
                    }
                },
                error: (err) => {
                    toast.error('Error reading the file: ' + err.message);
                    setIsUploading(false);
                }
            });
        };
        reader.readAsText(csvFile);
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
                                            ALUMNI DIRECTORY
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            View Alumni Details | Warden Portal
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
                                    <MdSchool className="text-gold" /> Alumni Directory
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Manage and view records of hall alumni.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsImportModalOpen(true)}
                                    className="cursor-pointer px-4 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdUploadFile /> Bulk Import
                                </button>
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="cursor-pointer px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm"
                                >
                                    <MdAdd /> Add Alum
                                </button>
                            </div>
                         </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full pt-4 border-t border-gray-100">
                            <div className="relative">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name..."
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white"
                                />
                            </div>

                            <select name="dept" value={filters.dept} onChange={handleFilterChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer">
                                <option value="All">All Departments</option>
                                {departments.filter(d => d !== 'All').map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>

                            <select name="batch" value={filters.batch} onChange={handleFilterChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer">
                                <option value="All">All Batches</option>
                                {batches.filter(b => b !== 'All').map(batch => <option key={batch} value={batch}>{batch}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Alumni List */}
                    <div className="overflow-x-auto min-h-[400px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : error ? (
                            <div className="p-10 text-center text-red-500 font-bold">{error}</div>
                        ) : alumni.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-primary/5 border-b border-primary/10">
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Name</th>
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Department</th>
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">Profile</th>
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-right">Joining Year</th>
                                        <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alumni.map((alum) => (
                                        <tr key={alum.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                            <td className="p-5">
                                                <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{alum.fullName}</div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                    <MdSchool className="text-gray-400 group-hover:text-gold transition-colors" size={16} />
                                                    {alum.department}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-1">
                                                    {alum.profile && (
                                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                                            <MdWorkOutline className="text-gray-400 group-hover:text-gold transition-colors" size={16} />
                                                            {alum.profile}
                                                        </div>
                                                    )}
                                                    {alum.linkedin && (
                                                        <a href={alum.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors">
                                                            <FaLinkedin size={16} /> LinkedIn
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                {alum.batchYear && (
                                                    <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-gray-50 text-gray-600 border-gray-200">
                                                        {alum.batchYear}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-5 text-center">
                                                <button 
                                                    onClick={() => handleEditClick(alum)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Alumnus"
                                                >
                                                    <MdEdit size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-gray-400">
                                <MdPerson size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No alumni found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modals */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold font-serif text-primary">Add New Alumnus</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500"><MdClose size={24}/></button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Batch Year *</label>
                                    <select 
                                        required 
                                        value={formData.batchYear} 
                                        onChange={e => setFormData({...formData, batchYear: e.target.value})} 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" 
                                    >
                                        <option value="" disabled>Select Year</option>
                                        {batchYears.map(year => <option key={year} value={year}>{year}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department *</label>
                                    <select value={formData.department} required onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold">
                                        {departments.filter(d=>d!=='All').map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Profile / Job Title</label>
                                    <input type="text" value={formData.profile} onChange={e => setFormData({...formData, profile: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" placeholder="e.g. Software Engineer at Google" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">LinkedIn URL</label>
                                    <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" placeholder="https://linkedin.com/in/..." />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-2 flex-shrink-0">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} disabled={adding} className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                                <button type="submit" disabled={adding} className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed">
                                    {adding ? "Adding..." : "Add Alumnus"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold font-serif text-primary">Edit Alumnus</h3>
                            <button onClick={() => { setIsEditModalOpen(false); setCurrentEditId(null); }} className="cursor-pointer text-gray-400 hover:text-red-500"><MdClose size={24}/></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                                    <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Batch Year *</label>
                                    <select 
                                        required 
                                        value={formData.batchYear} 
                                        onChange={e => setFormData({...formData, batchYear: e.target.value})} 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" 
                                    >
                                        <option value="" disabled>Select Year</option>
                                        {/* Allow previously set years even if they are older than batchYears range by adding to dropdown if not present */}
                                        {!batchYears.includes(formData.batchYear) && formData.batchYear && (
                                            <option value={formData.batchYear}>{formData.batchYear}</option>
                                        )}
                                        {batchYears.map(year => <option key={year} value={year}>{year}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Department *</label>
                                    <select value={formData.department} required onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold">
                                        {departments.filter(d=>d!=='All').map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Profile / Job Title</label>
                                    <input type="text" value={formData.profile} onChange={e => setFormData({...formData, profile: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" placeholder="e.g. Software Engineer at Google" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">LinkedIn URL</label>
                                    <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold" placeholder="https://linkedin.com/in/..." />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-2 flex-shrink-0">
                                <button type="button" onClick={() => { setIsEditModalOpen(false); setCurrentEditId(null); }} disabled={editing} className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                                <button type="submit" disabled={editing} className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed">
                                    {editing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-xl font-bold font-serif text-primary">Bulk Import CSV</h3>
                            <button onClick={() => setIsImportModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleImportSubmit} className="p-6">
                            <p className="text-sm text-gray-500 mb-4">
                                Upload a CSV file. The columns should be:<br />
                                <code className="text-xs bg-gray-100 p-1 rounded">rollno, name, profile, linkedin</code><br/>
                                <span className="text-xs">Department and Batch Year will be automatically inferred from rollno.</span>
                            </p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            <div className="mt-8 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsImportModalOpen(false)}
                                    disabled={isUploading}
                                    className="cursor-pointer px-6 py-2 border rounded-lg text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading || !csvFile}
                                    className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? "Importing..." : "Upload & Import"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Results Modal */}
            {isResultsModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h3 className="text-xl font-bold font-serif text-primary">Import Results</h3>
                            <button onClick={() => setIsResultsModalOpen(false)} className="cursor-pointer text-gray-400 hover:text-red-500">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex flex-col gap-6">
                            {/* Summary */}
                            <div className="flex gap-4 flex-wrap">
                                <div className="flex-1 min-w-[150px] bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                    <MdCheckCircle className="text-green-600 flex-shrink-0" size={28} />
                                    <div>
                                        <p className="text-2xl font-black text-green-700">{importResults.createdAlumni.length}</p>
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Successfully Added</p>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[150px] bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                    <MdError className="text-red-500 flex-shrink-0" size={28} />
                                    <div>
                                        <p className="text-2xl font-black text-red-700">{importResults.failedAlumni.length}</p>
                                        <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Failed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Successfully added */}
                            {importResults.createdAlumni.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                                        <MdCheckCircle size={16} /> Successfully Added ({importResults.createdAlumni.length})
                                    </h4>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="bg-green-50 border-b border-green-100">
                                                    <th className="px-4 py-2 font-bold text-gray-600 text-xs uppercase">Name</th>
                                                    <th className="px-4 py-2 font-bold text-gray-600 text-xs uppercase">Batch</th>
                                                    <th className="px-4 py-2 font-bold text-gray-600 text-xs uppercase">Dept</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {importResults.createdAlumni.map((a, i) => (
                                                    <tr key={i} className="border-b border-gray-100 last:border-0">
                                                        <td className="px-4 py-2 text-gray-800 font-bold">{a.fullName}</td>
                                                        <td className="px-4 py-2 text-gray-700">{a.batchYear}</td>
                                                        <td className="px-4 py-2 text-gray-600">{a.department}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Failed records */}
                            {importResults.failedAlumni.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                        <h4 className="text-sm font-bold text-red-700 flex items-center gap-2">
                                            <MdError size={16} /> Failed ({importResults.failedAlumni.length})
                                        </h4>
                                        <button
                                            onClick={() => {
                                                const headers = "Name,Batch Year,Department,Error";
                                                const rows = importResults.failedAlumni.map(a => 
                                                    `"${(a.fullName || '').replace(/"/g, '""')}","${a.batchYear || ''}","${a.department || ''}","${(a.error || '').replace(/"/g, '""')}"`
                                                );
                                                const csv = [headers, ...rows].join('\n');
                                                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                                const url = URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.download = 'failed_alumni.csv';
                                                link.click();
                                                URL.revokeObjectURL(url);
                                            }}
                                            className="cursor-pointer px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5 border border-red-200"
                                        >
                                            <MdDownload size={14} /> Download Failed CSV
                                        </button>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="bg-red-50 border-b border-red-100">
                                                    <th className="px-4 py-2 font-bold text-gray-600 text-xs uppercase">Name</th>
                                                    <th className="px-4 py-2 font-bold text-gray-600 text-xs uppercase">Batch</th>
                                                    <th className="px-4 py-2 font-bold text-gray-600 text-xs uppercase">Error</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {importResults.failedAlumni.map((a, i) => (
                                                    <tr key={i} className="border-b border-gray-100 last:border-0">
                                                        <td className="px-4 py-2 text-gray-800 font-medium">{a.fullName}</td>
                                                        <td className="px-4 py-2 text-gray-600">{a.batchYear}</td>
                                                        <td className="px-4 py-2 text-red-600 text-xs">{a.error}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
                            <button
                                onClick={() => setIsResultsModalOpen(false)}
                                className="cursor-pointer px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-gold transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WardenAlumni;
