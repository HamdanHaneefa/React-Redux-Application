import { Link } from "react-router-dom";

const Service = () => {
  const services = [
    { name: "Counter", path: "/services/counter" },
    { name: "Todo", path: "/services/todo" },
    // Add more services as needed
  ];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-8">Our Services</h1>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.name}
              to={service.path}
              className="bg-white shadow-md hover:shadow-xl transition-transform transform hover:scale-105 duration-300 ease-in-out rounded-lg p-6 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50"
            >
              <h2 className="text-xl font-semibold text-indigo-600 group-hover:text-indigo-800">{service.name}</h2>
              <p className="text-sm text-gray-500 mt-2">Click to explore the {service.name} feature.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
