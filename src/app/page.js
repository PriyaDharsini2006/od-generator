'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Event options
const events = [
  'Takshashila Day',
  'Technical Symposium',
  'Cultural Fest',
  'Hackathon',
  'Workshop',
  'Paper Presentation',
  'Project Exhibition',
  'Coding Contest',
  'Sports Meet',
  'Quiz Competition',

  // New Events
  'IPL Auction',
  'Load the Lyrics',
  'Funzone',
  'Graphite-TY',
  'Film Fanatics',
  'Frame Spot',
  'Solo Dance',
  'Duo Dance',
  'Cypher',
  'Behind the Yellow Tapes',
  'Treasure Hunt',
  
  'H2O Rocketry',
  'Brand Marketing',
  'UI/UX (Designers Onboard)',
  
  'Aeromodelling',
  'World of OpenSource with GitHub',
  'IoT and Embedded Systems',

  'Stress Interview',
  'Real to Reel',
  'TK TV',
  'Solo Singing',
  'Group Singing',
  'Treasure Hunt',
  'Surprise Event',
  'On-Air (RJ Hunt)',
  'Connection: Music',

  'Paper Presentation',
  'Tech Quest',
  'Reverse Engineering Challenge',
  'Trial Tracks',

  'Cybersecurity',
  'Full Stack',
  'CITIL - Idea to Impact',

  'Street Music Jam',
  'Word Whiz',
  'Talking Heads',
  'Anime Gauntlet',
  'Music Quiz',
  'Shipwreck',
  'Rap-a-Thon',
  'Treasure Hunt',

  'Radio Wheels',
  'Dark Web Treasure Hunt',
  'Binary Symphony',

  'Music Production',
  'AI/ML with IoT',
  'Networking with Linux',
  'Drone'
];


export default function Home() {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDepartment: '',
    eventDate: '',
    eventName: 'Takshashila Day',
  });
  
  const [templateHtml, setTemplateHtml] = useState('');

  // Fetch the HTML template on component mount
  useEffect(() => {
    fetch('/templates/od-letter-template.html')
      .then(response => response.text())
      .then(html => {
        setTemplateHtml(html);
      })
      .catch(error => {
        console.error('Error loading template:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const generatePDF = () => {
    if (!templateHtml) {
      alert('Template is still loading, please try again in a moment');
      return;
    }

    // Replace placeholders in the template
    let filledTemplate = templateHtml
      .replace('{{CURRENT_DATE}}', format(new Date(), 'MMMM dd, yyyy'))
      .replace(/{{RECIPIENT_NAME}}/g, formData.recipientName || '[Recipient Name]')
      .replace('{{RECIPIENT_DEPARTMENT}}', formData.recipientDepartment || '[Department]')
      .replace(/{{EVENT_NAME}}/g, formData.eventName)
      .replace('{{EVENT_DATE}}', formData.eventDate ? format(new Date(formData.eventDate), 'MMMM dd, yyyy') : '[Event Date]');

    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = filledTemplate;
    document.body.appendChild(container);
    
    // Import html2pdf dynamically (to avoid SSR issues)
    import('html2pdf.js').then(html2pdfModule => {
      const html2pdf = html2pdfModule.default;
      const options = {
        margin: 10,
        filename: `OD_Permission_${formData.recipientName.replace(/\s+/g, '_') || 'Letter'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(container).set(options).save().then(() => {
        // Remove the temporary container after PDF generation
        document.body.removeChild(container);
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5 mb-6">
              <div className="h-14 w-14 bg-blue-600 rounded-full flex flex-shrink-0 justify-center items-center text-white text-2xl font-mono">CIT</div>
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <h2 className="leading-relaxed">OD Permission Letter Generator</h2>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">Fill in the details to generate an OD permission letter</p>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="py-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                
                <div className="flex flex-col">
                  <label className="leading-loose">Recipient's Name</label>
                  <input 
                    type="text" 
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" 
                    placeholder="John Doe" 
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="leading-loose">Department</label>
                  <input 
                    type="text" 
                    name="recipientDepartment"
                    value={formData.recipientDepartment}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" 
                    placeholder="Computer Science" 
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="leading-loose">Event Date</label>
                  <input 
                    type="date" 
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" 
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="leading-loose">Event Name</label>
                  <select 
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className="px-4 py-2 border focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                  >
                    {events.map((event, index) => (
                      <option key={index} value={event}>{event}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex items-center space-x-4">
                <button 
                  className="bg-blue-600 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-blue-700 transition duration-300"
                  onClick={generatePDF}
                >
                  Generate PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
