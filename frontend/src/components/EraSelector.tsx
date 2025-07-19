// Era selector component - locked to 1980s for MVP
import React from 'react';
import { EraConfig } from '../types';

interface EraSelectorProps {
  selectedEra: string;
  onEraChange: (era: string) => void;
  eras: EraConfig[];
}

const EraSelector: React.FC<EraSelectorProps> = ({ selectedEra, onEraChange, eras }) => {
  return (
    <div className="era-selector">
      <label htmlFor="era-select" className="era-label">
        🕰️ Time Period:
      </label>
      <select
        id="era-select"
        value={selectedEra}
        onChange={(e) => onEraChange(e.target.value)}
        className="era-dropdown"
      >
        {eras.map((era) => (
          <option 
            key={era.value} 
            value={era.value}
            disabled={!era.isActive}
          >
            {era.name} {!era.isActive && '(Coming Soon)'}
          </option>
        ))}
      </select>
      <div className="era-description">
        {eras.find(era => era.value === selectedEra)?.description}
      </div>
    </div>
  );
};

export default EraSelector;