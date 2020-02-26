export default (date:string) => {
  return new Date(date).toLocaleString('lt-LT', { dateStyle: 'long'} );
};
