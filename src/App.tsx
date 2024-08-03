import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/auth/Login';
import Tracking from './components/tracking/Tracking';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/track-shipment" element={<Tracking />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
