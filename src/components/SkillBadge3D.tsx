import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFastapi,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiSqlite,
  SiFirebase,
  SiSupabase,
  SiSelenium,
  SiGit,
  SiGithub,
  SiPostman,
  SiLinux,
  SiDocker,
} from 'react-icons/si';
import {
  TbBrandVscode,
  TbApi,
  TbShieldLock,
  TbSql,
  TbBinaryTree,
  TbCube,
  TbDatabase,
  TbCpu,
  TbNetwork,
  TbCode,
} from 'react-icons/tb';

interface SkillInfo {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  glow: string;
}

const skillMap: Record<string, SkillInfo> = {
  // Languages
  'C': { icon: SiC, color: '#A8B9CC', glow: 'rgba(168, 185, 204, 0.4)' },
  'C++': { icon: SiCplusplus, color: '#00599C', glow: 'rgba(0, 89, 156, 0.5)' },
  'Python': { icon: SiPython, color: '#3776AB', glow: 'rgba(55, 118, 171, 0.5)' },
  'JavaScript': { icon: SiJavascript, color: '#F7DF1E', glow: 'rgba(247, 223, 30, 0.5)' },
  'TypeScript': { icon: SiTypescript, color: '#3178C6', glow: 'rgba(49, 120, 198, 0.5)' },

  // Frontend
  'React.js': { icon: SiReact, color: '#61DAFB', glow: 'rgba(97, 218, 251, 0.5)' },
  'React': { icon: SiReact, color: '#61DAFB', glow: 'rgba(97, 218, 251, 0.5)' },
  'HTML': { icon: SiHtml5, color: '#E34F26', glow: 'rgba(227, 79, 38, 0.5)' },
  'CSS': { icon: SiCss, color: '#1572B6', glow: 'rgba(21, 114, 182, 0.5)' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.5)' },

  // Backend
  'FastAPI': { icon: SiFastapi, color: '#009688', glow: 'rgba(0, 150, 136, 0.5)' },
  'Node.js': { icon: SiNodedotjs, color: '#5FA04E', glow: 'rgba(95, 160, 78, 0.5)' },
  'Express.js': { icon: SiExpress, color: '#EDEDED', glow: 'rgba(255, 255, 255, 0.4)' },
  'REST APIs': { icon: TbApi, color: '#FF6C37', glow: 'rgba(255, 108, 55, 0.5)' },
  'Authentication': { icon: TbShieldLock, color: '#F5A524', glow: 'rgba(245, 165, 36, 0.5)' },

  // Databases
  'Supabase': { icon: SiSupabase, color: '#3ECF8E', glow: 'rgba(62, 207, 142, 0.5)' },
  'PostgreSQL': { icon: SiPostgresql, color: '#4169E1', glow: 'rgba(65, 105, 225, 0.5)' },
  'SQLite': { icon: SiSqlite, color: '#003B57', glow: 'rgba(0, 59, 87, 0.6)' },
  'MongoDB': { icon: SiMongodb, color: '#47A248', glow: 'rgba(71, 162, 72, 0.5)' },
  'Firebase': { icon: SiFirebase, color: '#FFCA28', glow: 'rgba(255, 202, 40, 0.5)' },
  'SQL': { icon: TbSql, color: '#00758F', glow: 'rgba(0, 117, 143, 0.5)' },

  // Tools
  'Selenium': { icon: SiSelenium, color: '#43B02A', glow: 'rgba(67, 176, 42, 0.5)' },
  'Git': { icon: SiGit, color: '#F05032', glow: 'rgba(240, 80, 50, 0.5)' },
  'GitHub': { icon: SiGithub, color: '#EDEDED', glow: 'rgba(255, 255, 255, 0.4)' },
  'VS Code': { icon: TbBrandVscode, color: '#007ACC', glow: 'rgba(0, 122, 204, 0.5)' },
  'Postman': { icon: SiPostman, color: '#FF6C37', glow: 'rgba(255, 108, 55, 0.5)' },
  'Linux': { icon: SiLinux, color: '#FCC624', glow: 'rgba(252, 198, 36, 0.5)' },
  'Docker': { icon: SiDocker, color: '#2496ED', glow: 'rgba(36, 150, 237, 0.5)' },

  // CS Fundamentals
  'Data Structures and Algorithms': { icon: TbBinaryTree, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.5)' },
  'OOP': { icon: TbCube, color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.5)' },
  'DBMS': { icon: TbDatabase, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.5)' },
  'Operating Systems': { icon: TbCpu, color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' },
  'Computer Networks': { icon: TbNetwork, color: '#10B981', glow: 'rgba(16, 185, 129, 0.5)' },
};

export const SkillBadge3D: React.FC<{ name: string; index?: number }> = ({ name }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = skillMap[name] || {
    icon: TbCode,
    color: '#F5A524',
    glow: 'rgba(245, 165, 36, 0.4)',
  };

  const IconComponent = info.icon;

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 800)}
      whileHover={{
        y: -5,
        scale: 1.06,
        rotateX: 6,
        rotateY: -6,
        transition: { type: 'spring', stiffness: 350, damping: 18 },
      }}
      whileTap={{
        scale: 0.94,
        y: 1,
        transition: { duration: 0.1 },
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 800,
        boxShadow: isHovered
          ? `0 10px 22px -4px ${info.glow}, 0 0 12px ${info.glow}`
          : '0 2px 6px rgba(0, 0, 0, 0.4)',
        borderColor: isHovered ? info.color : 'rgba(255, 255, 255, 0.1)',
      }}
      className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-gradient-to-b from-[#151921]/90 to-[#0e1117]/90 border backdrop-blur-md cursor-pointer select-none transition-colors duration-200"
    >
      {/* 3D Animated Icon */}
      <motion.div
        animate={
          isHovered
            ? {
                rotate: [0, -12, 12, -6, 0],
                scale: [1, 1.25, 1.15],
                transition: { duration: 0.5, ease: 'easeInOut' },
              }
            : { rotate: 0, scale: 1 }
        }
        className="flex items-center justify-center flex-shrink-0"
        style={{
          color: info.color,
          filter: isHovered ? `drop-shadow(0 0 6px ${info.color})` : 'none',
        }}
      >
        <IconComponent size={18} />
      </motion.div>

      {/* Skill Name */}
      <span
        className={`font-mono text-xs transition-colors duration-200 ${
          isHovered ? 'text-white font-medium' : 'text-zinc-300'
        }`}
      >
        {name}
      </span>

      {/* Subtle top 3D specular highlight */}
      <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    </motion.div>
  );
};

