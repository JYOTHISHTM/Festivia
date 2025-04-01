import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../layout/creator/SideBar';

interface Event {
  _id: string;
  eventName: string;
  location: string;
  prize: number;
  totalSeats: string;
  date: string;
  image?: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/creator/events');
        console.log("API Response:", response.data); 
        setEvents(response.data);
        setLoading(false);
      } catch (error: any) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 p-8">
        {/* Tabs */}
        <div className="flex space-x-6 mb-6 items-center">
          <h1 className="px-10 py-2 font-medium text-2xl text-gray-800">All Listed Events</h1>
         
        </div>

        {/* Events List */}
        <div className="bg-gray-300 p-8 rounded-2xl ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
            {events.map(event => (
              <div
                key={event._id}
                onClick={() => navigate(`/creator/event/${event._id}`)}
                className="bg-white w-70  mb-6   rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105 p-3"
              >
                {/* Event Image */}
                {event.image && (
                  <div className="h-40 w-full mb-4">
                    <img
                      src={event.image}
                      alt="Event"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Event Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <h2 className="text-xl font-bold text-gray-800">{event.eventName}</h2>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <div className="bg-green-100 text-green-600 font-bold py-1 px-6 rounded-lg">
                      ₹{event.prize}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>





      </div>
    </div>
  );
};

export default EventsPage;
