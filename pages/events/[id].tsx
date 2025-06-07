import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Event } from '../../lib/types';
import { format } from 'date-fns';

interface EventWithRegistrations extends Event {
  registration_count: number;
}

const EventDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<EventWithRegistrations | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string>('');
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        const eventData = await response.json();
        setEvent(eventData);
      } else if (response.status === 404) {
        setError('Event not found');
      } else {
        setError('Failed to load event');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: id,
          ...registrationForm
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistered(true);
        setRegistrationForm({ name: '', email: '' });
        if (event) {
          setEvent({ ...event, registration_count: event.registration_count + 1 });
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const isEventPast = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  if (loading) {
    return (
      <Layout title="Loading... - EventHub">
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error && !event) {
    return (
      <Layout title="Error - EventHub">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
            <p className="text-gray-600 mb-4">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <button
              onClick={() => router.push('/events')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) return null;

  return (
    <Layout title={`${event.title} - EventHub`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {format(new Date(event.date), 'h:mm a')}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{event.registration_count}</div>
                <div className="text-sm text-gray-600">Registered</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isEventPast(event.date) ? 'text-red-600' : 'text-green-600'}`}>
                  {isEventPast(event.date) ? 'Past' : 'Upcoming'}
                </div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {format(new Date(event.created_at), 'MMM d')}
                </div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
            </div>

            {/* Event description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Registration section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration</h2>
              
              {isEventPast(event.date) ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-800 font-medium">This event has already ended</span>
                  </div>
                  <p className="text-red-700 mt-2">Registration is no longer available for past events.</p>
                </div>
              ) : registered ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800 font-medium">Registration Successful!</span>
                  </div>
                  <p className="text-green-700 mt-2">
                    You have successfully registered for this event. We&apos;ll send you more details via email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegistration} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 font-medium">{error}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={registrationForm.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={registrationForm.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={registering || !registrationForm.name || !registrationForm.email}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {registering ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </div>
                    ) : (
                      'Register for Event'
                    )}
                  </button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    By registering, you agree to receive event updates and reminders via email.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Date & Time</h4>
              <p className="text-gray-600">
                {format(new Date(event.date), 'EEEE, MMMM d, yyyy')} at {format(new Date(event.date), 'h:mm a')}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Location</h4>
              <p className="text-gray-600">{event.location}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Registrations</h4>
              <p className="text-gray-600">{event.registration_count} people registered</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Event ID</h4>
              <p className="text-gray-600">#{event.id}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;