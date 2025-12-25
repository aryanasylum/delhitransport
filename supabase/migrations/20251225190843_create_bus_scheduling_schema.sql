/*
  # DTC Bus Scheduling System Schema

  1. New Tables
    - bus_routes: Stores bus route information
    - bus_stops: Stores stop information
    - route_stops: Junction table connecting routes with stops
    - schedules: Stores schedule information

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (bus info is public)
*/

CREATE TABLE IF NOT EXISTS bus_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_number text UNIQUE NOT NULL,
  route_name text NOT NULL,
  start_point text NOT NULL,
  end_point text NOT NULL,
  total_distance numeric DEFAULT 0,
  estimated_duration integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bus_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_name text NOT NULL,
  stop_code text UNIQUE NOT NULL,
  latitude numeric,
  longitude numeric,
  address text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES bus_routes(id) ON DELETE CASCADE,
  stop_id uuid REFERENCES bus_stops(id) ON DELETE CASCADE,
  stop_sequence integer NOT NULL,
  arrival_offset integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES bus_routes(id) ON DELETE CASCADE,
  bus_number text NOT NULL,
  departure_time time NOT NULL,
  days_of_week text[] DEFAULT ARRAY['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  frequency integer DEFAULT 30,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bus_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bus routes"
  ON bus_routes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view bus stops"
  ON bus_stops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view route stops"
  ON route_stops FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view schedules"
  ON schedules FOR SELECT
  TO public
  USING (true);