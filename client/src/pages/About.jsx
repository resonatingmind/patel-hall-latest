import React, { useEffect } from 'react';

const About = () => {
    // Add effect to clean up any potential scroll locking or styles if needed
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col">
            <section className="bg-deep-maroon pt-32 pb-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-4 block">ESTD. 1951</span>
                    <h1 className="text-white text-5xl md:text-7xl font-serif font-black mb-8">About Patel Hall</h1>
                    <div className="w-32 h-px bg-gold/50 mx-auto mb-10"></div>
                    <p className="text-ivory/90 text-2xl font-serif italic mb-4">
                        "Lux Et Veritas Vincant"
                    </p>
                    <p className="text-gold font-serif text-xl md:text-2xl font-medium">
                        Once a Patelian, Always a Patelian
                    </p>
                </div>
            </section>
            
            <section className="py-24 px-4 md:px-10 bg-ivory">
                <div className="max-w-[1000px] mx-auto">
                    <div className="flex flex-col items-center mb-16">
                        <span className="text-primary/60 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Historical Narrative</span>
                        <h2 className="text-4xl font-serif font-bold text-primary mb-6">The Soul of Kharagpur</h2>
                        <div className="w-12 h-1 bg-gold mb-8"></div>
                        <p className="text-gray-700 text-lg leading-relaxed font-light">
                            Patel Hall of Residence is the oldest hall in the institute to board the students since 1951. The motto of the hall is Lux et veritas vincant (translated as “Let Light and Truth Prevail”), and the residents and alumni, better known as Patelians, live by this motto. We take pride in standing together, learning together, and growing together in every story, every dream, and every smile that becomes part of our history.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 border border-primary/10 transition-all group-hover:scale-[1.02]"></div>
                            <img 
                                alt="Patel Hall Heritage" 
                                className="w-full h-[400px] object-cover grayscale brightness-90 contrast-125 shadow-2xl relative z-10" 
                                src="./old-photo.png"
                            />
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-serif font-bold text-primary">Founding & Legacy</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Patel Hall of Residence is named after India's first deputy Prime Minister and the Ironman of India, Sardar Vallabhbhai Patel. It is IIT Kharagpur's oldest hall of residence, with a long and illustrious history. Being the hall which once housed the Gymkhana, its walls speak of stories of the past and present.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Our legacy at Patel Hall is not just about GC and IITKGP; it's about the bonds of friendship that transcend barriers. It's about celebrating our differences and finding strength in our shared experiences. It's about fostering an environment where every individual is valued and respected, regardless of their background.
                            </p>
                            <div className="pt-4">
                                <div className="flex items-center gap-4 text-primary font-bold text-xs uppercase tracking-widest">
                                    <span className="w-8 h-px bg-primary"></span>
                                    A Tradition of Excellence
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#f9f5f0] border-y border-primary/5 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-4 md:px-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif font-bold text-primary uppercase tracking-widest">A stroll down memory lane</h2>
                        <p className="text-gray-500 mt-2 italic">A visual journey through decades of excellence</p>
                    </div>
                    <div className="flex overflow-x-auto gap-8 pb-12 no-scrollbar cursor-grab active:cursor-grabbing snap-x">
                        <div className="min-w-[400px] snap-center">
                            <div className="bg-white p-4 shadow-xl border border-primary/5 group">
                                <div className="overflow-hidden relative h-64 mb-4">
                                    <img 
                                        alt="Archival 1951" 
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXI2X0t8NqCDIXtMMI3V1s7NQjHXnb6qb-vF2cLeUFcdNz6ftOZM15u_Nx6j1-3joF0Fy9PlZikA6EYdftHPf0Pd3N-_VSGbGr4w-R-npFn1Z83AB5Wt2fSuagLs7KBXFOyaMhCjMwbiHAQgUsATBccY6LBex4coBOAafLvyY9JFBcYFX841BswrRN8ewDpzQtBOvdMljODK9mf-fGzlQBoYHZalzKNEBC_5dXZRhGLNENCwP1bCvWmhsxdhHiZKlWjq5jztrg23HO"
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="text-primary font-serif font-bold text-lg">Inauguration</h4>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-1">Founding Year</p>
                                    </div>
                                    <span className="text-gold font-serif italic text-2xl">1951</span>
                                </div>
                            </div>
                        </div>
                        <div className="min-w-[400px] snap-center">
                            <div className="bg-white p-4 shadow-xl border border-primary/5">
                                <div className="overflow-hidden relative h-64 mb-4">
                                    <img 
                                        alt="Dominance Era" 
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy4CrdN1uOVhsVSiBxWwQG1NWm4fdMyY0Yj1wMSW42sFh1jwqCLp63yPd1h0DLlUZJh5t3XPOv8PTmar_RQLRgoMJ4vvHRzmC_Edw24e-FiVS5NaWy4qF896hZV0B7xM83TfOO30gRtch95l24C4eMQE7xPGM5EpIbUGj1LpA9IecAq2jz2AKQ-LURUHz2XZ2nm7xNTGQr0p1--FFcSUen8r7EgqptEkHd5TnQtBH6c-BS9jCEOVrvkwjoNQWau_e5wq7wJP2wMj_l"
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="text-primary font-serif font-bold text-lg">The Golden Era</h4>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-1">General Championship Streak</p>
                                    </div>
                                    <span className="text-gold font-serif italic text-2xl">1970s</span>
                                </div>
                            </div>
                        </div>
                        <div className="min-w-[400px] snap-center">
                            <div className="bg-white p-4 shadow-xl border border-primary/5">
                                <div className="overflow-hidden relative h-64 mb-4">
                                    <img 
                                        alt="Present Day" 
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrICnhmYvsKqkMlsqnAm-_nvYfEUMqD5VsdRLB3KkcHJtk4TXSY8QVJikld6s3vKuh2dM0tBTAdjDypZDLo2ZK_CukvbnH8xOlOxIYnZjmipFGjzQNRRm7OPkstgWCPJeZpoAkC71iYm3AkZB_G0mEOEROFwL-4qcphhOq4Ikso4y0aW6WMvy2rnjN1PehSjQ6Mch1tOqKJS9c51OoMJ-etw50cE5pMHD-oWyr4zWojNpPjTgw7de5l1OE6RHnIg_Br6Zq-7WG_sv_"
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="text-primary font-serif font-bold text-lg">Modernization</h4>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-1">Preserving Legacy</p>
                                    </div>
                                    <span className="text-gold font-serif italic text-2xl">Present</span>
                                </div>
                            </div>
                        </div>
                        <div className="min-w-[400px] snap-center">
                            <div className="bg-white p-4 shadow-xl border border-primary/5">
                                <div className="overflow-hidden relative h-64 mb-4">
                                    <img 
                                        alt="Student Life" 
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU1uCiy0xECb7g92ttHC2uuLwo1rNmCVk06pXBna7mEgoJXCiA_CBGk9EFoMGOlDFrwVYGwqSfgM9PbgxSvM_ECV_ZzOslSUysnQXFbs1yGysQrQ_t7VTW4CVdW5kGNmLAv-aLmAivzu-1jv4hMg0RbDldYXCuYUwhZzhG1RgJLCPHv8eB1oEs5_E3gGvUuXCvdlFL-X8M4gSMmFGz8855LEaLPz8xEprkAHbHtc7zBNcE3l7Bkhu5nB5TJhRZG7ONZTzqHM4nJgX2"
                                    />
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="text-primary font-serif font-bold text-lg">Cultural Dominance</h4>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-1">Spirit of Illumination</p>
                                    </div>
                                    <span className="text-gold font-serif italic text-2xl">1990s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        <div className="h-1 w-12 bg-primary"></div>
                        <div className="h-1 w-4 bg-primary/20"></div>
                        <div className="h-1 w-4 bg-primary/20"></div>
                    </div>
                </div>
            </section>

            {/* <footer className="bg-[#1a0b0b] text-white pt-20 pb-12 px-10 border-t border-white/5">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="material-symbols-outlined text-4xl text-gold">account_balance</span>
                            <h2 className="text-2xl font-serif font-bold uppercase tracking-wider">Patel Hall</h2>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            An institution of honor, Patel Hall of Residence has been at the forefront of IIT Kharagpur's culture and heritage since 1951.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-all rounded-full">
                                <span className="material-symbols-outlined text-sm">public</span>
                            </a>
                            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-gold hover:text-primary transition-all rounded-full">
                                <span className="material-symbols-outlined text-sm">mail</span>
                            </a>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-bold text-gold text-[10px] uppercase tracking-[0.3em] mb-8">Quick Links</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tech</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Soc-cult</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sports</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Illumination</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Initiatives</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-bold text-gold text-[10px] uppercase tracking-[0.3em] mb-8">Resources</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">HMC Portal</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">ERP Login</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gymkhana</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">IIT Kharagpur</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hall Alumni</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h3 className="font-bold text-gold text-[10px] uppercase tracking-[0.3em] mb-8">Archives</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Historical Archive</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Photo Gallery</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Past Presidents</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hall Spirit</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em]">© 2024 Patel Hall of Residence. Excellence Since 1951.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-[0.2em]">Privacy</a>
                        <a href="#" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-[0.2em]">Terms</a>
                    </div>
                </div>
            </footer> */}
        </div>
    );
};

export default About;