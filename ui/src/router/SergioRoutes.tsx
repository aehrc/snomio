import { Route, Routes } from 'react-router-dom';
// import HomePage from "sharedComp/HomePage";
import ProductModelView from '../pages/products/ProductModelView.tsx';

function ProductRoutes() {
  return (
    <Routes>
      <Route path="/sergio" element={<ProductModelView />} />
    </Routes>
  );
}

export default ProductRoutes;
