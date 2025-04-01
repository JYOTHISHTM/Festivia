import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  eventName: string;
  eventType: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  seatType: 'GENERAL' | 'RESERVED';
  prize: number;
  image: string;
  totalSeats?: number;
  availableSeats?: number;
  earlyBirdTickets?: number;
  earlyBirdDiscount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    seatType: { 
      type: String, 
      required: true,
      enum: ['GENERAL', 'RESERVED']
    },
    prize: { type: Number, required: true },
    image: { type: String, required: true },
    
    totalSeats: { type: Number },
    availableSeats: { type: Number },
    earlyBirdTickets: { type: Number },
    earlyBirdDiscount: { type: Number },
    
  },
  { timestamps: true }
);


const EventModel = mongoose.model<IEvent>("Event", EventSchema);
export default EventModel;
export { EventModel };