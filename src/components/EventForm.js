import React from "react";

const EventForm = ({
  handleAddEvent,
  newEvent,
  handleChange,
  artifactFiles,
  fileInputRef,
  handleFileChange,
  removeFile,
  setShowOverlay,
  members,
  handleMemberCheckboxChange,
}) => (
  <div className="overlay">
    <div className="overlay-content">
      <h3>Add Event</h3>
      <form onSubmit={handleAddEvent}>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Start Time:
          <input
            type="time"
            name="startTime"
            value={newEvent.startTime}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Time:
          <input
            type="time"
            name="endTime"
            value={newEvent.endTime}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Name of Activity:
          <input
            type="text"
            name="name"
            value={newEvent.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Members:
          <div className="members">
            {members.map((member, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={member}
                    checked={newEvent.members.has(member)}
                    onChange={handleMemberCheckboxChange}
                  />
                  {member}
                </label>
              </div>
            ))}
          </div>
        </label>
        <div>
          <label>Artifacts:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <button type="button" onClick={() => fileInputRef.current.click()}>
            Add Files
          </button>
          <div>
            {artifactFiles.map((file, index) => (
              <div key={index}>
                {file.name}{" "}
                <button type="button" onClick={() => removeFile(file)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          <button type="submit">Add Event</button>
          <button type="button" onClick={() => setShowOverlay(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default EventForm;
