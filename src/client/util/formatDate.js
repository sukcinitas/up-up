export default (date) => {
  const options = {
    dateStyle: 'long',
  };
  return new Date(date).toLocaleString('lt-LT', options);
};
