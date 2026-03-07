import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden bg-ivory px-4 py-16">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl text-center">
        <p className="text-gold font-bold tracking-[0.35em] uppercase text-xs mb-6">
          Error 404
        </p>
        <h1 className="text-6xl md:text-8xl font-serif font-black text-primary leading-none mb-6">
          Page Not Found
        </h1>
        <p className="text-gray-700 text-base md:text-lg max-w-xl mx-auto mb-10">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-red-900 text-white font-bold tracking-wide transition-all"
          >
            Go to Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-primary/20 bg-white hover:bg-primary/5 text-primary font-bold tracking-wide transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
