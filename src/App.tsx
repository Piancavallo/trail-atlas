import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { ParkDetailPage } from './pages/ParkDetailPage'
import { ParksPage } from './pages/ParksPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={<PlaceholderPage title="Discover America's Wild Places" />}
        />
        <Route path="parks" element={<ParksPage />} />
        <Route path="parks/:code" element={<ParkDetailPage />} />
        <Route path="favorites" element={<PlaceholderPage title="Your Favorites" />} />
        <Route path="plan" element={<PlaceholderPage title="Trip Planner" />} />
        <Route path="about" element={<PlaceholderPage title="About Trail Atlas" />} />
      </Route>
    </Routes>
  )
}

export default App
