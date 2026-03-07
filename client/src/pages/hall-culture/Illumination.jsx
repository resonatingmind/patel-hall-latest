import React, { useEffect, useRef, useState } from 'react';

const Illumination = () => {
    const scrollContainerRef = useRef(null);
    const [lightboxImage, setLightboxImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const galleryImages = [
        {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYX0oZGtjhF8oeUXlPUVRaLyenSOzyIC2tslMZKiiGKqA4bBfhjzCGc8UvYMe_BOoQ2F16OXCRzLps8zvNUdPMpbymBAeSy674z8GUg0EhsoXp6rAF_Sh4SrJMp0NTh2U_6RJoNv9uABnNV1vj5R1CQm4TsrSxRGLRmcx4LPhWa8bXsXP8MuqdBc7iWzwUQEqYhmlYP9S2P3PxKqEOfZ1e9rfyaZejjO-tb-XKfUToVh-IEUKA4_vxRWBgo9Lj-B360CUqKu8bcWI",
            title: "The Great Chatai: 2023",
            subtitle: "Theme: Indian Independence"
        },
        {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMrdoRoEUo-F0f_IXi9upcbONZVgE6YCpdMB1Kdzsm-mSAAlAETOJSjxQn1L_gBQSmTxH4g73IlsNuZPrytWUcP1PMcZ3cbK0nW35_acxJqR3Mr8ugyOR9VGsnXnS9D4Iamn3T0MHKxRC2AR9VyBc3QgxQnj_tWiGNH0vK5H-z1EYnAfwWN5g_9Lz2f6f4nb8ChWv34ujfSvJeFp6GNhkJorABN9S-h9ypnfP-zxSfTqTU54ktdF2XQjNgnc6bmndb7jl5z7dCBSE",
            title: "Rangoli Artistry",
            subtitle: "Design: Peacock in Bloom"
        },
        {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCah4bD4gsVyyz5drQIiXSXJESHMceRx7Sj4889IUbCOEZL5DQ0H_m_MRd02NE8O7u9rGyRIlv4ZVt9ZOOXLvo0i4ujQ4tgQ6xrs9zfGlkv24vTSNwSpMsZu1asdFnODEgJa43WL3eKIazb9ovuIs2uQ4Gp-mx5TGW4sx0AlzaMw1h0wu9ij6L9G7i7L8OvvMlxD-O0Dx4bnqYvOT39uZXQMmnYgwTwtbokqRuc-ZO46tz1YxSv3bTNdlpWAXVLvByujcBttppM2Og",
            title: "Night of 20,000 Lights",
            subtitle: "Panorama View of Patel Hall"
        },
         {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMF_gmCXuZbgSPb50Wt0v7hlDhCx6xjSQLvXr636PMP59yM_BsgNKap5-NzA3OzWq6PIV6NCeM-cD1Ttlep47AaBTvosJ-FZ4aKmIGKgCJOq-3gInMZTu5gryPfROIyW1RXPbQPWYMXASHEMjT4s7pACrHjCC0Moq-WG6uUr3o8JZx8dWWSLmaStIqcAMl4rbR9wwvBcVE4TbDSYeDJiTijcCHjRg-wNrUp36MnfEIA0PfjSrJ8nispPLlowL_44es33jmrDa1XAI",
            title: "The Chatai",
            subtitle: "A massive grid of diyas"
        }
    ];

    return (
        <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col pt-10">
            {/* Hero Section */}
            <section className="relative w-full">
    <div className="flex flex-col w-full">
        <div className="w-full">
            <div className="flex flex-col w-full">
                <div className="@container">
                    {/* Parent Container */}
                    <div className="relative flex min-h-[550px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                        
                        {/* Background Layer: Separated to apply blur without affecting text */}
                        <div 
                            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110" 
                            style={{
                                backgroundImage: 'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("/IlluBanner.jpg")'
                            }}
                        ></div>

                        {/* Content Layer: Higher z-index to stay sharp */}
                        <div className="flex flex-col gap-4 relative z-10 max-w-4xl sm:mx-auto sm:px-2 scale-90 sm:scale-100">
                            <span className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-2 block">
                                A Legacy of Light
                            </span>
                            <h1 className="text-white text-5xl font-serif font-black leading-tight tracking-[-0.05em] @[480px]:text-7xl uppercase drop-shadow-lg">
                                Illumination & Rangoli
                            </h1>
                            <h2 className="text-gold text-lg font-medium tracking-widest uppercase @[480px]:text-xl font-serif">
                                The Signature Chatai Tradition of Patel Hall
                            </h2>
                            <p className="text-ivory/80 text-lg font-serif italic mt-4">
                                "Where thousands of lamps tell a story"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

             {/* Overall Standings */}
             <section className="py-12 md:py-24 px-4 md:px-10 bg-ivory">
                <div className="max-w-[1000px] mx-auto">
                    <div className="flex flex-col items-center text-center mb-16">
                        <span className="text-primary/60 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Competition History</span>
                        <h2 className="text-4xl font-serif font-bold text-primary mb-6">Our Legacy of Victory</h2>
                        <div className="w-12 h-1 bg-gold mb-8"></div>
                    </div>
                
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* 2023 */}
                         <div className="bg-white p-8 rounded shadow-xl border border-primary/5 group hover:-translate-y-2 transition-transform duration-300">
                             <div className="flex justify-between items-start mb-4">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">2023 Season</span>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Gold</span>
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-primary mb-2">Winner</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                First place in both Illumination & Rangoli. Theme: "Indian Independence".
                            </p>
                         </div>
                        
                         {/* 2022 */}
                         <div className="bg-white p-8 rounded shadow-xl border border-primary/5 group hover:-translate-y-2 transition-transform duration-300">
                             <div className="flex justify-between items-start mb-4">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">2022 Season</span>
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Silver</span>
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-primary/80 mb-2">Runner Up</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                 A distinguished 'Taj Mahal' design that captivated the judges.
                            </p>
                         </div>

                          {/* 2021 */}
                          <div className="bg-white p-8 rounded shadow-xl border border-primary/5 group hover:-translate-y-2 transition-transform duration-300">
                             <div className="flex justify-between items-start mb-4">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">2021 Season</span>
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Gold</span>
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-primary mb-2">Winner</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Record-breaking 25,000 diyas used for the 'Mahabharat' theme.
                            </p>
                         </div>
                    </div>
                </div>
             </section>

             {/* Leadership Section */}
             <section className="py-12 md:py-24 bg-[#f9f5f0] border-y border-primary/5">
                <div className="max-w-[1200px] mx-auto px-4 md:px-10">
                     <div className="text-center mb-16">
                        <span className="text-primary/60 font-bold tracking-[0.3em] uppercase text-[10px] mb-4">Leadership</span>
                        <h2 className="text-4xl font-serif font-bold text-primary mb-6">Architects of Light</h2>
                        <div className="w-12 h-1 bg-gold mx-auto mb-8"></div>
                        <p className="text-gray-600 max-w-xl mx-auto italic">
                            The visionaries who orchestrate the grand symphony of light and color.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {/* Leaders */}
                         {[
                            { title: "Illumination Captain", name: "Arnav Sharma", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1eSovXrH4_8QRPQcSNyd9qQ2ut0kS95hcycXAsd4DcXDP94jT40mLHkXbm8ZKRNQBrXKCj2g1BT5h-9WKN7bZ1NVVGxP6g7T29sYMJVP1XfJaGaKRQRVEDkXQaMPHvj_wvKwaiy_NFN7ui-SpH0dil6-DiI_-laDY7XD4AEsfsmYds-NT0WD1GZwX_dSH7rLwP0YsBWgeF2EKesOZqk7_8vStjuwmXz56EBqRLwkQI__IXmrrI_KzlRyduW-zsrCbUVX_GvUx7U" },
                            { title: "Rangoli Captain", name: "Vikram Aditya", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGDh_pvvZcarDNr4KKzi39tFYnGSA5Iukw6djJl48oRX2lenSBe_tKCPcKGJ06rr_9fiao7niRqYcgOHuI0rOA9Pdt_YtS6HoEK-5YB1WyueznNhPvdyVeqRgvc4zdBdVp3NRSL70Ck7Fy9-1b6aOAI0yTkzc0Z-OSz666Clhcmc00o2R6__97a9pmj6XwqjFTmIgatOV3Sjt-Edth5wG5DnGZS7lDVf665ERv0tWrdo1ec52qH2F6t1PyOdBE6oNw1st0r8fWVs8" },
                            { title: "Vice Captain", name: "Rohan Verma", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjZwz9c6lU_7ug7u5KHvgruq_7Cowb7Wksf_SqiVJtecF10gaKLVMiLwfnsufp-9qtS7l0jXQ7_U8DCYdw-AixlXdTBSlKebCYKdZYO6ramYPqd6aupBAQ4fjqeF0I4RNKBA1WQhh1vJX89GSGiB_UyQiLgwZF6W5kn1_m_sA9LQ_F9L353ZZb2ygN7JGOJHcjtC2qyl54t98OZgVRIEGwNFD8F98Ec7J1IYTuRKJFVB7u8_A_T8FCLGIIxpnfmSiYCalkudF2WoY" },
                            { title: "Vice Captain", name: "Sameer Khan", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkT4C964kdFnfxfHxS1fO8C_f7I-h-iIhOqlACGrLyhx1rWhlzYpASdQUoiVCqz6XfmN8td8KRiclZZI223tGgvy5766fqZvZrTgRxjJrU2f7fribjBjBXnXtbfaVvUJekZxIFreKtegHpVmMG-JWSCwqU16P-2pral1mXBogLvC1vOxC8BSm0RJFLSx2tvgKAEiqC35GC92SLCpP8yKncL4FFo6BggdhY50Ne2EjbB9X7RUlahW9dYajiURPcUBiONcZOezzmSVI" }
                         ].map((leader, index) => (
                              <div key={index} className="bg-white p-4 shadow-lg border border-primary/5 group">
                                <div className="aspect-square bg-cover bg-center mb-4 transition-all duration-500" style={{backgroundImage: `url('${leader.img}')`}}></div>
                                <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">{leader.title}</p>
                                <h4 className="text-xl font-serif font-bold text-[#2d1a1a]">{leader.name}</h4>
                              </div>
                         ))}
                    </div>
                </div>
             </section>

              {/* Gallery Section */}
            <section className="py-12 md:py-24 px-4 bg-ivory relative">
                 <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-4">
                         <div className="mb-6 md:mb-0">
                            <span className="text-primary/60 font-bold tracking-[0.3em] uppercase text-[10px] mb-2 block">Archives</span>
                            <h2 className="text-4xl font-serif font-bold text-primary">Gallery of Illu-Rangoli</h2>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => scroll('left')} className="w-12 h-12 border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center rounded-full">
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                             <button onClick={() => scroll('right')} className="w-12 h-12 border border-primary/20 hover:bg-primary hover:text-white transition-all flex items-center justify-center rounded-full">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    <div 
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-8 pb-12 no-scrollbar scroll-smooth snap-x px-4"
                    >
                         {galleryImages.map((img, index) => (
                             <div key={index} className="min-w-[85vw] md:min-w-[400px] lg:min-w-[600px] snap-center cursor-pointer group" onClick={() => setLightboxImage(img)}>
                                 <div className="relative overflow-hidden aspect-video shadow-2xl">
                                     <div 
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{backgroundImage: `url('${img.url}')`}}
                                     ></div>
                                     <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg">zoom_in</span>
                                     </div>
                                 </div>
                                 <div className="mt-4">
                                     <h4 className="text-primary font-serif font-bold text-xl">{img.title}</h4>
                                     <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mt-1">{img.subtitle}</p>
                                 </div>
                             </div>
                         ))}
                    </div>
                 </div>
            </section>

            {/* Simple Lightbox */}
            {lightboxImage && (
                <div 
                    className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button 
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <span className="material-symbols-outlined text-4xl">close</span>
                    </button>
                    <div className="max-w-7xl max-h-[90vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <img 
                            src={lightboxImage.url} 
                            alt={lightboxImage.title}
                            className="max-h-[80vh] w-auto shadow-2xl object-contain"
                        />
                         <div className="mt-4 text-center">
                            <h3 className="text-white text-2xl font-serif font-bold">{lightboxImage.title}</h3>
                            <p className="text-white/60 text-sm mt-1">{lightboxImage.subtitle}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Illumination;