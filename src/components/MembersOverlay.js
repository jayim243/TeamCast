import React from "react";

const MembersOverlay = ({
  members,
  newMembers,
  setNewMembers,
  handleMemberChange,
  saveMembers,
  setShowMembersOverlay,
}) => (
  <div className="overlay">
    <div className="overlay-content">
      <h3>{members.length > 0 ? "Edit Members" : "Add Members"}</h3>
      {newMembers.map((member, index) => (
        <label key={index}>
          Member {index + 1}:
          <input
            type="text"
            value={member}
            onChange={(e) => handleMemberChange(e, index)}
          />
        </label>
      ))}
      <div className="button-container">
        <button onClick={saveMembers}>Save Members</button>
        <button onClick={() => setShowMembersOverlay(false)}>Cancel</button>
      </div>
    </div>
  </div>
);

export default MembersOverlay;
