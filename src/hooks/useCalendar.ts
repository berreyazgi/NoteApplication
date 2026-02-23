import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns';
import { useAuth } from '../context/AuthContext';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
}

export type EventMap = Record<string, CalendarEvent[]>;

// Fallback for random UUID if crypto.randomUUID is not available
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useCalendar = () => {
  const { user } = useAuth();
  const userId = user?.id || 'anonymous';
  const storageKey = `dashboard_calendar_events_${userId}`;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<EventMap>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to parse calendar events:', e);
      return {};
    }
  });

  // Re-initialize events when user changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setEvents(saved ? JSON.parse(saved) : {});
    } catch (e) {
      console.error('Failed to parse calendar events:', e);
      setEvents({});
    }
  }, [userId]);

  // Persist events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save calendar events:', e);
    }
  }, [events, userId]);

  const nextMonth = useCallback(() => setCurrentMonth(prev => addMonths(prev, 1)), []);
  const prevMonth = useCallback(() => setCurrentMonth(prev => subMonths(prev, 1)), []);

  const selectDate = (date: Date) => setSelectedDate(date);

  const addEvent = (date: Date, title: string, time: string) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const newEvent: CalendarEvent = {
      id: generateId(),
      title,
      time
    };

    setEvents(prev => {
      const updatedEvents = { ...prev };
      updatedEvents[dateKey] = [...(updatedEvents[dateKey] || []), newEvent];
      return updatedEvents;
    });
  };

  const deleteEvent = (dateKey: string, eventId: string) => {
    setEvents(prev => {
      const updatedEvents = { ...prev };
      if (updatedEvents[dateKey]) {
        updatedEvents[dateKey] = updatedEvents[dateKey].filter(e => e.id !== eventId);
        if (updatedEvents[dateKey].length === 0) {
          delete updatedEvents[dateKey];
        }
      }
      return updatedEvents;
    });
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: startDate,
      end: endDate
    });
  }, [currentMonth]);

  const getEventsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return events[dateKey] || [];
  };

  return {
    currentMonth,
    selectedDate,
    nextMonth,
    prevMonth,
    selectDate,
    addEvent,
    deleteEvent,
    calendarDays,
    getEventsForDate,
    events
  };
};
