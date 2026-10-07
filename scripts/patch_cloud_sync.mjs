import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const pSyncStart = html.indexOf('async smartSync(showToastFeedback = false) {');
const pSyncEnd = html.indexOf('updateIndicator() {', pSyncStart);

if (pSyncStart === -1 || pSyncEnd === -1) {
    console.error('smartSync bounds not found');
    process.exit(1);
}

const newSmartSync = `async smartSync(showToastFeedback = false) {
                if (!AppState.cloudSyncEmail) return;

                const email = String(AppState.cloudSyncEmail).trim().toLowerCase();
                const pin = window.__pinNuvem || '';
                const url = this.getApiUrl('/api/cloud-sync/load?email=' + encodeURIComponent(email) + (pin ? '&pin=' + encodeURIComponent(pin) : ''));

                try {
                    const res = await fetch(url);
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.success && data.user) {
                            const cloudXp = Number(data.user.xp) || 0;
                            const localXp = Number(AppState.xp) || 0;
                            const cloudStreak = Number(data.user.streak) || 0;
                            const localStreak = Number(AppState.streak) || 0;

                            // 1. SEMPRE MESCLAR NOVENAS (Nuvem + Local)
                            if (data.appState && data.appState.novenas) {
                                AppState.novenas = AppState.novenas || { progress: {}, meta: {} };
                                AppState.novenas.progress = AppState.novenas.progress || {};
                                AppState.novenas.meta = AppState.novenas.meta || {};
                                const cloudProgress = data.appState.novenas.progress || {};
                                const cloudMeta = data.appState.novenas.meta || {};

                                Object.keys(cloudProgress).forEach(novenaId => {
                                    let localDays = [];
                                    try {
                                        localDays = JSON.parse(localStorage.getItem(\`thesaurus_progress_\${novenaId}\`) || '[]');
                                    } catch(e) { localDays = []; }
                                    const cDays = cloudProgress[novenaId] || [];
                                    const mergedDays = Array.from(new Set([...(localDays || []), ...(cDays || [])])).sort((a,b)=>a-b);
                                    localStorage.setItem(\`thesaurus_progress_\${novenaId}\`, JSON.stringify(mergedDays));
                                    AppState.novenas.progress[novenaId] = mergedDays;
                                });

                                Object.keys(cloudMeta).forEach(novenaId => {
                                    let localMeta = {};
                                    try {
                                        localMeta = JSON.parse(localStorage.getItem(\`thesaurus_meta_\${novenaId}\`) || '{}');
                                    } catch(e) { localMeta = {}; }
                                    const cMeta = cloudMeta[novenaId] || {};
                                    const mergedMeta = Object.assign({}, localMeta, cMeta);
                                    localStorage.setItem(\`thesaurus_meta_\${novenaId}\`, JSON.stringify(mergedMeta));
                                    AppState.novenas.meta[novenaId] = mergedMeta;
                                });

                                if (window.NovenasManager) {
                                    window.NovenasManager.updateHomeCard();
                                }
                                const iframe = document.getElementById('novenas-iframe');
                                if (iframe && iframe.contentWindow) {
                                    try {
                                        iframe.contentWindow.postMessage({ type: 'NOVENAS_DATA_SYNC', novenas: AppState.novenas }, '*');
                                    } catch(e) {}
                                }
                            }

                            // 2. SEMPRE MESCLAR LITURGIA DIÁRIA, REFLEXÕES E CONQUISTAS (Aditivo e Nunca perde nada)
                            if (data.appState) {
                                if (data.appState.liturgicalRead) {
                                    AppState.liturgicalRead = Object.assign({}, data.appState.liturgicalRead, AppState.liturgicalRead || {});
                                }
                                if (data.appState.lectioNotes) {
                                    AppState.lectioNotes = Object.assign({}, data.appState.lectioNotes, AppState.lectioNotes || {});
                                }
                                if (Array.isArray(data.appState.completedLessons)) {
                                    const setL = new Set([...(AppState.completedLessons || []), ...data.appState.completedLessons]);
                                    AppState.completedLessons = Array.from(setL);
                                }
                                if (Array.isArray(data.appState.unlockedAchievements)) {
                                    const setA = new Set([...(AppState.unlockedAchievements || []), ...data.appState.unlockedAchievements]);
                                    AppState.unlockedAchievements = Array.from(setA);
                                }
                                if (data.appState.dailyChallenges) {
                                    AppState.dailyChallenges = Object.assign({}, data.appState.dailyChallenges, AppState.dailyChallenges || {});
                                }
                            }

                            // 3. Atualizar XP e Ofensiva (Sempre o maior)
                            AppState.xp = Math.max(localXp, cloudXp);
                            AppState.streak = Math.max(localStreak, cloudStreak);
                            AppState.lastCloudSync = new Date().toISOString();
                            saveState();
                            this.updateIndicator();
                            if (typeof updateHeaderBadges === 'function') updateHeaderBadges();

                            // 4. Se o local tiver novos dados ou mais XP que a nuvem, sincroniza de volta para a nuvem!
                            if (localXp > cloudXp || (data.appState && Object.keys(AppState.liturgicalRead || {}).length > Object.keys(data.appState.liturgicalRead || {}).length)) {
                                await this.syncToCloud(false);
                            }

                            if (showToastFeedback) {
                                showToast('Sincronizado com a nuvem! (' + AppState.xp + ' XP, ' + AppState.streak + ' dias)', 'success');
                            }
                            return;
                        }
                    }
                    await this.syncToCloud(showToastFeedback);
                } catch (e) {
                    console.warn('[SmartSync] Falha na sincronização:', e.message);
                    if (showToastFeedback) {
                        showToast('Progresso mantido localmente.', 'info');
                    }
                }
            },

            `;

html = html.substring(0, pSyncStart) + newSmartSync + html.substring(pSyncEnd);

// 2. Corrigir markLiturgicalRead para sempre chamar syncToCloud imediatamente se tiver e-mail
const oldMark = `function markLiturgicalRead(date) {
            if (AppState.liturgicalRead[date]) {
                showToast("Esta liturgia já foi lida!", "info");
                return;
            }
            AppState.liturgicalRead[date] = true;
            AppState.xp += 15;
            if (window.CloudSyncManager) {
                CloudSyncManager.checkPromptOnAction('Marcar Liturgia Diária como Lida');
            }
            if (!AppState.unlockedAchievements.includes('first_liturgy')) {
                AppState.unlockedAchievements.push('first_liturgy');
                showToast("🏆 Conquista: Ouvinte da Palavra!", "success");
            }
            saveState();
            showToast("Liturgia lida! +15 XP", "success");
            router.navigate('liturgia', date);
        }`;

const newMark = `function markLiturgicalRead(date) {
            if (AppState.liturgicalRead && AppState.liturgicalRead[date]) {
                showToast("Esta liturgia já foi lida!", "info");
                return;
            }
            AppState.liturgicalRead = AppState.liturgicalRead || {};
            AppState.liturgicalRead[date] = true;
            AppState.xp = (AppState.xp || 0) + 15;
            if (!AppState.unlockedAchievements.includes('first_liturgy')) {
                AppState.unlockedAchievements.push('first_liturgy');
                showToast("🏆 Conquista: Ouvinte da Palavra!", "success");
            }
            saveState();
            if (window.CloudSyncManager) {
                if (AppState.cloudSyncEmail) {
                    CloudSyncManager.syncToCloud(false);
                } else {
                    CloudSyncManager.checkPromptOnAction('Marcar Liturgia Diária como Lida');
                }
            }
            showToast("Liturgia lida! +15 XP", "success");
            router.navigate('liturgia', date);
        }`;

if (html.includes(oldMark)) {
    html = html.replace(oldMark, newMark);
    console.log('markLiturgicalRead updated successfully!');
} else {
    console.warn('markLiturgicalRead old pattern mismatch');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html patched with bidirectional sync fixes! Length:', html.length);
