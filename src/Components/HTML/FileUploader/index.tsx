import { ChangeEvent, InputHTMLAttributes, useState } from 'react';

import styles from './styles.module.css';

import closeIcon from '../../../assets/icons/close.svg';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type ChangeEventInput = ChangeEvent<HTMLInputElement>;

type FileUploaderProps = Omit<InputProps, 'type' | 'id'> & {
  label: string;
  onChange: (e: ChangeEventInput) => void;
};

export default function FileUploader({ label, onChange, ...props }: FileUploaderProps) {
  const [fileName, setFileName] = useState('');

  function handleChangeFile(e: ChangeEventInput) {
    const file = e.target.files?.[0];

    if (file) {
      setFileName(file.name);
    }

    onChange?.(e);
  }

  function handleResetFile() {
    setFileName('');
    onChange({ target: { files: null } } as ChangeEventInput);
  }

  return (
    <div className={`${styles.container}`}>
      {label && <span className={`${styles['label-title']}`}>{label}</span>}

      <div className={`${styles['wrapper-input']}`}>
        <label htmlFor='file-input'>
          <div
            className={`${styles['wrapper-input-button']}`}
            tabIndex={0}
            role="button"
          >
            <span>Escolher Arquivo</span>
          </div>


          <input id="file-input" type="file" onChange={handleChangeFile} {...props} />
        </label>

        {fileName && (
          <div className={`${styles['file-name-wrapper']}`}>
            <span title={fileName} className={`${styles['file-name']}`}>{fileName}</span>

            <button type="button" onClick={handleResetFile} className={`${styles['reset-file-value']}`}>
              <img src={closeIcon} alt="Remover arquivo" />
            </button>
          </div>
        )}
      </div>
    </div >
  );
}
