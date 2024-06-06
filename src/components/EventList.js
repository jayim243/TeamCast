import React from "react";
import { format } from "date-fns";

const EventList = ({
  weekDates,
  events,
  formatTime,
  members,
  newEvent,
  setNewEvent,
  handleMemberCheckboxChange,
  handleFileChange,
  fileInputRef,
  removeFile,
  artifactFiles,
}) => (
  <div className="week-dates-container">
    <div className="week-dates">
      {weekDates.map((date) => (
        <div key={date} className="week-date">
          <div>{format(date, "EEE")}</div>
          <div>{format(date, "MM/dd")}</div>
          <div className="event-container">
            {events
              .filter((event) => event.date === format(date, "yyyy-MM-dd"))
              .map((event, index) => (
                <div key={index} className="event">
                  <div>{event.name}</div>
                  <div>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                  <div>Members: {event.members.join(", ")}</div>
                  {event.thumbnail && (
                    <img
                      src={event.thumbnail}
                      alt="Event Thumbnail"
                      className="thumbnail"
                    />
                  )}
                  {event.artifacts &&
                    event.artifacts.map((url, i) => (
                      <div key={i}>
                        {url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                          <img src={url} alt={`Artifact ${i + 1}`} />
                        ) : (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Artifact {i + 1}
                          </a>
                        )}
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EventList;
