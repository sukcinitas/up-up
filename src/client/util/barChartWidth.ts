export default () => {
  const windowW = window.innerWidth // to supoort <= IE8
|| document.documentElement.clientWidth
|| document.body.clientWidth;
  let w;
  if (windowW < 920) {
    w = windowW - 20;
  } else if (windowW > 1024) {
    w = windowW - 80 - 504; // 504 is width of options list
  } else {
    w = 860;
  }
  return w;
};
