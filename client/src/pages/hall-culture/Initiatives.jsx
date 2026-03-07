import React, { useEffect } from 'react';

const Initiatives = () => {
    // Add effect to clean up any potential scroll locking or styles if needed
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col pt-8">
            {/* HERO SECTION - Adapted from About.jsx */}
            <section className="bg-deep-maroon pt-32 pb-24 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: 'url("/InitiativeBanner.jpg")' }}
                    ></div>
                    <div className="absolute inset-0 bg-deep-maroon/20"></div>
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Social Outreach</span>
                    <h1 className="text-white text-5xl md:text-7xl font-serif font-black mb-8">Initiatives</h1>
                    <div className="w-32 h-px bg-gold/50 mx-auto mb-10"></div>
                    <p className="text-ivory/90 text-2xl font-serif italic mb-4">
                        "Service Above Self"
                    </p>
                    <p className="text-gold font-serif text-xl md:text-2xl mb-10 font-medium">
                        Building a legacy of social responsibility
                    </p>
                    <p className="text-ivory/60 text-base leading-relaxed max-w-2xl mx-auto font-light tracking-wide uppercase">
                        Patel Hall is committed to making a tangible difference through student-led outreach and community service.
                    </p>
                </div>
            </section>
            
            {/* SECTION 1: Annual Blood Donation - Styled like "Historical Narrative" */}
            <section className="py-24 px-4 md:px-10 bg-ivory">
                <div className="max-w-[1000px] mx-auto">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-primary/60 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Annual Event</span>
                        <h2 className="text-4xl font-serif font-bold text-primary mb-6">Annual Blood Donation Camp</h2>
                        <div className="w-12 h-1 bg-gold mb-8"></div>
                        <p className="text-gray-700 text-lg leading-relaxed font-light">
                            Patel Hall's annual blood donation drive is a cornerstone of our social initiatives, organized in collaboration with BC Roy Hospital and local blood banks. Each year, our residents step forward in record numbers, embodying the spirit of "Service Above Self". The event serves as a platform for students to contribute directly to the healthcare ecosystem of Kharagpur.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                         <div className="bg-white p-8 shadow-xl border border-primary/5 text-center group hover:-translate-y-2 transition-all duration-300">
                             <div className="text-primary mb-4 flex justify-center"><span className="material-symbols-outlined text-5xl">trending_up</span></div>
                             <h4 className="text-4xl font-serif font-bold text-primary mb-2">150+</h4>
                             <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Units Collected</p>
                             <div className="mt-4 text-[#0bda5e] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-sm">arrow_upward</span> +15% from last year
                             </div>
                         </div>
                         <div className="bg-white p-8 shadow-xl border border-primary/5 text-center group hover:-translate-y-2 transition-all duration-300">
                             <div className="text-primary mb-4 flex justify-center"><span className="material-symbols-outlined text-5xl">groups</span></div>
                             <h4 className="text-4xl font-serif font-bold text-primary mb-2">120+</h4>
                             <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Total Donors</p>
                             <div className="mt-4 text-[#0bda5e] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-sm">stars</span> New Record
                             </div>
                         </div>
                         <div className="bg-white p-8 shadow-xl border border-primary/5 text-center group hover:-translate-y-2 transition-all duration-300">
                             <div className="text-primary mb-4 flex justify-center"><span className="material-symbols-outlined text-5xl">handshake</span></div>
                             <h4 className="text-4xl font-serif font-bold text-primary mb-2">4</h4>
                             <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Partner Organizations</p>
                             <div className="mt-4 text-primary/60 text-xs font-bold uppercase tracking-wider">
                                Hospitals & NGOs
                             </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]">
                        <div className="col-span-2 row-span-2 relative group overflow-hidden shadow-2xl h-[300px] md:h-auto">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                             <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDXhSYLMT59j2T5X3Y1Lias6O3E1Mzt2tz0VDUSjDH-dSb1qoE6FmNdtcsu3qnBI9fY4p2BA070LDe1hi3JlcGJGN0p4ROKS2M5UvH_E6iNjLTl15rK6JUSIowWqdMijeQrN8wAUnl0VLnshetwwNtJ-ePaxTII7v9fXH2wJElq4-Y5t3ijdOfK5zfQdD7cYyfRbNhBff2FjS_HPqvu758IyB9SWSRNRJ2ivzYefzF_SJC0ygKh_0kASPGzxjBKUcqQCn56ChZUis" 
                                className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                                alt="Main shot of blood donation camp" 
                            />
                        </div>
                        <div className="col-span-2 row-span-1 relative group overflow-hidden shadow-2xl h-[200px] md:h-auto">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                             <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3a8f38ndj-Bj0GyfUlU_TdQrc97v80VgcwPNnPso3pXIR9ipSMKLRf4FV7vjRKuZ-pBqc4XNuCyBk1D4wEgpRdf9-B0kOg0UYhxvPdunj312uwguxFGJHKQ5NsV4MaXu23GwDKemrWRtH2NjPfJc_AyQiYhWMCLPGDqEaVaw-X47I6sbP3xs_IsnpTY2P4QdVPlJ6-Dv-Eh_zB-4RXRhcfe2xT663P-tFSGWxzJtWRPNankBIU2_-EhJtX05nu52HlbgzFhfQ9c" 
                                className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                                alt="Donor resting area" 
                            />
                        </div>
                        <div className="col-span-1 row-span-1 relative group overflow-hidden shadow-2xl h-[150px] md:h-auto">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                             <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCISc3oiTDhbXuBbDQuSkFo6SBtNWHWmrLyVblnNpF4dLqn8lwZbTWtjw_jq5yDnBV1sVl7xnLuBaerBRDNBTBrNL6QUay4kvIjjFGkQetoOD9DPtJujurfSTQPJ5tjZAueFVNV2zGQDoG2KIFIJScXC6tIBuB_XzipmMqTUzkgsguNURRJnh_ky7P8FGH5EMSgXQFx4ymlXYK60_gnxpjNNNxnG21Cuh0d-VzmghriEupyYgECnqDbftiL049xfNGglOnwECNJ6dA" 
                                className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                                alt="Medical staff testing blood" 
                            />
                        </div>
                        <div className="col-span-1 row-span-1 relative group overflow-hidden shadow-2xl h-[150px] md:h-auto">
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                             <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLkzkTBRpGbpNbq8LEr6qUDm8ZsNbS1QMHzsU7JdLw_zlr0mnHJ4VjVovccEAC3vu_g-68lphjMQ0NTZgTWDucVtQ6kOr1CBQbHjvaivOAqJHGMzPFA04UUHfIFhI4vyxF2QTj4QB6HtvdPfXlq69-ETWms3BwKoUqUFQToPSMXEVm_sbjWMdNBYKMr1Z0mdsZjIty0nIE2ut6BfsvgPSeVlEUJb-j36mvyHOBHR8d55NKhwXueWXCuOawMBQnwzpYMJPyjndFMmY" 
                                className="w-full h-full object-cover transition-all duration-700 hover:scale-105" 
                                alt="Volunteer certificate distribution" 
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-primary/60">
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">person</span> Event Lead: Rahul Sharma</span>
                        <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">person</span> Co-Lead: Ananya Singh</span>
                    </div>
                </div>
            </section>

            {/* SECTION 2: Orphanage Drive - Styled like "Milestones Through Time" background */}
            <section className="py-24 bg-[#f9f5f0] border-y border-primary/5 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-4 md:px-10">
                    <div className="text-center mb-16">
                        <span className="text-primary/60 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Community Outreach</span>
                        <h2 className="text-3xl font-serif font-bold text-primary uppercase tracking-widest">Orphanage Donation Drive</h2>
                        <p className="text-gray-500 mt-2 italic">Building connections giving back.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                             <p className="text-gray-700 text-lg leading-relaxed font-light">
                                Beyond material support, our orphanage visits are about building connections. Our residents spend the day organizing drawing competitions, story-telling sessions, and sports activities for children at the local Kharagpur Orphanage.
                             </p>
                             
                             <div>
                                <h4 className="font-serif font-bold text-primary text-xl mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gold">inventory_2</span> Items Donated
                                </h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <div className="w-1 h-1 bg-gold rounded-full"></div>
                                        200+ Books & Stationery
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <div className="w-1 h-1 bg-gold rounded-full"></div>
                                        Winter Clothing Kits
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <div className="w-1 h-1 bg-gold rounded-full"></div>
                                        Sports Equipment
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <div className="w-1 h-1 bg-gold rounded-full"></div>
                                        Nutrition Packs
                                    </li>
                                </ul>
                             </div>

                             <div className="flex gap-4 pt-4 overflow-x-auto pb-4 no-scrollbar">
                                <div className="min-w-[150px] md:min-w-[200px] h-32 rounded-lg bg-white p-1 shadow-md border border-primary/5 rotate-[-2deg] hover:rotate-0 transition-all duration-300">
                                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBldvc7rqKu7M8ufNcnthcM_u6bvuFOCTSc6-tHsFHVUWmyz76hm_EbBQJ4kWXXgOQCnFBNroWK5OIXhRXmelAVPJawsHn9CIeuAn-PrPN5m-f6XjpsYB0R4oQzzcFv1eE5TG4m4VoyctfNNsWOMlifV-e_REsRAgBKpYFTauhSVmj32OAYGffWNd70Fn6NDM7NOtJMCQh6JK61zFdVu2OmzrUq-592s6duJO9uhaHxA5L34Iyyp1QiU7jsyZxS-5Cttx5VUPIrvEk" className="w-full h-full object-cover transition-all" alt="Mini 1" />
                                </div>
                                <div className="min-w-[150px] md:min-w-[200px] h-32 rounded-lg bg-white p-1 shadow-md border border-primary/5 rotate-[2deg] hover:rotate-0 transition-all duration-300">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHoeZVlM51xhIzkRyvghJk5XBum6xUG1cdV6zgd27MM-NznT3UOtutXJndSUUo9gp6MwPzdQV0ESLo6EqCl8IwgRH-Ip2XX0FIz7LsweaCaoqNufmI-HIYeFlNFM6ebc9t-2yXxdDc-2qu9Km7einJlbl-khE4ihdpfg0Kj30_yhm2GIekq3YGQqkryeyqz_NN1W1VLlr7v5r1ztRfrUrbZd4JdPRxZGVaLI80sCsQ0W0szD0JhG1Tj84gpH6t4gkn3po5wK6WsD8" className="w-full h-full object-cover transition-all" alt="Mini 2" />
                                </div>
                             </div>
                        </div>

                        <div className="relative group perspective-1000">
                             <div className="absolute -inset-4 border border-primary/10 transition-all group-hover:rotate-2 group-hover:scale-105 z-0"></div>
                             <div className="relative z-10 overflow-hidden shadow-2xl rounded-sm">
                                <img 
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmawpZAgDNOZThdPZpLQ52iEZAhGeYYgCVTF6xQU50q0l0lwl-t-bQM8710hfDgrD9okXP_6XhH2F0r4IyZr2CfoivbVUbLmsEW50T2ae0Ki4BVblkLUklbOa4p7zNJ8aXSOALNg_dR6ictY2xy_VFNd5dU9I1QHp4omxTh1T40oGbJvCRlDG8B7F3CNNWtTVxZJQWfhLbnRou_-J818EuQ8lHC0z4EAXUbBnL6O6iuqthTZSATPat7sjJdqK4pFCLoTItSLRElCA"
                                    className="w-full h-[500px] object-cover transition-all duration-700" 
                                    alt="Orphanage Drive Main"
                                />
                             </div>
                             <div className="absolute -left-2 -bottom-8 md:-left-8 bg-white p-6 shadow-xl border border-primary/5 z-20 max-w-[200px] block">
                                  <p className="text-4xl font-serif font-bold text-primary mb-1">50+</p>
                                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Student Volunteers</p>
                              </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Initiatives;