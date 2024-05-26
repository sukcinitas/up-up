export default (date: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const newDate: Date = new Date(date);
  return newDate.toLocaleDateString('en-US', options);
};
