import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import MealPlanDashboard from './pages/MealPlanDashboard'
import SupplementGuide from './pages/SupplementGuide'
import UserProfile from './pages/UserProfile'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/meal-plan" element={<MealPlanDashboard />} />
            <Route path="/supplements" element={<SupplementGuide />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App