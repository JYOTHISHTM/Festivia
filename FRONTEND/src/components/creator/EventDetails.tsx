import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideBar from "../layout/creator/SideBar";
import { Link } from "react-router-dom";

interface Event {
  eventName: string;
  eventType: string;
  description: string;
  date: string;
  time: string;
  location: string;
  totalSeats: number;
  prize: number;
  seatType: string;
  earlyBirdTickets?: number;
  earlyBirdDiscount?: number;
  image?: string;
}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/creator/event/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (error: any) {
        setError("Failed to fetch event data");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No Event Data Found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sidebar & Content Container */}
      <div className="flex flex-1">
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 h-screen overflow-hidden ">
          {/* Breadcrumb Navigation */}
          {/* Breadcrumb Navigation */}
          <nav className="text-gray-600 text-sm px-6 bg-gray-200 py-2">
            <ul className="flex items-center font-bold text-lg space-x-2 relative top-20 left-30">
              <li>
                <Link to="/creator/events" className="text-gray-400 hover:text-black">
                  Event
                </Link>
              </li>
              <span className="text-gray-400">/</span>
              <li className="text-black">Event Details</li>
            </ul>
          </nav>


          {/* Event Details Container */}
          <div className="flex items-center justify-center bg-gray-200 p-4 h-full">
            <div className="bg-black p-8 rounded-2xl shadow-lg max-w-4xl  w-full">
              {/* Event Container */}
              <div className="bg-gray-100 p-6 rounded-lg flex flex-col md:flex-row gap-6">
                {/* Event Image */}
                <div className="w-full md:w-1/3">
                  <img
                    src={event.image || "https://via.placeholder.com/300"}
                    alt="Event"
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>

                {/* Event Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-center text-gray-800">
                    {event.eventName}
                  </h1>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-gray-700">
                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      DATE: {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      SEAT TYPE: {event.seatType}
                    </div>
                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      TIME: {event.time}
                    </div>
                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      TOTAL SEAT: {event.totalSeats}
                    </div>
                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      LOCATION: {event.location}
                    </div>
                    <div className="bg-gray-300 p-2 rounded-lg text-center">
                      TICKET PRIZE: {event.prize}
                    </div>
                  </div>

                  {event.earlyBirdTickets && (
                    <div className="bg-gray-300 text-center font-semibold p-3 rounded-lg mt-3">
                      EARLY BIRD TICKET COUNT: {event.earlyBirdTickets}
                    </div>
                  )}

                  {event.earlyBirdDiscount && (
                    <div className="bg-green-300 text-center font-semibold p-3 rounded-lg mt-2">
                      EARLY BIRD DISCOUNT: {event.earlyBirdDiscount}%
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-100 p-4 rounded-lg mt-3 text-gray-700">
                <p>{event.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
