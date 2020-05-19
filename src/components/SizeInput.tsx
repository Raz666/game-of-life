import React, { useState, useEffect } from 'react';

type Params = {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>,
  label: string,
  setValidity: React.Dispatch<React.SetStateAction<boolean>>,
}

const SizeInput: React.FC<Params> = ({ value, setValue, label, setValidity }) => {
  const [error, setError] = useState('');

  const validate = (value: string, validCallback: React.Dispatch<React.SetStateAction<number>>, errorCallback: React.Dispatch<React.SetStateAction<string>>): void => {
    const parsedValue = parseInt(value);
    if (!parsedValue || parsedValue < 3 || parsedValue > 100) {
      errorCallback('Keep it between 3 and 100.');
    } else {
      errorCallback('');
    }
    validCallback(parsedValue);
  }

  useEffect(() => {
    error ? setValidity(false) : setValidity(true);
  }, [error, setValidity])

  return (
    <div className="size-input">
      <label>{label}</label>
      <div className="input-group">
        <input
          type="number"
          min={3}
          max={200}
          value={value}
          onChange={(e) => validate(e.target.value, setValue, setError)} />
        <div className="error">{error}</div>
      </div>
    </div>
  );
}

export default SizeInput;
