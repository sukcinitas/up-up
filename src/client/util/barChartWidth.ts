export default (): {
  w: number;
  left: number;
  windowW: number;
} => {
  const windowW =
    window.innerWidth || // to support <= IE8
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const w = windowW;
  const left = 0;
  return { w, left, windowW };
};
