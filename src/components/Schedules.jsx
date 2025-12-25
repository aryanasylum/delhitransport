import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Clock, Calendar, Bus as BusIcon, RefreshCw } from 'lucide-react';

function Schedules() {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    if (selectedRouteId) {
      fetchSchedules(selectedRouteId);
    }
  }, [selectedRouteId]);

  const fetchRoutes = async () => {
    const { data, error } = await supabase
      .from('bus_routes')
      .select('id, route_number, route_name')
      .eq('active', true)
      .order('route_number');

    if (!error && data) {
      setRoutes(data);
      if (data.length > 0) {
        setSelectedRouteId(data[0].id);
      }
    }
  };

  const fetchSchedules = async (routeId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        bus_routes (
          route_number,
          route_name
        )
      `)
      .eq('route_id', routeId)
      .eq('active', true)
      .order('departure_time');

    if (!error && data) {
      setSchedules(data);
    }
    setLoading(false);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const selectedRoute = routes.find(r => r.id === selectedRouteId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bus Schedules</h2>
        <p className="text-gray-600 mb-6">
          View departure times and frequency for buses on different routes.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Route
        </label>
        <select
          value={selectedRouteId}
          onChange={(e) => setSelectedRouteId(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
        >
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              Route {route.route_number} - {route.route_name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No schedules available for this route.
          </p>
        </div>
      ) : (
        <div>
          {selectedRoute && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Route {selectedRoute.route_number} - {selectedRoute.route_name}
              </h3>
              <p className="text-sm text-blue-700">
                {schedules.length} scheduled departure{schedules.length !== 1 ? 's' : ''} per day
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BusIcon className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Bus Number</p>
                    <p className="text-lg font-bold text-gray-900">{schedule.bus_number}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Departure Time</p>
                      <p className="font-semibold text-lg">{formatTime(schedule.departure_time)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <RefreshCw className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Frequency</p>
                      <p className="font-semibold">Every {schedule.frequency} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Operating Days</p>
                      <p className="font-semibold text-sm">
                        {schedule.days_of_week.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedules;
