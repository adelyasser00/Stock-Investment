import axios from 'axios';

export async function sendRequest(task: 'Financial Sentiment Analysis' | 'Financial Relation Extraction' | 'Financial Headline Classification' | 'Financial Named Entity Recognition', data: string): Promise<any> {
  const encodedData = encodeURIComponent(data);
  const encodedTask = encodeURIComponent(task);
  const url = `https://4bcc-35-197-64-113.ngrok-free.app/predict?data=${encodedData}&task=${encodedTask}`;

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


