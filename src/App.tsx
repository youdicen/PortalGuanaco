import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { SearchProtocol } from './components/SearchProtocol';
import { Philosophy } from './components/Philosophy';
import { AuthView } from './components/AuthView';
import { RecordForm } from './components/RecordForm';
import { Dashboard } from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router basename="/PortalGuanaco/">
      <Layout>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <SearchProtocol />
              <Philosophy />
            </>
          } />
          <Route path="/auth" element={<AuthView />} />
          <Route path="/submit" element={<RecordForm />} />
          <Route path="/edit/:id" element={<RecordForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
