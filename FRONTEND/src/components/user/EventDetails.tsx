import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../layout/user/HomeNavbar';
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

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => (
    <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full mt-12">
            <div className="bg-gray-200 p-6 rounded-lg flex flex-col md:flex-row gap-6 animate-pulse">
                <div className="w-full md:w-1/3 h-64 bg-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-4">
                    <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-12 bg-gray-300 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-6 w-1/2 bg-gray-300 rounded mt-4"></div>
                </div>
            </div>
        </div>
    </div>
);

const EventDetails: React.FC = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/users/event/${id}`);
                setTimeout(() => {
                    setEvent(response.data);
                    setLoading(false);
                }, 1000); // 1-second delay
            } catch (error: any) {
                setError('Failed to fetch event data');
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <SkeletonLoader />;
    if (error) return <div>{error}</div>;
    if (!event) return <div>No Event Data Found</div>;

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen bg-gray-200">
                {/* Breadcrumb Navigation */}
                <nav className="text-gray-600 text-sm px-15 bg-gray-200 ">
                    <ul className="flex items-center font-bold text-xl ml-15 space-x-2 relative top-8">
                        <li>
                            <Link to="/user/home" className="text-gray-500 hover:text-black">
                                Home
                            </Link>
                        </li>
                        <span className="text-gray-400">/</span>
                        <li className="text-black mt-1">Event Details</li>
                    </ul>
                </nav>

                {/* Event Container */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full mt-8">
                        <div className="bg-gray-200 p-6 rounded-lg flex flex-col md:flex-row gap-6">
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
                                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                                    {event.eventName}
                                </h1>
                                <div className="grid grid-cols-2 gap-4 text-gray-700">
                                    <div className="bg-gray-300 p-3 rounded-lg text-center">
                                        DATE: {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="bg-gray-300 p-3 rounded-lg text-center">
                                        SEAT TYPE: {event.seatType}
                                    </div>
                                    <div className="bg-gray-300 p-3 rounded-lg text-center">
                                        TIME: {event.time}
                                    </div>

            
{event.totalSeats&&(
  <div className="bg-gray-300 p-3 rounded-lg text-center">
  TOTAL SEAT: {event.totalSeats}
</div>
)}
                                  



                                    <div className="bg-gray-300 p-3 rounded-lg text-center">
                                        LOCATION: {event.location}
                                    </div>
                                    <div className="bg-gray-300 p-3 rounded-lg text-center text-green-500 font-semibold">
                                        TICKET PRIZE: {event.prize}
                                    </div>
                                </div>

                                {event.earlyBirdTickets && (
                                    <div className="bg-gray-300 text-center font-semibold p-3 rounded-lg mt-4">
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
                        <div className="bg-gray-200 p-4 rounded-lg mt-6 text-gray-700">
                            <p>{event.description}</p>
                        </div>

                        {/* Book Ticket Button */}
                        <div className="justify-center text-center mt-8">
                            <button className="px-8 py-3 bg-black rounded font-medium text-white">
                                BOOK TICKET
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventDetails;
