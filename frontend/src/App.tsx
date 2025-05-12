import './App.css'
import { Routes, Route } from 'react-router-dom'
import Test from './pages/Test'
import Templates from './pages/Templates'
import Home from './pages/Home'
import Verification from './pages/verification'
import Layout from './components/Layout'

function App() {  
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path='/templates' element={<Templates />} />
        <Route path='/verification' element={<Verification />} />
      </Route>
    </Routes>
  )
}

export default App
