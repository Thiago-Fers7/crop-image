import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import FileUploader from './Components/HTML/FileUploader';
import Layout from './Components/HTML/Layout';

import './assets/styles/global.css';
import styles from './app.module.css';

type holdingValues = { isHolding: boolean; buttonRef: 'top-left' | 'bottom-right' | null };

export default function App() {
  const [imgValue, setImgValue] = useState<FileList | null>(null);
  const [imgSrc, setImgSrc] = useState('');

  const editContainerRef = useRef<HTMLDivElement>(null);
  const resizerBox = useRef<HTMLDivElement>(null);
  const resizeBarTopLeftRef = useRef<HTMLButtonElement>(null);
  const resizeBarBottomRightRef = useRef<HTMLButtonElement>(null);
  const resizeVaues = useRef({ positionButtonLeft: 0, positionButtonRight: 0, distanceBeetweenButtons: 0 });

  const [holding, setHolding] = useState<holdingValues>({ isHolding: false, buttonRef: null });

  useEffect(() => {
    function handleResizeSquare(e: any) {
      const { offsetLeft, offsetHeight, offsetWidth, offsetTop } = editContainerRef.current?.parentNode as HTMLElement;
      const cursorPositionX = e.clientX;
      const cursorPositionY = e.clientY;

      const moveLeft = cursorPositionX - offsetLeft;
      const moveTop = cursorPositionY - offsetTop;

      if (resizerBox.current) {
        if (holding.buttonRef === 'top-left') {
          resizerBox.current.style.left = `${moveLeft}px`;
          resizerBox.current.style.top = `${moveTop}px`;
          return;
        }

        if (holding.buttonRef === 'bottom-right') {
          resizerBox.current.style.right = `${(offsetLeft + offsetWidth) - cursorPositionX}px`;
          resizerBox.current.style.bottom = `${(offsetTop + offsetHeight) - cursorPositionY}px`;
          return;
        }
      }
    }

    const element = editContainerRef.current;

    if (holding.isHolding) {
      element?.addEventListener('mousemove', handleResizeSquare);
    }

    return () => {
      element?.removeEventListener('mousemove', handleResizeSquare);
    }
  }, [holding]);

  useEffect(() => {
    function handleMouseUp() {
      setHolding({ isHolding: false, buttonRef: null });
    }

    if (imgValue) {
      document.body.addEventListener('mouseup', handleMouseUp)
    } else {
      document.body.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.body.removeEventListener('mouseup', handleMouseUp);
    }
  }, [imgSrc]);

  function handleChangeImgValue(e: ChangeEvent<HTMLInputElement>) {
    setImgValue(e.target.files);
  }

  useEffect(() => {
    if (!imgValue) {
      setImgSrc('');
      return;
    }

    const src = URL.createObjectURL(imgValue[0]);
    setImgSrc(src);
  }, [imgValue]);

  return (
    <Layout>
      <main className={`${styles['main-container']}`}>
        <header>
          <FileUploader
            label='Importe sua imagem'
            accept='image/*'
            onChange={handleChangeImgValue}
          />
        </header>

        <section>
          {imgSrc && (
            <div className={`${styles['img-edit-container']} ${styles['expand']}`} ref={editContainerRef} >
              <img src={imgSrc} alt="Imagem" className={`${styles['original-img']}`} />

              <div className={styles['resizer-box']} ref={resizerBox}>
                <button
                  type="button"
                  className={`${styles['resizer-bar']} ${styles['left']}`}
                  onMouseDown={() => setHolding({ isHolding: true, buttonRef: 'top-left' })}
                  ref={resizeBarTopLeftRef}
                />

                <button
                  type="button"
                  className={`${styles['resizer-bar']} ${styles['right']}`}
                  ref={resizeBarBottomRightRef}
                  onMouseDown={() => setHolding({ isHolding: true, buttonRef: 'bottom-right' })}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </Layout>
  )
}
