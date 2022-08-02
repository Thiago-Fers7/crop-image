import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import FileUploader from './Components/HTML/FileUploader';
import Layout from './Components/HTML/Layout';

import './assets/styles/global.css';
import styles from './app.module.css';

type holdingValues = { isHolding: boolean; buttonRef: string };

export default function App() {
  const [imgValue, setImgValue] = useState<FileList | null>(null);
  const [imgSrc, setImgSrc] = useState('');

  const holdingMouse = useRef({} as holdingValues);

  const editContainerRef = useRef<HTMLDivElement>(null);
  const resizeBarLeftRef = useRef<HTMLButtonElement>(null);
  const resizeBarRightRef = useRef<HTMLButtonElement>(null);
  const resizeVaues = useRef({ positionButtonLeft: 0, positionButtonRight: 0, distanceBeetweenButtons: 0 });

  function handleHolding({ isHolding, buttonRef }: holdingValues) {
    holdingMouse.current = { isHolding, buttonRef };

    if (isHolding) {
      editContainerRef.current && (editContainerRef.current.style.cursor = 'e-resize');
    } else {
      editContainerRef.current && (editContainerRef.current.style.cursor = 'default');
    }
  }

  useEffect(() => {
    function handleMouseUp() {
      handleHolding({ isHolding: false, buttonRef: '' });
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

  function handleMoveBar(e: MouseEvent) {
    if (!holdingMouse.current.isHolding) return;

    function moveBar(barPosition: number) {
      if (resizeBarLeftRef.current && resizeBarRightRef.current) {
        if (holdingMouse.current.buttonRef === 'left') {
          if (barPosition >= resizeVaues.current.positionButtonRight) {
            resizeBarLeftRef.current.style.left = `${resizeVaues.current.positionButtonRight}px`;
          } else {
            resizeBarLeftRef.current.style.left = `${barPosition}px`;
          }


          resizeVaues.current.positionButtonLeft = barPosition;
        } else {
          if (barPosition <= resizeVaues.current.positionButtonLeft) {
            resizeBarRightRef.current.style.left = `${resizeVaues.current.positionButtonLeft}px`;
          } else {
            resizeBarRightRef.current.style.left = `${barPosition}px`;
          }

          resizeVaues.current.positionButtonRight = barPosition;

        }

        resizeVaues.current.distanceBeetweenButtons = resizeVaues.current.positionButtonRight - resizeVaues.current.positionButtonLeft;
      }
    }

    let { offsetLeft, offsetWidth } = editContainerRef.current?.parentNode as HTMLElement;

    const cursorPosition = e.clientX;
    const maxPosition = offsetLeft + offsetWidth;

    if (cursorPosition >= maxPosition) {
      moveBar(offsetWidth);
      return;
    }

    if (cursorPosition <= offsetLeft) {
      moveBar(0);
      return;
    }

    const freePosition = cursorPosition - offsetLeft;
    moveBar(freePosition);
  }

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
            <div className={`${styles['img-edit-container']} ${styles['expand']}`} ref={editContainerRef} onMouseMove={handleMoveBar}>
              <img src={imgSrc} alt="Imagem" className={`${styles['original-img']}`} />

              <div className={styles['resizer-box']} />

              <button
                type="button"
                className={`${styles['resizer-bar']} ${styles['left']}`}
                onMouseDown={() => handleHolding({ isHolding: true, buttonRef: 'left' })}
                ref={resizeBarLeftRef}
              />

              <button
                type="button"
                className={`${styles['resizer-bar']} ${styles['right']}`}
                ref={resizeBarRightRef}
                onMouseDown={() => handleHolding({ isHolding: true, buttonRef: 'right' })}
              />
            </div>
          )}
        </section>
      </main>
    </Layout>
  )
}
