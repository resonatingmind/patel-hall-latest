import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdPhone, MdBusiness, MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Administration = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/administration-page`);
      setMembers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch administration members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate members by role
  const warden = members.find(
    (m) =>
      m.position?.toLowerCase().includes("warden") &&
      !m.position?.toLowerCase().includes("assistant"),
  );
  const assistantWardens = members.filter((m) =>
    m.position?.toLowerCase().includes("assistant warden"),
  );
  const otherStaff = members.filter(
    (m) =>
      m.role === "OTHER" ||
      (!m.position?.toLowerCase().includes("warden") && m.role !== "ADMIN"),
  );

  // Warden's static message (not from backend)
  const wardenMessage =
    "It is a matter of great pride to lead Patel Hall of Residence, an institution that has nurtured some of the finest minds of our country. Our hall is more than just a residence; it is a vibrant ecosystem where tradition meets modernity, and where students forge lifelong bonds.";

  if (isLoading) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-ivory text-[#2d1a1a] font-display min-h-screen flex flex-col">
      {/* Warden's Message Section */}
      {warden && (
        <section className="pt-40 pb-20 px-4 md:px-10 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-0.5 w-10 bg-gold"></div>
            <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs">
              Administration
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-primary mb-16">
            Warden's Message
          </h1>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8 order-2 md:order-1">
              <div className="relative">
                <span className="absolute -top-6 -left-4 text-8xl text-primary/10 font-serif font-black">
                  "
                </span>
                <p className="text-gray-700 leading-relaxed italic text-xl font-light relative z-10">
                  {wardenMessage}
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We are committed to providing a conducive environment for
                academic excellence and holistic development. Our administration
                works tirelessly to ensure that every resident feels at home
                while maintaining the high standards of discipline and
                camaraderie that Patel Hall is known for.
              </p>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-bold text-2xl font-serif text-primary">
                  {warden.name}
                </h4>
                <p className="text-gold text-xs font-bold uppercase tracking-widest mt-1">
                  {warden.position}
                  {warden.dept ? `, ${warden.dept}` : ""}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  {warden.phone && (
                    <a
                      href={`tel:${warden.phone}`}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors"
                    >
                      <MdPhone size={14} /> {warden.phone}
                    </a>
                  )}
                  {warden.office && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MdBusiness size={14} /> {warden.office}
                    </span>
                  )}
                  {warden.linkedin && (
                    <a
                      href={warden.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaLinkedin size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="absolute top-4 -right-4 w-full h-full border-2 border-primary/20 rounded-lg"></div>
              <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-2xl relative z-10">
                {warden.image ? (
                  <img
                    src={warden.image}
                    alt={warden.name}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(warden.name)}&background=800000&color=fff&size=400`}
                      alt={warden.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Assistant Wardens */}
      {assistantWardens.length > 0 && (
        <section className="py-24 px-4 md:px-10 bg-white shadow-inner">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4 text-primary">
                Assistant Wardens
              </h2>
              <div className="h-1 w-20 bg-gold mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {assistantWardens.map((aw) => (
                <div
                  key={aw.id}
                  className="group bg-white hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors z-10"></div>
                    {aw.image ? (
                      <img
                        src={aw.image}
                        alt={aw.name}
                        className="w-full h-full object-cover transition-all duration-700"
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(aw.name)}&background=800000&color=fff&size=400`}
                        alt={aw.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="text-center px-4">
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                      {aw.position}
                      {aw.dept ? `, ${aw.dept}` : ""}
                    </p>
                    <h3 className="font-serif font-bold text-2xl mb-2 text-primary">
                      {aw.name}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mt-3">
                      {aw.phone && (
                        <a
                          href={`tel:${aw.phone}`}
                          className="text-gray-400 hover:text-primary transition-colors"
                          title={aw.phone}
                        >
                          <MdPhone size={18} />
                        </a>
                      )}
                      {aw.office && (
                        <span className="text-gray-400" title={aw.office}>
                          <MdBusiness size={18} />
                        </span>
                      )}
                      {aw.linkedin && (
                        <a
                          href={aw.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FaLinkedin size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hall Staff (OTHER role members) */}
      {otherStaff.length > 0 && (
        <section className="py-24 px-4 md:px-10 bg-ivory">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4 text-primary">
                Hall Staff
              </h2>
              <div className="h-1 w-20 bg-gold mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {otherStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="flex bg-white p-8 shadow-sm hover:shadow-lg transition-all items-center gap-6 border border-gray-100"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border-4 border-ivory shadow-md">
                    {staff.image ? (
                      <img
                        src={staff.image}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=800000&color=fff&size=128`}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl font-serif text-primary">
                      {staff.name}
                    </h3>
                    <p className="text-gold text-xs uppercase tracking-widest font-bold mt-1">
                      {staff.position}
                      {staff.dept ? `, ${staff.dept}` : ""}
                    </p>
                    <div className="flex gap-4 mt-4">
                      {staff.phone && (
                        <a
                          href={`tel:${staff.phone}`}
                          className="text-gray-400 hover:text-primary transition-colors"
                          title={staff.phone}
                        >
                          <MdPhone size={18} />
                        </a>
                      )}
                      {staff.office && (
                        <span className="text-gray-400" title={staff.office}>
                          <MdBusiness size={18} />
                        </span>
                      )}
                      {staff.linkedin && (
                        <a
                          href={staff.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FaLinkedin size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Maintenance Staff */}
      <section className="relative py-28 bg-[#1a0b0b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1581094794329-cd6a3780deaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-gold"></div>
                <span className="text-gold font-bold tracking-[0.2em] uppercase text-sm">
                  Essential Services
                </span>
              </div>
              <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">
                Maintenance Staff
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                The backbone of Patel Hall. Our dedicated dadas ensures that
                every facility is functioning perfectly for the comfort of our
                residents. From cycle repairing to sanitation to food, they work
                round the clock to maintain the highest living standards.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 border border-white/10 rounded-lg group-hover:scale-105 transition-transform duration-500"></div>
              <div className="rounded-lg overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Maintenance Team"
                  className="w-full h-full object-cover  transition-all duration-700 brightness-90 contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-white font-serif text-xl italic">
                    "Excellence in Service"
                  </p>
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
