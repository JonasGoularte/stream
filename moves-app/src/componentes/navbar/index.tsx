import React from 'react';
import styles from './index.module.scss';

const Navbar: React.FC = () => {
  const goHome = () => {
    window.location.href = '/'; // força recarregamento completo
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Filmes</h1>
      <button className={styles.homeButton} onClick={goHome}>
        Início
      </button>
    </nav>
  );
};

export default Navbar;
