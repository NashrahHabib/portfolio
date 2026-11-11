import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

function OldProjectLink() {
  const { slug } = useParams();
  return <Navigate to={`/portfolio/${slug}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {/* About now lives on the homepage. */}
        <Route path="about" element={<Navigate to={{ pathname: '/', hash: '#about' }} replace />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/:slug" element={<ProjectDetail />} />
        {/* Old addresses keep working. */}
        <Route path="work" element={<Navigate to="/portfolio" replace />} />
        <Route path="work/:slug" element={<OldProjectLink />} />
        <Route path="services" element={<Navigate to={{ pathname: '/', hash: '#services' }} replace />} />
        <Route path="contact" element={<Navigate to={{ pathname: '/', hash: '#contact' }} replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
