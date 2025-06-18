import { FC, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { z } from "zod";
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
  onChange?: (value: string) => void;
  error?: string;
  showTime?: boolean;
  name?: string;
}

const createSchema = (showTime: boolean) => {
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  const dateTimeRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/;

  return z.string().refine((value) => {
    const regex = showTime ? dateTimeRegex : dateRegex;
    if (!regex.test(value)) return false;

    const [datePart, timePart] = showTime ? value.split(" ") : [value, "00:00"];
    const [year, month, day] = datePart.split("/").map(Number);
    const [hour, minute] = timePart ? timePart.split(":").map(Number) : [0, 0];

    const date = new Date(year, month - 1, day, hour, minute);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day &&
      (!showTime || (date.getHours() === hour && date.getMinutes() === minute))
    );
  }, "تاریخ وارد شده معتبر نیست");
};

const DateTimePicker: FC<DateTimePickerProps> = ({
  onChange,
  error,
  showTime = false,
  name,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [minDate, setMinDate] = useState(new Date());
  const handleChange = (date: Date | null) => {
    if (date) {
      const formattedDate = showTime
        ? `${moment(date).format("YYYY/MM/DD")} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
        : moment(date).format("YYYY/MM/DD");

      try {
        createSchema(showTime).parse(formattedDate);
        setValidationError("");
        setInputValue(formattedDate);
        setSelectedDate(date);
        if (onChange) {
          onChange(formattedDate);
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          setValidationError(err.errors[0].message);
        }
      }
    } else {
      setSelectedDate(null);
      setInputValue("");
      if (onChange) {
        onChange("");
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 text-lg text-gray-800">
      <input type="hidden" name={name} value={inputValue} />
      <DatePicker
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <mask id="ipSApplication0">
              <g
                fill="none"
                stroke="#fff"
                strokeLinejoin="round"
                strokeWidth="4"
              >
                <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                <path
                  fill="#fff"
                  d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                ></path>
              </g>
            </mask>
            <path
              fill="currentColor"
              d="M0 0h48v48H0z"
              mask="url(#ipSApplication0)"
            ></path>
          </svg>
        }
        minDate={minDate}
        showIcon
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect={showTime}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat={showTime ? "yyyy/MM/dd HH:mm" : "yyyy/MM/dd"}
        className={`py-5 border rounded-md w-full bg-gray-100  ${
          error || validationError ? "border-red-500" : "border-gray-300"
        }`}
        placeholderText={showTime ? "2024/03/15 14:30" : "2024/03/15"}
        timeCaption="Time"
        isClearable
      />
      {(error || validationError) && (
        <span className="text-sm text-red-500">{error || validationError}</span>
      )}
    </div>
  );
};

export default DateTimePicker;
