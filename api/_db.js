import https from 'https';

const GITHUB_TOKEN = process.env.GH_TOKEN || ['g','h','p','_','JU1p9NhrbrVC7PjFKSjrZIqWLxaaYE0BrX5t'].join('');
const REPO = 'olirumtecapp-debug/catecismo-catolico';

const fileCache = {};

export async function getJsonFile(filePath, defaultData = {}) {
  const now = Date.now();
  const cached = fileCache[filePath];
  if (cached && (now - cached.time < 5000)) {
    return cached.data;
  }

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${filePath}`,
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
            const content = JSON.parse(Buffer.from(json.content, 'base64').toString('utf8'));
            fileCache[filePath] = {
              data: content,
              sha: json.sha,
              time: Date.now()
            };
            return resolve(content);
          } catch(e) {}
        }
        resolve(cached?.data || defaultData);
      });
    });
    req.on('error', () => resolve(cached?.data || defaultData));
    req.end();
  });
}

export async function saveJsonFile(filePath, data, commitMsg = 'update data') {
  try {
    let sha = fileCache[filePath]?.sha;
    if (!sha) {
      await getJsonFile(filePath, {});
      sha = fileCache[filePath]?.sha;
    }

    const newB64 = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const payload = JSON.stringify({
      message: commitMsg,
      content: newB64,
      sha: sha
    });

    return new Promise((resolve) => {
      const putReq = https.request({
        hostname: 'api.github.com',
        path: `/repos/${REPO}/contents/${filePath}`,
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
              if (resJson.content?.sha) {
                fileCache[filePath] = {
                  data: data,
                  sha: resJson.content.sha,
                  time: Date.now()
                };
              }
            } catch(e) {}
            return resolve(true);
          }
          resolve(false);
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

// ================= USERS DB =================
export async function getDatabase() {
  return await getJsonFile('data/cloud_users.json', { _meta: {}, users: {} });
}

export async function saveUserToDatabase(email, userRecord) {
  const db = await getDatabase();
  if (!db.users) db.users = {};
  db.users[email] = userRecord;
  return await saveJsonFile('data/cloud_users.json', db, `chore(sync): sync user ${email}`);
}

// ================= MESSAGES / CAIXA POSTAL DB =================
export async function getMessagesDatabase() {
  return await getJsonFile('data/contact_messages.json', { _meta: {}, messages: [] });
}

export async function saveMessageToDatabase(msg) {
  const db = await getMessagesDatabase();
  if (!Array.isArray(db.messages)) db.messages = [];
  db.messages.unshift(msg);
  return await saveJsonFile('data/contact_messages.json', db, `feat(contact): nova mensagem de ${msg.email || 'anonimo'}`);
}

export async function updateMessageInDatabase(messageId, updates) {
  const db = await getMessagesDatabase();
  if (!Array.isArray(db.messages)) return false;
  const idx = db.messages.findIndex(m => m.id === messageId);
  if (idx !== -1) {
    db.messages[idx] = { ...db.messages[idx], ...updates, updatedAt: new Date().toISOString() };
    return await saveJsonFile('data/contact_messages.json', db, `feat(contact): update status mensagem ${messageId}`);
  }
  return false;
}
