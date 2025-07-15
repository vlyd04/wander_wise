import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import DestinationCard from "../components/DestinationCard";
import { fetchExperienceDetails } from "../../api";

export default function ExperienceDetails() {
  const { experience } = useParams();
  const [experienceData, setExperienceData] = useState(null);

  useEffect(() => {
    fetchExperienceDetails(experience).then(setExperienceData);
  }, [experience]);

  if (!experienceData) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner imageUrl={experienceData.banner_image_url} title={experienceData.name} />

      <section className="my-8">
        <h2 className="text-3xl font-semibold mb-4">About {experienceData.name}</h2>
        <p className="text-gray-700 mb-6">{experienceData.description}</p>
      </section>

      <section className="my-8">
        <h2 className="text-3xl font-semibold mb-4">Destinations with this Experience</h2>
        {experienceData.destinations.length === 0 ? (
          <p>No destinations found for this experience.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {experienceData.destinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
