window.MathJax = {
  tex: {
    inlineMath: [['$', '$']],
    displayMath: [['$$', '$$']],
    processEscapes: true
  },
  svg: {
    fontCache: 'global'
  },
  startup: {
    pageReady: () => {
      return MathJax.typesetPromise();
    }
  }
};
