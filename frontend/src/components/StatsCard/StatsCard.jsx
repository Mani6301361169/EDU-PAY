import React from 'react';
import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, icon: Icon, description, trend, trendType = 'up' }) => {
  return (
    <div className={`${styles.card} glass-panel glass-panel-hover`}>
      <div className={styles.flexHeader}>
        <div className={styles.content}>
          <span className={styles.title}>{title}</span>
          <h2 className={styles.value}>{value}</h2>
        </div>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon className={styles.icon} />
          </div>
        )}
      </div>
      
      {(description || trend) && (
        <div className={styles.footer}>
          {trend && (
            <span className={`${styles.trend} ${styles[trendType]}`}>
              {trend}
            </span>
          )}
          {description && <span className={styles.desc}>{description}</span>}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
