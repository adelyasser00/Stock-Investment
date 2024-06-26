import axios from 'axios';

export async function sendRequest(task: 'Financial Sentiment Analysis' | 'Financial Relation Extraction' | 'Financial Headline Classification' | 'Financial Named Entity Recognition', data: string): Promise<any> {
  const encodedData = encodeURIComponent(data);
  const encodedTask = encodeURIComponent(task);
  const url = `https://7663-35-247-102-50.ngrok-free.app/predict?data=${encodedData}&task=${encodedTask}`;

  try {
    // const response = await fetch(url)
    // console.log("url: ",url)
    // console.log(`/api/cors?url=${url}`)
    // const jsonRes = await response.json();
    // console.log(response)
    // // console.log(jsonRes)
    // console.log("helper.ts returned")
    //   return response
    const response = await axios.post(url, {}, {
      withCredentials: false,
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin':'*',
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
