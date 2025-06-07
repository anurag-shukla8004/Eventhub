import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminStatsPage: React.FC = () => {
  type PopularEvent = {
    id: string | number;
    title: string;
    registration_count: number;
  };
  type DailyStat = { date: string; registrations: number };

  const [popularEvents, setPopularEvents] = useState<PopularEvent[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPopularEvents = async () => {
    try {
      const response = await fetch("/api/admin/popular");
      const data = await response.json();

      console.log("Popular Events Response:", data);
      if (Array.isArray(data)) {
        setPopularEvents(data);
      } else {
        setPopularEvents([]);
      }
    } catch (error) {
      console.error("Error fetching popular events:", error);
    }
  };

  const fetchDailyStats = async () => {
    try {
      const response = await fetch("/api/admin/daily");
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setDailyStats(data);
      } else {
        setDailyStats([]);
      }
    } catch (error) {
      console.error("Error fetching daily stats:", error);
    }
  };

  useEffect(() => {
    fetchPopularEvents();
    fetchDailyStats();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout title="Admin Stats - EventHub">
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout title="Admin Stats - EventHub">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-8">
          Admin Status
        </h1>

        {/* Popular Events Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Popular Events (Last 30 Days)
          </h2>
          {popularEvents.length === 0 ? (
            <p className="text-center text-gray-500">
              No popular events found.
            </p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Event Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Registrations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {popularEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="bg-white border-b border-gray-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-6 py-4">{event.registration_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Daily Stats Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Daily Registration Stats (Last 30 Days)
          </h2>
          {dailyStats.length === 0 ? (
            <p className="text-center text-gray-500">
              No daily stats available.
            </p>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Registrations
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyStats.map((stat) => (
                    <tr
                      key={stat.date}
                      className="bg-white border-b border-gray-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {stat.date}
                      </td>
                      <td className="px-6 py-4">{stat.registrations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminStatsPage;
