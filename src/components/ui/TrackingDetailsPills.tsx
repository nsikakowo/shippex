import React, { ReactNode } from 'react';

interface PillsInfo {
  icon: ReactNode;
  tag: string;
  details: string;
}

const TrackingDetailsPills: React.FC<PillsInfo> = ({ icon, tag, details }) => {
  return (
    <div className="flex items-start px-[16px] justify-between mb-8 text-[15px]">
      <div className="flex items-center w-[50%]">
        <p>{icon}</p>
        <p className="ml-2 text-iconColor  font-[500]">{tag}</p>
      </div>
      <div className="w-[50%] ">
        <p className="w-[75%] text-darkPrimary  font-[500]">{details}</p>
      </div>
    </div>
  );
};

export default TrackingDetailsPills;
