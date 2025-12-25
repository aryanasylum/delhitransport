import { useState } from 'react';
import Routes from './components/Routes';
import Schedules from './components/Schedules';
import FindBus from './components/FindBus';
import { Bus } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/208541/pexels-photo-208541.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10">
        <nav className="max-w-5xl mx-auto px-4 pt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
            <div className="flex">
              <button
                onClick={() => setActiveTab('routes')}
                className={`flex-1 py-4 px-6 text-lg font-medium transition-all duration-300 rounded-l-2xl ${
                  activeTab === 'routes'
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Routes
              </button>
              <button
                onClick={() => setActiveTab('schedules')}
                className={`flex-1 py-4 px-6 text-lg font-medium transition-all duration-300 ${
                  activeTab === 'schedules'
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Schedules
              </button>
              <button
                onClick={() => setActiveTab('findbus')}
                className={`flex-1 py-4 px-6 text-lg font-medium transition-all duration-300 rounded-r-2xl ${
                  activeTab === 'findbus'
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Find Bus
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Bus className="w-10 h-10 text-blue-900" />
              <h1 className="text-4xl font-bold text-gray-900">
                DTC Bus Scheduling System
              </h1>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              This application helps users explore Delhi Transport Corporation bus routes,
              view detailed schedules, and find the most efficient bus between any two stops
              using real GTFS transit data.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
            {activeTab === 'routes' && <Routes />}
            {activeTab === 'schedules' && <Schedules />}
            {activeTab === 'findbus' && <FindBus />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
