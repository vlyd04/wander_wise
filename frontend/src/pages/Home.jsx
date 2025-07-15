import React from "react";
import { useEffect, useState } from "react";
import { fetchStates, fetchExperiences } from "../../api"
import { Link } from "react-router-dom";

export default function Home() {
  const [states, setStates] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    fetchStates().then(setStates);
    fetchExperiences().then(setExperiences);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore India</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Browse by States</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {states.map((state) => (
            <Link
              key={state.name}
              to={`/state/${encodeURIComponent(state.name)}`}
              className="border rounded-lg p-4 text-center hover:bg-gray-100 transition"
            >
              {state.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Browse by Experiences</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {experiences.map((exp) => (
            <Link
              key={exp.name}
              to={`/experience/${encodeURIComponent(exp.name)}`}
              className="border rounded-lg p-4 text-center hover:bg-gray-100 transition"
            >
              {exp.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
