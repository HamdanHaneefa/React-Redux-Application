import React, { useEffect, useState } from 'react';
import getData from '../redux/middleware/api';
import { useDispatch, useSelector } from 'react-redux';

const FetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-indigo-600 text-lg font-medium">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Available Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-indigo-100 p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-indigo-700">{item.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>📁 {item.category}</span>
              <span>⏱ {item.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchData;
