import { Route, Routes } from 'react-router-dom';
import SergioView from "../pages/sergio/SergiolView.tsx";

function SergioRoutes() {
  return (
    <Routes>
      <Route path="/:id" element={<SergioView />} />
    </Routes>
  );
}

export default SergioRoutes;
