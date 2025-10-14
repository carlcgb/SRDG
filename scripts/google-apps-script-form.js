// Google Apps Script for joke submissions using form data
// This avoids CORS issues by using form submission instead of JSON

function doPost(e) {
  try {
    console.log('Received data:', e);
    
    // Get the spreadsheet
    const spreadsheetId = '1JSARnydPoNzW1xh7iKgTtgV5k17-Qtg9wDo6_ach0cA';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Add headers if needed
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Titre', 'Contenu', 'Auteur']]);
    }
    
    // Get form data
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const title = e.parameter.title || '';
    const content = e.parameter.content || '';
    const author = e.parameter.author || 'Anonyme';
    
    // Add the joke data
    const newRow = [timestamp, title, content, author];
    
    console.log('Adding row:', newRow);
    sheet.appendRow(newRow);
    
    // Return a minimal HTML response that won't open any windows
    return HtmlService.createHtmlOutput(`
      <html>
        <head>
          <title>Success</title>
        </head>
        <body style="margin:0;padding:0;background:transparent;">
          <script>
            // Send success message to parent if in iframe
            if (window.parent !== window) {
              window.parent.postMessage('joke-submitted-success', '*');
            }
            // Close window if opened in popup (though this shouldn't happen with iframe)
            if (window.opener) {
              window.opener.postMessage('joke-submitted-success', '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return HtmlService.createHtmlOutput(`
      <html>
        <head>
          <title>Error</title>
        </head>
        <body style="margin:0;padding:0;background:transparent;">
          <script>
            // Send error message to parent if in iframe
            if (window.parent !== window) {
              window.parent.postMessage('joke-submitted-error', '*');
            }
            // Close window if opened in popup (though this shouldn't happen with iframe)
            if (window.opener) {
              window.opener.postMessage('joke-submitted-error', '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput(`
    <html>
      <body>
        <h1>Joke Submission API</h1>
        <p>This API is running and ready to receive joke submissions.</p>
        <p>Use POST method with form data to submit jokes.</p>
      </body>
    </html>
  `);
}
