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
    
    // Return a simple HTML response
    return HtmlService.createHtmlOutput(`
      <html>
        <body>
          <h1>Success!</h1>
          <p>Your joke has been submitted successfully.</p>
          <script>
            // Close the window if opened in a popup
            if (window.opener) {
              window.opener.postMessage('success', '*');
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
        <body>
          <h1>Error</h1>
          <p>There was an error submitting your joke: ${error.toString()}</p>
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
