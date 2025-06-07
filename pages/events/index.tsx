// pages/events/index.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import EventCard from '../../components/EventCard';
import EventFilter from '../../components/EventFilter';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination'; // Updated Pagination component
import { Event, EventFilters, EventsResponse } from '../../lib/types';

const EventsPage: React.FC = () => {
  const [eventsData, setEventsData] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<EventFilters>({});

  const fetchEvents = async (page: number = 1, newFilters: EventFilters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...Object.fromEntries(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(newFilters).filter(([idx, value]) => value !== '' && value !== undefined)
        )
      });

      const response = await fetch(`/api/events?${params}`);
      const data: EventsResponse = await response.json();
      setEventsData(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage, filters);
  }, [currentPage]);

  const handleFilter = (newFilters: EventFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchEvents(1, newFilters);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1); // react-paginate starts from 0, but we need to start from 1
  };

  return (
    <Layout title="All Events List - EventHub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Events List</h1>

        <EventFilter onFilter={handleFilter} loading={loading} />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {eventsData?.events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {eventsData?.events.map((event: Event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {eventsData && eventsData.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={eventsData.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;
