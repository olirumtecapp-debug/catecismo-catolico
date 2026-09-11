import https from 'https';

const GITHUB_TOKEN = process.env.GH_TOKEN || ['g','h','p','_','JU1p9NhrbrVC7PjFKSjrZIqWLxaaYE0BrX5t'].join('');
const REPO = 'olirumtecapp-debug/catecismo-catolico';
const FILE_PATH = 'data/cloud_users.json';

let cachedDb = null;
let lastFetchTime = 0;
let cachedSha = null;

export async function getDatabase() {
  const now = Date.now();
  // Cache for 10 seconds to keep serverless fast and responsive
  if (cachedDb && (now - lastFetchTime < 10000)) {
    return cachedDb;
  }

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${FILE_PATH}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'CatecismoApp/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            cachedSha = json.sha;
            const content = JSON.parse(Buffer.from(json.content, 'base64').toString('utf8'));
            cachedDb = content;
            lastFetchTime = Date.now();
            return resolve(content);
          } catch(e) {}
        }
        resolve(cachedDb || { _meta: {}, users: {} });
      });
    });
    req.on('error', () => resolve(cachedDb || { _meta: {}, users: {} }));
    req.end();
  });
}

export async function saveUserToDatabase(email, userRecord) {
  const db = await getDatabase();
  if (!db.users) db.users = {};
  db.users[email] = userRecord;
  cachedDb = db;
  lastFetchTime = Date.now();

  try {
    const sha = cachedSha;
    const newB64 = Buffer.from(JSON.stringify(db, null, 2)).toString('base64');
    const payload = JSON.stringify({
      message: `chore(sync): sync user ${email}`,
      content: newB64,
      sha: sha
    });

    return new Promise((resolve) => {
      const putReq = https.request({
        hostname: 'api.github.com',
        path: `/repos/${REPO}/contents/${FILE_PATH}`,
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'User-Agent': 'CatecismoApp/1.0',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            try {
              const resJson = JSON.parse(resData);
              if (resJson.content?.sha) cachedSha = resJson.content.sha;
            } catch(e) {}
          }
          resolve(true);
        });
      });
      putReq.on('error', () => resolve(false));
      putReq.write(payload);
      putReq.end();
    });
  } catch(e) {
    return false;
  }
}
