import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdReportProblem, MdListAlt, MdGroups, MdSportsCricket, MdTheaterComedy, MdComputer, MdPerson, MdEdit, MdLogout, MdSchool } from "react-icons/md";

const MemberPortal = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Mock Data
    const userProfile = {
        name: "Aditya Kumar",
        rollNo: "22EC10001",
        roomNo: "B-204",
        department: "Electronics & Electrical Communication",
        email: "aditya.kumar@example.com",
        phone: "+91 98765 43210",
        bloodGroup: "B+",
        dob: "2003-08-15"
    };

    const messCardDetails = {
        id: "PH-2024-22EC10001",
        messOption: "Non-Vegetarian",
        extraCoupons: 5,
        status: "Active"
    };

    const participationStats = [
        { category: "Tech", count: 12, icon: <MdComputer />, color: "gold" },
        { category: "Cultural", count: 8, icon: <MdTheaterComedy />, color: "silver" },
        { category: "Sports", count: 15, icon: <MdSportsCricket />, color: "bronze" }
    ];

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-20">
            
            {/* Header Section */}
            <section className="relative w-full">
                <div className="flex flex-col w-full">
                    <div className="w-full">
                        <div className="flex flex-col w-full">
                            <div className="@container">
                                <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                                    
                                    {/* Background Layer */}
                                    <div 
                                        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110" 
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")'
                                        }}
                                    ></div>

                                    {/* Content Layer */}
                                    <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                                        <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                                            STUDENT PORTAL
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Welcome, {userProfile.name}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile & Mess Card Section */}
            <section className="py-12 px-4 md:px-20 lg:px-40 flex justify-center -mt-20 relative z-20">
                <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* User Profile Card */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-gold group">
                        <div className="p-6 md:p-8">
                             <div className="flex justify-between items-start mb-6">
                                <h3 className="text-primary text-2xl font-serif font-bold">Personal Details</h3>
                                <Link to="/update-profile" className="text-gray-400 hover:text-primary transition-colors">
                                    <MdEdit size={24} />
                                </Link>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg shrink-0">
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        <MdPerson size={64} />
                                    </div>
                                </div>
                                <div className="space-y-3 w-full text-center md:text-left">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Full Name</p>
                                        <p className="text-lg font-serif font-bold text-primary">{userProfile.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Roll No</p>
                                            <p className="font-medium">{userProfile.rollNo}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Room No</p>
                                            <p className="font-medium">{userProfile.roomNo}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Department</p>
                                            <p className="font-medium">{userProfile.department}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mess Card */}
                    <div className="bg-gradient-to-br from-deep-maroon via-[#2a0f0f] to-black rounded-xl shadow-2xl overflow-hidden text-gold border border-gold/30 relative group transform hover:scale-[1.01] transition-transform duration-300">
                         {/* Card Background Pattern */}
                         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                         
                         <div className="p-6 md:p-8 relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                         <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-deep-maroon font-serif font-black text-xs">PH</div>
                                         <span className="font-serif font-bold tracking-widest uppercase text-sm opacity-80">Patel Hall Mess</span>
                                    </div>
                                    <p className="text-white/50 text-xs tracking-wider">Session 2024-2025</p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-gold text-deep-maroon text-xs font-black px-2 py-1 rounded uppercase tracking-wider">{messCardDetails.status}</span>
                                </div>
                            </div>

                            <div className="my-6">
                                <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">Mess ID</p>
                                <p className="font-mono text-2xl text-white tracking-wider shadow-black drop-shadow-md">{messCardDetails.id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-t border-gold/20 pt-4">
                                <div>
                                    <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">Selected Mess</p>
                                    <p className="text-white font-serif font-bold text-lg">{messCardDetails.messOption}</p>
                                </div>
                                <div>
                                    <p className="text-gold/60 text-xs uppercase tracking-widest mb-1">Extra Coupons</p>
                                    <p className="text-white font-serif font-bold text-lg">{messCardDetails.extraCoupons}</p>
                                </div>
                            </div>
                         </div>
                    </div>

                </div>
            </section>

             {/* Participation Details Section */}
             <section className="py-12 px-4 md:px-20 lg:px-40 flex justify-center bg-[#f9f5f0] border-y border-primary/5">
                <div className="max-w-[1200px] w-full">
                     <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">Participation Stats</h2>
                        <div className="h-1 w-20 bg-gold rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {participationStats.map((stat, index) => (
                             <div key={index} className={`bg-white p-6 rounded-xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 shadow-xl border-t-4 relative ${
                                    stat.color === 'gold' ? 'border-gold' : 
                                    stat.color === 'silver' ? 'border-gray-400' : 
                                    'border-[#cd7f32]'
                                }`}>
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg ${
                                     stat.color === 'gold' ? 'bg-gold/10 text-gold' : 
                                     stat.color === 'silver' ? 'bg-gray-100 text-gray-500' : 
                                     'bg-[#cd7f32]/10 text-[#cd7f32]'
                                }`}>
                                    <span className="text-4xl">{stat.icon}</span>
                                </div>
                                <h3 className="text-primary font-serif font-bold text-xl mb-1">{stat.category}</h3>
                                <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Events Participated</p>
                                <div className={`text-4xl font-black ${
                                     stat.color === 'gold' ? 'text-gold' : 
                                     stat.color === 'silver' ? 'text-gray-500' : 
                                     'text-[#cd7f32]'
                                }`}>
                                    {stat.count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </section>

            {/* Action Buttons Section */}
            <section className="py-16 px-4 md:px-20 lg:px-40 flex justify-center bg-white">
                <div className="max-w-[1200px] w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Button 1: View Participation Log */}
                         <Link to="/portal/participation-log" className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MdListAlt size={120} />
                            </div>
                            <div className="relative z-10">
                                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                                    <MdListAlt size={32} />
                                </span>
                                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">Participation Log</h3>
                                <p className="text-gray-600 text-sm mb-6">View detailed history of all events you have participated in.</p>
                                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                                    View Logs <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </Link>

                         {/* Button 2: View Batch */}
                         <Link to="/portal/batch" className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MdSchool size={120} />
                            </div>
                            <div className="relative z-10">
                                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                                    <MdSchool size={32} />
                                </span>
                                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">My Batch</h3>
                                <p className="text-gray-600 text-sm mb-6">Find your batchmates, details including room numbers and profiles.</p>
                                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                                    View Batch <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </Link>

                         {/* Button 3: Submit Grievance */}
                         <Link to="/portal/submit-grievance" className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MdReportProblem size={120} />
                            </div>
                            <div className="relative z-10">
                                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                                    <MdReportProblem size={32} />
                                </span>
                                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">Submit Grievance</h3>
                                <p className="text-gray-600 text-sm mb-6">Report maintenance issues or register other complaints.</p>
                                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                                    Lodge Complaint <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MemberPortal;
