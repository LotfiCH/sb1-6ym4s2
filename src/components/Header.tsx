import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Nutrition Planner</Link>
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          <Link to="/meal-plan" className="hover:text-blue-200">Meal Plan</Link>
          <Link to="/supplements" className="hover:text-blue-200">Supplements</Link>
          <Link to="/profile" className="hover:text-blue-200">Profile</Link>
        </nav>
        <button className="md:hidden">
          <Menu size={24} />
        </button>
      </div>
    </header>
  )
}

export default Header