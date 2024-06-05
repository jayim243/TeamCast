import React, { useState, useEffect, useCallback } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { firestore, storage } from "../firebase";
import "./WeeklyCalendar.css";

const db = firestore;


// rollover to next day? display preview of image thumbnails regardless of file type(pdf, png)



const WeeklyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: "",
    startTime: "",
    endTime: "",
    name: "",
    members: "",
    artifacts: [],
  });
  const [artifactFiles, setArtifactFiles] = useState([]);

  const fetchEvents = useCallback(async () => {
    const start = format(
      startOfWeek(currentDate, { weekStartsOn: 0 }),
      "yyyy-MM-dd"
    );
    const end = format(
      addDays(startOfWeek(currentDate, { weekStartsOn: 0 }), 6),
      "yyyy-MM-dd"
    );

    const snapshot = await db
      .collection("events")
      .where("date", ">=", start)
      .where("date", "<=", end)
      .get();

    const fetchedEvents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(fetchedEvents);
  }, [currentDate]);

  const handleFileUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        const storageRef = storage.ref();
        const fileRef = storageRef.child(`artifacts/${file.name}`);
        await fileRef.putString(reader.result, "data_url");
        const downloadURL = await fileRef.getDownloadURL();
        resolve(downloadURL);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFilesUpload = async (files) => {
    const artifactURLs = [];
    let thumbnailURL = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileURL = await handleFileUpload(file);
      artifactURLs.push(fileURL);
      thumbnailURL = fileURL;
    }

    return { artifactURLs, thumbnailURL };
  };

  const addEventToFirestore = async (event) => {
    try {
      const { artifactURLs, thumbnailURL } = await handleFilesUpload(
        artifactFiles
      );
      event.artifacts = artifactURLs;
      event.thumbnail = thumbnailURL;
      event.members = event.members.split(",").map((member) => member.trim());
      await db.collection("events").add(event);
      fetchEvents(); // Refresh events after adding
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, fetchEvents]);

  const getWeekDates = (date) => {
    const startOfWeekDate = startOfWeek(date, { weekStartsOn: 0 });
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(addDays(startOfWeekDate, i));
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentDate);

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    await addEventToFirestore({
      ...newEvent,
      date: format(parseISO(newEvent.date), "yyyy-MM-dd"),
    });
    setShowOverlay(false);
    setNewEvent({
      date: "",
      startTime: "",
      endTime: "",
      name: "",
      members: "",
      artifacts: [],
    });
    setArtifactFiles([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleFileChange = (e) => {
    setArtifactFiles([...e.target.files]);
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="weekly-calendar">
      <h2>TeamCast</h2>
      <div className="week-navigation">
        <button onClick={goToPreviousWeek}>Previous</button>
        <button onClick={goToNextWeek}>Next</button>
        <button onClick={() => setShowOverlay(true)}>Add Event</button>
      </div>
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
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
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
      {showOverlay && (
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
                Members (comma separated):
                <input
                  type="text"
                  name="members"
                  value={newEvent.members}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Artifacts:
                <input type="file" multiple onChange={handleFileChange} />
              </label>
              <button type="submit">Add Event</button>
              <button type="button" onClick={() => setShowOverlay(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
