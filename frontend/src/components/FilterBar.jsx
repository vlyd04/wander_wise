import React, { useState } from "react";

export default function FilterBar({ tags, selectedTags, onChange }) {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-left border-l-4 border-blue-400 pl-3" style={{marginBottom: 10}}>Filter by tags</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.2rem 2rem",
          marginTop: 8,
          alignItems: "center",
        }}
      >
        {tags.map((tag) => (
          <label
            key={tag}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#b4e1f7ff",
              borderRadius: 6,
              padding: "6px 14px 6px 8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              marginBottom: 4,
              minWidth: 90,
            }}
          >
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={() => onChange(tag)}
              style={{ marginRight: 6 }}
            />
            <span style={{ fontSize: 15 }}>{tag}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
