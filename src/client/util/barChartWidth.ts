export default (): {
  w: number;
  left: number;
  windowW: number;
} => {
  const windowW =
    window.innerWidth || // to support <= IE8
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  let w: number;
  let left: number;
  if (windowW > 1300) {
    w = windowW - 80 - 600;
    left = 100;
  } else if (windowW > 1024) {
    w = windowW - 80 - 500;
    left = 100;
  } else if (windowW < 400) {
    w = windowW - 80;
    left = 40;
  } else if (windowW < 920) {
    w = windowW - 90;
    left = 120;
  } else {
    w = windowW - 300;
    left = 90;
  }
  return { w, left, windowW };
};
