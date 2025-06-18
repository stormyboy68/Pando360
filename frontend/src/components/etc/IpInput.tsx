import { FC, useState } from 'react';
import { z } from 'zod';

interface IpInputProps {
  onChange?: (value: string) => void;
  error?: string;
  name?: string;
}

const ipAddressSchema = z.string().refine((value) => {
  if (!value) return true; // اجازه خالی بودن
  const ips = value.split(',').map(ip => ip.trim());
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  return ips.every(ip => ipRegex.test(ip));
}, "آدرس‌های IP وارد شده معتبر نیستند");

const IpInput: FC<IpInputProps> = ({ onChange, error, name }) => {
  const [validationError, setValidationError] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    try {
      ipAddressSchema.parse(value);
      setValidationError('');
      if (onChange) {
        onChange(value);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        name={name}
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="192.168.1.1,10.0.0.1"
        className={`p-2 border rounded-md bg-gray-100 text-gray-800 ${error || validationError ? 'border-red-500' : 'border-gray-300'}`}
        autoComplete='off'
      />
      {(error || validationError) && (
        <span className="text-sm text-red-500">{error || validationError}</span>
      )}
    </div>
  );
};

export default IpInput; 