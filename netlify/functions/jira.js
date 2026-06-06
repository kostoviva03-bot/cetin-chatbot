const https = require('https');

exports.handler = async (event) => {
  const { path: jiraPath } = JSON.parse(event.body || '{}');
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_TOKEN;
  const baseUrl = process.env.JIRA_URL;
  const credentials = Buffer.from(`${email}:${token}`).toString('base64');
  const url = new URL(`${baseUrl}${jiraPath}`);
  
  return new Promise((resolve) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
          body: data
        });
      });
    });
    req.on('error', (e) => {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });
    req.end();
  });
};
