import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Text from './components/text'
import Preferences from './components/preferences'
import styles from './index.module.css'

const url = window.location.href
console.log(url)

if (url.includes("main_window")) {
  const root = createRoot(document.body);
  root.render(
    <div className={styles.container}>
      <Text/>
    </div>
  );
}

if (url.includes("preferences_window")) {
  const root = createRoot(document.body);
  root.render(
    <div className={styles.container}>
      <Preferences/>
    </div>
  );
}