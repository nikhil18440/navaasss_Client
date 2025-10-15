// File: PeopleList.jsx
import React, { useState, useEffect } from "react";
import "./peoples.css";

export default function PeopleList() {
  const [people] = useState([
    {
      id: 1,
      name: "Soumya",
      role: "Captain",
    //   bio: "Loves minimal design, sustainable materials, and long walks with sketchbook.",
      img: "soumya.jpg",
    },
    {
      id: 2,
      name: "Vivek",
      role: "Vice captain",
    //   bio: "Loves minimal design, sustainable materials, and long walks with sketchbook.",
      img: "vivek.jpg",
    },
    {
      id: 3,
      name: "Anusyuudh",
      role: "Member",
    //   bio: "Loves minimal design, sustainable materials, and long walks with sketchbook.",
      img: "anusyuudh.png",
    },
    {
      id: 4,
      name: "Shreya",
      role: "Member",
    //   bio: "Loves minimal design, sustainable materials, and long walks with sketchbook.",
      img: "shreya.jpg",
    },
    {
      id: 5,
      name: "sreelakshmi",
      role: "Member",
    //   bio: "Loves minimal design, sustainable materials, and long walks with sketchbook.",
      img: "sreelakshmi.jpg",
    },
    {
      id: 6,
      name: "Anly anders",
      role: "Member",
    //   bio: "Loves minimal design, sustainable materials, and long walks with sketchbook.",
      img: "anly.jpg",
    },
    {
      id: 7,
      name: "Nikhil",
      role: "Member",
    //   bio: "Loves minimal design, sustainable materials, and long walks with sketchbook.",
      img: "nikhil.jpg",
    },
    
  ]);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="people-list-root">
      <header className="people-header">
        <h2>Team</h2>
        <p>Tap a person to view details</p>
      </header>

      <ul className="people-grid">
        {people.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => setSelected(p)}
              className="person-btn"
              aria-label={`Open details for ${p.name}`}>

              <div className="person-avatar">
                <img src={p.img} alt={p.name} />
              </div>

              <div className="person-name" title={p.name}>{p.name}</div>
              <div className="person-role">{p.role}</div>
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="modal-root" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setSelected(null)} />

          <div className="modal-card">
            <div className="modal-inner">
              <div className="modal-avatar">
                <img src={selected.img} alt={selected.name} />
              </div>

              <div className="modal-content">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <h3>{selected.name}</h3>
                    <p className="role">{selected.role}</p>
                  </div>

                  <button onClick={() => setSelected(null)} aria-label="Close" className="btn" style={{border: 'none', background: 'transparent'}}>✕</button>
                </div>

                <p className="bio">{selected.bio}</p>

                <div className="modal-actions">
                  <button className="btn">Message</button>
                  <button className="btn btn-primary">View Profile</button>
                </div>
              </div>
            </div>

            <div className="modal-footer">Tap outside to close</div>
          </div>
        </div>
      )}
    </div>
  );
}


