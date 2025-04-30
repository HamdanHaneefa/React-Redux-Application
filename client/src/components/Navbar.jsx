import { Link } from "react-router";

export const Navbar = () => {
  return (
    <>
      {/* <!-- Navbar Component --> */}
      <nav className="bg-indigo-600 border-b border-indigo-700 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl mx-auto">
          {/* <!-- Logo --> */}
          <a href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">🔯Redux</span>
          </a>

          {/* <!-- Mobile menu button --> */}
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-indigo-100 md:hidden hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5h14M3 10h14M3 15h14" clipRule="evenodd" />
            </svg>
          </button>

          {/* <!-- Nav Links --> */}
          <div className="hidden w-full md:flex md:w-auto md:items-center md:justify-center md:flex-1" id="navbar-default">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 text-sm font-medium">
              <li><Link to="/" className="block py-2 pl-3 pr-4 text-indigo-100 hover:text-white md:p-0 transition-colors duration-200">Home</Link></li>
              <li><Link to="/services" className="block py-2 pl-3 pr-4 text-indigo-100 hover:text-white md:p-0 transition-colors duration-200">Services</Link></li>
              <li><Link to="/about" className="block py-2 pl-3 pr-4 text-indigo-100 hover:text-white md:p-0 transition-colors duration-200">About</Link></li>
              <li><Link to="/contact" className="block py-2 pl-3 pr-4 text-indigo-100 hover:text-white md:p-0 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
