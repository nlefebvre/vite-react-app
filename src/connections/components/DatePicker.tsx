
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';


export const MyDatePicker = ({ date, setDate }: { date?: Dayjs; setDate: (date?: Dayjs) => void; }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={date} maxDate={dayjs()} onChange={(val) => val ? setDate(val) : setDate()} />
    </LocalizationProvider>
  );
};