import React, { useState } from 'react';
import Tab from "@/components/Tabs";
import EventsTable from "./EventsTable";
import ResultsTable from "./ResultsTable";

const TableSection = ({ eventData }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: 'Event Schedule', href: '#', current: activeTab === 0 },
    { id: 1, name: 'See Results', href: '#', current: activeTab === 1 },
  ];

  const handleTabClick = (e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  return (
    <div style={{ paddingTop: "350px", paddingLeft: "100px", paddingRight: "70px" }}>
      <div>
        <Tab tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
        {activeTab === 0 && <EventsTable eventData={eventData} />}
        {activeTab === 1 && <ResultsTable eventData={eventData} />}
      </div>
    </div>
  );
};

export default TableSection;
