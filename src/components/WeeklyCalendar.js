// src/WeeklyCalendar.js
import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { firebase } from '../firebase'; // Ensure the correct path to firebase.js

const db = firebase.firestore();

const WeeklyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', title: '' });

  const fetchEvents = useCallback(async () => {
    const start = format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd');
    const end = format(addDays(startOfWeek(currentDate, { weekStartsOn: 0 }), 6), 'yyyy-MM-dd');

    const snapshot = await db.collection('events')
      .where('date', '>=', start)
      .where('date', '<=', end)
      .get();

    const fetchedEvents = snapshot.docs.map(doc => doc.data());
    setEvents(fetchedEvents);
  }, [currentDate]);

  const addEventToFirestore = async (event) => {
    try {
      await db.collection('events').add(event);
      fetchEvents(); // Refresh events after adding
    } catch (error) {
      console.error('Error adding document: ', error);
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

  const handleAddEvent = (event) => {
    event.preventDefault();
    addEventToFirestore({ ...newEvent, date: format(parseISO(newEvent.date), 'yyyy-MM-dd') });
    setShowOverlay(false);
    setNewEvent({ date: '', title: '' });
  };

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Weekly Calendar</h2>
      <div>
        <button onClick={goToPreviousWeek}>Previous</button>
        <button onClick={goToNextWeek}>Next</button>
        <button onClick={() => setShowOverlay(true)}>Add Event</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        {weekDates.map((date) => (
          <div key={date} style={{ textAlign: 'center' }}>
            <div>{format(date, 'EEE')}</div>
            <div>{format(date, 'MM/dd')}</div>
            <div>
              {events
                .filter(event => event.date === format(date, 'yyyy-MM-dd'))
                .map((event, index) => (
                  <div key={index}>{event.title}</div>
                ))}
            </div>
          </div>
        ))}
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
                Title:
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit">Add Event</button>
              <button type="button" onClick={() => setShowOverlay(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
