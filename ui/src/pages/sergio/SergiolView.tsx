import React from 'react';
import { useParams } from 'react-router-dom';

import Home from 'sergio/Home';
function SergioView() {
  const { id } = useParams();


  return (
    <>
      <h1> Sergio content</h1>
      <Home></Home>
    </>
  );
}

export default SergioView;
