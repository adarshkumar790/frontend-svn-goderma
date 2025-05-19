import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [title, setTitle] = useState('');
  const [img, setImg] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/facilities');
      setFacilities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addFacility = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/facilities', { title, img });
      setFacilities([...facilities, res.data]);
      setTitle('');
      setImg('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFacility = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/facilities/${id}`);
      setFacilities(facilities.filter(facility => facility._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Facilities</h2>
      <input
        type="text"
        placeholder="Facility Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={img}
        onChange={(e) => setImg(e.target.value)}
      />
      <button onClick={addFacility}>Add Facility</button>
      <ul>
        {facilities.map(facility => (
          <li key={facility._id}>
            <h3>{facility.title}</h3>
            <img src={facility.img} alt={facility.title} width="100" />
            <button onClick={() => deleteFacility(facility._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Facilities;
