import image from '../../assets/images/pexels-bertellifotografia-3321791.jpg';
import Footer from '../layout/user/Footer';
import Navbar from '../layout/user/HomeNavbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Eimage1 from '../../assets/images/pexels-isabella-mendes-107313-332688.jpg';
import Eimage2 from '../../assets/images/pexels-isabella-mendes-107313-332688.jpg';
import Eimage3 from '../../assets/images/pexels-pixabay-264787.jpg';
import Eimage4 from '../../assets/images/pexels-pixabay-264787.jpg';

interface Event {
  _id: string;
  eventName: string;
  image?: string;
}
const HomePage: React.FC = () => {
  const categories = [
    { name: 'Music', icon: '🎵' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Food', icon: '🍽' },
  ];

  const eventTypes = [
    { title: 'WEDDING EVENTS', image: image },
    { title: 'BIRTHDAY PARTY', image: image },
    { title: 'MUSIC EVENTS', image: image },
    { title: 'WEDDING EVENTS', image: image },
    { title: 'BIRTHDAY PARTY', image: image },
    { title: 'MUSIC EVENTS', image: image }
  ];

  const images = [Eimage1, Eimage2, Eimage3, Eimage4];



  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/users/public-events');
        setEvents(response.data);
        setLoading(false);
      } catch (error: any) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };
    
  
    fetchEvents();
  }, []);
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        
        {/* Skeleton for Navbar */}
        <div className="h-16 w-full bg-gray-300 animate-pulse via-white/80 rounded-md mb-5"></div>
  
        {/* Skeleton for Image Carousel */}
        <div className="w-full h-[500px] bg-gray-300 animate-pulse via-white/80 rounded-lg mb-12"></div>
  
        {/* Skeleton for Public Events Section */}
        <h1 className="text-2xl font-semibold tracking-[0.2em] text-center mb-12 animate-pulse bg-gray-300 w-1/3 mx-auto h-6 rounded"></h1>
  
        {/* Skeleton for Search Filters */}
        <div className="flex gap-3 mb-8">
          <div className="w-full h-10 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-full h-10 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-full h-10 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="px-6 py-2 bg-gray-300 animate-pulse rounded"></div>
        </div>
  
        {/* Skeleton for Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="h-72 bg-gray-300 animate-pulse rounded-2xl shadow-md"></div>
          ))}
        </div>
  
        {/* Skeleton for Create Your Own Events Section */}
        <h1 className="text-2xl font-semibold tracking-[0.2em] text-center mt-12 mb-12 animate-pulse bg-gray-300 w-1/3 mx-auto h-6 rounded"></h1>
  
        {/* Skeleton for Create Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="h-48 bg-gray-300 animate-pulse rounded-2xl shadow-lg"></div>
          ))}
        </div>
  
        {/* Skeleton for Footer */}
        <div className="h-20 w-full bg-gray-300 animate-pulse rounded-md mt-12"></div>
        <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(120%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
        `}
      </style>
      </div>
    );
  }
  

    if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 ">


        <div className="relative w-full overflow-hidden mb-12">
          <div
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {images.map((src, index) => (
              <div key={index} className="flex-shrink-0 w-full snap-center">
                <div className="relative h-[500px] w-[1000px] mx-4">
                  <img src={src}  className="object-cover w-full h-full rounded-lg shadow-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>


        <div className="mb-12">
          <h1 className="text-3xl font-semibold tracking-[0.2em] text-center mb-12">PUBLIC EVENTS</h1>

          <div className="flex gap-3 mb-8 justify-center align-center">
            <input type="text" placeholder="Search Location" className="w-70 px-3 py-2 rounded bg-gray-100 pr-8 text-sm" />
            <input type="text" placeholder="Search Date" className="w-70 px-3 py-2 rounded bg-gray-100 pr-8 text-sm" />
            <input type="text" placeholder="Search Date" className="w-70 px-3 py-2 rounded bg-gray-100 pr-8 text-sm" />
            <button className="px-6 py-2 bg-black rounded text-white text-sm">GO</button>
          </div>
          <div className="mb-8  justify-center align-center text-white text-center p-2">
            <p className="text-md text-gray-600 mb-3 ">CATEGORY</p>
            <div className="flex gap-2 justify-center align-center">
              {categories.map((category, index) => (
                <button key={index} className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded text-sm">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-gray-600">{category.name}</span>
                </button>
              ))}
            </div>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map(event => (
            <div
              key={event._id}
              onClick={() => navigate(`/user/event/${event._id}`)}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {event.image && (
                <img src={event.image} alt={event.eventName} className="w-full h-60 object-cover rounded-2xl" />
              )}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-white bg-opacity-95 px-4 py-1.5 rounded-full">
                  <p className="text-center text-xs font-medium">{event.eventName}</p>
                </div>
              </div>
              <div className="absolute right-4 bottom-4 text-white text-2xl opacity-75 group-hover:translate-x-2 transition-all duration-300">→</div>
            </div>
          ))}
        </div>



        </div>


        <div>
          <h1 className="text-2xl font-semibold tracking-[0.2em] text-center mb-12">CREATE YOUR OWN EVENTS</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((event, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-2xl" />
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center rounded-2xl">
                  <p className="text-white text-lg font-medium tracking-widest">{event.title}</p>
                </div>
                <div className="absolute right-4 bottom-4 text-white text-2xl opacity-75 group-hover:translate-x-2 transition-all duration-300">→</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
  .myClass { color: red; }
`}</style>


      </div>
      <Footer />
    </>
  );
};

export default HomePage;