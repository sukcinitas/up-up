export default (date: string): string => {
  const options: {
    year: string;
    month: string;
    day: string;
  } = { year: 'numeric', month: 'long', day: 'numeric' };
  const newDate: Date = new Date(date);
  return newDate.toLocaleDateString('lt-LT', options);
};
