import React, {useState, useEffect} from 'react'
import styles from './preferences.module.css'

export default function Preferences() {
  return (
    <div className={styles.preferencesContainer}>
      <h2 className={styles.title}>Notepad v2 Preferences</h2>
      <div className={styles.preferencesSectionItem}>
          <p className={styles.preferenceExplanation}>Customize your notepad.</p>
        </div>
      <div className={styles.preferencesSection}>
        <div className={styles.preferencesSectionItem}>
          <p className={styles.preferenceLabel}>Local Language Model:</p>
          <input className={styles.preferenceInput} placeholder='api_key' value="Llama-2-7b-chat" disabled/>
        </div>
        <p className={styles.preferenceExplanation}>By default, Notepad v2 uses locally hosted language models for all completions. This means ALL your notes are completely private and confidential. All computation is done on your device, and you can use completions while offline.</p>
        <p className={styles.preferenceExplanation}>At least 6GB of RAM is recommended. Apple Silicon Laptops are fully supported.</p>
        <p className={styles.preferenceExplanation}>Currently, models are locked to Llama-2-7b-chat, but custom model support is coming soon.</p>
      </div>
      <div className={styles.preferencesSection}>
        <p className={styles.preferenceExplanation}>Remote language models may be desirable in many situations. This means using an external API for your language model completions.</p>
        <p className={styles.preferenceExplanation}>Adjust the following settings to select your desired API provider.</p>

        <div className={styles.preferencesSectionItem}>
          <p className={styles.preferenceLabel}>Language Model API Key:</p>
          <input className={styles.preferenceInput} placeholder='api_key' disabled/>
        </div>

        <div className={styles.preferencesSectionItem}>
          <p className={styles.preferenceLabel}>Language Model Server Address:</p>
          <input className={styles.preferenceInput} placeholder='https://localhost:3000' disabled/>
        </div>
        <div className={styles.preferencesSectionItem}>
          <p className={styles.preferenceExplanation}>Remote Language Model support is currently disabled. Full support is coming soon.</p>
        </div>
      </div>
    </div>
  )
}