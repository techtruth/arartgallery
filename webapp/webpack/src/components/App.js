import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Setup from './Setup';
import EditGallery from './EditGallery';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/edit" element={<EditGallery />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/poo" element={<Setup />}>
            <Route path="/poo/gallery-entry" element={<Setup />} />
            <Route path="/poo/gallery-entry-attribute" element={<Setup />} />
            <Route path="*" element={<Setup />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
