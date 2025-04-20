import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Flag, Calendar, Settings, Home as HomeIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-aqsa">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Flag className="h-8 w-8 text-red-600" />
                  <span className="ml-2 text-xl font-bold font-rationalist">F1 Dashboard</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-900 font-rationalist">
                    <HomeIcon className="h-5 w-5 mr-1" />
                    Home
                  </Link>
                  <Link to="/live" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900 font-rationalist">
                    <Flag className="h-5 w-5 mr-1" />
                    Live
                  </Link>
                  <Link to="/calendar" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900 font-rationalist">
                    <Calendar className="h-5 w-5 mr-1" />
                    Calendar
                  </Link>
                  <Link to="/settings" className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900 font-rationalist">
                    <Settings className="h-5 w-5 mr-1" />
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<div>Live Page (Coming Soon)</div>} />
            <Route path="/calendar" element={<div>Calendar Page (Coming Soon)</div>} />
            <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
          </Routes>
        </main>

        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="grid grid-cols-4 gap-1">
            <Link to="/" className="flex flex-col items-center py-2 font-rationalist">
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </Link>
            <Link to="/live" className="flex flex-col items-center py-2 font-rationalist">
              <Flag className="h-6 w-6" />
              <span className="text-xs">Live</span>
            </Link>
            <Link to="/calendar" className="flex flex-col items-center py-2 font-rationalist">
              <Calendar className="h-6 w-6" />
              <span className="text-xs">Calendar</span>
            </Link>
            <Link to="/settings" className="flex flex-col items-center py-2 font-rationalist">
              <Settings className="h-6 w-6" />
              <span className="text-xs">Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </Router>
  );
}

export default App;