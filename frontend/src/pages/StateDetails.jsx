import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import DestinationCard from "../components/DestinationCard";
import ExperienceCard from "../components/ExperienceCard";
import { fetchStateDetails, fetchDestinationsByState } from "../../api";

export default function StateDetails() {
  const { state } = useParams();
  const [stateData, setStateData] = useState(null);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchStateDetails(state).then(setStateData);
    fetchDestinationsByState(state).then(setDestinations);
  }, [state]);

  if (!stateData) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner imageUrl={stateData.banner_image_url} title={stateData.name} />

      <section className="my-8">
        <h2 className="text-3xl font-semibold mb-4">About {stateData.name}</h2>
        <p className="text-gray-700 mb-6">{stateData.description}</p>

        {stateData.map_url && (
          <img
            src={stateData.map_url}
            alt={`${stateData.name} map`}
            className="w-full max-w-xl mx-auto rounded shadow-md"
          />
        )}
      </section>

      <section className="my-8">
        <h2 className="text-3xl font-semibold mb-4">Attractions</h2>
        {destinations.length === 0 ? (
          <p>No attractions found for this state.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      <section className="my-8">
        <h2 className="text-3xl font-semibold mb-4">Experiences</h2>
        {stateData.experiences && stateData.experiences.length === 0 ? (
          <p>No experiences found for this state.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stateData.experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
