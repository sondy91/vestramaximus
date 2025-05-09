import React from 'react';
import { models } from '../../wailsjs/go/models';

interface BudgetPeriodItemProps {
  period: models.BudgetPeriod;
  isSelected: boolean;
  onClick: (period: models.BudgetPeriod) => void;
}

const BudgetPeriodItem: React.FC<BudgetPeriodItemProps> = ({ period, isSelected, onClick }) => {
  const formatDate = (dateString: string | Date): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div 
      className={`budget-period-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(period)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(period)}
    >
      <div className="period-name">{period.name}</div>
      <div className="period-dates">
        {formatDate(period.startDate)} - {formatDate(period.endDate)}
      </div>
      <div className={`period-status status-${period.status.toLowerCase()}`}>{period.status}</div>
    </div>
  );
};

export default BudgetPeriodItem; 