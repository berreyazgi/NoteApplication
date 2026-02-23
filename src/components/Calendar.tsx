import React, { useState } from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Clock } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';

const Calendar: React.FC = () => {
  const {
    currentMonth,
    selectedDate,
    nextMonth,
    prevMonth,
    selectDate,
    addEvent,
    deleteEvent,
    calendarDays,
    getEventsForDate
  } = useCalendar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && eventTitle && eventTime) {
      addEvent(selectedDate, eventTitle, eventTime);
      setEventTitle('');
      setEventTime('');
      setIsModalOpen(false);
    }
  };

  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 md:p-6 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-violet-500/10 shadow-[0_0_30px_rgba(123,108,246,0.06)] transition-all duration-300">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <p className="text-sm text-white/30 font-medium">Manage your schedule</p>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-violet-400"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-violet-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 h-full">
        {/* Main Calendar Grid */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-xs font-bold text-white/20 uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {calendarDays.map(day => {
              const dayEvents = getEventsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => selectDate(day)}
                  className={`
                    relative min-h-[85px] md:min-h-[105px] p-2.5 rounded-xl border transition-all cursor-pointer group
                    ${isSelected
                      ? 'bg-violet-500/10 border-violet-500/30 ring-2 ring-violet-500/20 shadow-[0_0_20px_rgba(123,108,246,0.1)]'
                      : 'bg-white/[0.02] border-white/5 hover:border-violet-500/20 hover:bg-white/[0.04] hover:shadow-md hover:-translate-y-0.5'}
                    ${!isCurrentMonth ? 'opacity-15' : 'opacity-100'}
                  `}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`
                      text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                      ${isToday ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30' : 'text-white/60'}
                      ${isSelected && !isToday ? 'text-violet-400' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="flex h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_6px_rgba(123,108,246,0.6)]"></span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map(event => (
                      <div key={event.id} className="text-[10px] leading-tight bg-violet-500/10 text-violet-300 px-1.5 py-0.5 rounded-md truncate font-medium border border-violet-500/10">
                        {event.time} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-white/30 font-bold pl-1">
                        + {dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel: Selected Day Events */}
        <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
          <div className="p-6 bg-white/[0.03] backdrop-blur-lg rounded-2xl border border-white/5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
                </h3>
                <p className="text-xs text-white/30 font-medium">Daily events</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2.5 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="group relative bg-white/[0.04] p-3 rounded-xl border border-white/5 hover:border-violet-500/20 transition-all">
                    <div className="flex gap-2 items-start">
                      <div className="mt-0.5 text-violet-400">
                        <Clock size={14} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-violet-400 mb-0.5">{event.time}</p>
                        <p className="text-sm font-semibold text-white truncate pr-6">{event.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEvent(selectedDateKey, event.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-40 text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 border border-white/5">
                    <Plus size={20} className="text-white/30" />
                  </div>
                  <p className="text-xs font-bold text-white/40">No events yet</p>
                  <p className="text-[10px] text-white/20 mt-1">Plan your day by adding one</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-[#0E1025] w-full max-w-[520px] rounded-2xl p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-violet-500/20">
            <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Add New Event</h3>
                <p className="text-[11px] text-violet-400 font-bold uppercase tracking-[0.3em] mt-2">
                  {selectedDate ? format(selectedDate, 'yyyy • MM • dd') : ''}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="Meeting, deadline..."
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 text-white transition-all placeholder:text-white/15 font-semibold"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Time</label>
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 text-white transition-all font-semibold"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full px-8 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 active:scale-[0.98] mb-4"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-8 py-3 text-white/30 font-semibold rounded-xl hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
