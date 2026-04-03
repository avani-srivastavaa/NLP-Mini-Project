import { Link } from 'react-router';
import { Book, Code, ArrowLeft } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';

const avaniImage = new URL('../components/assets/developers/avani-srivastava.png', import.meta.url).href;
const sumitImage = new URL('../components/assets/developers/sumit-roy.png', import.meta.url).href;
const abinrajImage = new URL('../components/assets/developers/abinraaj.png', import.meta.url).href;
const keerthanaImage = new URL('../components/assets/developers/keerthana.png', import.meta.url).href;
const adityaImage = new URL('../components/assets/developers/aditya-shinde.png', import.meta.url).href;
const veenaImage = new URL('../components/assets/developers/veena.png', import.meta.url).href;
const parthImage = new URL('../components/assets/developers/parth.png', import.meta.url).href;
const sarthImage = new URL('../components/assets/developers/sarth.png', import.meta.url).href;
const vedantImage = new URL('../components/assets/developers/vedant.png', import.meta.url).href;
const jayeshImage = new URL('../components/assets/developers/jayesh.png', import.meta.url).href;
const tajeshreeImage = new URL('../components/assets/developers/tajeshree.png', import.meta.url).href;
const vishalImage = new URL('../components/assets/developers/vishal.png', import.meta.url).href;

const developers = [
  {
    domain: 'Frontend',
    icon: Code,
    members: [
      { name: 'Keerthana', linkedinUrl: 'https://www.linkedin.com/in/kirtna/', imageUrl: keerthanaImage },
      { name: 'Veena', linkedinUrl: 'https://www.linkedin.com/in/veeeenapatil?utm_source=share_via&utm_content=profile&utm_medium=member_android', imageUrl: veenaImage },
      { name: 'Abinraj', linkedinUrl: 'https://www.linkedin.com/in/abinraj-lalraj-140458265', imageUrl: abinrajImage },
    ],
  },
  {
    domain: 'Backend & Database',
    icon: Code,
    members: [
      { name: 'Sarth Patil', linkedinUrl: 'https://www.linkedin.com/in/sarth-patil-993797222?utm_source=share_via&utm_content=profile&utm_medium=member_android', imageUrl: sarthImage },
      { name: 'Vedant Salve', linkedinUrl: 'https://www.linkedin.com/in/vedant-salve-38b8aa39b', imageUrl: vedantImage },
      { name: 'Parth Patil', linkedinUrl: 'https://www.linkedin.com/in/parth-patil-6210a3310', imageUrl: parthImage },
    ],
  },
  {
    domain: 'NLP & AI',
    icon: Code,
    members: [
      { name: 'Sumit Roy', linkedinUrl: 'https://www.linkedin.com/in/sumit-roy-a73098309?utm_source=share_via&utm_content=profile&utm_medium=member_android', imageUrl: sumitImage },
      { name: 'Nihar', linkedinUrl: '', imageUrl: undefined },
    ],
  },
  {
    domain: 'QA & Content',
    icon: Code,
    members: [
      { name: 'Aditya Shinde', linkedinUrl: 'https://www.linkedin.com/in/aditya-shinde-50083a319/?skipRedirect=true', imageUrl: adityaImage },
      { name: 'Jayesh Sonar', linkedinUrl: 'https://www.linkedin.com/in/jayesh-sonar-54b94b31a?utm_source=share_via&utm_content=profile&utm_medium=member_ios', imageUrl: jayeshImage },
    ],
  },
  {
    domain: 'DevOps & Git',
    icon: Code,
    members: [
      { name: 'Avani Srivastava', linkedinUrl: 'https://www.linkedin.com/in/avani-srivastava-1202b22b9/', imageUrl: avaniImage },
    ],
  },
  {
    domain: 'Documentation',
    icon: Book,
    members: [
      { name: 'Tajeshree', linkedinUrl: '', imageUrl: undefined },
      { name: 'Vishal Singh', linkedinUrl: '', imageUrl: undefined },
    ],
  },
];

export default function Developers() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Book className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-800">Smart Library</span>
            </Link>
            <Link to="/" className="group">
              <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Meet Our Developers
          </h1>
          <p className="text-2xl text-gray-600">
            The talented team behind Smart Library System
          </p>
        </div>
      </section>

      {/* Developers Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {developers.map((group) => {
          const IconComponent = group.icon;
          return (
            <div key={group.domain} className="mb-20">
              {/* Domain Header */}
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                  {group.domain}
                </h2>
              </div>

              {/* Members Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.members.map((member) => {
                  const [imageError, setImageError] = useState(false);

                  return (
                    <div
                      key={member.name}
                      className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-gray-100 relative"
                    >
                      {/* LinkedIn Icon - Upper Right Corner */}
                      {member.linkedinUrl ? (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FaLinkedin size={32} />
                        </a>
                      ) : (
                        <div className="absolute top-4 right-4 text-gray-300">
                          <FaLinkedin size={32} />
                        </div>
                      )}

                      {/* Profile Avatar */}
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                        {member.imageUrl && !imageError ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                          />
                        ) : (
                          <span className="text-3xl font-bold text-white">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Member Name */}
                      <h3 className="text-2xl font-bold text-gray-900 text-center">
                        {member.name}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2026 Smart Library System. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Developed as a learning project at{' '}
            <a
              href="https://pce.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Pillai College of Engineering
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
