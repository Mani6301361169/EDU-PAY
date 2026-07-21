import React from 'react';
import styles from './Modal.module.css';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className={styles.overlay}>
        <motion.div 
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div 
          className={`${styles.modalContainer} glass-panel`}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <button onClick={onClose} className={styles.closeBtn}>
              <FiX />
            </button>
          </div>
          <div className={styles.body}>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
