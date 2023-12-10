import { Route, Routes } from 'react-router-dom';
import ProductModelView from '../pages/products/ProductModelView.tsx';
import HomePage from "remote/HomePage";

function ProductRoutes() {
  return (
    <Routes>
      <Route path="/:id" element={<HomePage />} />
    </Routes>
  );
}

export default ProductRoutes;
