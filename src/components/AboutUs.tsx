import React, { useState, useEffect } from 'react';
import { Mail, Globe, Twitter, Linkedin, Award, Users, BookOpen, Calendar, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '../config';

// Mock team members to use when the API endpoint is not available
const MOCK_TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Ahmmad Abdullah Mahmud',
    role: 'President',
    bio: 'Leading the CASC Science Club with passion and dedication. Focused on creating a positive learning environment for all members.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400',
    social: {
      email: 'ahmmadabdullah@example.com',
      website: '#',
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    id: '2',
    name: 'Sajid Hossain',
    role: 'Vice President',
    bio: 'Dedicated to supporting club activities and ensuring smooth operations. Specializes in coordinating research initiatives.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400',
    social: {
      email: 'sajid.hossain@example.com',
      website: '#',
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    id: '3',
    name: 'Farhana Islam',
    role: 'Secretary',
    bio: 'Manages administrative tasks and communication. Ensures that all club members are informed and engaged in activities.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400',
    social: {
      email: 'farhana.islam@example.com',
      website: '#',
      twitter: '#',
      linkedin: '#'
    }
  }
];

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    email: string;
    website: string;
    twitter: string;
    linkedin: string;
  };
}

function AboutUs() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiMissing, setApiMissing] = useState(false);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const response = await fetch(`${API_BASE_URL}/team-members`);
        
        if (response.status === 404) {
          // If API endpoint doesn't exist, use mock data
          console.warn('API endpoint /team-members not found. Using mock data instead.');
          setTeamMembers(MOCK_TEAM_MEMBERS);
          setApiMissing(true);
        } else if (!response.ok) {
          throw new Error('Failed to fetch team members');
        } else {
          const data = await response.json();
          setTeamMembers(data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setTeamMembers(MOCK_TEAM_MEMBERS);
        setApiMissing(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About CASC Science Club
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Founded in October 2024 at Civil Aviation School and College, we are a community of young scientists and innovators dedicated to exploration and discovery.
        </p>
      </div>

      {/* History & Mission Section */}
      <div className="mb-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-indigo-900 rounded-xl shadow-xl p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Story
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The CASC Science Club was established in October 2024 at Civil Aviation School and College to foster a love of science among students. What began as a small group of enthusiastic science lovers has grown into a vibrant community that encourages scientific inquiry, innovation, and collaboration.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our club provides a platform for students to explore various scientific disciplines, develop critical thinking skills, and engage in hands-on experiments and projects. We believe in creating an environment where curiosity is celebrated and scientific literacy is promoted among the younger generation.
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          Our Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
              <Award className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Science Fair Winners</h3>
            <p className="text-gray-600 dark:text-gray-300">Multiple awards at regional and national science competitions</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
              <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Growing Community</h3>
            <p className="text-gray-600 dark:text-gray-300">Over 50 active members from various academic backgrounds</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
              <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Research Initiatives</h3>
            <p className="text-gray-600 dark:text-gray-300">Successful completion of multiple student-led research projects</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-full bg-indigo-100 dark:bg-indigo-900 mb-4">
              <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Events Organized</h3>
            <p className="text-gray-600 dark:text-gray-300">Hosted workshops, seminars, and field trips to promote scientific learning</p>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center w-full">
            Our Leadership Team
          </h2>
          
          {apiMissing && (
            <div className="absolute right-8 flex items-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="text-sm">Using demo data</span>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all hover:transform hover:scale-[1.02]"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {member.bio}
                  </p>
                  <div className="flex items-center space-x-4">
                    <a
                      href={`mailto:${member.social.email}`}
                      className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    {member.social.website !== '#' && (
                      <a
                        href={member.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter !== '#' && (
                      <a
                        href={`https://twitter.com/${member.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.linkedin !== '#' && (
                      <a
                        href={`https://linkedin.com/in/${member.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-indigo-900 rounded-xl shadow-xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            The CASC Science Club is committed to inspiring the next generation of scientists by fostering curiosity, 
            critical thinking, and a love for scientific exploration. We aim to create a supportive environment 
            where students can develop valuable skills through hands-on experiences, collaborative projects, 
            and meaningful engagement with science. Our goal is to prepare students for future academic and 
            career opportunities in science, technology, engineering, and mathematics (STEM).
          </p>
        </div>
      </div>
    </div>
  );
}

export { AboutUs };