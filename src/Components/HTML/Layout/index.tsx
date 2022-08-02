import styles from './styles.module.css';

import { ReactNode } from 'react'
import Header from '../Header';

type LayoutProps = {
  children: ReactNode;
  mainFullWidth?: boolean;
}

export default function Layout({ children, mainFullWidth }: LayoutProps) {
  return (
    <div className={styles.container}>
      <Header />

      <div className={`${styles['wrapper-main']}`}>
        <div
          className={`
            ${styles.main}
            ${mainFullWidth ? styles['full-width'] : ''}
          `}
        >
          {children}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}
