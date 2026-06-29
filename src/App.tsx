import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { AboutPage } from './pages/AboutPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { ParkDetailPage } from './pages/ParkDetailPage'
import { ParksPage } from './pages/ParksPage'
import { TripPlannerPage } from './pages/TripPlannerPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="parks" element={<ParksPage />} />
        <Route path="parks/:code" element={<ParkDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="plan" element={<TripPlannerPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}

export default App
