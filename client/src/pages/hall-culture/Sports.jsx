import React, { useEffect, useState, useRef } from "react";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getPositionLabel = (position) => {
  switch (position) {
    case 1:
      return { medal: "Gold", place: "1ST PLACE", type: "gold" };
    case 2:
      return { medal: "Silver", place: "2ND PLACE", type: "silver" };
    case 3:
      return { medal: "Bronze", place: "3RD PLACE", type: "bronze" };
    default:
      return {
        medal: `#${position}`,
        place: `${position}TH PLACE`,
        type: "bronze",
      };
  }
};

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const Sports = () => {
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
          fetch(`${API_BASE}/api/events/category/SPORTS/results`),
          fetch(`${API_BASE}/api/events/category/SPORTS/standings`),
        ]);

        if (!resultsRes.ok || !standingsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const resultsData = await resultsRes.json();
        const standingsData = await standingsRes.json();

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

        const standingsMap = {};
        for (const s of standingsData) {
          standingsMap[s.year] = {
            position: s.position,
            totalPoints: s.totalPoints,
          };
        }
        setStandings(standingsMap);

        const years = Object.keys(achievements).sort((a, b) => b - a);
        if (years.length > 0) {
          setActiveYear(years[0]);
        }
      } catch (err) {
        console.error("Error fetching sports data:", err);
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
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7", // Placeholder Image
      title: "Cricket",
      description:
        "Strategizing victories on the pitch with discipline and teamwork.",
      captain: "Rahul Sharma",
      email: "rahul@example.com",
      linkedin: "https://linkedin.com/in/rahul",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7", // Placeholder Image
      title: "Football",
      description:
        "Passion and agility driving us to the goalpost every single time.",
      captain: "Amit Singh",
      email: "amit@example.com",
      linkedin: "https://linkedin.com/in/amit",
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAoV9tCF3C4I5x53h6sD6w_7c0A2B1kE5G5H0I9J6KcL3M7N4O1P8Q2R5S3T0U7V4W9X8Y2Z1A7B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7", // Placeholder Image
      title: "Hockey",
      description: "Stickwork and stamina defining our dominance on the field.",
      captain: "Suresh Kumar",
      email: "suresh@example.com",
      linkedin: "https://linkedin.com/in/suresh",
    },
  ];

  const [leadershipTeam, setLeadershipTeam] = useState([]);
  const [leadershipLoading, setLeadershipLoading] = useState(true);

  const DEFAULT_AVATAR =
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        setLeadershipLoading(true);
        const res = await fetch(
          `${API_BASE}/api/events/category/SPORTS/leadership`,
        );
        if (!res.ok) throw new Error("Failed to fetch leadership team");
        const data = await res.json();
        const mapped = data.map((m) => ({
          name: `${m.student.firstName} ${m.student.lastName}`,
          role: m.role,
          image: m.student.image || DEFAULT_AVATAR,
          email: m.student.user?.email || "",
          linkedin: m.student.linkedin || "",
        }));
        setLeadershipTeam(mapped);
      } catch (err) {
        console.error("Error fetching leadership team:", err);
      } finally {
        setLeadershipLoading(false);
      }
    };
    fetchLeadership();
  }, []);

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
                {/* Parent Container: Added 'relative' and 'overflow-hidden' */}
                <div className="relative flex min-h-[550px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                  {/* Background Layer: The Blur is applied here */}
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-105"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("/SportsBanner.jpg")',
                    }}
                  ></div>

                  {/* Content Layer: Wrapped in relative z-10 to stay above the blur */}
                  <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                      SPORTS
                    </h1>
                    <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                      Forging Champions | Patel Hall of Residence
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
                        sports_soccer
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
              Sports Achievements
            </h2>
            <div className="h-1.5 w-24 bg-gold rounded-full mb-6"></div>
            <p className="text-gray-600 text-center max-w-2xl font-light">
              A legacy of athletic dominance in the Inter-Hall General
              Championship. Select a year to view our performance.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p className="text-lg font-medium">
                Failed to load achievements.
              </p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          ) : Object.keys(achievementsData).length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <span className="material-symbols-outlined text-5xl mb-4 block">
                trophy
              </span>
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
                            trophy
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
                            <p className="text-gray-500 text-xs mb-2">
                              {card.caption}
                            </p>
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
          {leadershipLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : leadershipTeam.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <span className="material-symbols-outlined text-5xl mb-4 block">
                group
              </span>
              <p className="text-lg font-medium">
                No leadership members found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadershipTeam.map((member, index) => (
                <div
                  key={index}
                  className="bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                    <img
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-500"
                      src={member.image}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
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
                      {member.email && (
                        <a
                          className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all"
                          href={`mailto:${member.email}`}
                        >
                          <MdEmail className="scale-115" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all"
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${event.email}`}
                        className="hover:text-primary transition-colors text-gray-400"
                      >
                        <MdEmail className="scale-115" />
                      </a>
                      <a
                        href={event.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors text-gray-400"
                      >
                        <FaLinkedin />
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
              <h2 className="text-primary text-3xl font-bold tracking-tight mb-1 font-serif">
                Sports Gallery
              </h2>
              <p className="text-gray-500 italic">
                Moments of adrenaline and victory.
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

export default Sports;
