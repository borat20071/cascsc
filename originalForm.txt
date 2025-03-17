import React, { useState } from 'react';
import { School, BookOpen, GraduationCap, Star, Moon, Sun } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`min-h-screen p-2 sm:p-4 md:p-8 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-[#f0f8ff]'}`}>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-full ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-800'} shadow-lg`}
        >
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>
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
          <div className="flex-1">Form No. <input type="text" className={`border px-2 w-full sm:w-32 rounded ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} /></div>
          <div className="flex-1">Registration No. <input type="text" className={`border px-2 w-full sm:w-32 rounded ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} /></div>
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
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Science Club
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Debate Club
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Photography Club
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Business & Carrier Club
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Language Club
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Cultural Club
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Sports Club
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className={isDark ? 'accent-blue-400' : ''} /> The CASC Nature & Environment Club
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
                <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
              <div className={`w-full sm:w-40 h-48 border flex items-center justify-center text-center ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                Color Photo<br />with<br />School/College<br />Uniform
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Date of Birth:</label>
                <input type="date" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
              <div>
                <label className="block mb-1">Place of Birth:</label>
                <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Gender:</label>
                <div className="flex gap-4">
                  <label><input type="radio" name="gender" className={isDark ? 'accent-blue-400' : ''} /> Male</label>
                  <label><input type="radio" name="gender" className={isDark ? 'accent-blue-400' : ''} /> Female</label>
                  <label><input type="radio" name="gender" className={isDark ? 'accent-blue-400' : ''} /> Other</label>
                </div>
              </div>
              <div>
                <label className="block mb-1">Blood Group:</label>
                <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
              <div>
                <label className="block mb-1">Religion:</label>
                <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
            </div>

            <div>
              <label className="block mb-1">Address:</label>
              <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Phone No:</label>
                <input type="tel" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
              <div>
                <label className="block mb-1">Email ID:</label>
                <input type="email" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Guardian Name:</label>
                <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
              <div>
                <label className="block mb-1">G. Mobile No.:</label>
                <input type="tel" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Records */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Last two Year Academic Records:</h3>
          <div>
            <label className="block mb-1">School/College Name:</label>
            <input type="text" className={`w-full border rounded px-2 py-1 mb-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">1. Class:</label>
                  <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className="block mb-1">GPA:</label>
                  <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">2. Class:</label>
                  <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className="block mb-1">GPA:</label>
                  <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hobby */}
        <div className="mb-6">
          <label className="block mb-1">Hobby:</label>
          <input type="text" className={`w-full border rounded px-2 py-1 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`} />
        </div>

        {/* Community Correspondences */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
            <h3 className="font-semibold">Send Community Correspondences to:</h3>
            <div className="flex gap-4">
              <label><input type="radio" name="correspondence" className={isDark ? 'accent-blue-400' : ''} /> Yes</label>
              <label><input type="radio" name="correspondence" className={isDark ? 'accent-blue-400' : ''} /> No</label>
            </div>
          </div>
          <div>
            <label className="block mb-1">Why are you interested in joining our association clubs?</label>
            <textarea className={`w-full border rounded px-2 py-1 h-24 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}></textarea>
          </div>
        </div>

        {/* Past Participation */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
            <h3 className="font-semibold">Are you a past participant in a club?</h3>
            <div className="flex gap-4">
              <label><input type="radio" name="past_participant" className={isDark ? 'accent-blue-400' : ''} /> Yes</label>
              <label><input type="radio" name="past_participant" className={isDark ? 'accent-blue-400' : ''} /> No</label>
            </div>
          </div>
          <div>
            <label className="block mb-1">Why are you interested in joining our association clubs?</label>
            <textarea className={`w-full border rounded px-2 py-1 h-24 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}></textarea>
          </div>
        </div>

        {/* Declaration */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">DECLARATION AND CONSENT</h3>
          <div className="space-y-2">
            <label className="flex items-start gap-2">
              <input type="checkbox" className={`mt-1 ${isDark ? 'accent-blue-400' : ''}`} />
              <span>I hereby declare that the above information is true and correct to the best of my knowledge and belief.</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" className={`mt-1 ${isDark ? 'accent-blue-400' : ''}`} />
              <span>I agree to abide by the club's rules and regulations.</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="checkbox" className={`mt-1 ${isDark ? 'accent-blue-400' : ''}`} />
              <span>I consent to the club collecting and using my personal data for membership and club activities.</span>
            </label>
          </div>
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
    </div>
  );
}

export default App;