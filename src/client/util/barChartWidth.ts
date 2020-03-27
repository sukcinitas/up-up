export default () => {
  const windowW = window.innerWidth // to supoort <= IE8
|| document.documentElement.clientWidth
|| document.body.clientWidth;
  let w:number; let left:number;
  if (windowW < 920) {
    w = windowW - 40;
    left = 60;
  } else if (windowW > 1024) {
    w = windowW - 80 - 400;
    left = 100;
  } else {
    w = windowW - 40;
    left = 90;
  }
  return { w, left };
};
