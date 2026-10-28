import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';

export type ScrollDirection = 'up' | 'down';

export const ScrollDirectionContext = createContext<ScrollDirection>('down');

export const ScrollDirectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [direction, setDirection] = useState<ScrollDirection>('down');
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    const delta = latest - prev;
    if (Math.abs(delta) > 6) {
      setDirection(delta > 0 ? 'down' : 'up');
    }
  });

  return (
    <ScrollDirectionContext.Provider value={direction}>
      {children}
    </ScrollDirectionContext.Provider>
  );
};

export const useScrollDirection = () => useContext(ScrollDirectionContext);

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  threshold?: number;
}

/**
 * MotionSection
 * - Zoom in when scrolling down (scales from ~0.92 to 1.0)
 * - Zoom out when scrolling up (scales from ~1.08 to 1.0)
 */
export const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className = '',
  id,
  delay = 0,
  threshold = 0.12,
}) => {
  const direction = useScrollDirection();
  const isDown = direction === 'down';

  return (
    <motion.section
      id={id}
      initial={{
        opacity: 0,
        scale: isDown ? 0.93 : 1.07,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: false, amount: threshold }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

interface MotionTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

/**
 * MotionText
 * - Slide in animation when scrolling up
 * - Slide out animation when scrolling down
 */
export const MotionText: React.FC<MotionTextProps> = ({
  children,
  className = '',
  delay = 0,
  as = 'div',
}) => {
  const direction = useScrollDirection();
  const isDown = direction === 'down';

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        y: isDown ? 30 : -30,
        x: isDown ? 8 : -8,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * MotionCard
 * Interactive card with subtle directional motion and hover lift
 */
export const MotionCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}> = ({ children, className = '', delay = 0, onClick }) => {
  const direction = useScrollDirection();
  const isDown = direction === 'down';

  return (
    <motion.div
      onClick={onClick}
      initial={{
        opacity: 0,
        scale: isDown ? 0.95 : 1.04,
        y: isDown ? 20 : -20,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={{ once: false, amount: 0.15 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
