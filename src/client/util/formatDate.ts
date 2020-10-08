export default (date:string):string => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const newDate = new Date(date);
  return newDate.toLocaleDateString('lt-LT', options);
};
