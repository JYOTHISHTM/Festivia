import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SideBar from '../layout/creator/SideBar';
import api from '../../services/creator/ApiService';

interface FormValues {
  eventName: string;
  eventType: string;
  description: string;
  date: string;
  time: string;
  location: string;
  totalSeats: string;
  seatType: string;
  prize: string;
  earlyBirdTickets: string;
  earlyBirdDiscount: string;
}

const CreateEvent: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initial form values
  const initialValues: FormValues = {
    eventName: '',
    eventType: '',
    description: '',
    date: '',
    time: '',
    location: '',
    totalSeats: '',
    seatType: '',
    prize: '',
    earlyBirdTickets: '',
    earlyBirdDiscount: '',
  };

  // Define validation schema
  const validationSchema = Yup.object({
    eventName: Yup.string()
      .required('Event name is required')
      .test(
        'no-leading-space',
        'Event name cannot start with a space',
        (value) => value?.charAt(0) !== ' '
      )
      .min(3, 'Event name must be at least 3 characters')
    ,


    eventType: Yup.string()
      .required('Event type is required')
      .matches(/^[A-Za-z,\s]+$/, 'Only letters, commas, and spaces are allowed')
      .test('no-leading-trailing-space', 'Cannot start with space', value => {
        if (!value) return true;
        return value === value.trim();
      }),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .test('no-leading-trailing-space', 'Cannot start with spaces', value => {
        if (!value) return true;
        return value === value.trim();
      }),
    date: Yup.date()
      .required('Date is required')
      .min(new Date(), 'Event date must be in the future'),
    // time: Yup.string()
    //   .required('Time is required')
    //   .matches(
    //     /^(?!00:00)([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?\s*(?:AM|PM|am|pm)?$/,
    //     'Enter a valid time format (e.g., 7:00 PM) and cannot be 00:00'
    //   ),

    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters')
      .test('no-leading-trailing-space', 'Cannot start  with spaces', value => {
        if (!value) return true;
        return value === value.trim();
      }),
    seatType: Yup.string()
      .required('Please select a seat type')
      .oneOf(['GENERAL', 'RESERVED'], 'Invalid seat type'),
    prize: Yup.number()
      .typeError('Price must be a number')
      .required('Price is required')
      .min(100, 'Price cannot be less that 100')
      .test('is-decimal', 'Price can have up to 2 decimal places', value => {
        if (!value) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }),
    totalSeats: Yup.number()
      .when('seatType', {
        is: 'RESERVED',
        then: (schema) => schema
          .typeError('Total seats must be a number')
          .required('Total seats is required for reserved seating')
          .integer('Total seats must be a whole number')
          .min(20, 'At least 20 seat is required'),
        otherwise: (schema) => schema.notRequired(),
      }),
    earlyBirdTickets: Yup.number()
      .when('seatType', {
        is: 'RESERVED',
        then: (schema) => schema
          .typeError('Early bird tickets must be a number')
          .required('Early bird tickets is required for reserved seating')
          .integer('Early bird tickets must be a whole number')
          .min(5, 'Min 5 is required')
          .test(
            'max-tickets',
            'Cannot exceed total seats',
            function (value) {
              const { totalSeats } = this.parent;
              if (!value || !totalSeats) return true;
              return value <= parseInt(totalSeats);
            }
          ),
        otherwise: (schema) => schema.notRequired(),
      }),
    earlyBirdDiscount: Yup.number()
      .when('seatType', {
        is: 'RESERVED',
        then: (schema) => schema
          .typeError('Early bird discount must be a number')
          .required('Early bird discount is required for reserved seating')
          .integer('Early bird discount must be a whole number')
          .min(1, 'Min 1% required')
          .max(100, 'Cannot exceed 100%'),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate image type
      if (!file.type.startsWith('image/')) {
        setImageError('Please upload a valid image file');
        setImage(null);
        return;
      }

      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image should be less than 5MB');
        setImage(null);
        return;
      }

      setImageError(null);
      setImage(file);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      // Validate image is selected
      if (!image) {
        setImageError('Please upload an image');
        setSubmitting(false);
        return;
      }

      const form = new FormData();

      // Only append fields that are relevant based on seatType
      Object.entries(values).forEach(([key, value]) => {
        if (values.seatType === 'GENERAL' &&
          (key === 'totalSeats' || key === 'earlyBirdTickets' || key === 'earlyBirdDiscount')) {
          return;
        }
        form.append(key, value);
      });

      form.append('image', image);

      const response = await api.post('http://localhost:5001/creator/create-event', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data._id) {
        navigate(`/creator/event/${response.data._id}`);
      }
    } catch (error) {
      console.error('❌ Failed to create event:', error);
      setServerError('Failed to create event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1 p-8 bg-gray-100 flex justify-center">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, touched, errors }) => (
            <Form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl space-y-6">
              <h1 className="text-3xl font-bold text-center mb-6">Create Event</h1>

              {serverError && (
                <div className="text-red-500 bg-red-50 p-3 rounded">{serverError}</div>
              )}

              {/* Event Name */}
              <div className="space-y-1">
                <Field
                  type="text"
                  name="eventName"
                  placeholder="Enter Your Event Name"
                  className={`w-full p-3 border rounded ${touched.eventName && errors.eventName ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="eventName" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Event Type */}
              <div className="space-y-1">
                <Field
                  type="text"
                  name="eventType"
                  placeholder="Enter Your Event Type [MUSIC, CONCERT, SEMINAR, DRAMA...]"
                  className={`w-full p-3 border rounded ${touched.eventType && errors.eventType ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="eventType" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter Your Description"
                  className={`w-full p-3 border rounded ${touched.description && errors.description ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="description" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <Field
                  type="date"
                  name="date"
                  className={`w-full p-3 border rounded ${touched.date && errors.date ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="date" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Time */}
              <div className="space-y-1">
                <Field
                  as="select"
                  name="time"
                  className={`w-full p-3 border rounded ${touched.time && errors.time ? 'border-red-500' : ''
                    }`}
                >
                  <option value="">Select Time</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) =>
                    ["00", "30"].map((minutes) => (
                      <>
                        <option key={`${hour}:${minutes} AM`} value={`${hour}:${minutes} AM`}>
                          {hour}:{minutes} AM
                        </option>
                        <option key={`${hour}:${minutes} PM`} value={`${hour}:${minutes} PM`}>
                          {hour}:{minutes} PM
                        </option>
                      </>
                    ))
                  )}
                </Field>
                <ErrorMessage name="time" component="p" className="text-red-500 text-sm" />
              </div>



              {/* Location */}
              <div className="space-y-1">
                <Field
                  type="text"
                  name="location"
                  placeholder="Enter Your Location"
                  className={`w-full p-3 border rounded ${touched.location && errors.location ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="location" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Seat Type */}
              <div className="space-y-1">
                <Field
                  as="select"
                  name="seatType"
                  className={`w-full p-3 border rounded ${touched.seatType && errors.seatType ? 'border-red-500' : ''
                    }`}
                >
                  <option value="" disabled>Choose Seat Type</option>
                  <option value="GENERAL">GENERAL</option>
                  <option value="RESERVED">RESERVED</option>
                </Field>
                <ErrorMessage name="seatType" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <Field
                  type="number"
                  name="prize"
                  placeholder="Enter Your Ticket Price"
                  className={`w-full p-3 border rounded ${touched.prize && errors.prize ? 'border-red-500' : ''
                    }`}
                />
                <ErrorMessage name="prize" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Conditional fields that only appear for RESERVED seat type */}
              {values.seatType === "RESERVED" && (
                <>
                  {/* Total Seats */}
                  <div className="space-y-1">
                    <Field
                      type="number"
                      name="totalSeats"
                      placeholder="Enter Your Total Seats"
                      className={`w-full p-3 border rounded ${touched.totalSeats && errors.totalSeats ? 'border-red-500' : ''
                        }`}
                    />
                    <ErrorMessage name="totalSeats" component="p" className="text-red-500 text-sm" />
                  </div>

                  {/* Early Bird Tickets */}
                  <div className="space-y-1">
                    <Field
                      type="number"
                      name="earlyBirdTickets"
                      placeholder="Enter Your Early Bird Tickets"
                      className={`w-full p-3 border rounded ${touched.earlyBirdTickets && errors.earlyBirdTickets ? 'border-red-500' : ''
                        }`}
                    />
                    <ErrorMessage name="earlyBirdTickets" component="p" className="text-red-500 text-sm" />
                  </div>

                  {/* Early Bird Discount */}
                  <div className="space-y-1">
                    <Field
                      type="number"
                      name="earlyBirdDiscount"
                      placeholder="Enter Your Early Bird Discount (%)"
                      className={`w-full p-3 border rounded ${touched.earlyBirdDiscount && errors.earlyBirdDiscount ? 'border-red-500' : ''
                        }`}
                    />
                    <ErrorMessage name="earlyBirdDiscount" component="p" className="text-red-500 text-sm" />
                  </div>
                </>
              )}

              {/* Image Upload */}
              <div className="space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full p-3 border rounded ${imageError ? 'border-red-500' : ''}`}
                  required
                />
                {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-black text-white py-3 px-4 rounded hover:bg-gray-800 w-full font-medium transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? 'Creating Event...' : 'Create Event'}
              </button>
            </Form>

          )}
        </Formik>
      </div>
    </div>
  );
};


export default CreateEvent;