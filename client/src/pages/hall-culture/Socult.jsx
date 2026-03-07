import React, { useEffect, useState, useRef } from 'react';
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Socult = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [activeSession, setActiveSession] = useState('2024-25');
    const galleryRef = useRef(null);

    const scrollGallery = (direction) => {
        if (galleryRef.current) {
            const { current } = galleryRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const achievementsData = {
        '2024-25': {
            overall: "RUNNERS UP",
            cards: [
                { cup: "Dramatics", title: "Stage Play", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Music", title: "Eastern Vocals", medal: "Silver Medalist", place: "2ND PLACE", type: "silver" },
                { cup: "Dance", title: "Choreography", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Fine Arts", title: "Painting", medal: "Bronze Medalist", place: "3RD PLACE", type: "bronze" }
            ]
        },
        '2023-24': {
            overall: "CHAMPIONS",
            cards: [
                { cup: "Dramatics", title: "Street Play", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Music", title: "Western Instruments", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Dance", title: "Street Dance", medal: "Silver Medalist", place: "2ND PLACE", type: "silver" },
                { cup: "Fine Arts", title: "Sketching", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" }
            ]
        },
        '2022-23': {
            overall: "RUNNERS UP",
            cards: [
                { cup: "Dramatics", title: "Mime", medal: "Silver Medalist", place: "2ND PLACE", type: "silver" },
                { cup: "Music", title: "Eastern Instruments", medal: "Bronze Medalist", place: "3RD PLACE", type: "bronze" },
                { cup: "Dance", title: "Solo Dance", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Fine Arts", title: "Poster Making", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" }
            ]
        },
        '2021-22': {
            overall: "2ND RUNNERS UP",
            cards: [
                { cup: "Dramatics", title: "Skit", medal: "Bronze Medalist", place: "3RD PLACE", type: "bronze" },
                { cup: "Music", title: "Western Vocals", medal: "Silver Medalist", place: "2ND PLACE", type: "silver" },
                { cup: "Dance", title: "Folk Dance", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Fine Arts", title: "Clay Modeling", medal: "Silver Medalist", place: "2ND PLACE", type: "silver" }
            ]
        },
        '2020-21': {
            overall: "CHAMPIONS",
            cards: [
                { cup: "Dramatics", title: "Monologue", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Music", title: "Band", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" },
                { cup: "Dance", title: "Contemporary", medal: "Silver Medalist", place: "2ND PLACE", type: "silver" },
                { cup: "Fine Arts", title: "Rangoli", medal: "Gold Medalist", place: "1ST PLACE", type: "gold" }
            ]
        }
    };

    const currentData = achievementsData[activeSession];

    const eventsData = [
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7", // Placeholder Image
            title: "Dramatics",
            description: "Expressing stories and emotions through the art of theater and performance.",
            captain: "Aditi Rao",
            email: "aditi@example.com",
            linkedin: "https://linkedin.com/in/aditi"
        },
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7", // Placeholder Image
            title: "Music",
            description: "Harmonizing melodies and rhythms to create unforgettable musical experiences.",
            captain: "Rohan Gupta",
            email: "rohan@example.com",
            linkedin: "https://linkedin.com/in/rohan"
        },
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7", // Placeholder Image
            title: "Dance",
            description: "Moving to the beat with grace, energy, and impeccably choreographed steps.",
            captain: "Sneha Reddy",
            email: "sneha@example.com",
            linkedin: "https://linkedin.com/in/sneha"
        }
    ];

    const galleryImages = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7",
         "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7",
         "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7",
         "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7",
         "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7",
    ];

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
            
            {/* Header Section */}
            <section className="relative w-full">
    <div className="flex flex-col w-full">
        <div className="w-full">
            <div className="flex flex-col w-full">
                <div className="@container">
                    {/* Main Container: relative and overflow-hidden are key here */}
                    <div className="relative flex min-h-[550px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                        
                        {/* Background Layer: Applying blur-md for a sophisticated look */}
                        <div 
                            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110" 
                            style={{
                                backgroundImage: 'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("/SoCult.jpg")'
                            }}
                        ></div>

                        {/* Content Layer: Wrapped in relative z-10 */}
                        <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                            <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                                SOCIAL & CULTURAL
                            </h1>
                            <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                                The Heart of Hall Culture | Patel Hall of Residence
                            </h2>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-8 relative z-10">
                            <a className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-gold text-deep-maroon text-base font-bold shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all border border-white/20 group" href="#standings">
                                <span className="material-symbols-outlined mr-2 group-hover:scale-110 transition-transform">emoji_events</span>
                                Our Standings
                            </a>
                            <a className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white/10 text-white text-base font-bold border border-white/20 hover:bg-white/20 transition-all group backdrop-blur-sm" href="#events">
                                <span className="material-symbols-outlined mr-2 group-hover:scale-110 transition-transform">theater_comedy</span>
                                Event Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

            {/* Standings Section */}
            <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center bg-[#f9f5f0] border-y border-primary/5" id="standings">
                <div className="max-w-[1200px] w-full">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-4xl font-serif font-bold tracking-tight mb-2">Socult Achievements</h2>
                        <div className="h-1.5 w-24 bg-gold rounded-full mb-6"></div>
                        <p className="text-gray-600 text-center max-w-2xl font-light">Celebrating creativity and expression in the Inter-Hall General Championship. Select a session to view our performance.</p>
                    </div>
                    
                    {/* Year Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {Object.keys(achievementsData).map((year) => (
                             <button 
                                key={year}
                                onClick={() => setActiveSession(year)}
                                className={`px-6 py-3 rounded-md border border-primary/10 font-bold transition-all ${
                                    activeSession === year 
                                    ? 'bg-deep-maroon text-gold shadow-lg' 
                                    : 'bg-white text-gray-500 hover:bg-primary/5 hover:text-primary'
                                }`}
                             >
                                {year}
                             </button>
                        ))}
                    </div>

                    <div className="space-y-12 animate-fade-in-up">
                        {/* Overall Standing Header */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/10 pb-8 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0">
                                        <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary uppercase tracking-tighter">Session {activeSession}</h3>
                                </div>
                            <div className="flex items-center gap-6 bg-gradient-to-r from-deep-maroon to-primary border border-gold/40 p-1 pr-8 rounded-full shadow-xl">
                                <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
                                    <span className="material-symbols-outlined text-deep-maroon text-3xl font-bold">theater_comedy</span>
                                </div>
                                <div>
                                    <p className="text-gold/80 text-[10px] uppercase font-black tracking-widest leading-tight">Overall Standing</p>
                                    <p className="text-white font-black text-2xl leading-none font-serif">{currentData.overall}</p>
                                </div>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {currentData.cards.map((card, index) => (
                                <div key={index} className={`bg-white p-6 rounded-xl flex flex-col group hover:-translate-y-2 transition-all duration-300 shadow-xl border-t-4 relative overflow-hidden ${
                                    card.type === 'gold' ? 'border-gold' : 
                                    card.type === 'silver' ? 'border-gray-400' : 
                                    'border-[#cd7f32]'
                                }`}>
                                    <div className="absolute top-0 right-0 p-2 opacity-5">
                                         <span className="material-symbols-outlined text-8xl">
                                            {card.type === 'gold' || card.type === 'silver' ? 'workspace_premium' : 'stars'}
                                         </span>
                                    </div>
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <span className={`material-symbols-outlined text-5xl drop-shadow-sm ${
                                            card.type === 'gold' ? 'text-gold' : 
                                            card.type === 'silver' ? 'text-gray-400' : 
                                            'text-[#cd7f32]'
                                        }`}>
                                            {card.type === 'gold' || card.type === 'silver' ? 'workspace_premium' : 'stars'}
                                        </span>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded shadow-sm ${
                                            card.type === 'gold' ? 'bg-gold text-deep-maroon' : 
                                            card.type === 'silver' ? 'bg-gray-200 text-gray-700' : 
                                            'bg-[#cd7f32]/20 text-[#a05a2c]'
                                        }`}>
                                            {card.place}
                                        </span>
                                    </div>
                                    <div className="mt-auto relative z-10">
                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Cup: {card.cup}</p>
                                        <h4 className="text-primary font-serif font-bold text-xl mb-1">{card.title}</h4>
                                        <div className={`flex items-center gap-2 mt-4 ${
                                            card.type === 'gold' ? 'text-gold' : 
                                            card.type === 'silver' ? 'text-gray-400' : 
                                            'text-[#cd7f32]'
                                        }`}>
                                            <span className="text-xs font-bold uppercase tracking-wider">{card.medal}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Team Section */}
            <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center bg-white">
                <div className="max-w-[1200px] w-full">
                    <div className="flex flex-col items-center mb-16">
                        <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">The Leadership Team</h2>
                        <div className="h-1 w-20 bg-gold rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Member 1 */}
                        <div className="bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg">
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img alt="Socult Secretary" className="w-full h-full object-cover transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlL96oUy_Crpfs2JzDdA0Tg3QApTyAVU7tmT56IK2QZIKDmUK7Fg6cNs2nbMIpynQg6fPedMQLuc4HzT3gZm6xKGrMcaiDkgUDVvf1ceFZr2lggvj_rEOOrxdWijR59JyMkdU9-v2tdrHnUxq0lCYes0XKyGsb2OdGv7NelM2UayJ4QlqMCpwwpx5mpq2PqMdBCIvvE8U1Jchj5ryD6zZgQGklecxnDQwhgC3nAeDoB_IP-ti5veRU4sxVR-VzsQYwEPFa0tJ1f0g"/>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-maroon/90 to-transparent p-4">
                                    <span className="bg-gold text-deep-maroon text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Socult Secretary</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col items-center text-center grow">
                                <h4 className="text-primary font-serif font-bold text-lg mb-1">Priya Das</h4>
                                <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Overall Cultural Head</p>
                                <div className="flex gap-4 mt-auto">
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="mailto:priya@example.com">
                                        <MdEmail className='scale-115'/>
                                    </a>
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="https://linkedin.com/in/priya" target="_blank" rel="noopener noreferrer">
                                       <FaLinkedin/>
                                    </a>
                                </div>
                            </div>
                        </div>

                         {/* Member 2 */}
                         <div className="bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg">
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img alt="Socult Secretary" className="w-full h-full object-cover transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdNuyWO-pytQXzGPEAHpos7ZvqGwSC-Hrv1Eq9qwpiWAVUUcSHgueEH1zhkC7Y-xJv5keuhuaA1yfrjZECQkxJqfU0gmQclxXj6dQivGUUwCWcTCT-F6ZBllOkt-GKPGyn1RQIGt56jzSR8ZPA54vV7xA9tVeUgE2qTvgx1fKZuNssN2nV9I478YgxDuwoGE2YzhAc3lbxmFdDZzp30-LjyHrgrzEh9dPMILTjGEfO_EsKwFZl7NQ3OzT2c9D_drsOMMRaFe7zIZw"/>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-maroon/90 to-transparent p-4">
                                    <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Second Socult Secy</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col items-center text-center grow">
                                <h4 className="text-primary font-serif font-bold text-lg mb-1">Rahul Sharma</h4>
                                <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Cultural Events</p>
                                <div className="flex gap-4 mt-auto">
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="mailto:rahul@example.com">
                                         <MdEmail className='scale-115'/>
                                    </a>
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="https://linkedin.com/in/rahul" target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin/>
                                    </a>
                                </div>
                            </div>
                        </div>

                         {/* Member 3 */}
                         <div className="bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg">
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img alt="Captain" className="w-full h-full object-cover transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYunzI8N-rMvKgHtKONbqIzzVo_F_1ude-n-BEQxhMdOU-9VMvyGNXkAp91afkstFo50ecP6mH50fg5xuDfsM9lcA6XCGIJQtdViFx5gWrloxY_RffKybhZA41sBd-JTZHV_K2AvSFAAGdCgZzjOUXjfV18SxsQ_5u2khEjOK1KrCNQlqNQyHLilRwU9rEIq1HOum2TSN4hGwE_i1A8UEtbwvvx-pC9AohMED132oymeJtZUBQhTibp894HDmiJDf7fETxH51lE1Q"/>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-maroon/90 to-transparent p-4">
                                    <span className="bg-primary/80 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Captain</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col items-center text-center grow">
                                <h4 className="text-primary font-serif font-bold text-lg mb-1">Aditi Rao</h4>
                                <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Dramatics Captain</p>
                                <div className="flex gap-4 mt-auto">
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="mailto:aditi@example.com">
                                         <MdEmail className='scale-115'/>
                                    </a>
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="https://linkedin.com/in/aditi" target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin/>
                                    </a>
                                </div>
                            </div>
                        </div>

                         {/* Member 4 */}
                         <div className="bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg">
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <img alt="Captain" className="w-full h-full object-cover transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClg48JXcP2c7XhzsySrWwredAzoaZa2v-42xQH2HtczWR_E2P5T_aJ2-XNq4-aojVMny2B8OkhNVEcGqAN9q5QEYoICdO9xqfahAbZBf53WSlFXg8ANwUQSb3niAr1oVMmfDaxoqLOhFazMHRJk40IluOMYWI3NqLIMR22T6rcXmpGpVr0sasXGNeuk8r8l8vmnGIBox1DyV03T6l3OqzOLRiH7lN0mmJ79sL5dImKezgZHo6paaW0DJ6UFUcSSMnG0S2slQmoLY0"/>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-maroon/90 to-transparent p-4">
                                    <span className="bg-primary/80 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Captain</span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col items-center text-center grow">
                                <h4 className="text-primary font-serif font-bold text-lg mb-1">Sneha Reddy</h4>
                                <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Dance Captain</p>
                                <div className="flex gap-4 mt-auto">
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="mailto:sneha@example.com">
                                         <MdEmail className='scale-115'/>
                                    </a>
                                    <a className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all" href="https://linkedin.com/in/sneha" target="_blank" rel="noopener noreferrer">
                                        <FaLinkedin/>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Events Section */}
            <section className="py-12 md:py-16 px-4 md:px-20 lg:px-40 flex justify-center bg-[#f9f5f0]" id="events">
                <div className="max-w-[1200px] w-full">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">Event Details</h2>
                        <div className="h-1 w-20 bg-gold rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventsData.map((event, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-xl bg-white border border-primary/10 hover:border-gold/50 transition-all duration-300 shadow-lg">
                                <div className="h-48 overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={event.image} alt={event.title} />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-primary text-xl font-serif font-bold mb-1">{event.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>
                                    <div className="flex items-center gap-3 border-t border-gray-100 pt-4 justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary text-sm">person</span>
                                            </div>
                                            <div>
                                                <p className="text-primary text-xs font-bold uppercase tracking-wide">Captain</p>
                                                <p className="text-gray-500 text-sm font-medium">{event.captain}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={`mailto:${event.email}`} className="hover:text-primary transition-colors text-gray-400">
                                                 <MdEmail className='scale-115'/>
                                            </a>
                                            <a href={event.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-gray-400">
                                                <FaLinkedin/>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-12 md:py-16">
                <div className="px-4 md:px-20 lg:px-40">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-primary text-3xl font-bold tracking-tight mb-1 font-serif">Socult Gallery</h2>
                            <p className="text-gray-500 italic">Expressions of art and culture.</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => scrollGallery('left')} className="p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button onClick={() => scrollGallery('right')} className="p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                    <div ref={galleryRef} className="flex overflow-x-auto gap-4 no-scrollbar pb-6 snap-x scroll-smooth">
                        {galleryImages.map((src, index) => (
                            <div key={index} className="flex-none w-72 h-96 rounded-xl overflow-hidden shadow-xl snap-center border border-primary/5 group">
                                <img 
                                    className="w-full h-full object-cover transition-all duration-500" 
                                    src={src} 
                                    alt={`Gallery Image ${index + 1}`} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Socult;