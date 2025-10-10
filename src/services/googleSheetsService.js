// Service for submitting joke data to Google Sheets via hidden iframe
// This completely bypasses CORS issues

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzkPj42gMV3uhtqOWwrkU8s_4zA1EGVfoDdsD2wOgSOmq0Bz2fbsj3JSFgeqvKqDmBk/exec';

export const submitJokeToSheets = async (jokeData) => {
  try {
    console.log('🚀 Starting joke submission via iframe...');
    console.log('📝 Joke data received:', jokeData);
    
    // Create a hidden iframe to submit the data
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      
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
        console.log('✅ Form submitted successfully via iframe');
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        resolve({ success: true, data: { message: 'Joke submitted via iframe' } });
      };
      
      iframe.onerror = () => {
        console.log('❌ Error submitting form via iframe');
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        resolve({ success: false, error: 'Iframe submission failed' });
      };
      
      // Submit form
      form.submit();
      
      // Fallback timeout
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          console.log('⏰ Form submission timeout, assuming success');
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          resolve({ success: true, data: { message: 'Joke submitted (timeout fallback)' } });
        }
      }, 5000);
    });
    
  } catch (error) {
    console.error('💥 Error submitting joke to Google Sheets:', error);
    return { success: false, error: error.message };
  }
};