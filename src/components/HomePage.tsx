import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      Welcome to the Home Page
    </div>
  );
};

export default HomePage;