/* Initialize Mermaid for Material for MkDocs with instant navigation support */
window.mermaid = window.mermaid || {};

// Configure Mermaid. Adjust options as needed.
mermaid.initialize({
  startOnLoad: true,
  theme: 'default'
});

// Re-run Mermaid after page changes triggered by instant navigation
if (window.document$) {
  document$.subscribe(() => {
    try {
      mermaid.run({ nodes: document.querySelectorAll('.mermaid') });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Mermaid render error:', e);
    }
  });
}
