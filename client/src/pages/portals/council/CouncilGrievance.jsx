import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdReportProblem, MdImage, MdAdd, MdEdit, MdDelete, MdClose } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import axios from 'axios';
import { toast } from 'sonner';

const CouncilGrievance = () => {
    const { user } = useAuth();
    
    const [grievances, setGrievances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGrievance, setSelectedGrievance] = useState(null);

    const [problem, setProblem] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchMyGrievances();
    }, []);

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || null;
    };

    const fetchMyGrievances = async () => {
        setIsLoading(true);
        try {
            const currentToken = await getToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/grievances/me`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setGrievances(response.data);
        } catch (err) {
            console.error("Failed to fetch grievances:", err);
            toast.error("Failed to load your grievances.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB");
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const resetForm = () => {
        setProblem('');
        setImageFile(null);
        setImagePreview(null);
        setSelectedGrievance(null);
    };

    const openAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const openEditModal = (grievance) => {
        setSelectedGrievance(grievance);
        setProblem(grievance.problem);
        setImagePreview(grievance.image);
        setImageFile(null);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (grievance) => {
        setSelectedGrievance(grievance);
        setIsDeleteModalOpen(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        
        if (!problem.trim()) {
            toast.error("Please describe your problem.");
            return;
        }

        setIsSubmitting(true);
        let imageUrl = null;

        try {
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user?.id || 'anonymous'}_${Date.now()}.${fileExt}`;
                const filePath = `grievances/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('Patelhall')
                    .upload(filePath, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

                const { data: publicUrlData } = supabase.storage
                    .from('Patelhall')
                    .getPublicUrl(filePath);

                imageUrl = publicUrlData.publicUrl;
            }

            const currentToken = await getToken();
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/grievances`, {
                problem,
                image: imageUrl
            }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            toast.success("Grievance submitted successfully.");
            setIsAddModalOpen(false);
            resetForm();
            fetchMyGrievances();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to submit: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        if (!problem.trim()) {
            toast.error("Please describe your problem.");
            return;
        }

        setIsSubmitting(true);
        let imageUrl = selectedGrievance.image;

        try {
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user?.id || 'anonymous'}_${Date.now()}.${fileExt}`;
                const filePath = `grievances/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('Patelhall')
                    .upload(filePath, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

                const { data: publicUrlData } = supabase.storage
                    .from('Patelhall')
                    .getPublicUrl(filePath);

                imageUrl = publicUrlData.publicUrl;
            } else if (imagePreview === null) {
                 // user explicitly removed the image
                 imageUrl = null;
            }

            const currentToken = await getToken();
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/grievances/${selectedGrievance.id}`, {
                problem,
                image: imageUrl
            }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            toast.success("Grievance updated successfully.");
            setIsEditModalOpen(false);
            resetForm();
            fetchMyGrievances();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to update: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            const currentToken = await getToken();
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/grievances/${selectedGrievance.id}`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            toast.success("Grievance deleted successfully.");
            setIsDeleteModalOpen(false);
            resetForm();
            fetchMyGrievances();
        } catch (err) {
            console.error(err);
            toast.error(`Failed to delete: ${err.response?.data?.message || err.message}`);
        } finally {
             setIsSubmitting(false);
        }
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
                                            MY GRIEVANCES
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Manage and Report Issues | Council Portal
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
                                <MdReportProblem className="text-gold" /> Past Reports
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">View the status and details of grievances you have submitted.</p>
                        </div>
                        <button 
                            onClick={openAddModal}
                            className="cursor-pointer px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-gold transition-colors flex items-center gap-2 text-sm shadow-md"
                        >
                            <MdAdd size={20} /> Submit New Grievance
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : grievances.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-100 flex flex-col items-center">
                            <MdReportProblem size={64} className="text-gray-200 mb-4" />
                            <h4 className="text-xl font-bold text-gray-700 mb-2">No Grievances Found</h4>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't submitted any grievances yet. If you have any issues regarding hall facilities, feel free to report them here.</p>
                            <button 
                                onClick={openAddModal}
                                className="cursor-pointer px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                Submit Your First Grievance
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {grievances.map((grievance) => (
                                <div key={grievance.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col hover:shadow-lg transition-shadow group">
                                    {grievance.image && (
                                        <div className="h-48 overflow-hidden bg-gray-100">
                                            <img src={grievance.image} alt="Grievance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                {new Date(grievance.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <div className="flex gap-2">
                                                <button onClick={() => openEditModal(grievance)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors cursor-pointer" title="Edit">
                                                    <MdEdit size={18} />
                                                </button>
                                                <button onClick={() => openDeleteModal(grievance)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer" title="Delete">
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 font-medium line-clamp-4 leading-relaxed flex-grow">
                                            {grievance.problem}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Modals */}
            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 fade-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                                {isEditModalOpen ? <><MdEdit className="text-gold"/> Edit Grievance</> : <><MdAdd className="text-gold"/> Submit Grievance</>}
                            </h3>
                            <button onClick={() => isEditModalOpen ? setIsEditModalOpen(false) : setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-200">
                                <MdClose size={24}/>
                            </button>
                        </div>
                        
                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="flex flex-col p-6 overflow-y-auto">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Problem Description *</label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={problem}
                                        onChange={(e) => setProblem(e.target.value)}
                                        placeholder="Explain your grievance here..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none resize-none transition-all"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Attach Image (Optional)</label>
                                    <div className="flex items-center gap-4 mb-3">
                                        <label className="cursor-pointer px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-gold hover:bg-gold/5 transition-colors flex items-center gap-2 group w-full justify-center">
                                            <MdImage className="text-gray-400 group-hover:text-gold" />
                                            <span className="text-sm text-gray-600 group-hover:text-primary font-medium">Choose File</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                    
                                    {imagePreview && (
                                        <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                                            <img src={imagePreview} alt="Preview" className="w-full h-40 object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    type="button" 
                                                    onClick={removeImage}
                                                    className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 cursor-pointer shadow-lg transform hover:scale-105 transition-all"
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2 text-center">Max file size: 5MB. Supported formats: JPG, PNG, GIF.</p>
                                </div>
                            </div>
                            
                            <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => isEditModalOpen ? setIsEditModalOpen(false) : setIsAddModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="cursor-pointer px-5 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="cursor-pointer px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-gold transition-colors disabled:opacity-50 shadow-md shadow-primary/20 flex items-center gap-2"
                                >
                                    {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    {isEditModalOpen ? 'Save Changes' : 'Submit Grievance'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4 transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                                <MdDelete className="text-red-500" /> Confirm Deletion
                            </h3>
                            <button onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors p-1 rounded-full hover:bg-gray-200">
                                <MdClose size={24}/>
                            </button>
                        </div>
                        
                        <div className="p-6 flex flex-col">
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to delete this grievance? This action cannot be undone and will permanently remove the record.
                            </p>
                            
                            <div className="pt-2 flex justify-end gap-3 mt-auto">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={isSubmitting}
                                    className="cursor-pointer px-5 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="cursor-pointer px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 shadow-md shadow-red-500/20 flex items-center gap-2"
                                >
                                    {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouncilGrievance;
