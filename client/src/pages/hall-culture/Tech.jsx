import React, { useEffect, useState, useRef } from "react";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getPositionLabel = (position) => {
  switch (position) {
    case 1: return { medal: "Gold", place: "1ST PLACE", type: "gold" };
    case 2: return { medal: "Silver", place: "2ND PLACE", type: "silver" };
    case 3: return { medal: "Bronze", place: "3RD PLACE", type: "bronze" };
    default: return { medal: `#${position}`, place: `${position}TH PLACE`, type: "bronze" };
  }
};

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const Tech = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeYear, setActiveYear] = useState(null);
  const [achievementsData, setAchievementsData] = useState({});
  const [standings, setStandings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resultsRes, standingsRes] = await Promise.all([
          fetch(`${API_BASE}/api/events/category/TECHNOLOGY/results`),
          fetch(`${API_BASE}/api/events/category/TECHNOLOGY/standings`),
        ]);

        if (!resultsRes.ok || !standingsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const resultsData = await resultsRes.json();
        const standingsData = await standingsRes.json();

        // Build achievements keyed by year
        const achievements = {};
        for (const [year, results] of Object.entries(resultsData)) {
          achievements[year] = {
            cards: results.map((r) => ({
              title: r.eventName,
              caption: r.caption,
              ...getPositionLabel(r.position),
            })),
          };
        }
        setAchievementsData(achievements);

        // Build standings keyed by year
        const standingsMap = {};
        for (const s of standingsData) {
          standingsMap[s.year] = {
            position: s.position,
            totalPoints: s.totalPoints,
          };
        }
        setStandings(standingsMap);

        // Set active year to the most recent
        const years = Object.keys(achievements).sort((a, b) => b - a);
        if (years.length > 0) {
          setActiveYear(years[0]);
        }
      } catch (err) {
        console.error("Error fetching tech data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const { current } = galleryRef;
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const currentData = activeYear ? achievementsData[activeYear] : null;
  const currentStanding = activeYear ? standings[activeYear] : null;

  const eventsData = [
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBYq7gcBR1Nbaa5VjtSRAUhCes-LSLCcHfNaOEJh2oE6EKH9CiQIOAvwqnBqWn64f7kqKFiFtMcvK6oF_knlYOGso4y_uCp0uXZJGnZU7p5B2-YSXH1l8hsyJwkT7ARqn66_UUD6MELbZhMNfRauHS_Nv0pZrI8uiX1wPZTzICfoc5NTwe5GfKNEOTiuPJT77dp5nqfnS6-peC2PpH2t5aVNyxLeOUDSLTw58SMl3bhfBDI2s2pSwhbKdy-fpo0l8Rk73e9gC3z9sA",
      title: "Robotics",
      description:
        "Autonomous navigation, vision systems and hardware modeling.",
      captain: "Vikram Aditya",
      email: "vikram@example.com",
      linkedin: "https://linkedin.com/in/vikram",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA21YWFxbo9_iK5vQb9radCoLq3qUXAk_YZT7aBIw158JFdvgwRNhgMATBUQfpEt9hb5_UJAI1TogoCg8v6I_pgvmZh70A-sUdajsGBbBm8VGi9GxEj6YbT_KtAcIok9TXfRtChLz_d3_9RK24eAhVyWFI-Cd3fae0ZLSwcIh_zEYJk6kv-GwLpjtwPsRBT3nirOaJrjFxADMTzY_EKFAyjj7208zaxAPOs4Tg7RgItDq2kL8akyMhrPcHzexwflssQuvYCMHqFvm4",
      title: "Data Science",
      description:
        "ML models, statistical analysis and predictive visualization.",
      captain: "Ishita Roy",
      email: "ishita@example.com",
      linkedin: "https://linkedin.com/in/ishita",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAVXtSDqQbVX9bzDFWY6Cvo4RXgGWrw3tzE71M-gCJbmJIh0-4uskdqdz8fhAGqIXfWW3BHFojJxppvX1r1AZGx491kecUGHR8bpz-99yYRsWAt9_FkRKbRBOkPILghO2GSxbN1FgXx-ty1CgXkpMynPIz-ywGjTMwXOY-kexfj2oQ3HUeuB6_17DRPQntbverkNpDCRnfH04DyuIRpUT_fS_KUTUt7ua55KzcrZWnqe7ESVvHBacBazjOaiLdeS_LdJyDyylu2yaY",
      title: "Product Design",
      description: "UI/UX research, prototyping and industrial CAD design.",
      captain: "Samrat Sen",
      email: "samrat@example.com",
      linkedin: "https://linkedin.com/in/samrat",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAVXtSDqQbVX9bzDFWY6Cvo4RXgGWrw3tzE71M-gCJbmJIh0-4uskdqdz8fhAGqIXfWW3BHFojJxppvX1r1AZGx491kecUGHR8bpz-99yYRsWAt9_FkRKbRBOkPILghO2GSxbN1FgXx-ty1CgXkpMynPIz-ywGjTMwXOY-kexfj2oQ3HUeuB6_17DRPQntbverkNpDCRnfH04DyuIRpUT_fS_KUTUt7ua55KzcrZWnqe7ESVvHBacBazjOaiLdeS_LdJyDyylu2yaY",
      title: "Product Design",
      description: "UI/UX research, prototyping and industrial CAD design.",
      captain: "Samrat Sen",
      email: "samrat@example.com",
      linkedin: "https://linkedin.com/in/samrat",
    },
  ];

  const leadershipTeam = [
    {
      name: "Vedant Sewatkar",
      role: "Advisor",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAlL96oUy_Crpfs2JzDdA0Tg3QApTyAVU7tmT56IK2QZIKDmUK7Fg6cNs2nbMIpynQg6fPedMQLuc4HzT3gZm6xKGrMcaiDkgUDVvf1ceFZr2lggvj_rEOOrxdWijR59JyMkdU9-v2tdrHnUxq0lCYes0XKyGsb2OdGv7NelM2UayJ4QlqMCpwwpx5mpq2PqMdBCIvvE8U1Jchj5ryD6zZgQGklecxnDQwhgC3nAeDoB_IP-ti5veRU4sxVR-VzsQYwEPFa0tJ1f0g",
      email: "aravind@example.com",
      linkedin: "https://linkedin.com/in/aravind",
    },
    {
      name: "Aditya Kariwal",
      role: "General Secretary Technology",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBdNuyWO-pytQXzGPEAHpos7ZvqGwSC-Hrv1Eq9qwpiWAVUUcSHgueEH1zhkC7Y-xJv5keuhuaA1yfrjZECQkxJqfU0gmQclxXj6dQivGUUwCWcTCT-F6ZBllOkt-GKPGyn1RQIGt56jzSR8ZPA54vV7xA9tVeUgE2qTvgx1fKZuNssN2nV9I478YgxDuwoGE2YzhAc3lbxmFdDZzp30-LjyHrgrzEh9dPMILTjGEfO_EsKwFZl7NQ3OzT2c9D_drsOMMRaFe7zIZw",
      email: "ananya@example.com",
      linkedin: "https://linkedin.com/in/ananya",
    },
    {
      name: "Sushant Verma",
      role: "Tech Coordinator",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYunzI8N-rMvKgHtKONbqIzzVo_F_1ude-n-BEQxhMdOU-9VMvyGNXkAp91afkstFo50ecP6mH50fg5xuDfsM9lcA6XCGIJQtdViFx5gWrloxY_RffKybhZA41sBd-JTZHV_K2AvSFAAGdCgZzjOUXjfV18SxsQ_5u2khEjOK1KrCNQlqNQyHLilRwU9rEIq1HOum2TSN4hGwE_i1A8UEtbwvvx-pC9AohMED132oymeJtZUBQhTibp894HDmiJDf7fETxH51lE1Q",
      email: "rohan@example.com",
      linkedin: "https://linkedin.com/in/rohan",
    },
    {
      name: "Akshat Sharma",
      role: "Secretary",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYunzI8N-rMvKgHtKONbqIzzVo_F_1ude-n-BEQxhMdOU-9VMvyGNXkAp91afkstFo50ecP6mH50fg5xuDfsM9lcA6XCGIJQtdViFx5gWrloxY_RffKybhZA41sBd-JTZHV_K2AvSFAAGdCgZzjOUXjfV18SxsQ_5u2khEjOK1KrCNQlqNQyHLilRwU9rEIq1HOum2TSN4hGwE_i1A8UEtbwvvx-pC9AohMED132oymeJtZUBQhTibp894HDmiJDf7fETxH51lE1Q",
      email: "rohan@example.com",
      linkedin: "https://linkedin.com/in/rohan",
    },
    {
      name: "Shreyash Prashant Yadav",
      role: "Secretary",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCYunzI8N-rMvKgHtKONbqIzzVo_F_1ude-n-BEQxhMdOU-9VMvyGNXkAp91afkstFo50ecP6mH50fg5xuDfsM9lcA6XCGIJQtdViFx5gWrloxY_RffKybhZA41sBd-JTZHV_K2AvSFAAGdCgZzjOUXjfV18SxsQ_5u2khEjOK1KrCNQlqNQyHLilRwU9rEIq1HOum2TSN4hGwE_i1A8UEtbwvvx-pC9AohMED132oymeJtZUBQhTibp894HDmiJDf7fETxH51lE1Q",
      email: "rohan@example.com",
      linkedin: "https://linkedin.com/in/rohan",
    },
  ];

  const galleryImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCx8Okuv6AeEbTvpuupAI-UqoyEECw8P0U3b1JX5qrcskDvNcPg8NHzyA_d62ovvipi23uHF9u4wfCAR8t2BQ0eaiNyHKrkwQ1GVUWr0XXxkVIEcvUuqVyx5xTK1eNtguqfpE04VciFBL-ODPOnqcHEF-qMWYS0mlQwcn7C9V-AK5CTIwiY7csByBrX0IBwUrjN3-X85LKXydfQCCEBjSh42iGl8JAjIhiHnWSqAiCDR5SlkiW7d_fbMGuktYgfUPbzGCh_sJ88ke0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAuQf4icovGlM8qM-nabVPygfPdIIfEsBLinqjHKAc1lfjheYUeQPJW5Y4S-VYz__BOb8Ib0EPrRpnb8Qzi4hni6CQeD00ZiYTxzyw8Cfac6dES0mGeyuym6VrJNvG7o-LaU1cTUdN7V-PonjeV-Fz51sDt__1rbeyZKZuYp3YNAO4jZWJ4ePSvmRv2WLu_oockscNPyGsvPWOiZTvIjuHTR7KmlM-WUYUoiSpArfJdy3rMU3RKLbeSl7YQnNiLI9E--LO4_1dMCxs",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAdrnPwhd3EdFpQ4dhYWpBPMEtpzg4WyqqT-FZLhcpfiV7zEi_UMsP4Dcb8tDOQm6X6FtZ1lIGgE40tOwMH0gH4lyCM9jD2-kk0jtSVSCMJmdCECSX_gYhdIzaVz_Qu03DD0zbovSkmY9h1L93kO6gdwM56j6enYxYTpckIGNE990d1uw-Kldt5dDzwmLdbOPpwPlRy-WpB_7s2B-LO---2ubEa3-FrgV8VaXx_d8G4We-13oILhTYE-4z445z3bcYbtIpcuQ3ciiY",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuClg48JXcP2c7XhzsySrWwredAzoaZa2v-42xQH2HtczWR_E2P5T_aJ2-XNq4-aojVMny2B8OkhNVEcGqAN9q5QEYoICdO9xqfahAbZBf53WSlFXg8ANwUQSb3niAr1oVMmfDaxoqLOhFazMHRJk40IluOMYWI3NqLIMR22T6rcXmpGpVr0sasXGNeuk8r8l8vmnGIBox1DyV03T6l3OqzOLRiH7lN0mmJ79sL5dImKezgZHo6paaW0DJ6UFUcSSMnG0S2slQmoLY0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAdrnPwhd3EdFpQ4dhYWpBPMEtpzg4WyqqT-FZLhcpfiV7zEi_UMsP4Dcb8tDOQm6X6FtZ1lIGgE40tOwMH0gH4lyCM9jD2-kk0jtSVSCMJmdCECSX_gYhdIzaVz_Qu03DD0zbovSkmY9h1L93kO6gdwM56j6enYxYTpckIGNE990d1uw-Kldt5dDzwmLdbOPpwPlRy-WpB_7s2B-LO---2ubEa3-FrgV8VaXx_d8G4We-13oILhTYE-4z445z3bcYbtIpcuQ3ciiY",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAdrnPwhd3EdFpQ4dhYWpBPMEtpzg4WyqqT-FZLhcpfiV7zEi_UMsP4Dcb8tDOQm6X6FtZ1lIGgE40tOwMH0gH4lyCM9jD2-kk0jtSVSCMJmdCECSX_gYhdIzaVz_Qu03DD0zbovSkmY9h1L93kO6gdwM56j6enYxYTpckIGNE990d1uw-Kldt5dDzwmLdbOPpwPlRy-WpB_7s2B-LO---2ubEa3-FrgV8VaXx_d8G4We-13oILhTYE-4z445z3bcYbtIpcuQ3ciiY",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAdrnPwhd3EdFpQ4dhYWpBPMEtpzg4WyqqT-FZLhcpfiV7zEi_UMsP4Dcb8tDOQm6X6FtZ1lIGgE40tOwMH0gH4lyCM9jD2-kk0jtSVSCMJmdCECSX_gYhdIzaVz_Qu03DD0zbovSkmY9h1L93kO6gdwM56j6enYxYTpckIGNE990d1uw-Kldt5dDzwmLdbOPpwPlRy-WpB_7s2B-LO---2ubEa3-FrgV8VaXx_d8G4We-13oILhTYE-4z445z3bcYbtIpcuQ3ciiY",
  ];

  return (
    <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
      {/* Header Section */}
      <section className="relative w-full">
        <div className="flex flex-col w-full">
          <div className="w-full">
            <div className="flex flex-col w-full">
              <div className="@container">
                {/* 1. Main Container: Added 'group' for potential hover effects and relative positioning */}
                <div className="relative flex min-h-[550px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                  {/* 2. The Background Layer: This is where the magic happens */}
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")',
                    }}
                  ></div>

                  {/* 3. Content Layer: Ensure z-10 so it stays above the blur */}
                  <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                      TECHNOLOGY
                    </h1>
                    <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                      Patel Hall of Residence
                    </h2>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mt-8 relative z-10">
                    <a
                      className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-gold text-deep-maroon text-base font-bold shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all border border-white/20 group"
                      href="#standings"
                    >
                      <span className="material-symbols-outlined mr-2 group-hover:scale-110 transition-transform">
                        emoji_events
                      </span>
                      Our Standings
                    </a>
                    <a
                      className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white/10 text-white text-base font-bold border border-white/20 hover:bg-white/20 transition-all group backdrop-blur-sm"
                      href="#events"
                    >
                      <span className="material-symbols-outlined mr-2 group-hover:scale-110 transition-transform">
                        segment
                      </span>
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
      <section
        className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center bg-[#f9f5f0] border-y border-primary/5"
        id="standings"
      >
        <div className="max-w-[1200px] w-full">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-primary text-4xl font-serif font-bold tracking-tight mb-2">
              GC Tech Achievements
            </h2>
            <div className="h-1.5 w-24 bg-gold rounded-full mb-6"></div>
            <p className="text-gray-600 text-center max-w-2xl font-light">
              A legacy of technical dominance in the Inter-Hall General
              Championship. Select a year to view our performance.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p className="text-lg font-medium">Failed to load achievements.</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          ) : Object.keys(achievementsData).length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <span className="material-symbols-outlined text-5xl mb-4 block">emoji_events</span>
              <p className="text-lg font-medium">No results available yet.</p>
            </div>
          ) : (
            <>
              {/* Year Tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {Object.keys(achievementsData)
                  .sort((a, b) => b - a)
                  .map((year) => (
                    <button
                      key={year}
                      onClick={() => setActiveYear(year)}
                      className={`px-6 py-3 rounded-md border border-primary/10 font-bold transition-all ${
                        activeYear === year
                          ? "bg-deep-maroon text-gold shadow-lg"
                          : "bg-white text-gray-500 hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
              </div>

              {currentData && (
                <div className="space-y-12 animate-fade-in-up">
                  {/* Overall Standing Header */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-primary/10 pb-8 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0">
                        <span className="material-symbols-outlined text-primary">
                          calendar_month
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary uppercase tracking-tighter">
                        Year {activeYear}
                      </h3>
                    </div>
                    {currentStanding && (
                      <div className="flex items-center gap-6 bg-gradient-to-r from-deep-maroon to-primary border border-gold/40 p-1 pr-8 rounded-full shadow-xl">
                        <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
                          <span className="material-symbols-outlined text-deep-maroon text-3xl font-bold">
                            military_tech
                          </span>
                        </div>
                        <div>
                          <p className="text-gold/80 text-[10px] uppercase font-black tracking-widest leading-tight">
                            Overall Standing
                          </p>
                          <p className="text-white font-black text-2xl leading-none font-serif">
                            {getOrdinal(currentStanding.position)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentData.cards.map((card, index) => (
                      <div
                        key={index}
                        className={`bg-white p-6 rounded-xl flex flex-col group hover:-translate-y-2 transition-all duration-300 shadow-xl border-t-4 relative overflow-hidden ${
                          card.type === "gold"
                            ? "border-gold"
                            : card.type === "silver"
                              ? "border-gray-400"
                              : "border-[#cd7f32]"
                        }`}
                      >
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                          <span className="material-symbols-outlined text-8xl">
                            {card.type === "gold" || card.type === "silver"
                              ? "workspace_premium"
                              : "stars"}
                          </span>
                        </div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <span
                            className={`material-symbols-outlined text-5xl drop-shadow-sm ${
                              card.type === "gold"
                                ? "text-gold"
                                : card.type === "silver"
                                  ? "text-gray-400"
                                  : "text-[#cd7f32]"
                            }`}
                          >
                            {card.type === "gold" || card.type === "silver"
                              ? "workspace_premium"
                              : "stars"}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-1 rounded shadow-sm ${
                              card.type === "gold"
                                ? "bg-gold text-deep-maroon"
                                : card.type === "silver"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-[#cd7f32]/20 text-[#a05a2c]"
                            }`}
                          >
                            {card.place}
                          </span>
                        </div>
                        <div className="mt-auto relative z-10">
                          <h4 className="text-primary font-serif font-bold text-xl mb-1">
                            {card.title}
                          </h4>
                          {card.caption && (
                            <p className="text-gray-500 text-xs mb-2">{card.caption}</p>
                          )}
                          <div
                            className={`flex items-center gap-2 mt-4 ${
                              card.type === "gold"
                                ? "text-gold"
                                : card.type === "silver"
                                  ? "text-gray-400"
                                  : "text-[#cd7f32]"
                            }`}
                          >
                            <span className="text-xs font-bold uppercase tracking-wider">
                              {card.medal}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center bg-white">
        <div className="max-w-[1200px] w-full">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">
              The Leadership Team
            </h2>
            <div className="h-1 w-20 bg-gold rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member, index) => (
              <div
                key={index}
                className="bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    alt={member.role}
                    className="w-full h-full object-cover transition-all duration-500"
                    src={member.image}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-maroon/90 to-transparent p-4"></div>
                </div>
                <div className="p-5 flex flex-col items-center text-center grow">
                  <h4 className="text-primary font-serif font-bold text-lg mb-1">
                    {member.name}
                  </h4>
                  <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">
                    {member.role}
                  </p>
                  <div className="flex gap-4 mt-auto">
                    <a
                      className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all"
                      href={`mailto:${member.email}`}
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
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section
        className="py-12 md:py-16 px-4 md:px-20 lg:px-40 flex justify-center bg-[#f9f5f0]"
        id="events"
      >
        <div className="max-w-[1200px] w-full">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">
              Event Details
            </h2>
            <div className="h-1 w-20 bg-gold rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsData.map((event, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-white border border-primary/10 hover:border-gold/50 transition-all duration-300 shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={event.image}
                    alt={event.title}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-primary text-xl font-serif font-bold mb-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">
                          person
                        </span>
                      </div>
                      <div>
                        <p className="text-primary text-xs font-bold uppercase tracking-wide">
                          Captain
                        </p>
                        <p className="text-gray-500 text-sm font-medium">
                          {event.captain}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-16 hidden">
        <div className="px-4 md:px-20 lg:px-40">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-primary text-3xl font-bold tracking-tight mb-1 font-serif">
                Technology Gallery
              </h2>
              <p className="text-gray-500 italic">
                Snapshots of hard work and triumph.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollGallery("left")}
                className="p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => scrollGallery("right")}
                className="p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div
            ref={galleryRef}
            className="flex overflow-x-auto gap-4 no-scrollbar pb-6 snap-x scroll-smooth"
          >
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="flex-none w-72 h-96 rounded-xl overflow-hidden shadow-xl snap-center border border-primary/5 group"
              >
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

export default Tech;
