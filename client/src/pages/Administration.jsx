import React, { useEffect } from 'react';

const Administration = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Placeholder data
    const warden = {
        name: "Prof. Vivek Dixit",
        dept: "Department of Electronics and Electrical Communication Engineering",
        title: "Warden, Patel Hall of Residence",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        message: "It is a matter of great pride to lead Patel Hall of Residence, an institution that has nurtured some of the finest minds of our country. Our hall is more than just a residence; it is a vibrant ecosystem where tradition meets modernity, and where students forge lifelong bonds."
    };

    const assistantWardens = [
        { 
            name: "Prof. S.K. Gupta", 
            portfolio: "Mess", 
            dept: "Dept. of Mechanical Engineering",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        { 
            name: "Prof. R.C. Das", 
            portfolio: "Maintenance", 
            dept: "Dept. of Civil Engineering",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        },
        { 
            name: "Prof. M.K. Singh", 
            portfolio: "Sports", 
            dept: "Dept. of Physics",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ];

    const hallStaff = [
        { name: "Mr. Rajesh Sharma", role: "Hall Supervisor" },
        { name: "Mr. S.P. Chatterjee", role: "Mess Manager" }
    ];

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display min-h-screen flex flex-col">
            {/* Warden's Message Section */}
             <section className="pt-40 pb-20 px-4 md:px-10 max-w-7xl mx-auto w-full">
                 <div className="flex items-center gap-4 mb-4">
                     <div className="h-0.5 w-10 bg-gold"></div>
                     <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs">Administration</span>
                 </div>
                 <h1 className="text-5xl md:text-6xl font-serif font-black text-primary mb-16">Warden's Message</h1>
                 
                 <div className="grid md:grid-cols-2 gap-16 items-start">
                     <div className="space-y-8 order-2 md:order-1">
                         <div className="relative">
                            <span className="absolute -top-6 -left-4 text-8xl text-primary/10 font-serif font-black">"</span>
                            <p className="text-gray-700 leading-relaxed italic text-xl font-light relative z-10">
                                {warden.message}
                            </p>
                         </div>
                         <p className="text-gray-600 leading-relaxed text-lg">
                            We are committed to providing a conducive environment for academic excellence and holistic development. Our administration works tirelessly to ensure that every resident feels at home while maintaining the high standards of discipline and camaraderie that Patel Hall is known for.
                         </p>
                         <div className="pt-4 border-t border-gray-200">
                             <h4 className="font-bold text-2xl font-serif text-primary">{warden.name}</h4>
                             <p className="text-gold text-xs font-bold uppercase tracking-widest mt-1">{warden.title}</p>
                             <p className="text-gray-500 text-xs mt-1">{warden.dept}</p>
                         </div>
                     </div>
                     <div className="relative order-1 md:order-2">
                         <div className="absolute top-4 -right-4 w-full h-full border-2 border-primary/20 rounded-lg"></div>
                         <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-2xl relative z-10">
                             <img src={warden.image} alt={warden.name} className="w-full h-full object-cover transition-all duration-700" />
                         </div>
                     </div>
                 </div>
             </section>

             {/* Assistant Wardens */}
             <section className="py-24 px-4 md:px-10 bg-white shadow-inner">
                 <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-primary">Assistant Wardens</h2>
                        <div className="h-1 w-20 bg-gold mx-auto"></div>
                     </div>
                     
                     <div className="grid md:grid-cols-3 gap-10">
                         {assistantWardens.map((aw, idx) => (
                             <div key={idx} className="group bg-white hover:-translate-y-2 transition-transform duration-300">
                                 <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
                                     <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors z-10"></div>
                                     <img src={aw.image} alt={aw.name} className="w-full h-full object-cover transition-all duration-700" />
                                 </div>
                                 <div className="text-center px-4">
                                     <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{aw.portfolio}</p>
                                     <h3 className="font-serif font-bold text-2xl mb-2 text-primary">{aw.name}</h3>
                                     <p className="text-gray-500 text-sm font-light">{aw.dept}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </section>

             {/* Hall Staff */}
             <section className="py-24 px-4 md:px-10 bg-ivory">
                 <div className="max-w-5xl mx-auto">
                     <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-primary">Hall Staff</h2>
                        <div className="h-1 w-20 bg-gold mx-auto"></div>
                     </div>
                     <div className="grid md:grid-cols-2 gap-8">
                         {hallStaff.map((staff, idx) => (
                             <div key={idx} className="flex bg-white p-8 shadow-sm hover:shadow-lg transition-all items-center gap-6 border border-gray-100">
                                 <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border-4 border-ivory shadow-md">
                                      <img src={`https://ui-avatars.com/api/?name=${staff.name}&background=800000&color=fff&size=128`} alt={staff.name} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-xl font-serif text-primary">{staff.name}</h3>
                                     <p className="text-gold text-xs uppercase tracking-widest font-bold mt-1">{staff.role}</p>
                                     <div className="flex gap-4 mt-4">
                                         <button className="text-gray-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-lg">mail</span>
                                         </button>
                                         <button className="text-gray-400 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined text-lg">call</span>
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </section>

             {/* Maintenance Staff */}
             <section className="relative py-28 bg-[#1a0b0b] text-white overflow-hidden">
                 <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                      <img src="https://images.unsplash.com/photo-1581094794329-cd6a3780deaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Background" className="w-full h-full object-cover" />
                 </div>
                 <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
                     <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px w-12 bg-gold"></div>
                                <span className="text-gold font-bold tracking-[0.2em] uppercase text-sm">Essential Services</span>
                            </div>
                            <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">Maintenance Staff</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                                The backbone of Patel Hall. Our dedicated dadas ensures that every facility is functioning perfectly for the comfort of our residents. From cycle repairing to sanitation to food, they work round the clock to maintain the highest living standards.
                            </p>
                        </div>
                        <div className="relative group">
                             <div className="absolute -inset-4 border border-white/10 rounded-lg group-hover:scale-105 transition-transform duration-500"></div>
                             <div className="rounded-lg overflow-hidden shadow-2xl relative">
                                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Maintenance Team" className="w-full h-full object-cover  transition-all duration-700 brightness-90 contrast-125" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-white font-serif text-xl italic">"Excellence in Service"</p>
                                </div>
                             </div>
                        </div>
                     </div>
                 </div>
             </section>
        </div>
    );
};

export default Administration;
