// Simple Google Apps Script for joke submissions
// Handles both GET and POST requests with form data

function doPost(e) {
  try {
    // Get the spreadsheet
    const spreadsheetId = '1JSARnydPoNzW1xh7iKgTtgV5k17-Qtg9wDo6_ach0cA';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // Add headers if needed
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Titre', 'Contenu', 'Auteur', 'Timestamp']]);
    }
    
    // Get form data from parameters

    const title = e.parameter.title || '';
    const content = e.parameter.content || '';
    const author = e.parameter.author || 'Anonyme';
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    // Add the joke data
    const newRow = [title, content, author, timestamp];
    sheet.appendRow(newRow);
    
    // Return success page
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Joke Submitted</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: green; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Success!</h1>
          <p>Your joke has been submitted successfully.</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Author:</strong> ${author}</p>
          <script>
            // Try to close the window if it's in a popup
            if (window.opener) {
              window.opener.postMessage('joke-submitted', '*');
              setTimeout(() => window.close(), 2000);
            }
          </script>
        </body>
      </html>
    `);
      
  } catch (error) {
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h1 class="error">❌ Error</h1>
          <p>There was an error submitting your joke.</p>
          <p>Error: ${error.toString()}</p>
        </body>
      </html>
    `);
  }
}

function doGet(e) {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Joke Submission API</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        </style>
      </head>
      <body>
        <h1>🎭 Joke Submission API</h1>
        <p>This API is running and ready to receive joke submissions.</p>
        <p>Submit jokes using POST method with form data.</p>
        <p><strong>Status:</strong> ✅ Online</p>
      </body>
    </html>
  `);
}
