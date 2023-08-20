import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import ListAllGallery from './ListGallery';
import NewGallery from './NewGallery';
import EditGallery from './EditGallery';
import ViewGallery from './ViewGallery';
import Setup from './Setup';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<ListAllGallery />} />
          <Route path="/new" element={<NewGallery />} />
          <Route path="/edit" element={<EditGallery />} />
          <Route path="/gallery" element={<ViewGallery />} />
          <Route path="/setup" element={<Setup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
