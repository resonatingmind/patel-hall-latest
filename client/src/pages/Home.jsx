import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="w-full">
            <div className="p-0">
                <div className="relative flex min-h-screen flex-col gap-6 overflow-hidden items-center justify-center p-4">
                    {/* Background Image with Blur */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105 brightness-90" style={{ backgroundImage: "url('/patel-hall.jpeg')" }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20"></div>
                    </div>
                    <div className="relative z-10 flex flex-col gap-6 text-center max-w-[900px] w-full px-4 mt-10">
                        <div className="flex flex-col gap-4">
                            <span className="text-gold font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-xs self-center text-center">Indian Institute of Technology Kharagpur</span>
                            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-[-0.03em] drop-shadow-2xl font-serif">
                                Patel Hall of Residence
                            </h1>
                            <div className="h-1 md:h-1.5 w-24 md:w-32 bg-primary mx-auto"></div>
                            <h2 className="text-white text-xl md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.6em] uppercase mt-2 md:mt-4 drop-shadow-md break-words">
                                PATEL | PASSION | PRIDE
                            </h2>
                        </div>
                    </div>
                    <div className="relative z-10 flex flex-row flex-wrap gap-3 justify-center mt-8 md:mt-12 w-full px-2">
                        <Link to="/about" className="flex flex-1 sm:flex-none sm:min-w-[200px] max-w-[180px] sm:max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 md:h-14 px-4 sm:px-8 bg-primary hover:bg-red-900 text-white text-sm md:text-base font-bold leading-normal tracking-wide transition-all transform hover:scale-105 shadow-2xl shadow-black/50 border border-white/10">
                            <span className="truncate">Explore Legacy</span>
                        </Link>
                        <Link to="/council" className="flex flex-1 sm:flex-none sm:min-w-[150px] max-w-[180px] sm:max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 md:h-14 px-4 sm:px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm md:text-base font-bold leading-normal tracking-wide transition-all">
                            <span className="truncate">Hall Council</span>
                        </Link>
                    </div>
                    <div className="hidden absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40">
                        <span className="text-[10px] uppercase tracking-[0.3em]">Patel Legacy</span>
                        <span className="material-symbols-outlined animate-bounce">keyboard_double_arrow_down</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
