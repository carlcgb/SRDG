# Debug Steps for Google Sheets Integration

## Step 1: Test the Integration

1. **Open your React app** (should be running on http://localhost:3000)
2. **Open browser developer tools** (Press F12)
3. **Go to the Console tab**
4. **Navigate to the joke section** and click "Partager ma blague"
5. **Fill out the form** with test data:
   - Titre: "Test Debug"
   - Votre blague: "This is a test joke for debugging"
   - Votre nom: "Debug User"
6. **Click "Envoyer ma blague"**
7. **Watch the console** for detailed logs

## Step 2: What to Look For

You should see these console messages in order:

```
🎭 Joke submission started in modal hook
📋 Joke data in modal: {jokeTitle: "Test Debug", jokeContent: "This is a test joke for debugging", jokeAuthor: "Debug User"}
📤 Calling submitJokeToSheets...
🚀 Starting joke submission...
📝 Joke data received: {jokeTitle: "Test Debug", jokeContent: "This is a test joke for debugging", jokeAuthor: "Debug User"}
📤 Sending data to Google Sheets: {data: {timestamp: "2024-01-01T00:00:00.000Z", title: "Test Debug", content: "This is a test joke for debugging", author: "Debug User"}}
🔗 URL: https://script.google.com/macros/s/AKfycbzgZrAqkbgAgqF7P-fzfbVLyXuI2WsTRmGuoygVWlO4QmP_dwbmXGItEEq1NhH25JR_/exec
📡 Response received: Response {status: 200, statusText: "OK", ...}
📊 Response status: 200
📋 Response headers: {content-type: "application/json", ...}
✅ Success response: {success: true, message: "Joke added successfully"}
📥 Result from submitJokeToSheets: {success: true, data: {success: true, message: "Joke added successfully"}}
✅ Joke submitted successfully!
```

## Step 3: Check Your Google Sheet

1. **Open your Google Sheet**: https://docs.google.com/spreadsheets/d/1JSARnydPoNzW1xh7iKgTtgV5k17-Qtg9wDo6_ach0cA/edit
2. **Look for a new row** with your test data
3. **Check if headers were created** (Timestamp, Titre, Contenu, Auteur)

## Step 4: Common Issues

### If you see CORS errors:
- The Google Apps Script might not be deployed correctly
- Check if the script URL is accessible

### If you see network errors:
- Check your internet connection
- Verify the Google Apps Script URL is correct

### If you see no console logs:
- The form submission might not be working
- Check if the modal is properly connected

### If you see success but no data in sheets:
- The Google Apps Script might have permission issues
- Check the Google Apps Script execution logs

## Step 5: Report Back

Tell me:
1. **What console messages do you see?**
2. **Do you see any error messages?**
3. **Does data appear in your Google Sheet?**
4. **At which step does it fail?**

This will help me identify exactly where the issue is!
