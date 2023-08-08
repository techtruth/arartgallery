import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Setup from './Setup';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Setup />}>
            <Route path="/setup" element={<Setup />} />
            <Route path="/gallery" element={<Setup />} />
            <Route path="/gallery-entry" element={<Setup />} />
            <Route path="/gallery-entry-attribute" element={<Setup />} />
            <Route path="*" element={<Setup />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
