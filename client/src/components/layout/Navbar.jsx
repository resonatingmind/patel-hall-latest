import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import {LogOut} from 'lucide-react'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCultureOpen, setIsMobileCultureOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
        setIsMobileCultureOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
      try {
          await supabase.auth.signOut();
          // Clear state first
          setUser(null); 
          // Use a slight delay or ensure this runs after state update
          navigate('/', { replace: true }); 
      } catch (error) {
          console.error("Error logging out:", error.message);
      }
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 z-[100] w-full bg-white/95 backdrop-blur-md shadow-md border-b border-white/20">
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/patel-hall-logo.png"
              alt="IIT KGP Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="w-26">
              <h2 className="w-full text-gray-900 text-sm font-bold leading-none uppercase tracking-tight">
                Patel Hall
              </h2>
              <p className="w-full text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-600 mt-0.5">
                IIT Kharagpur
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link className="nav-link" to="/administration">
            Administration
          </Link>
          <div className="relative group/culture h-full flex items-center">
            <button className="nav-link gap-1 py-4">
              Hall Culture
              <span className="material-symbols-outlined text-lg leading-none transition-transform duration-300 group-hover/culture:rotate-180">
                expand_more
              </span>
            </button>

            {/* Dropdown Container */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/culture:opacity-100 group-hover/culture:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover/culture:translate-y-0 w-[220px]">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden ring-1 ring-black/5 p-1.5">
                <Link
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl font-medium transition-all duration-200 group"
                  to="/tech"
                >
                  <span>Tech</span>
                  <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl font-medium transition-all duration-200 group"
                  to="/soc-cult"
                >
                  <span>Soc-cult</span>
                  <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl font-medium transition-all duration-200 group"
                  to="/sports"
                >
                  <span>Sports</span>
                  <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl font-medium transition-all duration-200 group"
                  to="/illumination"
                >
                  <span>Illumination</span>
                  <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl font-medium transition-all duration-200 group"
                  to="/initiatives"
                >
                  <span>Social Initiatives</span>
                  <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <Link className="nav-link" to="/portal">
            Portal
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 shrink-0">
          {user ? (
            <div
              className="cursor-pointer bg-primary hover:bg-red-900 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-105 flex items-center gap-2"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <span className="material-symbols-outlined text-sm">
                {<LogOut className="w-4 h-4" />}
              </span>
            </div>
          ) : (
            <Link
              className="bg-primary hover:bg-red-900 text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all transform hover:scale-105"
              to="/login"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-3xl">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
          <Link
            className="text-gray-700 font-medium py-2 border-b border-gray-50"
            to="/administration"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Administration
          </Link>

          <div className="border-b border-gray-50">
            <button
              className="w-full flex items-center justify-between py-2 text-gray-700 font-medium"
              onClick={() => setIsMobileCultureOpen(!isMobileCultureOpen)}
            >
              <span>Hall Culture</span>
              <span
                className={`material-symbols-outlined text-xl transition-transform duration-200 ${isMobileCultureOpen ? "rotate-180" : ""}`}
              >
                expand_more
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCultureOpen ? "max-h-[300px] opacity-100 mb-2" : "max-h-0 opacity-0"}`}
            >
              <div className="pl-4 flex flex-col gap-2 border-l-2 border-primary/10 ml-1 py-1">
                <Link
                  className="text-sm text-gray-600 hover:text-primary py-1"
                  to="/tech"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tech
                </Link>
                <Link
                  className="text-sm text-gray-600 hover:text-primary py-1"
                  to="/soc-cult"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Soc-cult
                </Link>
                <Link
                  className="text-sm text-gray-600 hover:text-primary py-1"
                  to="/sports"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sports
                </Link>
                <Link
                  className="text-sm text-gray-600 hover:text-primary py-1"
                  to="/illumination"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Illumination
                </Link>
                <Link
                  className="text-sm text-gray-600 hover:text-primary py-1"
                  to="/initiatives"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Social Initiatives
                </Link>
              </div>
            </div>
          </div>

          <Link
            className="text-gray-700 font-medium py-2 border-b border-gray-50"
            to="/portal"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Portal
          </Link>

          {user ? (
            <div
              className="cursor-pointer bg-primary text-white text-center py-3 rounded-lg font-bold mt-2 flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <span className="material-symbols-outlined text-sm">
                {<LogOut className="w-4 h-4"/>}
              </span>
            </div>
          ) : (
            <Link
              className="bg-primary text-white text-center py-3 rounded-lg font-bold mt-2"
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
