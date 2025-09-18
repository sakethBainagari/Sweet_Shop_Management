import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Sweet Shop Management System
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Welcome to Sweet Shop Management
                  </h2>
                  <p className="text-gray-600">
                    Your full-stack application is being set up. Phase 1 complete!
                  </p>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App