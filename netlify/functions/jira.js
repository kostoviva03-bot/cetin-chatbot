exports.handler = async (event) => {
  const { path: jiraPath } = JSON.parse(event.body || '{}');
  
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_TOKEN;
  const baseUrl = process.env.JIRA_URL;
  
  if (!email || !token || !baseUrl) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing env vars' }) };
  }

  const credentials = Buffer.from(`${email}:${token}`).toString('base64');
  
  try {
    const response = await fetch(`${baseUrl}${jiraPath}`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
