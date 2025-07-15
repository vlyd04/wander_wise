import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

const CardSection = ({ heading, endpoint }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/${endpoint}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [endpoint]);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">{heading}</h2>
      <div className="flex flex-wrap gap-6">
        {data.map((item) => (
          <Card key={item.id} title={item.title} image={`http://localhost:5000${item.image_url}`} description={item.description} />
        ))}
      </div>
    </section>
  );
};

export default CardSection;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Card from './Card';

// const CardSection = () => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const latitude = 41.397158;
//   const longitude = 2.160873;
//   const radius = 1;

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/activities', {
//         params: { latitude, longitude, radius }
//       })
//       .then((res) => {
//         const raw = res.data.data || [];
//         const mapped = raw.map((item) => ({
//           id: item.id,
//           title: item.attributes.name,
//           image: item.attributes.picture?.[0] || '',
//           description: item.attributes.shortDescription,
//           link: item.attributes.bookingLink
//         }));
//         setActivities(mapped);
//       })
//       .catch((err) => {
//         console.error('Error fetching Amadeus activities:', err);
//         setActivities([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <section className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Amadeus Activities Nearby</h2>
//       {loading ? (
//         <p>Loading activities...</p>
//       ) : activities.length === 0 ? (
//         <p>No activities found.</p>
//       ) : (
//         <div className="flex flex-wrap gap-6">
//           {activities.map(({ id, title, image, description, link }) => (
//             <AmadeusCard
//               key={id}
//               title={title}
//               image={image}
//               description={description}
//               link={link}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default CardSection;
