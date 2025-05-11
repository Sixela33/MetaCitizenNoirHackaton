import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Test from './pages/Test'

function App() {  
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/test" replace />} />
        <Route path="/test" element={<Test />} />
      </Routes>
  )
}

export default App
