(function() {
  // Dynamically create a window with unique content for the Example App
  const windowTitle = 'Example App';
  const customHTML = `
    <h2>Example App</h2>
    <p>This is the example app.</p>
  `;

  // Create a window dynamically
  createWindow(windowTitle, customHTML, [
    { label: 'Close', action: closeWindow },
    { label: 'Minimize', action: minimizeWindow },
    { label: 'Maximize', action: maximizeWindow }
  ]);
})();

notifier.create('Hello from the Example App', 'info', 5000);