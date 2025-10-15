import React, { useEffect, useRef, useState } from "react";
import "./home.css";

/**
 * WorkshopDays
 * - 3 day sections
 * - per-day file upload (drag & drop or picker)
 * - per-day list of uploaded reports (saved to localStorage as data URLs)
 * - per-day notes area with autosave (saved to localStorage). Pasting images into notes embeds them as data URLs.
 *
 * Drop this component anywhere (e.g. App.js) and import the CSS file.
 */

const DAY_KEYS = ["reports_day1", "reports_day2", "reports_day3"];
const NOTE_KEYS = ["notes_day1", "notes_day2", "notes_day3"];
const DAY_TITLES = [
  "Day 1 — Introduction",
  "Day 2 — Hands-on",
  "Day 3 — Wrap-up",
];
const DAY_SUBS = [
  "(Collect initial observations & attendance)",
  "(Workshop exercises & code)",
  "(Final reports & feedback)",
];

function bytesToSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024,
    sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function Home() {
  const [reports, setReports] = useState([[], [], []]); // each index => array of report objects
  const [notes, setNotes] = useState(["", "", ""]);
  const autosaveTimers = useRef([null, null, null]);

  // load initial from localStorage
  useEffect(() => {
    const loadedReports = DAY_KEYS.map((k) => {
      try {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    });
    const loadedNotes = NOTE_KEYS.map((k) => localStorage.getItem(k) || "");
    setReports(loadedReports);
    setNotes(loadedNotes);
  }, []);

  // helpers to persist
  function persistReports(index, arr) {
    const newReports = [...reports];
    newReports[index] = arr;
    setReports(newReports);
    try {
      localStorage.setItem(DAY_KEYS[index], JSON.stringify(arr));
    } catch (e) {
      console.error("Failed to persist reports:", e);
    }
  }
  function persistNote(index, txt) {
    const newNotes = [...notes];
    newNotes[index] = txt;
    setNotes(newNotes);
    try {
      localStorage.setItem(NOTE_KEYS[index], txt);
    } catch (e) {
      console.error("Failed to persist note:", e);
    }
  }

  // handle files (reads as DataURL)
  function handleFiles(index, fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    let remaining = files.length;
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target.result;
        const entry = {
          name: f.name,
          size: f.size,
          sizeReadable: bytesToSize(f.size),
          type: f.type,
          time: Date.now(),
          data,
        };
        const arr = [entry, ...reports[index]];
        persistReports(index, arr);
        remaining -= 1;
      };
      reader.onerror = () => {
        remaining -= 1;
        console.error("File read error:", f.name);
      };
      reader.readAsDataURL(f);
    });
  }

  // drag & drop helpers
  function onDrop(e, index) {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length) handleFiles(index, dt.files);
    e.currentTarget.classList.remove("dragover");
  }
  function onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  }
  function onDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  }

  // remove report
  function removeReport(dayIndex, idx) {
    if (!window.confirm("Remove this report?")) return;
    const arr = [...reports[dayIndex]];
    arr.splice(idx, 1);
    persistReports(dayIndex, arr);
  }

  // clear all reports for a day
  function clearReports(dayIndex) {
    if (!window.confirm("Clear all reports for this day?")) return;
    persistReports(dayIndex, []);
  }

  // notes autosave & paste-as-image support
  function onNoteInput(index, e) {
    const txt = e.target.value;
    // immediate UI update
    const newNotes = [...notes];
    newNotes[index] = txt;
    setNotes(newNotes);
    // debounce save
    if (autosaveTimers.current[index]) clearTimeout(autosaveTimers.current[index]);
    autosaveTimers.current[index] = setTimeout(() => {
      persistNote(index, txt);
      autosaveTimers.current[index] = null;
    }, 1000);
  }

  function saveNoteNow(index) {
    persistNote(index, notes[index] || "");
  }

  function clearNote(index) {
    if (!window.confirm("Clear the note for this day?")) return;
    persistNote(index, "");
  }

  // paste handling (clipboard images to dataURL inserted into textarea)
  function onNotePaste(index, e) {
    const clipboard = e.clipboardData || window.clipboardData;
    if (!clipboard) return;
    const items = Array.from(clipboard.items || []);
    const imageItem = items.find((it) => it.type && it.type.startsWith("image"));
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target.result; // dataURL
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        const tag = `![image](${data})`;
        const nextVal = before + tag + after;
        const newNotes = [...notes];
        newNotes[index] = nextVal;
        setNotes(newNotes);
        // persist after small delay
        if (autosaveTimers.current[index]) clearTimeout(autosaveTimers.current[index]);
        autosaveTimers.current[index] = setTimeout(() => {
          persistNote(index, nextVal);
          autosaveTimers.current[index] = null;
        }, 600);
      };
      reader.readAsDataURL(file);
      e.preventDefault();
    }
  }

  // view/download actions: open in new tab or start download (anchor's download handles it)
  function viewReport(entry) {
    // opens the data URL
    window.open(entry.data, "_blank");
  }

  return (
    <div className="workshop-app">
      {/* <nav className="navbar">
        <div className="logo">
          <span className="mark" aria-hidden />
          <div>
            <div className="title">Navaasss</div>
            <div className="nav-actions">Workshop · 3 days</div>
          </div>
        </div>
        <div className="nav-actions">Group profiles · Upload reports</div>
      </nav> */}

      <header className="hero">
        <div>
          <h1>Workshop — Daily Reports & Notes</h1>
          <p className="muted">Upload, save, and manage daily reports. Notes persist in your browser.</p>
        </div>
        <div className="info">Tip: drag & drop files into each day's box</div>
      </header>

      <section className="days">
        {DAY_KEYS.map((key, idx) => (
          <article className="day" key={key}>
            <div className="day-head">
              <div>
                <div className="day-title">{DAY_TITLES[idx]}</div>
                <div className="day-sub">{DAY_SUBS[idx]}</div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button className="btn" onClick={() => clearReports(idx)}>
                  Clear
                </button>

                {/* Hidden file input with visible label */}
                <label className="btn" style={{ cursor: "pointer" }}>
                  <input
                    type="file"
                    accept="application/pdf,image/*,.doc,.docx,.txt"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handleFiles(idx, e.target.files);
                      e.target.value = "";
                    }}
                  />
                  Upload
                </label>
              </div>
            </div>

            <div className="upload-wrap">
              <div
                className="dropzone"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    // optionally open file picker (not implemented here)
                  }
                }}
              >
                Drop files here or click Upload
              </div>
            </div>

            <div className="reports-list" aria-live="polite">
              {reports[idx] && reports[idx].length ? (
                reports[idx].map((r, i) => (
                  <div className="report-row" key={r.time + "-" + i}>
                    <div className="report-meta">
                      <div className="report-name">{r.name}</div>
                      <div className="report-sub">
                        {new Date(r.time).toLocaleString()} · {r.type || ""} · {r.sizeReadable}
                      </div>
                    </div>

                    <div className="report-actions">
                      <button className="btn small" onClick={() => viewReport(r)}>
                        View
                      </button>
                      <a className="btn small" href={r.data} download={r.name}>
                        Download
                      </a>
                      <button className="btn small" onClick={() => removeReport(idx, i)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="info">No reports yet.</div>
              )}
            </div>

            <div className="notes-wrap">
              <div className="notes-head">
                <div style={{ fontWeight: 600 }}>Daily Notes</div>
                <div className="notes-actions">
                  <div className="saved-indicator" aria-live="polite">
                    {notes[idx] ? "Saved" : "Not saved"}
                  </div>
                  <button className="btn" onClick={() => clearNote(idx)}>
                    Clear Note
                  </button>
                  <button className="btn btn-primary" onClick={() => saveNoteNow(idx)}>
                    Save Note
                  </button>
                </div>
              </div>

              <textarea
                className="notes-textarea"
                placeholder="Write today's notes, observations, or paste images (they will be embedded as data URLs)"
                value={notes[idx] || ""}
                onChange={(e) => onNoteInput(idx, e)}
                onPaste={(e) => onNotePaste(idx, e)}
              />
            </div>
          </article>
        ))}
      </section>

      <div style={{ marginTop: 18, textAlign: "center", color: "#6B7280", fontSize: 13 }}>
        Files and notes are stored locally in your browser. Use Download to share files.
      </div>
    </div>
  );
}
