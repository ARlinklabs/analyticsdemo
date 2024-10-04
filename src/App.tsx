import { AnalyticsDashboardComponent } from './components/analytics-dashboard';
//import AnalyticsWrapper from './scripts/AnalyticsWrapper';
import  AnalyticsWrapper  from 'arlink-analytics/src/AnalyticsWrapper';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

function App() {
  return (
    <Router>
    <AnalyticsWrapper processId="KgeRB6uIOmh-zFj2JUIpPvaVcY_CKBvwzpAMPWyi2pI">
     
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/" element={<AnalyticsDashboardComponent />} />
        </Routes>
     
    </AnalyticsWrapper>
    </Router>
  );
}

export default App;
