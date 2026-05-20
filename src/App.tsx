import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { EcosystemProblem } from './components/EcosystemProblem';
import { Features } from './components/Features';
import { Philosophy } from './components/Philosophy';
import { GlobalVision } from './components/GlobalVision';
import { AuthView } from './components/AuthView';
import { RecordForm } from './components/RecordForm';
import { Dashboard } from './components/Dashboard';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { PageProtocol } from './components/PageProtocol';
import { PageFeatures } from './components/PageFeatures';
import { PagePhilosophy } from './components/PagePhilosophy';
import { PagePremium } from './components/PagePremium';
import { PageContact } from './components/PageContact';
import { PageCookies } from './components/PageCookies';
import { CookieBanner } from './components/CookieBanner';
import { ReportRtoElSalvador } from './components/ReportRtoElSalvador';
import { ReportProductDestruction } from './components/ReportProductDestruction';
import { ReportFraudDefenseLatam } from './components/ReportFraudDefenseLatam';
import { ReportFraudLossesLatam } from './components/ReportFraudLossesLatam';
import { QuickReport } from './components/QuickReport';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <CookieBanner />
      <Layout>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <EcosystemProblem />
              <Features />
              <Philosophy />
              <GlobalVision />
            </>
          } />
          <Route path="/protocolo"      element={<PageProtocol />} />
          <Route path="/caracteristicas" element={<PageFeatures />} />
          <Route path="/filosofia"      element={<PagePhilosophy />} />
          <Route path="/premium"        element={<PagePremium />} />
          <Route path="/contacto"       element={<PageContact />} />
          <Route path="/cookies"        element={<PageCookies />} />
          <Route path="/reportajes/tasa-rto-el-salvador" element={<ReportRtoElSalvador />} />
          <Route path="/reportajes/costo-destruccion-margen" element={<ReportProductDestruction />} />
          <Route path="/reportajes/revenue-absorbido-fraude-latam" element={<ReportFraudDefenseLatam />} />
          <Route path="/reportajes/impacto-fraude-ecommerce-latam" element={<ReportFraudLossesLatam />} />
          <Route path="/auth"           element={<AuthView />} />
          <Route path="/quick-report"   element={<QuickReport />} />
          <Route path="/submit"         element={<RecordForm />} />
          <Route path="/edit/:id"       element={<RecordForm />} />
          <Route path="/dashboard"      element={<Dashboard />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
