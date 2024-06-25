import axios from 'axios';

async function sendRequest(task: 'Financial Sentiment Analysis' | 'Financial Relation Extraction' | 'Financial Headline Classification' | 'Financial Named Entity Recognition', data: string): Promise<any> {
  const encodedData = encodeURIComponent(data);
  const encodedTask = encodeURIComponent(task);
  const url = `https://bff1-35-229-141-67.ngrok-free.app/predict?data=${encodedData}&task=${encodedTask}`;

  try {
    const response = await axios.post(url, {}, {
      headers: {
        'accept': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
}

// Example usage:
sendRequest('Financial Headline Classification', 'Apple released new iphone')
  .then(response => console.log(response))
  .catch(error => console.error(error));
