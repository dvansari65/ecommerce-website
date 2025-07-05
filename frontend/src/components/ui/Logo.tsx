import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="inline-block font-[Rubik] text-3xl font-extrabold text-black relative group"
    >
      <span className="lowercase tracking-wide text-white">sho</span>
      <span className="relative">
        <span className="lowercase tracking-wide text-blue-400">p</span>
        {/* Arc under the "p" */}
        <svg
          className="absolute -bottom-2 left-0 w-6 h-3 text-blue-400 group-hover:text-blue-500 transition"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M2 12s3.5 5 10 5 10-5 10-5" />
        </svg>
      </span>
      <span className="lowercase tracking-wide text-white">it</span>
      <sup className="text-xs ml-1 text-blue-400 group-hover:text-blue-500">®</sup>
    </Link>
  );
};

export default Logo;
