import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdFilterList, MdSearch, MdPerson, MdRoom, MdSchool, MdWork } from "react-icons/md";

const Batch = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock Data for Students
    const allStudents = [
        { id: 1, name: "Arjun Sharma", room: "C-204", dept: "CS", profile: "SDE" },
        { id: 2, name: "Rohan Singh", room: "B-102", dept: "ME", profile: "Core" },
        { id: 3, name: "Vikram Das", room: "A-301", dept: "EE", profile: "Finance" },
        { id: 4, name: "Suresh Raina", room: "D-105", dept: "CH", profile: "Data" },
        { id: 5, name: "Ankit Verma", room: "C-112", dept: "CS", profile: "Product" },
        { id: 6, name: "Rahul Dravid", room: "B-210", dept: "CE", profile: "Consult" },
        { id: 7, name: "Ishan Kishan", room: "A-205", dept: "EE", profile: "SDE" },
        { id: 8, name: "Virat Kohli", room: "C-305", dept: "ME", profile: "Core" },
        { id: 9, name: "Rohit Sharma", room: "D-201", dept: "CS", profile: "SDE" },
        { id: 10, name: "Hardik Pandya", room: "B-303", dept: "MA", profile: "Finance" },
        { id: 11, name: "Jasprit Bumrah", room: "A-101", dept: "PH", profile: "Data" },
        { id: 12, name: "Ravindra Jadeja", room: "C-215", dept: "CS", profile: "SDE" },
    ];

    const [students, setStudents] = useState(allStudents);
    const [filters, setFilters] = useState({
        block: 'All',
        dept: 'All',
        profile: 'All',
        search: ''
    });

    const blocks = ['All', 'A Block', 'B Block', 'C Block', 'D Block'];
    const departments = ['All', 'CS', 'EE', 'ME', 'CE', 'CH', 'MA', 'PH'];
    const profiles = ['All', 'SDE', 'Data', 'Consult', 'Finance', 'Core', 'Product', 'Others'];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        let filtered = allStudents;

        if (filters.block !== 'All') {
            const blockLetter = filters.block.charAt(0);
            filtered = filtered.filter(student => student.room.startsWith(blockLetter));
        }

        if (filters.dept !== 'All') {
            filtered = filtered.filter(student => student.dept === filters.dept);
        }

        if (filters.profile !== 'All') {
            filtered = filtered.filter(student => student.profile === filters.profile);
        }

        if (filters.search) {
            filtered = filtered.filter(student => 
                student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                student.room.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setStudents(filtered);
    }, [filters]);

    const getProfileColor = (profile) => {
        return 'bg-gray-50 text-gray-600 border-gray-200';
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
                                            BATCH 2024-25
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Student Directory | Patel Hall
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
                <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
                    
                    {/* Filters Header in the same style as Participation Log's Header */}
                    <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex flex-col gap-6">
                         <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                                    <MdSchool className="text-gold" /> Student Directory
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">Browse and search for hall residents.</p>
                            </div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Students:</span>
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">{students.length}</span>
                            </div>
                         </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full pt-4 border-t border-gray-100">
                             {/* Search */}
                            <div className="relative">
                                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold" />
                                <input 
                                    type="text" 
                                    placeholder="Search..."
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white"
                                />
                            </div>

                            {/* Block Filter */}
                            <select 
                                name="block" 
                                value={filters.block} 
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
                            >
                                {blocks.map(block => <option key={block} value={block}>{block}</option>)}
                            </select>

                            {/* Dept Filter */}
                            <select 
                                name="dept" 
                                value={filters.dept} 
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
                            >
                                <option value="All">All Departments</option>
                                {departments.filter(d => d !== 'All').map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>

                            {/* Profile Filter */}
                            <select 
                                name="profile" 
                                value={filters.profile} 
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
                            >
                                <option value="All">All Profiles</option>
                                {profiles.filter(p => p !== 'All').map(profile => <option key={profile} value={profile}>{profile}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Students List - Row Wise */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/5 border-b border-primary/10">
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[30%]">Name</th>
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[15%]">Room No</th>
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[15%]">Dept</th>
                                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest w-[20%] text-right">Profile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <td className="p-5">
                                            <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">{student.name}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                <MdRoom className="text-gray-400 group-hover:text-gold transition-colors" size={16} />
                                                {student.room}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                                <MdSchool className="text-gray-400 group-hover:text-gold transition-colors" size={16} />
                                                {student.dept}
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getProfileColor(student.profile)}`}>
                                                {student.profile}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {students.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                             <MdPerson size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No students found matching filters.</p>
                             <button 
                                onClick={() => setFilters({ block: 'All', dept: 'All', profile: 'All', search: '' })}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
};

export default Batch;
