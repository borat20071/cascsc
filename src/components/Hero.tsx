import React, { useEffect, useState, memo } from "react";
import { Atom, FlaskRound as Flask, Microscope, Mail, Globe, Twitter, Linkedin, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

interface TeamMember {
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

// Memoized team member component to prevent unnecessary re-renders
const TeamMemberCard = memo(({ member }: { member: TeamMember }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all hover:transform hover:scale-[1.02]">
    <div className="aspect-w-4 aspect-h-3">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-full h-64 object-cover"
        loading="lazy" // Add lazy loading for images
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
        <a href={`mailto:${member.social.email}`} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
          <Mail className="w-5 h-5" />
        </a>
        <a href={member.social.website} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
          <Globe className="w-5 h-5" />
        </a>
        <a href={`https://twitter.com/${member.social.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
          <Twitter className="w-5 h-5" />
        </a>
        <a href={`https://linkedin.com/in/${member.social.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>
  </div>
));

// The main Hero component
function Hero() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load team members after the main content is displayed
  useEffect(() => {
    // Use requestIdleCallback or setTimeout to defer non-critical data fetching
    const loadTeamMembers = () => {
      fetch("http://localhost:5000/api/team")
        .then((res) => res.json())
        .then((data) => {
          setTeamMembers(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching team members:", err);
          setIsLoading(false);
        });
    };

    // Use requestIdleCallback if available (for better performance) or setTimeout as fallback
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadTeamMembers);
    } else {
      setTimeout(loadTeamMembers, 200);
    }
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          <div className="flex justify-center space-x-4 mb-8">
            <Atom className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <Flask className="h-16 w-16 text-purple-600 dark:text-purple-400 animate-pulse delay-100" />
            <Microscope className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-pulse delay-200" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Discover the World of Science
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join our community of curious minds and explore the wonders of science together. We're dedicated to pushing the boundaries
            of scientific discovery through collaborative research and innovation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Register for Membership
            </Link>
            <Link to="/about" className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A dedicated group of scientists and researchers working together to advance the boundaries of human knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show loading placeholders while team data is being fetched
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-pulse">
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="flex space-x-4">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export { Hero };
