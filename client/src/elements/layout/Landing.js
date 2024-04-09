import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Landing = () => {
  let navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
}

export default Landing;