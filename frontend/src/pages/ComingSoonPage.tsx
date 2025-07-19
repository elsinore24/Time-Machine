// Coming Soon page for inactive eras
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ComingSoonPage.css';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="coming-soon-page">
      <motion.div 
        className="coming-soon-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="construction-icon"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🚧
        </motion.div>
        
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Time Portal Under Construction
        </motion.h1>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          We're working hard to build time portals to other eras! 
          Stay tuned for more nostalgic adventures.
        </motion.p>
        
        <motion.div
          className="available-eras"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Currently Available:</h3>
          <Link to="/1980s" className="era-link">
            🕰️ Visit the 1980s
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Link to="/" className="back-home-btn">
            ← Back to Time Machine
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoonPage;