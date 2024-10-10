import React from 'react';
import './reset.css'
import './global.css'
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <Sidebar />
    </div>
  );
};

export default App;




