import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './elements/layout/Landing';
import Auth from './views/Auth';
import './App.css';
import AuthContextProvider from './contexts/AuthContext';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/login" element={<Auth authRoute='login' />} />
          <Route exact path="/register" element={<Auth authRoute='register' />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;