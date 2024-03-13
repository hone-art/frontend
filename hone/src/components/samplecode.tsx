# React component for the habit tracker
component = """
import React, { useState } from 'react';
import './HabitTracker.css';

const HabitTracker = ({ entries, currentStreak, longestStreak }) => {
  // Create a grid representing the days of the month
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysGrid = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Check if the day has an entry
  const hasEntry = (day) => entries.includes(day);

  // Determine the shade based on the entry value
  const getShade = (entryValue) => {
    if (entryValue <= 0.33) return 'light';
    if (entryValue <= 0.66) return 'medium';
    return 'dark';
  };

  return (
    <div className="habit-tracker">
      <div className="entries-header">{entries.length} entries this month</div>
      <div className="days-grid">
        {daysGrid.map((day, index) => {
          const entryValue = entries.find(entry => entry.day === day)?.value || 0;
          const shade = getShade(entryValue);
          return (
            <div key={index} className={`day ${shade} ${day === new Date().getDate() ? 'today' : ''}`}></div>
          );
        })}
      </div>
      <div className="streak-info">
        <div>Current streak: {currentStreak} days</div>
        <div>Longest streak: {longestStreak} days</div>
      </div>
    </div>
  );
};

export default HabitTracker;
"""

# Writing the component to a .jsx file
path = '/mnt/data/HabitTracker.jsx'
with open(path, 'w') as file:
    file.write(component)

path
