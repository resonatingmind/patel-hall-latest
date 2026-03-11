import React, { useEffect, useState } from "react";
import { FaLinkedin, FaCode } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const WebTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchWebTeam();
  }, []);

  const fetchWebTeam = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/users/web-team`);
      setMembers(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching web team:", err);
      setError("Failed to load web team members.");
    } finally {
      setLoading(false);
    }
  };

  const MemberCard = ({ member }) => (
    <div className="bg-ivory rounded-2xl overflow-hidden group border border-primary/5 hover:border-gold/50 transition-all flex flex-col shadow-lg h-full transform hover:-translate-y-2">
      {/* Image */}
      <div className="aspect-[3/3.5] relative overflow-hidden bg-gray-100">
        {member.image ? (
          <img
            alt={`${member.firstName} ${member.lastName}`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            src={member.image}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <span className="text-6xl text-primary/20 font-serif font-black">
              {member.firstName?.charAt(0) || "?"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col items-center text-center grow bg-ivory">
        <h4 className="text-primary font-serif font-bold text-xl mb-1">
          {member.firstName} {member.lastName}
        </h4>
        <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider font-medium">
          {member.position}
        </p>

        <div className="flex gap-4 mt-auto">
          {member.email && (
            <a
              className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/60 hover:text-white hover:bg-primary transition-all"
              href={`mailto:${member.email}`}
              title={member.email}
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
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
      {/* Header Section */}
      <section className="relative w-full">
        <div className="flex flex-col w-full">
          <div className="@container">
            <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
              <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")',
                }}
              ></div>
              <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FaCode className="text-gold text-3xl md:text-4xl" />
                </div>
                <h1 className="text-white text-4xl md:text-5xl lg:text-7xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                  WEB TEAM
                </h1>
                <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                  The Team Behind This Website
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center bg-white">
        <div className="max-w-[1400px] w-full">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <button
                onClick={fetchWebTeam}
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-gold transition-colors"
              >
                Retry
              </button>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg font-medium">
                No web team members found.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex flex-col items-center mb-16">
                <h2 className="text-primary text-3xl font-serif font-bold tracking-tight mb-2">
                  Meet the Developer
                </h2>
                <div className="h-1 w-20 bg-gold rounded-full"></div>
              </div>
              <div
                className={`grid gap-10 ${
                  members.length === 1
                    ? "grid-cols-1 max-w-sm mx-auto"
                    : members.length === 2
                      ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                      : members.length === 3
                        ? "grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto"
                }`}
              >
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WebTeam;
