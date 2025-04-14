
const axios = require('axios');

// Replace these placeholders with actual values
const API_KEY = '<replace_api_key>';
const EXTERNAL_USER_ID = '<replace_external_user_id>';
const QUERY = 'Put your query here';
const PLUGIN_IDS = [
  'plugin-1712327325',
  'plugin-1713962163',
  'plugin-1713954536',
  'plugin-1713958591',
  'plugin-1713958830',
  'plugin-1713961903',
  'plugin-1713967141'
];
const ENDPOINT_ID = 'predefined-openai-gpt4o';

// Function to create a chat session
async function createChatSession() {
  const url = 'https://api-dev.on-demand.io/chat/v1/sessions';
  const headers = { apikey: API_KEY };
  const body = {
    pluginIds: [],
    externalUserId: EXTERNAL_USER_ID
  };

  try {
    const response = await axios.post(url, body, { headers });
    if (response.status === 201) {
      console.log('Chat session created successfully:', response.data);
      return response.data.id; // Extract session ID
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating chat session:', error.message);
    throw error;
  }
}

// Function to submit a query (sync mode)
async function submitQuerySync(sessionId) {
  const url = `https://api-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`;
  const headers = { apikey: API_KEY };
  const body = {
    endpointId: ENDPOINT_ID,
    query: QUERY,
    pluginIds: PLUGIN_IDS,
    responseMode: 'sync',
    reasoningMode: 'medium'
  };

  try {
    const response = await axios.post(url, body, { headers });
    if (response.status === 200) {
      console.log('Query response:', response.data);
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting query:', error.message);
    throw error;
  }
}

// Function to submit a query (stream mode using SSE)
async function submitQueryStream(sessionId) {
  const url = `https://api-dev.on-demand.io/chat/v1/sessions/${sessionId}/query`;
  const headers = {
    apikey: API_KEY,
    'Content-Type': 'application/json'
  };
  const body = {
    endpointId: ENDPOINT_ID,
    query: QUERY,
    pluginIds: PLUGIN_IDS,
    responseMode: 'stream',
    reasoningMode: 'medium'
  };

  try {
    const response = await axios({
      method: 'POST',
      url,
      headers,
      data: body,
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      const data = chunk.toString();
      console.log('Streamed data:', data);
    });

    response.data.on('end', () => {
      console.log('Stream ended.');
    });

    response.data.on('error', (error) => {
      console.error('Stream error:', error.message);
    });
  } catch (error) {
    console.error('Error submitting query in stream mode:', error.message);
    throw error;
  }
}

// Main function to execute the flow
async function main() {
  try {
    const sessionId = await createChatSession();
    console.log('Session ID:', sessionId);

    // Submit query in sync mode
    await submitQuerySync(sessionId);

    // Uncomment the following line to test stream mode
    // await submitQueryStream(sessionId);
  } catch (error) {
    console.error('Error in main flow:', error.message);
  }
}

// Execute the main function
main();
