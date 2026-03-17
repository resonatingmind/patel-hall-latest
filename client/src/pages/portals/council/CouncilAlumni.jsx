import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdSearch,
  MdSchool,
  MdPerson,
  MdWorkOutline,
} from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { supabase } from "../../../lib/supabaseClient";
import axios from "axios";

const allDepartments = [
  "CS",
  "EC",
  "EE",
  "ME",
  "CH",
  "CE",
  "AE",
  "IM",
  "IE",
  "NA",
  "AG",
  "MI",
  "MT",
  "BT",
  "MF",
  "AR",
  "MA",
  "PH",
  "CY",
  "HS",
  "GG",
  "EX",
];
const defaultDepartments = ["All", ...allDepartments.sort()];

const CouncilAlumni = () => {
  // Function to get fresh token
  const getToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const [allAlumni, setAllAlumni] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    dept: "All",
    batch: "All",
    search: "",
  });

  const [departments, setDepartments] = useState(defaultDepartments);
  const [batches, setBatches] = useState(["All"]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setIsLoading(true);
    try {
      const currentToken = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/alumni`,
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        },
      );
      const fetchedData = response.data;
      setAllAlumni(fetchedData);
      setAlumni(fetchedData);

      const departmentsList = Array.from(
        new Set(fetchedData.map((a) => a.department).filter(Boolean)),
      ).sort();
      setDepartments(["All", ...departmentsList]);

      // Dynamically generate batches based on fetched data
      const batchesList = Array.from(
        new Set(fetchedData.map((a) => String(a.batchYear))),
      ).sort((a, b) => Number(b) - Number(a));
      setBatches(["All", ...batchesList]);
    } catch (err) {
      console.error("Failed to fetch alumni:", err);
      setError("Failed to load alumni database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let filtered = allAlumni;

    if (filters.dept !== "All") {
      filtered = filtered.filter((alum) => alum.department === filters.dept);
    }

    if (filters.batch !== "All") {
      filtered = filtered.filter(
        (alum) => String(alum.batchYear) === filters.batch,
      );
    }

    if (filters.search) {
      filtered = filtered.filter((alum) =>
        alum.fullName.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    setAlumni(filtered);
  }, [filters, allAlumni]);

  const renderProfileCell = (alum) => (
    <div className="flex flex-col gap-1">
      {alum.profile && (
        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MdWorkOutline
            className="text-gray-400 group-hover:text-gold transition-colors"
            size={16}
          />
          {alum.profile}
        </div>
      )}
      {alum.linkedin && (
        <a
          href={alum.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
        >
          <FaLinkedin size={16} /> LinkedIn
        </a>
      )}
      {!alum.profile && !alum.linkedin && (
        <span className="text-gray-400 text-sm">—</span>
      )}
    </div>
  );

  return (
    <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-10">
      {/* Header Section */}
      <section className="relative w-full">
        <div className="flex flex-col w-full">
          <div className="w-full">
            <div className="flex flex-col w-full">
              <div className="@container">
                <div className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
                  <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat blur-xs scale-110"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(74, 0, 0, 0.85) 0%, rgba(16, 22, 34, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_AOtFhZRsAj-qahqn3QKkG8gccl-CNDhqYVLnebmMCt4_PP-td1cAcidBbiOXkWu_h7OMU7kzgkImTqVC8zZP8d_T_87XpaCyxy2Tl7TFHFpRaAg1wuOWYGtHbQf8mF87r1IYMPUFmssSqGfTgZr6RhAyd2QZ1PrmE-wmGM6y-M6bsd1GQS6ddpMDtN7vDyJ6AZgQHFexef8fTL3h9tudRzRQfk76Tuc9ThWRHem9q0Q18vw7ONV3ygPuOEyKWOjQjaxwEwjup4")',
                    }}
                  ></div>
                  <div className="flex flex-col gap-4 relative z-10 max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Link
                        to="/portal"
                        className="flex items-center gap-1 text-gold/80 hover:text-gold transition-colors text-sm font-bold uppercase tracking-widest"
                      >
                        <MdArrowBack /> Back to Portal
                      </Link>
                    </div>
                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-serif font-black leading-tight tracking-[-0.05em] uppercase drop-shadow-lg">
                      ALUMNI DIRECTORY
                    </h1>
                    <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                      View Alumni Details | Council Portal
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 px-4 md:px-20 lg:px-40 flex justify-center relative z-20">
        <div className="max-w-[1200px] w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-gold">
          <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100 flex flex-col gap-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h3 className="text-primary text-2xl font-serif font-bold flex items-center gap-2">
                  <MdSchool className="text-gold" /> Alumni Directory
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  View complete records of hall alumni.
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full pt-4 border-t border-gray-100">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white"
                />
              </div>

              <select
                name="dept"
                value={filters.dept}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
              >
                <option value="All">All Departments</option>
                {departments
                  .filter((d) => d !== "All")
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
              </select>

              <select
                name="batch"
                value={filters.batch}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-gold focus:ring-1 focus:ring-gold outline-none text-sm bg-white cursor-pointer"
              >
                <option value="All">All Batches</option>
                {batches
                  .filter((b) => b !== "All")
                  .map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Alumni List */}
          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500 font-bold">
                {error}
              </div>
            ) : alumni.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">
                      Name
                    </th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">
                      Department
                    </th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest">
                      Profile
                    </th>
                    <th className="p-5 font-serif font-bold text-primary uppercase text-xs tracking-widest text-right">
                      Joining Year
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alumni.map((alum) => (
                    <tr
                      key={alum.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="font-bold text-gray-800 text-lg group-hover:text-primary transition-colors">
                          {alum.fullName}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <MdSchool
                            className="text-gray-400 group-hover:text-gold transition-colors"
                            size={16}
                          />
                          {alum.department}
                        </div>
                      </td>
                      <td className="p-5">{renderProfileCell(alum)}</td>
                      <td className="p-5 text-right">
                        {alum.batchYear && (
                          <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-gray-50 text-gray-600 border-gray-200">
                            {alum.batchYear}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <MdPerson size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No alumni found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CouncilAlumni;
