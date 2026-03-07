import React, { useEffect } from "react";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Council = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const councilData = {
    president: {
      name: "Rajshekhar Upadhyay",
      position: "Hall President",
      tag: "PRESIDENT",
      // Using a professional abstract/placeholder that looks good
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
      email: "mailto:urajshekhars@gmail.com",
      linkedin: "https://www.linkedin.com/in/rajshekhar-upadhyay/",
    },
    ssm: {
      name: "Sambhav Kothari",
      position: "Second Senate Member",
      tag: "SSM",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
      email: "mailto:sambhavkothari@gmail.com",
      linkedin: "https://www.linkedin.com/in/sambhav-kothari-b23b59247/",
    },
    auditor: {
      name: "Om Prakash Lenka",
      position: "Second Senate Member",
      tag: "SSM",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
      email: "mailto:omprakashlenka02@gmail.com",
      linkedin: "https://www.linkedin.com/in/om-prakash-lenka-589a55257/",
    },
    generalSecretaries: [
      {
        name: "Rudra Biswas",
        position: "GSec Sports & Games",
        department: "Sports & Games",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
        email: "mailto:sports@patelhall.iitkgp.ac.in",
        linkedin: "https://www.linkedin.com/in/rudra-biswas-00578828b/",
      },
      {
        name: "Aditya Kariwal",
        position: "GSec Technology",
        department: "Technology",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
        email: "mailto:kariwal25@gmail.com",
        linkedin: "https://www.linkedin.com/in/aditya-kariwal-730a04295/",
      },
      {
        name: "Aryan Shrivastava",
        position: "GSec So-Cult",
        department: "Social & Cultural",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        email: "mailto:soccult@patelhall.iitkgp.ac.in",
        linkedin: "https://www.linkedin.com/in/aryan-s-706945293/",
      },
      {
        name: "Vedansh Patel",
        position: "GSec Alumni Affairs",
        department: "Alumni Affairs",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
        email: "mailto:alumni@patelhall.iitkgp.ac.in",
        linkedin: "https://www.linkedin.com/in/vedansh-patel-a32a6728b/",
      },
      {
        name: "Sarthak Choudhary",
        position: "GSec Maintenance",
        department: "Maintenance",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
        email: "mailto:maint@patelhall.iitkgp.ac.in",
        linkedin: "https://www.linkedin.com/in/sarthak-choudhary-7a7889282/",
      },
      {
        name: "Ankit Pal",
        position: "GSec Library",
        department: "Library",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
        email: "mailto:library@patelhall.iitkgp.ac.in",
        linkedin: "https://www.linkedin.com/in/ankit-pal-59b398286/",
      },
      {
        name: "Ayush Munshi",
        position: "GSec Mess",
        department: "Mess",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
        email: "mailto:mess@patelhall.iitkgp.ac.in",
        linkedin: "https://www.linkedin.com/in/ayush-munshi-a7181a301/",
      },
      {
        name: "Nazeer Anwar",
        position: "GSec Welfare",
        department: "Welfare",
        tag: "General Secretary",
        image:
          "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop",
        email: "mailto:welfare@patelhall.iitkgp.ac.in",
        linkedin: "https://www.linkedin.com/in/nazeer-anwar-vintara-international/",
      },
    ],
    operationsSecretaries: [
      
    ],
    archives: [
      { year: "2024-25", link: "#" },
      { year: "2023-24", link: "#" },
    ],
  };

  // Card Component based on Tech.jsx Leadership Team Card
  const TechStyleCard = ({ member, isLarge = false }) => (
    <div
      className={`bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg h-full ${isLarge ? "transform hover:-translate-y-2" : ""}`}
    >
      {/* Image Container - Larger Aspect Ratio for President/SSM */}
      <div
        className={`${isLarge ? "aspect-[3/3.5]" : "aspect-[4/5]"} relative overflow-hidden`}
      >
        <img
          alt={member.position}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          src={member.image}
        />
      </div>

      {/* Content Container */}
      <div
        className={`${isLarge ? "p-6" : "p-5"} flex flex-col items-center text-center grow bg-ivory`}
      >
        <h4
          className={`text-primary font-serif font-bold ${isLarge ? "text-2xl" : "text-lg"} mb-1`}
        >
          {member.name}
        </h4>
        <p
          className={`text-gray-500 ${isLarge ? "text-sm" : "text-xs"} mb-4 uppercase tracking-wider font-medium`}
        >
          {member.department || member.position}
        </p>

        <div className="flex gap-4 mt-auto">
          <a
            className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all"
            href={member.email}
          >
            <MdEmail className="scale-115" />
          </a>
          <a
            className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all"
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
      {/* Header Section - Matches Tech.jsx */}
      <section className="relative w-full">
        <div className="flex flex-col w-full">
          <div className="w-full">
            <div className="flex flex-col w-full">
              <div className="@container">
                <div className="relative flex min-h-[500px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                  {/* Background Layer */}
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")',
                    }}
                  ></div>

                  {/* Content Layer */}
                  <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                      HALL COUNCIL
                    </h1>
                    <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                      Leadership 2025-26
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center bg-white">
        <div className="max-w-[1400px] w-full space-y-24">
          {/* Top Tier - President (Single Card) */}
          <div>
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">
                Hall Leadership
              </h2>
              <div className="h-1 w-20 bg-gold rounded-full"></div>
            </div>
            <div className="flex justify-center max-w-4xl mx-auto">
              <div className="w-full max-w-sm">
                <TechStyleCard member={councilData.president} isLarge={true} />
              </div>
            </div>
          </div>

          {/* President & SSM (Two Cards) */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <TechStyleCard member={councilData.ssm} isLarge={true} />
              <TechStyleCard member={councilData.auditor} isLarge={true} />
            </div>
          </div>

          {/* General Secretaries */}
          <div>
            <div className="flex flex-col items-center mb-16">
              <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">
                General Secretaries
              </h2>
              <div className="h-1 w-20 bg-primary/20 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {councilData.generalSecretaries.map((gsec, index) => (
                <TechStyleCard key={index} member={gsec} />
              ))}
            </div>
          </div>

          {/* Operations Secretaries */}
          <div className="hidden">
            <div className="flex flex-col items-center mb-16">
              <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-2">
                Operations & Welfare
              </span>
              <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">
                General Secretaries
              </h2>
              <div className="h-1 w-20 bg-primary/20 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {councilData.operationsSecretaries.map((gsec, index) => (
                <TechStyleCard key={index} member={gsec} />
              ))}
            </div>
          </div>

          {/* Archives Link */}
          {/* <div className="flex justify-center pt-8 border-t border-primary/5">
                        <div className="flex gap-4">
                             {councilData.archives.map((archive, index) => (
                                <a 
                                    key={index}
                                    href={archive.link}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 text-primary hover:bg-gold hover:text-deep-maroon transition-all font-bold text-sm uppercase tracking-wider group"
                                >
                                    <span>Council {archive.year}</span>
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                             ))}
                        </div>
                    </div> */}
        </div>
      </section>
    </div>
  );
};

export default Council;
