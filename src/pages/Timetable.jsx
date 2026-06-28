import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchTimetableEvents, createTimetableEvent, updateTimetableEvent, deleteTimetableEvent } from "../utils/api";

function Timetable() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeSlot, setActiveSlot] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 100, left: 100 });
  const [newEvent, setNewEvent] = useState({ subject: "", day: "Monday", startTime: "09:00", endTime: "10:30", notes: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const evtData = await fetchTimetableEvents();
    setEvents(evtData || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEvent.subject || !newEvent.day || !newEvent.startTime || !newEvent.endTime) return;
    if (isEditing && editingId) {
      await updateTimetableEvent(editingId, newEvent);
    } else {
      await createTimetableEvent(newEvent);
    }
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setActiveSlot(null);
    setNewEvent({ subject: "", day: "Monday", startTime: "09:00", endTime: "10:30", notes: "" });
    loadData();
  };


  const openEditModal = (evt, e) => {
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const modalWidth = 380;
      let left = rect.right + 12;
      if (left + modalWidth > window.innerWidth - 20) {
        left = rect.left - modalWidth - 12;
      }
      let top = rect.top;
      if (top + 350 > window.innerHeight - 20) {
        top = Math.max(20, window.innerHeight - 370);
      }
      setPopupPos({ top, left });
    } else {
      setPopupPos({ top: Math.max(50, window.innerHeight / 2 - 180), left: Math.max(20, window.innerWidth / 2 - 190) });
    }
    setIsEditing(true);
    setEditingId(evt._id);
    setActiveSlot({ day: evt.day, time: evt.startTime });
    setNewEvent({
      subject: evt.subject || "",
      day: evt.day || "Monday",
      startTime: evt.startTime || "09:00",
      endTime: evt.endTime || "10:30",
      notes: evt.notes || evt.venue || ""
    });
    setShowModal(true);
  };

  const handleSlotClick = (e, d, t) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const endH = String(Math.min(23, getHour(t) + 1)).padStart(2, '0');
    
    const modalWidth = 380;
    let left = rect.right + 12;
    if (left + modalWidth > window.innerWidth - 20) {
      left = rect.left - modalWidth - 12;
    }
    let top = rect.top;
    if (top + 350 > window.innerHeight - 20) {
      top = Math.max(20, window.innerHeight - 370);
    }

    setActiveSlot({ day: d, time: t });
    setPopupPos({ top, left });
    setIsEditing(false);
    setEditingId(null);
    setNewEvent({
      subject: "",
      day: d,
      startTime: t,
      endTime: `${endH}:00`,
      notes: ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteTimetableEvent(id);
    setShowModal(false);
    setActiveSlot(null);
    loadData();
  };

  const getHour = (timeStr) => {
    if (!timeStr) return -1;
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10);
  };

  const parseHourDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) + (parseInt(parts[1], 10) / 60);
  };

  const formatCardTime = (startStr, endStr) => {
    if (!startStr || !endStr) return "";
    const formatPart = (str) => {
      const parts = str.split(':');
      let h = parseInt(parts[0], 10);
      const m = parts[1];
      const ampm = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      return m === '00' ? `${h}${ampm}` : `${h}:${m}${ampm}`;
    };
    const s = formatPart(startStr);
    const e = formatPart(endStr);
    if (s.slice(-2) === e.slice(-2)) {
      return `${s.slice(0, -2)} – ${e}`;
    }
    return `${s} – ${e}`;
  };

  const shiftWeek = (daysToAdd) => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + daysToAdd);
    setCurrentDate(next);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = [
    { label: '7 AM', value: '07:00' },
    { label: '8 AM', value: '08:00' },
    { label: '9 AM', value: '09:00' },
    { label: '10 AM', value: '10:00' },
    { label: '11 AM', value: '11:00' },
    { label: '12 PM', value: '12:00' },
    { label: '1 PM', value: '13:00' },
    { label: '2 PM', value: '14:00' },
    { label: '3 PM', value: '15:00' },
    { label: '4 PM', value: '16:00' },
    { label: '5 PM', value: '17:00' },
    { label: '6 PM', value: '18:00' },
    { label: '7 PM', value: '19:00' }
  ];

  const timeSelectOptions = [];
  for (let h = 7; h <= 21; h++) {
    for (let m of ['00', '30']) {
      if (h === 21 && m === '30') continue;
      const val = `${String(h).padStart(2, '0')}:${m}`;
      const h12 = h % 12 || 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const label = `${h12}:${m} ${ampm}`;
      timeSelectOptions.push({ val, label });
    }
  }

  const dayOfWeek = currentDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = new Date(currentDate);
  mondayDate.setDate(currentDate.getDate() + diffToMonday);

  const weekDates = days.map((_, idx) => {
    const dt = new Date(mondayDate);
    dt.setDate(mondayDate.getDate() + idx);
    return dt;
  });

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-btn)", padding: "2px", boxShadow: "var(--shadow-sm)" }}>
            <button className="btn" style={{ padding: "8px 16px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-heading)", fontSize: "0.95rem", fontWeight: 700 }} onClick={() => shiftWeek(-7)}>← Prev</button>
            <div style={{ width: "1px", height: "18px", background: "var(--border)" }}></div>
            <button className="btn" style={{ padding: "8px 16px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-heading)", fontSize: "0.95rem", fontWeight: 700 }} onClick={() => shiftWeek(7)}>Next →</button>
          </div>

          <span style={{ fontWeight: 700, fontSize: "1.05rem", minWidth: 160, textAlign: "center", color: "var(--text-heading)" }}>
            {mondayDate.toLocaleDateString('en-US', { month: 'short' })} {mondayDate.getDate()} – {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: 80, borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-light)", padding: "16px 8px 8px", background: "var(--bg-secondary)", textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", verticalAlign: "bottom" }}>GMT</th>
              {days.map((d, idx) => {
                const dt = weekDates[idx];
                const isToday = dt.toDateString() === new Date().toDateString();
                return (
                  <th key={d} style={{ borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-light)", padding: "12px 8px", background: isToday ? "var(--primary-light)" : "var(--bg-secondary)", color: isToday ? "var(--primary)" : "inherit" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 600, opacity: 0.8 }}>{d.slice(0, 3).toUpperCase()}</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 800, marginTop: 2 }}>{dt.getDate()}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {times.map((slot) => {
              const t = slot.value;
              const slotHour = getHour(t);
              return (
                <tr key={t}>
                  <td style={{ borderBottom: "none", borderRight: "1px solid var(--border-light)", padding: "0 8px 0 0", textAlign: "right", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 500, verticalAlign: "top", height: 56 }}>
                    <span style={{ position: "relative", top: "-7px" }}>{slot.label}</span>
                  </td>
                  {days.map(d => {
                    const dayEvents = events.filter(e => e.day === d || e.day === d.slice(0, 3)).filter(e => getHour(e.startTime) === slotHour);
                    const activeStartH = parseHourDecimal(newEvent.startTime);
                    const activeEndH = parseHourDecimal(newEvent.endTime);
                    const isHighlighted = (showModal && newEvent.day === d && slotHour >= activeStartH && slotHour < activeEndH) || (!showModal && activeSlot && activeSlot.day === d && activeSlot.time === t);
                    const isPreviewSlot = showModal && !isEditing && newEvent.day === d && getHour(newEvent.startTime) === slotHour;
                    return (
                      <td
                        key={d}
                        style={{
                          borderBottom: "1px solid var(--border-light)",
                          borderRight: "1px solid var(--border-light)",
                          padding: 0,
                          verticalAlign: 'top',
                          height: 56,
                          cursor: "pointer",
                          background: isHighlighted ? "var(--primary-light)" : "transparent",
                          boxShadow: isHighlighted ? "inset 0 0 0 2px var(--primary)" : "none",
                          transition: "background 0.2s ease, box-shadow 0.2s ease",
                          position: "relative"
                        }}
                        onClick={(e) => handleSlotClick(e, d, t)}
                      >
                        <div style={{ position: "relative", width: "100%", height: "100%" }}>
                          {dayEvents.map(evt => {
                            const dur = Math.max(0.5, parseHourDecimal(evt.endTime) - parseHourDecimal(evt.startTime));
                            const offsetMinutes = (parseHourDecimal(evt.startTime) - slotHour) * 60;
                            const topOffset = (offsetMinutes / 60) * 56 + 2;
                            return (
                              <div key={evt._id} style={{ background: "var(--primary)", color: "#FFF", padding: "6px 8px", borderRadius: "6px", fontSize: "0.8rem", position: "absolute", top: topOffset, left: 4, right: 4, height: Math.max(46, dur * 56 - 4), display: "flex", flexDirection: "column", justify: "flex-start", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", cursor: "pointer", overflow: "hidden", zIndex: 5, boxSizing: "border-box" }} onClick={(e) => { e.stopPropagation(); openEditModal(evt, e); }}>
                                <div style={{ fontWeight: 700, lineHeight: 1.2, paddingRight: 18, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{evt.subject || "(No title)"}</div>
                                <div style={{ fontSize: "0.75rem", opacity: 0.95, lineHeight: 1.2, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formatCardTime(evt.startTime, evt.endTime)}</div>
                                {(evt.notes || evt.venue) && <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis" }}>{evt.notes || evt.venue}</div>}
                                <button type="button" title="Delete Class" style={{ position: "absolute", top: 4, right: 4, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 4, color: "#FFF", cursor: "pointer", padding: "1px 5px", fontSize: "0.7rem", lineHeight: 1 }} onClick={(e) => { e.stopPropagation(); handleDelete(evt._id); }}>✕</button>
                              </div>
                            );
                          })}
                          {isPreviewSlot && (() => {
                            const dur = Math.max(0.5, parseHourDecimal(newEvent.endTime) - parseHourDecimal(newEvent.startTime));
                            const offsetMinutes = (parseHourDecimal(newEvent.startTime) - slotHour) * 60;
                            const topOffset = (offsetMinutes / 60) * 56 + 2;
                            return (
                              <div style={{ background: "var(--primary)", color: "#FFF", padding: "6px 8px", borderRadius: "6px", fontSize: "0.8rem", position: "absolute", top: topOffset, left: 4, right: 4, height: Math.max(46, dur * 56 - 4), display: "flex", flexDirection: "column", justify: "flex-start", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", overflow: "hidden", zIndex: 10, boxSizing: "border-box" }}>
                                <div style={{ fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{newEvent.subject || "(No title)"}</div>
                                <div style={{ fontSize: "0.75rem", opacity: 0.95, lineHeight: 1.2, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formatCardTime(newEvent.startTime, newEvent.endTime)}</div>
                              </div>
                            );
                          })()}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }} onClick={() => { setShowModal(false); setActiveSlot(null); }}>
          <div className="card" style={{ position: "fixed", top: popupPos.top, left: popupPos.left, width: 380, padding: "20px 24px", borderRadius: "16px", boxShadow: "0 16px 40px rgba(0,0,0,0.22)", background: "var(--card-bg)", border: "1px solid var(--border)", zIndex: 1001 }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--text-heading)" }}>{isEditing ? "Edit Class" : "Add Class"}</span>
              <button type="button" style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => { setShowModal(false); setActiveSlot(null); }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <input
                  type="text"
                  placeholder="Subject Name (e.g. Data Structures)"
                  value={newEvent.subject}
                  onChange={e => setNewEvent({...newEvent, subject: e.target.value})}
                  required
                  autoFocus
                  style={{ width: "100%", fontSize: "1.25rem", fontWeight: 600, border: "none", borderBottom: "2px solid var(--primary)", padding: "6px 0", outline: "none", background: "transparent", color: "var(--text-heading)" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 4 }}>
                <div style={{ fontSize: "1.1rem", paddingTop: 4, color: "var(--text-muted)" }}></div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <select
                    className="form-input form-select"
                    style={{ fontWeight: 600 }}
                    value={newEvent.day}
                    onChange={e => setNewEvent({...newEvent, day: e.target.value})}
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <select
                      className="form-input form-select"
                      style={{ flex: 1, fontWeight: 500 }}
                      value={newEvent.startTime}
                      onChange={e => setNewEvent({...newEvent, startTime: e.target.value})}
                    >
                      {timeSelectOptions.map(opt => <option key={`start-${opt.val}`} value={opt.val}>{opt.label}</option>)}
                    </select>
                    <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>–</span>
                    <select
                      className="form-input form-select"
                      style={{ flex: 1, fontWeight: 500 }}
                      value={newEvent.endTime}
                      onChange={e => setNewEvent({...newEvent, endTime: e.target.value})}
                    >
                      {timeSelectOptions.map(opt => <option key={`end-${opt.val}`} value={opt.val}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>☰</div>
                <input
                  className="form-input"
                  style={{ flex: 1 }}
                  placeholder="Notes (Optional)"
                  value={newEvent.notes}
                  onChange={e => setNewEvent({...newEvent, notes: e.target.value})}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ padding: "8px 16px" }} onClick={() => { setShowModal(false); setActiveSlot(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px", borderRadius: "16px" }}>{isEditing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Timetable;
