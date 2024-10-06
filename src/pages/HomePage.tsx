import React from 'react'
import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Nutrition Planner</h1>
        <p className="text-xl">Create and manage your custom meal plan based on Dr. Gacem Fayrouz's nutritional program.</p>
        <Link to="/meal-plan" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Start Planning
        </Link>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">About Dr. Gacem Fayrouz</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <User size={64} className="text-blue-600" />
          </div>
          <div>
            <p className="mb-2">Dr. Gacem Fayrouz is a renowned nutritionist with over 15 years of experience in developing personalized meal plans.</p>
            <p className="mb-2">Credentials: Ph.D. in Nutritional Sciences, Certified Dietitian-Nutritionist (CDN)</p>
            <p>Contact: dr.fayrouz@example.com | (123) 456-7890</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage