import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, MapPin, ArrowRight, Bus as BusIcon, Clock } from 'lucide-react';

function FindBus() {
  const [stops, setStops] = useState([]);
  const [fromStop, setFromStop] = useState('');
  const [toStop, setToStop] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    const { data, error } = await supabase
      .from('bus_stops')
      .select('*')
      .order('stop_name');

    if (!error && data) {
      setStops(data);
    }
  };

  const findBuses = async () => {
    if (!fromStop || !toStop) {
      return;
    }

    if (fromStop === toStop) {
      alert('Please select different stops');
      return;
    }

    setSearching(true);
    setResults([]);

    const { data: routesData, error } = await supabase
      .from('route_stops')
      .select(`
        route_id,
        stop_sequence,
        arrival_offset,
        bus_routes (
          id,
          route_number,
          route_name,
          start_point,
          end_point
        ),
        bus_stops (
          id,
          stop_name,
          stop_code
        )
      `);

    if (!error && routesData) {
      const routeMap = {};

      routesData.forEach((item) => {
        const routeId = item.route_id;
        if (!routeMap[routeId]) {
          routeMap[routeId] = {
            route: item.bus_routes,
            stops: []
          };
        }
        routeMap[routeId].stops.push({
          stopId: item.bus_stops.id,
          stopName: item.bus_stops.stop_name,
          stopCode: item.bus_stops.stop_code,
          sequence: item.stop_sequence,
          arrivalOffset: item.arrival_offset
        });
      });

      const matchingRoutes = [];

      Object.entries(routeMap).forEach(([routeId, routeInfo]) => {
        const fromStopData = routeInfo.stops.find(s => s.stopId === fromStop);
        const toStopData = routeInfo.stops.find(s => s.stopId === toStop);

        if (fromStopData && toStopData && fromStopData.sequence < toStopData.sequence) {
          const travelTime = toStopData.arrivalOffset - fromStopData.arrivalOffset;
          const stopsBetween = toStopData.sequence - fromStopData.sequence;

          matchingRoutes.push({
            route: routeInfo.route,
            fromStop: fromStopData,
            toStop: toStopData,
            travelTime,
            stopsBetween
          });
        }
      });

      matchingRoutes.sort((a, b) => a.travelTime - b.travelTime);
      setResults(matchingRoutes);
    }

    setSearching(false);
  };

  const handleSwapStops = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Bus Between Stops</h2>
        <p className="text-gray-600 mb-6">
          Enter your starting point and destination to find the best bus routes.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              From Stop
            </label>
            <select
              value={fromStop}
              onChange={(e) => setFromStop(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
            >
              <option value="">Select starting stop</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.stop_name} ({stop.stop_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              To Stop
            </label>
            <select
              value={toStop}
              onChange={(e) => setToStop(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
            >
              <option value="">Select destination stop</option>
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.stop_name} ({stop.stop_code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSwapStops}
            className="px-4 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all font-medium"
            disabled={!fromStop || !toStop}
          >
            Swap Stops
          </button>
          <button
            onClick={findBuses}
            disabled={!fromStop || !toStop || searching}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            {searching ? 'Searching...' : 'Find Buses'}
          </button>
        </div>
      </div>

      {searching ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Available Routes ({results.length})
            </h3>
            <p className="text-sm text-gray-500">Sorted by travel time</p>
          </div>

          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-xl font-bold text-blue-900">
                      {result.route.route_number}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {result.route.route_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {result.route.start_point} → {result.route.end_point}
                    </p>
                  </div>
                </div>
                {index === 0 && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Fastest
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Board at</p>
                    <p className="font-semibold text-gray-900">{result.fromStop.stopName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Alight at</p>
                    <p className="font-semibold text-gray-900">{result.toStop.stopName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Travel Time</p>
                    <p className="font-semibold text-gray-900">{result.travelTime} mins</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <BusIcon className="w-4 h-4" />
                  <span>{result.stopsBetween} stops between</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <span>View Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : fromStop && toStop ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-gray-200">
          <BusIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No direct routes found between these stops.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Try selecting different stops or check if a transfer is required.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default FindBus;
