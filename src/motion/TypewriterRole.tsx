import React, { useState, useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TypewriterRoleProps {
  roles?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export const TypewriterRole: React.FC<TypewriterRoleProps> = ({
  roles = [
    'Full Stack Developer (React.js, Node.js)',
    'Computer Science Engineer',
    'Modern Web & REST API Builder',
    'React & Next.js Specialist',
  ],
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseDuration = 2200,
  className = '',
  cursorClassName = 'text-orange-500 font-bold ml-1',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrentText(roles[0]);
      return;
    }

    const currentRole = roles[roleIndex];

    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === currentRole) {
      // Pause before backspacing
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === '') {
      // Move to next role
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      // Typing or deleting
      const nextChar = isDeleting
        ? currentRole.substring(0, currentText.length - 1)
        : currentRole.substring(0, currentText.length + 1);

      timer = setTimeout(
        () => setCurrentText(nextChar),
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, roles, typingSpeed, deletingSpeed, pauseDuration, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span className={className}>{roles[0]}</span>;
  }

  return (
    <span className={`inline-flex items-center ${className}`} aria-live="off">
      <span className="sr-only">{roles[0]}</span>
      <span aria-hidden="true">
        {currentText}
        <span className={`animate-pulse ${cursorClassName}`}>|</span>
      </span>
    </span>
  );
};
