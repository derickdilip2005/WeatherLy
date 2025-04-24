import { FC } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
}

const GlitchText: FC<GlitchTextProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className} group`}>
      <span className="relative inline-block">
        {children}
        <span className="absolute left-[2px] top-0 text-red-500 opacity-70 animate-[glitch_3s_infinite] hidden group-hover:inline-block">
          {children}
        </span>
        <span className="absolute -left-[2px] top-0 text-cyan-500 opacity-70 animate-[glitch_2s_infinite] hidden group-hover:inline-block">
          {children}
        </span>
      </span>
    </div>
  );
};

export default GlitchText;