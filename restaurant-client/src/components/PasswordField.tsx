import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // 👁️ иконки

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  showMatchWarning?: boolean;
  matchValue?: string;
  validateLatinOnly?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  showMatchWarning = false,
  matchValue = '',
  validateLatinOnly = false
}) => {
  const [visible, setVisible] = useState(false);
  const hasCyrillic = /[\u0400-\u04FF]/.test(value);
  const doesMatch = matchValue === value;

  return (
    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: '100%',
            padding: '0.6rem 2.5rem 0.6rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            fontSize: '1rem'
          }}
        />
        <button
          type="button"
          onClick={() => setVisible(prev => !prev)}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            padding: '0.25rem',
            cursor: 'pointer',
            color: '#555' // 👈 сделаем зрачок видимым
          }}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={15} color="#555" /> : <Eye size={15} color="#555" />}
        </button>
      </div>

      {validateLatinOnly && hasCyrillic && (
        <p className="error" style={{ color: 'red' }}>
          Password must not contain Cyrillic characters
        </p>
      )}
      {showMatchWarning && matchValue && !doesMatch && (
        <p className="error" style={{ color: 'red' }}>
          Passwords do not match
        </p>
      )}
    </div>
  );
};

export default PasswordField;
