'use client';

import { useEffect, useRef, useState, useMemo, type CSSProperties, type ElementType } from 'react';
import { gsap } from 'gsap';

interface TextTypeProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  cursorChar?: string;
  loop?: boolean;
  as?: ElementType;
  deletingSpeed?: number;
  pauseDuration?: number;
  cursorBlinkDuration?: number;
}

export function TextType({
  text,
  speed = 50,
  delay = 500,
  className = '',
  style,
  cursorChar = '|',
  loop = false,
  as: Component = 'span',
  deletingSpeed = 30,
  pauseDuration = 2000,
  cursorBlinkDuration = 0.5,
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [cursorBlinkDuration]);

  useEffect(() => {
    if (!isTyping) return;

    let timeout: ReturnType<typeof setTimeout>;
    const currentText = textArray[currentTextIndex];

    const executeTyping = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            setIsTyping(false);
            return;
          }
          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev + currentText[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
          }, speed);
        } else if (textArray.length > 1) {
          if (!loop && currentTextIndex === textArray.length - 1) {
            setIsTyping(false);
            return;
          }
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        } else if (loop) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        } else {
          setIsTyping(false);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTyping, delay);
    } else {
      executeTyping();
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, displayedText, isDeleting, speed, deletingSpeed, pauseDuration, textArray, currentTextIndex, loop, delay, isTyping]);

  return (
    <Component ref={containerRef} className={className} style={style}>
      {displayedText}
      {isTyping && (
        <span ref={cursorRef} className="text-type-cursor" style={{ marginLeft: '0.25rem' }}>
          {cursorChar}
        </span>
      )}
    </Component>
  );
}
