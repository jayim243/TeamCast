import React from "react";

const WeekNavigation = ({
  goToPreviousWeek,
  goToNextWeek,
  openAddMembers,
  setShowOverlay,
}) => (
  <div className="week-navigation">
    <button onClick={goToPreviousWeek}>Previous</button>
    <button onClick={goToNextWeek}>Next</button>
    <button onClick={openAddMembers}>Add Members</button>
    <button onClick={() => setShowOverlay(true)}>Add Event</button>
  </div>
);

export default WeekNavigation;
