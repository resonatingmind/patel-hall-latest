import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdArrowBack, MdEvent } from "react-icons/md";

const CouncilEventDetails = () => {
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

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
                                             <Link to="/portal/council/manage-events" className="flex items-center gap-1 text-gold/80 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest">
                                                <MdArrowBack /> Back to Events
                                             </Link>
                                        </div>
                                        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                                            EVENT DETAILS
                                        </h1>
                                        <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                            Event ID: {id}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20 px-4 flex justify-center relative z-20">
                <div className="max-w-[1000px] w-full bg-white rounded-xl shadow-2xl p-10 text-center border-t-4 border-gold">
                    <MdEvent size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Event Content</h3>
                    <p className="text-gray-500">Event details page content will be implemented later.</p>
                </div>
            </section>
        </div>
    );
};

export default CouncilEventDetails;
