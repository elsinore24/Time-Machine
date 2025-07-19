// 404 Not Found page
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <motion.div 
        className="not-found-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="error-icon"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⚡
        </motion.div>
        
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Time Portal Not Found
        </motion.h2>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Looks like you've wandered into an unknown dimension! 
          This timeline doesn't exist in our Time Machine database.
        </motion.p>
        
        <motion.div
          className="action-buttons"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Link to="/" className="home-btn">
            🏠 Return Home
          </Link>
          <Link to="/1980s" className="era-btn">
            🕰️ Visit 1980s
          </Link>
        </motion.div>
        
        <motion.div
          className="glitch-text"
          animate={{
            opacity: [1, 0.5, 1],
            x: [0, -2, 2, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          ERROR: TEMPORAL COORDINATES INVALID
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;