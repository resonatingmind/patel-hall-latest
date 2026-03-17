import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdReportProblem, MdAdd, MdClose, MdCloudUpload, MdCheckCircle, MdPending, MdErrorOutline } from "react-icons/md";

const Grievance = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Electrical',
        room: '',
        urgency: 'Low',
        description: '',
        isAnonymous: false,
        image: null
    });

    // Mock Data for Grievances
    const [grievances, setGrievances] = useState([
        {
            id: 1,
            date: "2024-10-15",
            category: "Electrical",
            room: "C-204",
            description: "Tube light flickering constantly.",
            urgency: "Medium",
            status: "Resolved",
            ticketId: "#GR-1024"
        },
        {
            id: 2,
            date: "2024-10-20",
            category: "Plumbing/Civil",
            room: "B-Washroom",
            description: "Tap leaking in the 2nd floor washroom.",
            urgency: "High",
            status: "In Progress",
            ticketId: "#GR-1055"
        },
        {
            id: 3,
            date: "2024-10-22",
            category: "Mess & Food",
            room: "Mess Hall",
            description: "Quality of rice was poor during lunch.",
            urgency: "Medium",
            status: "Pending",
            ticketId: "#GR-1060"
        }
    ]);

    const categories = ['Electrical', 'Plumbing/Civil', 'Mess & Food', 'Internet/Wi-Fi', 'Sanitation', 'General'];
    const urgencyLevels = ['Low', 'Medium', 'High'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mock submission
        const newGrievance = {
            id: grievances.length + 1,
            date: new Date().toISOString().split('T')[0],
            category: formData.category,
            room: formData.room,
            description: formData.description,
            urgency: formData.urgency,
            status: "Pending",
            ticketId: `#GR-${Math.floor(1000 + Math.random() * 9000)}`
        };

        setGrievances(prev => [newGrievance, ...prev]);
        setIsModalOpen(false);
        setFormData({ category: 'Electrical', room: '', urgency: 'Low', description: '', isAnonymous: false, image: null });
        alert("Grievance reported successfully!");
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch(urgency) {
            case 'High': return 'text-red-600 bg-red-50 border-red-100';
            case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-green-600 bg-green-50 border-green-100';
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
                                            GRIEVANCE REDRESSAL
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Report & Track Issues | Patel Hall
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* List Section */}
            <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center relative z-20 -mt-26">
                <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
                    <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                        <div>
                             <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                                <MdReportProblem className="text-gold" /> My Grievances
                             </h3>
                             <p className="text-gray-500 text-sm mt-1">Track the status of your reported issues.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-primary text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:bg-deep-maroon transition-all transform hover:scale-105"
                            >
                                <MdAdd size={18} /> Report Issue
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/5 border-b border-primary/10">
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[15%]">Date</th>
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[20%]">Category</th>
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[35%]">Description</th>
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[15%]">Priority</th>
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[15%] text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grievances.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <td className="p-5">
                                            <span className="font-mono text-xs font-bold text-gray-400 block mb-1">{item.ticketId}</span>
                                            <span className="font-medium text-gray-700 text-sm">{item.date}</span>
                                        </td>
                                        <td className="p-5">
                                            <div className="font-bold text-gray-800 text-sm">{item.category}</div>
                                            <div className="text-xs text-gray-500 mt-1">{item.room}</div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                        </td>
                                        <td className="p-5">
                                             <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wide border ${getUrgencyColor(item.urgency)}`}>
                                                {item.urgency}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(item.status)}`}>
                                                {item.status === 'Resolved' ? <MdCheckCircle size={14} /> : 
                                                 item.status === 'In Progress' ? <MdPending size={14} /> : 
                                                 <MdErrorOutline size={14} />}
                                                {item.status}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {grievances.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <p>No grievances reported yet.</p>
                        </div>
                    )}
                </div>
            </section>

             {/* Report Grievance Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-serif font-bold text-primary">Report Grievance</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <MdClose size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Category</label>
                                    <select 
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 bg-white"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Urgency</label>
                                    <select 
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 bg-white"
                                    >
                                        {urgencyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Room / Location</label>
                                <input 
                                    type="text" 
                                    name="room"
                                    value={formData.room}
                                    onChange={handleInputChange}
                                    placeholder="e.g. C-204, Mess Hall, 2nd Floor Washroom"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the issue in detail..."
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all text-gray-700 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Upload Image (Optional)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gold hover:bg-gold/5 transition-all cursor-pointer relative group">
                                    <input 
                                        type="file" 
                                        name="image"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    <MdCloudUpload size={32} className="mb-2 text-gray-300 group-hover:text-gold transition-colors" />
                                    <p className="text-sm font-medium">{formData.image ? formData.image.name : "Click to upload image"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input 
                                    type="checkbox" 
                                    name="isAnonymous"
                                    id="isAnonymous"
                                    checked={formData.isAnonymous}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-gold"
                                />
                                <label htmlFor="isAnonymous" className="text-sm text-gray-700 font-medium select-none cursor-pointer">
                                    Report Anonymously
                                </label>
                            </div>

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
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Grievance;
