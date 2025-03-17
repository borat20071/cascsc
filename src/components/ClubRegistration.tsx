import React, { useState } from 'react';
import { School, BookOpen, GraduationCap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { API_BASE_URL } from '../config';
import { useTheme } from '../hooks/useTheme';

interface FormData {
  formNo: string;
  registrationNo: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  address: string;
  phoneNo: string;
  email: string;
  guardianName: string;
  guardianMobile: string;
  schoolName: string;
  class1: string;
  gpa1: string;
  class2: string;
  gpa2: string;
  hobby: string;
  correspondence: string;
  pastParticipant: string;
  whyJoin: string;
  clubs: string[];
}

function ClubRegistration() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState<FormData>({
    formNo: '',
    registrationNo: '',
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    bloodGroup: '',
    religion: '',
    address: '',
    phoneNo: '',
    email: '',
    guardianName: '',
    guardianMobile: '',
    schoolName: '',
    class1: '',
    gpa1: '',
    class2: '',
    gpa2: '',
    hobby: '',
    correspondence: '',
    pastParticipant: '',
    whyJoin: '',
    clubs: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // For club selection checkboxes
      if (name.startsWith('club_')) {
        const clubName = name.replace('club_', '');
        const checkbox = e.target as HTMLInputElement;
        if (checkbox.checked) {
          // Add club to list if checked and not already in the list
          setFormData(prev => ({
            ...prev,
            clubs: [...prev.clubs, clubName].slice(0, 3) // Limit to 3 clubs
          }));
        } else {
          // Remove club from list if unchecked
          setFormData(prev => ({
            ...prev,
            clubs: prev.clubs.filter(club => club !== clubName)
          }));
        }
      }
    } else {
      // For regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Call the API endpoint
      const response = await fetch(`${API_BASE_URL}/club-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }
      
      // Show success message
      setSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          formNo: '',
          registrationNo: '',
          fullName: '',
          dateOfBirth: '',
          placeOfBirth: '',
          gender: '',
          bloodGroup: '',
          religion: '',
          address: '',
          phoneNo: '',
          email: '',
          guardianName: '',
          guardianMobile: '',
          schoolName: '',
          class1: '',
          gpa1: '',
          class2: '',
          gpa2: '',
          hobby: '',
          correspondence: '',
          pastParticipant: '',
          whyJoin: '',
          clubs: [],
        });
      }, 3000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit registration');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your club membership application has been submitted successfully.</span>
          </div>
          <p className="mb-6">Thank you for applying to the CASC Science Club. We will review your application and get back to you soon.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Join CASC Science Club | Membership Registration</title>
        <meta name="description" content="Register to become a member of the CASC Science Club. Enjoy access to scientific resources, networking opportunities, and exclusive events." />
      </Helmet>
      
      <div className={`min-h-screen p-2 sm:p-4 md:p-8 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-[#f0f8ff]'}`}>
        <form onSubmit={handleSubmit}>
          <div className={`max-w-4xl mx-auto rounded-lg shadow-lg p-4 sm:p-6 md:p-8 relative overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <div className="w-[800px] h-[800px] relative">
                <div className={`absolute inset-0 border-[40px] rounded-full ${isDark ? 'border-blue-400' : 'border-[#00a2e8]'}`}></div>
                <div className={`absolute inset-[80px] border-[30px] rounded-full ${isDark ? 'border-blue-400' : 'border-[#00a2e8]'}`}></div>
                <div className="absolute inset-[160px] flex items-center justify-center">
                  <div className={`text-[200px] font-bold ${isDark ? 'text-blue-400' : 'text-[#00a2e8]'}`}>CA</div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-10">
              {/* Left Logo */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="w-24 h-24 sm:w-16 sm:h-16">
                  <img 
                    src="/path-to-your-logo.png" 
                    alt="CASC Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold">The Association of CASC Club</h1>
                  <h2 className="text-base sm:text-lg">Civil Aviation School & College, Tejgaon, Dhaka-1215</h2>
                </div>
              </div>
              {/* Right Logo */}
              <div className="w-24 h-24 sm:w-16 sm:h-16">
                <img 
                  src="/path-to-your-right-logo.png" 
                  alt="CA Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="flex-1">
                Form No. 
                <input 
                  type="text" 
                  name="formNo"
                  value={formData.formNo}
                  onChange={handleChange}
                  className={`border px-2 w-full sm:w-32 rounded ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                />
              </div>
              <div className="flex-1">
                Registration No. 
                <input 
                  type="text" 
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  className={`border px-2 w-full sm:w-32 rounded ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                />
              </div>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-bold text-center text-white py-2 mb-6 ${isDark ? 'bg-blue-600' : 'bg-[#00a2e8]'}`}>
              CLUB MEMBERSHIP APPLICATION FORM
            </h1>

            {/* Club Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Choose Any Three Clubs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_science" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("science")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Science Club
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_debate" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("debate")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Debate Club
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_photography" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("photography")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Photography Club
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_business" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("business")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Business & Carrier Club
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_language" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("language")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Language Club
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_cultural" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("cultural")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Cultural Club
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_sports" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("sports")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Sports Club
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      name="club_nature" 
                      onChange={handleChange}
                      disabled={formData.clubs.length >= 3 && !formData.clubs.includes("nature")}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> 
                    The CASC Nature & Environment Club
                  </label>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <label className="block mb-1">Full Name:</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                  <div className={`w-full sm:w-40 h-48 border flex items-center justify-center text-center ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                    Color Photo<br />with<br />School/College<br />Uniform
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Date of Birth:</label>
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Place of Birth:</label>
                    <input 
                      type="text" 
                      name="placeOfBirth"
                      value={formData.placeOfBirth}
                      onChange={handleChange}
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1">Gender:</label>
                    <div className="flex gap-4">
                      <label>
                        <input 
                          type="radio" 
                          name="gender" 
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleChange}
                          className={isDark ? 'accent-blue-400' : ''} 
                        /> Male
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          name="gender" 
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleChange}
                          className={isDark ? 'accent-blue-400' : ''} 
                        /> Female
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          name="gender" 
                          value="other"
                          checked={formData.gender === "other"}
                          onChange={handleChange}
                          className={isDark ? 'accent-blue-400' : ''} 
                        /> Other
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">Blood Group:</label>
                    <input 
                      type="text" 
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Religion:</label>
                    <input 
                      type="text" 
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Address:</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Phone No:</label>
                    <input 
                      type="tel" 
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleChange}
                      required
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email ID:</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Guardian Name:</label>
                    <input 
                      type="text" 
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      required
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                  <div>
                    <label className="block mb-1">G. Mobile No.:</label>
                    <input 
                      type="tel" 
                      name="guardianMobile"
                      value={formData.guardianMobile}
                      onChange={handleChange}
                      required
                      className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Records */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Last two Year Academic Records:</h3>
              <div>
                <label className="block mb-1">School/College Name:</label>
                <input 
                  type="text" 
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded px-2 py-1 mb-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">1. Class:</label>
                      <input 
                        type="text" 
                        name="class1"
                        value={formData.class1}
                        onChange={handleChange}
                        className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                      />
                    </div>
                    <div>
                      <label className="block mb-1">GPA:</label>
                      <input 
                        type="text" 
                        name="gpa1"
                        value={formData.gpa1}
                        onChange={handleChange}
                        className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">2. Class:</label>
                      <input 
                        type="text" 
                        name="class2"
                        value={formData.class2}
                        onChange={handleChange}
                        className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                      />
                    </div>
                    <div>
                      <label className="block mb-1">GPA:</label>
                      <input 
                        type="text" 
                        name="gpa2"
                        value={formData.gpa2}
                        onChange={handleChange}
                        className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hobby */}
            <div className="mb-6">
              <label className="block mb-1">Hobby:</label>
              <input 
                type="text" 
                name="hobby"
                value={formData.hobby}
                onChange={handleChange}
                className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} 
              />
            </div>

            {/* Community Correspondences */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                <h3 className="font-semibold">Send Community Correspondences to:</h3>
                <div className="flex gap-4">
                  <label>
                    <input 
                      type="radio" 
                      name="correspondence" 
                      value="yes"
                      checked={formData.correspondence === "yes"}
                      onChange={handleChange}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> Yes
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="correspondence" 
                      value="no"
                      checked={formData.correspondence === "no"}
                      onChange={handleChange}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> No
                  </label>
                </div>
              </div>
              <div>
                <label className="block mb-1">Why are you interested in joining our association clubs?</label>
                <textarea 
                  name="whyJoin"
                  value={formData.whyJoin}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded px-2 py-1 h-24 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                ></textarea>
              </div>
            </div>

            {/* Past Participation */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                <h3 className="font-semibold">Are you a past participant in a club?</h3>
                <div className="flex gap-4">
                  <label>
                    <input 
                      type="radio" 
                      name="pastParticipant" 
                      value="yes"
                      checked={formData.pastParticipant === "yes"}
                      onChange={handleChange}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> Yes
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      name="pastParticipant" 
                      value="no"
                      checked={formData.pastParticipant === "no"}
                      onChange={handleChange}
                      className={isDark ? 'accent-blue-400' : ''} 
                    /> No
                  </label>
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">DECLARATION AND CONSENT</h3>
              <div className="space-y-2">
                <label className="flex items-start gap-2">
                  <input type="checkbox" required className={`mt-1 ${isDark ? 'accent-blue-400' : ''}`} />
                  <span>I hereby declare that the above information is true and correct to the best of my knowledge and belief.</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" required className={`mt-1 ${isDark ? 'accent-blue-400' : ''}`} />
                  <span>I agree to abide by the club's rules and regulations.</span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" required className={`mt-1 ${isDark ? 'accent-blue-400' : ''}`} />
                  <span>I consent to the club collecting and using my personal data for membership and club activities.</span>
                </label>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="mb-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded font-bold text-white ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isDark 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-[#00a2e8] hover:bg-[#0089c4]'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              <div>
                <div className={`border-t pt-2 ${isDark ? 'border-gray-600' : 'border-black'}`}>
                  <div>Applicant Signature</div>
                  <div>Date:</div>
                </div>
              </div>
              <div>
                <div className={`border-t pt-2 ${isDark ? 'border-gray-600' : 'border-black'}`}>
                  <div>Class Teachers Signature</div>
                  <div>Date:</div>
                </div>
              </div>
            </div>

            {/* Enclosures */}
            <div className="mt-6">
              <div className="font-semibold">Enclosed:</div>
              <div className="text-sm sm:text-base">(a) Last Year Academic Report (b) Top Five Acheivement/Appreciation Certificate</div>
            </div>

            {/* Colorful Triangle Pattern */}
            <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32 overflow-hidden">
              <div className="absolute bottom-0 right-0 flex flex-col gap-1">
                <div className="flex gap-1 justify-end">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-600 transform rotate-45"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 transform rotate-45"></div>
                </div>
                <div className="flex gap-1 justify-end">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 transform rotate-45"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 transform rotate-45"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 transform rotate-45"></div>
                </div>
                <div className="flex gap-1 justify-end">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 transform rotate-45"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-500 transform rotate-45"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-500 transform rotate-45"></div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ClubRegistration; 