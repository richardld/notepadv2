import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Text from './components/text'
import styles from './index.module.css'

const root = createRoot(document.body);
root.render(
  <div className={styles.container}>
    <Text/>
  </div>
);