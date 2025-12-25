import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Clock, TrendingUp } from 'lucide-react';

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeStops, setRouteStops] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bus_routes')
      .select('*')
      .eq('active', true)
      .order('route_number');

    if (!error && data) {
      setRoutes(data);
    }
    setLoading(false);
  };

  const fetchRouteStops = async (routeId) => {
    const { data, error } = await supabase
      .from('route_stops')
      .select(`
        stop_sequence,
        arrival_offset,
        bus_stops (
          stop_name,
          stop_code,
          address
        )
      `)
      .eq('route_id', routeId)
      .order('stop_sequence');

    if (!error && data) {
      setRouteStops(data);
    }
  };

  const handleRouteClick = async (route) => {
    setSelectedRoute(route);
    await fetchRouteStops(route.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Routes</h2>
        <p className="text-gray-600 mb-6">
          Browse all active bus routes. Click on a route to view its stops and details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {routes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No routes available at the moment.
            </div>
          ) : (
            routes.map((route) => (
              <div
                key={route.id}
                onClick={() => handleRouteClick(route)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedRoute?.id === route.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-lg">
                        {route.route_number}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {route.route_name}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{route.start_point} → {route.end_point}</span>
                      </div>
                      {route.total_distance > 0 && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{route.total_distance} km</span>
                        </div>
                      )}
                      {route.estimated_duration > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{route.estimated_duration} mins</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          {selectedRoute ? (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Route {selectedRoute.route_number} - Stops
              </h3>
              {routeStops.length === 0 ? (
                <p className="text-gray-500">No stops information available.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {routeStops.map((stop, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {stop.stop_sequence}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {stop.bus_stops.stop_name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Code: {stop.bus_stops.stop_code}
                          </p>
                          {stop.bus_stops.address && (
                            <p className="text-xs text-gray-400 mt-1">
                              {stop.bus_stops.address}
                            </p>
                          )}
                          {stop.arrival_offset > 0 && (
                            <p className="text-xs text-blue-600 mt-1">
                              +{stop.arrival_offset} mins from start
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a route to view its stops</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Routes;
