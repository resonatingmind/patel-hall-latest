import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  MdReportProblem,
  MdListAlt,
  MdGroups,
  MdSportsCricket,
  MdTheaterComedy,
  MdComputer,
  MdPerson,
  MdEdit,
  MdLogout,
  MdSchool,
  MdAdminPanelSettings,
} from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { supabase } from "../../../lib/supabaseClient";
import EditProfileModal from "../../../components/EditProfileModal";

const DEPARTMENT_MAP = {
  CS: "Computer Science & Engg",
  EC: "Electronics & Electrical Comm",
  EE: "Electrical Engineering",
  ME: "Mechanical Engineering",
  CH: "Chemical Engineering",
  CE: "Civil Engineering",
  AE: "Aerospace Engineering",
  IM: "Industrial & Systems Engg",
  IE: "Instrumentation Engineering",
  NA: "Ocean Engg & Naval Architecture",
  AG: "Agricultural & Food Engg",
  MI: "Mining Engineering",
  MT: "Metallurgical & Materials Engg",
  BT: "Biotechnology",
  MF: "Manufacturing Science & Engg",
  AR: "Architecture & Regional Planning",
  MA: "Mathematics",
  PH: "Physics",
  CY: "Chemistry",
  HS: "Humanities & Social Sciences",
  GG: "Geology & Geophysics",
  EX: "Exploration Geophysics",
};

const JOB_PROFILE_MAP = {
  SDE: "Software Development",
  DATA: "Data Science / Analytics",
  CONSULT: "Consulting",
  FINANCE: "Finance",
  CORE: "Core Engineering",
  PRODUCT: "Product Management",
  OTHERS: "Others",
};

const CouncilPortal = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data) {
        setUserData(res.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getSessionYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 is January, 6 is July

    if (month >= 6) {
      // July onwards
      return `${year}-${year + 1}`;
    } else {
      // Jan to June
      return `${year - 1}-${year}`;
    }
  };

  const userProfile = {
    name: userData?.student?.firstName
      ? `${userData.student.firstName} ${userData.student.lastName}`
      : user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        "Student",
    rollNo: userData?.student?.rollNumber || "N/A",
    roomNo: userData?.student?.block
      ? `${userData.student.block}-${userData.student.roomNumber}`
      : "N/A",
    department: userData?.student?.department
      ? DEPARTMENT_MAP[userData.student.department] ||
        userData.student.department
      : "N/A",
    email: userData?.email || user?.email || "",
    jobProfile: userData?.student?.jobProfile
      ? JOB_PROFILE_MAP[userData.student.jobProfile] ||
        userData.student.jobProfile
      : "N/A",
    linkedin: userData?.student?.linkedin || "",
  };

  const messCardDetails = {
    id: userData?.student?.rollNumber
      ? `PH-2024-${userData.student.rollNumber}`
      : "N/A",
    messOption: "Non-Vegetarian",
    extraCoupons: 5,
    status: "Active",
  };

  return (
    <div className="bg-ivory text-[#2d1a1a] font-display overflow-x-hidden min-h-screen flex flex-col transition-colors duration-300 pt-20">
      {/* Header Section */}
      <section className="relative w-full">
        <div className="flex flex-col w-full">
          <div className="w-full">
            <div className="flex flex-col w-full">
              <div className="@container">
                <div className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden p-6 text-center shadow-2xl w-full">
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
                      COUNCIL PORTAL
                    </h1>
                    <h2 className="text-gold text-base md:text-lg font-medium tracking-widest uppercase font-serif">
                      Welcome, {userProfile.name}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile & Mess Card Section */}
      <section className="py-12 px-4 md:px-20 lg:px-40 flex justify-center -mt-20 relative z-20">
        <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4 border-gold group flex flex-col h-full">
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-primary text-2xl font-serif font-bold">
                  Personal Details
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <MdEdit size={24} />
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start flex-1">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg shrink-0">
                  {userData?.student?.image ? (
                    <img
                      src={userData.student.image}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <MdPerson
                        size={64}
                        className="w-12 h-12 sm:w-16 sm:h-16"
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-3 w-full text-center md:text-left h-full flex flex-col justify-center">
                  <div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold">
                      Full Name
                    </p>
                    <p className="text-base sm:text-lg font-serif font-bold text-primary leading-tight">
                      {userProfile.name}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold">
                        Roll No
                      </p>
                      <p className="font-medium text-sm sm:text-base">
                        {userProfile.rollNo}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold">
                        Room No
                      </p>
                      <p className="font-medium text-sm sm:text-base">
                        {userProfile.roomNo}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold">
                        Job Profile
                      </p>
                      <p className="font-medium text-sm sm:text-base">
                        {userProfile.jobProfile}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold">
                        LinkedIn
                      </p>
                      {userProfile.linkedin ? (
                        <a
                          href={userProfile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#0077B5] hover:text-[#005582] transition-colors font-medium text-sm sm:text-base"
                        >
                          <FaLinkedin size={18} />
                          <span>Profile</span>
                        </a>
                      ) : (
                        <p className="font-medium text-sm sm:text-base">N/A</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 font-bold">
                        Department
                      </p>
                      <p className="font-medium text-sm sm:text-base leading-tight">
                        {userProfile.department}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mess Card */}
          <div className="bg-gradient-to-br from-deep-maroon via-[#2a0f0f] to-black rounded-xl shadow-2xl overflow-hidden text-gold border border-gold/30 relative group transform hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            <div className="p-6 md:p-8 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 flex-1">
              {/* Left Side: Info (Desktop) / Top & Bottom (Mobile) */}
              <div className="flex flex-col flex-1 text-center sm:text-left w-full h-full justify-between sm:justify-center items-center sm:items-start order-1 sm:order-1">
                {/* 1. Hall Info */}
                <div className="mb-6 sm:mb-auto mt-auto sm:mt-0 w-full">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 mb-1">
                    <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-gold flex items-center justify-center text-deep-maroon font-serif font-black text-sm shadow-md mb-1 sm:mb-0 shrink-0">
                      PH
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-serif font-bold tracking-widest uppercase text-lg sm:text-base text-white drop-shadow-sm leading-tight text-center sm:text-left">
                        Patel Hall Mess
                      </h3>
                      <p className="text-gold/70 text-xs tracking-wider uppercase font-semibold text-center sm:text-left">
                        Session {getSessionYear()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 inline-flex justify-center sm:justify-start w-full sm:w-auto">
                    <span className="bg-gold/20 text-gold border border-gold/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      {messCardDetails.status}
                    </span>
                  </div>
                </div>

                {/* QR Code on Mobile (Rendered here for ordering, hidden on sm+) */}
                <div className="w-full flex justify-center sm:hidden mb-6 order-2">
                  <div className="bg-white p-3 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border-2 border-gold/30 w-48 h-48 flex items-center justify-center">
                    <QRCode
                      value={messCardDetails.id || "N/A"}
                      size={256}
                      style={{
                        height: "100%",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      bgColor="#ffffff"
                      fgColor="#2a0f0f"
                      level="Q"
                    />
                  </div>
                </div>

                {/* 3. Mess ID */}
                <div className="mt-auto sm:mt-4 order-3 w-full">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1 font-medium text-center sm:text-left">
                    Mess ID
                  </p>
                  <p className="font-mono text-xl sm:text-2xl text-gold tracking-wider font-bold drop-shadow-md break-all text-center sm:text-left">
                    {messCardDetails.id}
                  </p>
                </div>
              </div>

              {/* Right Side: QR Code (Hidden on mobile, visible on sm+) */}
              <div className="shrink-0 bg-white p-2 md:p-3 rounded-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)] border-2 border-gold/30 transform group-hover:scale-105 transition-transform duration-500 w-32 h-32 md:w-40 md:h-40 hidden sm:flex items-center justify-center order-2 sm:order-2">
                <QRCode
                  value={messCardDetails.id || "N/A"}
                  size={256}
                  style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                  bgColor="#ffffff"
                  fgColor="#2a0f0f"
                  level="Q"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="py-16 px-4 md:px-20 lg:px-40 flex justify-center bg-white">
        <div className="max-w-[1200px] w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Button 1: Manage Events */}
            <Link
              to="/portal/council/manage-events"
              className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MdTheaterComedy size={120} />
              </div>
              <div className="relative z-10">
                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                  <MdTheaterComedy size={32} />
                </span>
                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">
                  Manage Events
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Create, update, or remove hall events and notices.
                </p>
                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                  Go to Dashboard{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>

            {/* Button 2: Student Database */}
            <Link
              to="/portal/council/batch"
              className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MdGroups size={120} />
              </div>
              <div className="relative z-10">
                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                  <MdGroups size={32} />
                </span>
                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">
                  Batch
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Find batchmates, view details including room numbers and
                  profiles.
                </p>
                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                  View Batch{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>

            {/* Button 3: Alumni Database */}
            <Link
              to="/portal/council/alumni"
              className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MdSchool size={120} />
              </div>
              <div className="relative z-10">
                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                  <MdSchool size={32} />
                </span>
                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">
                  Alumni Database
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Connect with Alumni and view their records.
                </p>
                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                  View Alumni{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>

            {/* Button 4: Submit Grievance */}
            <Link
              to="/portal/council/grievance"
              className="group relative overflow-hidden rounded-xl bg-ivory border-2 border-primary/10 hover:border-gold/50 p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MdReportProblem size={120} />
              </div>
              <div className="relative z-10">
                <span className="bg-primary/5 text-primary p-3 rounded-lg inline-block mb-4 group-hover:bg-primary group-hover:text-gold transition-colors">
                  <MdReportProblem size={32} />
                </span>
                <h3 className="text-xl font-bold text-deep-maroon font-serif mb-2">
                  Submit Grievance
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Report maintenance issues or register other complaints.
                </p>
                <span className="text-primary font-bold text-sm tracking-wider uppercase border-b-2 border-transparent group-hover:border-gold transition-all inline-flex items-center gap-2">
                  Lodge Complaint{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onProfileUpdated={fetchUserData}
      />
    </div>
  );
};

export default CouncilPortal;
