import React from 'react';
import { Atom, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const quickLinks = [
    { name: 'Events', path: '/events' },
    { name: 'Members', path: '/members' },
    { name: 'Blog', path: '/blog' },
    { name: 'About Us', path: '/about' }
  ];

  const resourceLinks = [
    { name: 'Research Projects', path: '/research-projects' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center">
              <Atom className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">CASCSC</span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              CASC Science Club - Established in October 2024. Advancing scientific discovery through collaboration and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  Civil Aviation School and College, Tejgaon, Dhaka
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
                <a 
                  href="mailto:cascscienceclub.official@gmail.com" 
                  className="ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  cascscienceclub.official@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400" />
                <a 
                  href="tel:01730703404"
                  className="ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  01730-703404
                </a>
              </li>
              <li className="flex items-center">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                <a 
                  href="https://wa.me/8801730703404"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  WhatsApp: +8801730703404
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} CASC Science Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};