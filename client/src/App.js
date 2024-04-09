import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Landing from './elements/layout/Landing'

import AuthContextProvider from './contexts/AuthContext'

import Auth from './views/Auth'
import Newfeed from './views/Newfeed'

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/login" element={<Auth authRoute='login' />} />
          <Route exact path="/register" element={<Auth authRoute='register' />} />
          <Route exact path="/newfeed" element={<Newfeed />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  )
}

export default App