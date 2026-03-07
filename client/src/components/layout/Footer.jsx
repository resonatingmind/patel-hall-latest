import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <footer className="bg-[#080c12] text-white py-16 px-6 sm:px-10 border-t border-white/5">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                {/* Brand */}
                <div className="col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <img src="/iit-kharagpur-logo.webp" alt="IIT KGP Logo" className="hidden w-12 h-12 object-contain" />
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold leading-none">Patel Hall of Residence</h2>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">IIT Kharagpur</span>
                        </div>
                    </div>
                    <p className="text-gray-400 max-w-sm text-sm leading-relaxed italic">
                        "A legacy of excellence since 1951, fostering the leaders of tomorrow with passion and pride."
                    </p>
                    <div className="flex gap-3 mt-8">
                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/10"
                            href="https://www.facebook.com/share/1CDtEp6hT6/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebook className="text-base" />
                        </a>
                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/10"
                            href="https://www.instagram.com/patelhall.iitkgp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="text-base" />
                        </a>
                        <a
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/10"
                            href="https://www.linkedin.com/company/patel-hall-of-residence/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin className="text-base" />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-primary">Quick Links</h3>
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-gray-400 text-sm font-medium">
                        <li><Link className="footer-link" to="/tech">Tech</Link></li>
                        <li><Link className="footer-link" to="/illumination">Illu & Rangoli</Link></li>
                        <li><Link className="footer-link" to="/soc-cult">So-Cult</Link></li>
                        <li><Link className="footer-link" to="/initiatives">Social Initiatives</Link></li>
                        <li><Link className="footer-link" to="/sports">Sports</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div className="col-span-1">
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-primary">Resources</h3>
                    <ul className="space-y-3 text-gray-400 text-sm font-medium">
                        <li><a className="footer-link" href="https://www.iitkgp.ac.in" target="_blank" rel="noopener noreferrer">IIT Kharagpur Official</a></li>
                        <li><a className="footer-link" href="https://hmc.iitkgp.ac.in" target="_blank" rel="noopener noreferrer">Hall Management Centre</a></li>
                        <li><a className="footer-link" href="https://erp.iitkgp.ac.in" target="_blank" rel="noopener noreferrer">ERP Portal</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] uppercase tracking-widest">
                <p>© {new Date().getFullYear()} Patel Hall of Residence, IIT Kharagpur.</p>
                <div className="flex items-center gap-8">
                    <Link className="hover:text-white transition-colors" to="/team">Web Team</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
