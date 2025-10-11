// Service for submitting joke data to Google Sheets via hidden iframe
// This completely bypasses CORS issues

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkPj42gMV3uhtqOWwrkU8s_4zA1EGVfoDdsD2wOgSOmq0Bz2fbsj3JSFgeqvKqDmBk/exec';

export const submitJokeToSheets = async (jokeData) => {
  try {
    
      // Create a hidden iframe to submit the data
      return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        // Add sandbox attributes to prevent any window opening
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
        iframe.setAttribute('loading', 'lazy');
      
      // Create form data
      const formData = new FormData();
      formData.append('timestamp', new Date().toISOString());
      formData.append('title', jokeData.jokeTitle);
      formData.append('content', jokeData.jokeContent);
      formData.append('author', jokeData.jokeAuthor || 'Anonyme');
      
      // Create a form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SCRIPT_URL;
      form.target = 'hidden-iframe';
      form.style.display = 'none';
      form.style.position = 'absolute';
      form.style.left = '-9999px';
      form.style.top = '-9999px';
      
      // Add form fields
      const fields = {
        timestamp: new Date().toISOString(),
        title: jokeData.jokeTitle,
        content: jokeData.jokeContent,
        author: jokeData.jokeAuthor || 'Anonyme'
      };
      
      Object.keys(fields).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      });
      
      // Add form to page
      document.body.appendChild(form);
      document.body.appendChild(iframe);
      
      // Set iframe name
      iframe.name = 'hidden-iframe';
      
      // Handle iframe load
      iframe.onload = () => {
        // Clean up elements safely
        try {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        } catch (cleanupError) {
          console.warn('Cleanup error:', cleanupError);
        }
        resolve({ success: true, data: { message: 'Joke submitted via iframe' } });
      };
      
      iframe.onerror = () => {
        // Clean up elements safely
        try {
          if (document.body.contains(form)) {
            document.body.removeChild(form);
          }
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        } catch (cleanupError) {
          console.warn('Cleanup error:', cleanupError);
        }
        resolve({ success: false, error: 'Iframe submission failed' });
      };
      
      // Submit form
      form.submit();
      
      // Fallback timeout
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          // Clean up elements safely
          try {
            if (document.body.contains(form)) {
              document.body.removeChild(form);
            }
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          } catch (cleanupError) {
            console.warn('Cleanup error in timeout:', cleanupError);
          }
          resolve({ success: true, data: { message: 'Joke submitted (timeout fallback)' } });
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error('💥 Error submitting joke to Google Sheets:', error);
    return { success: false, error: error.message };
  }
};