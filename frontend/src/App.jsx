import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import TierSelection from './pages/TierSelection';
import StorageSelection from './pages/StorageSelection';
import DataUpload from './pages/DataSelection';
import FieldDetailsModal from './pages/FieldDetailsModal'
import VendorMap from './pages/VendorMap';
import DigitalTwin from './pages/DigitalTwin';
import ClassificationAgent from './pages/ClassificationAgent';
import AskImageQuestion from './pages/AskImageQuestion';
import VoxelTabViewer from './pages/VoxelTabViewer';
import './index.css';
import './App.css';
import TableA5View from './pages/TableA5View';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import WellMap from './pages/WellMap';
import Footer from './components/Footer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CloudSiloSetup from './pages/CloudSiloSetup';
import WorkflowStepper from './components/WorkflowStepper';
import ROIModal from './pages/ROIModal';
import ConvexChat from './pages/ConvexChat';
import TexasMap from './pages/TexasMap';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <WorkflowStepper />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/texasmap" element={<TexasMap />} />
            <Route path="/tiers" element={<TierSelection />} />
            <Route path="/storage" element={<StorageSelection />} />
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/roi" element={<ROIModal />} />
            <Route path="/vendor" element={<VendorMap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/well-map" element={<WellMap />} />
            <Route path="/voxel" element={<VoxelTabViewer/>} />
            <Route path="/convex-chat" element={<ConvexChat />} />
            <Route path="/classification-agent" element={<ClassificationAgent />} />
            <Route path="/ask-image" element={<AskImageQuestion />} />  {/* ✅ new route */}
            <Route path="/digital-twin" element={<DigitalTwin />} />
            <Route path="/TableA5View" element={<TableA5View />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cloud-setup" element={<CloudSiloSetup />} />
            <Route path="/FieldDetailsModal" element={<FieldDetailsModal />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;