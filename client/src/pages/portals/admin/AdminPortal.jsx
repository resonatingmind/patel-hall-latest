import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdSchool, MdAdminPanelSettings } from "react-icons/md";

const AdminPortal = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">

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
                                            ADMIN PORTAL
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Welcome Admin
                                        </h2>
                                        <div className="text-white/80 text-sm tracking-wider uppercase font-bold bg-white/10 px-4 py-2 rounded-full inline-block mt-2">
                                            Hall Administration
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Buttons Section */}
            <section className="py-16 px-4 md:px-20 lg:px-40 flex justify-center bg-white -mt-20 relative z-20">
                <div className="max-w-[1200px] w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Button 1: Student Database (Admin view) */}
                        <Link
                            to="/portal/admin/student-database"
                            className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MdSchool size={120} />
                            </div>
                            <div className="relative z-10">
                                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                                    <MdSchool size={32} />
                                </span>
                                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">
                                    Student Database
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    View and manage the complete hall student database.
                                </p>
                                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                                    Open Database <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </Link>

                        {/* Button 2: Administrative Members Page */}
                        <Link
                            to="/portal/admin/administration"
                            className="text-left group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MdAdminPanelSettings size={120} />
                            </div>
                            <div className="relative z-10">
                                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                                    <MdAdminPanelSettings size={32} />
                                </span>
                                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">
                                    Administrative Members
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    Manage wardens and other hall staff on a dedicated page.
                                </p>
                                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                                    Manage Members <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminPortal;

