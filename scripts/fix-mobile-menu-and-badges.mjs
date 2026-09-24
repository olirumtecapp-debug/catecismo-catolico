import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '..', 'index.html');

let content = fs.readFileSync(indexPath, 'utf8');
const isCRLF = content.includes('\r\n');
const eol = isCRLF ? '\r\n' : '\n';

// 1. Atualizar badges da sidebar desktop para ter a classe .menu-novenas-badge
content = content.replace(
  'id="sidebar-novenas-badge" class="shrink-0 text-[9px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">9 Dias</span>',
  'id="sidebar-novenas-badge" class="menu-novenas-badge shrink-0 text-[9px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">9 Dias</span>'
);

// 2. Atualizar menu mobile (Novenas e Diário Espiritual)
const oldMobileNovenasAndReflections = [
  '                        <button onclick="NovenasModal.open(); toggleMobileMenu();" data-menu-key="novenas" class="nav-item w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-mariana transition text-sm">',
  '                            <span class="flex items-center gap-3">',
  '                                <span>🌹</span>',
  '                                <span>Novenas Católicas</span>',
  '                            </span>',
  '                            <span class="text-[9px] font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">9 Dias</span>',
  '                        </button>',
  '                        <button onclick="router.navigate(\'oracao\'); toggleMobileMenu();" data-menu-key="oracao" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-mariana transition text-sm">🙏 Oração & Lectio</button>',
  '                        <button onclick="router.navigate(\'reflexoes\'); toggleMobileMenu();" data-menu-key="reflexoes" class="nav-item w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-mariana transition text-sm">',
  '                            <span class="flex items-center gap-3">',
  '                                <span>📖</span>',
  '                                <span>Diário Espiritual &amp; Reflexões</span>',
  '                            </span>',
  '                            <span id="mobile-reflections-badge" class="shrink-0 text-[9px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">0</span>',
  '                        </button>'
].join(eol);

const newMobileNovenasAndReflections = [
  '                        <button onclick="NovenasModal.open(); toggleMobileMenu();" data-menu-key="novenas" class="nav-item w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-mariana transition text-sm">',
  '                            <div class="flex items-center gap-3 min-w-0">',
  '                                <span class="text-base shrink-0">🌹</span>',
  '                                <span class="truncate">Novenas Católicas</span>',
  '                            </div>',
  '                            <span id="mobile-novenas-badge" class="menu-novenas-badge shrink-0 text-[9px] font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800">9 Dias</span>',
  '                        </button>',
  '                        <button onclick="router.navigate(\'oracao\'); toggleMobileMenu();" data-menu-key="oracao" class="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-mariana transition text-sm">🙏 Oração & Lectio</button>',
  '                        <button onclick="router.navigate(\'reflexoes\'); toggleMobileMenu();" data-menu-key="reflexoes" class="nav-item w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-mariana transition text-sm">',
  '                            <div class="flex items-center gap-3 min-w-0">',
  '                                <span class="text-base shrink-0">📖</span>',
  '                                <span class="truncate">Diário Espiritual</span>',
  '                            </div>',
  '                            <span id="mobile-reflections-badge" class="shrink-0 text-[9px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">0</span>',
  '                        </button>'
].join(eol);

if (content.includes(oldMobileNovenasAndReflections)) {
  content = content.replace(oldMobileNovenasAndReflections, newMobileNovenasAndReflections);
  console.log('✅ Menu mobile atualizado com sucesso!');
} else {
  console.warn('⚠️ Bloco do menu mobile não encontrado para substituição direta!');
}

// 3. Atualizar NovenasManager.updateHomeCard para atualizar todos os badges de novenas (.menu-novenas-badge, #sidebar-novenas-badge, #mobile-novenas-badge)
const oldSidebarBadgeDecl = 'const sidebarBadge = document.getElementById(\'sidebar-novenas-badge\');';
const newSidebarBadgeDecl = 'const novenaBadges = document.querySelectorAll(\'#sidebar-novenas-badge, #mobile-novenas-badge, .menu-novenas-badge\');';

if (content.includes(oldSidebarBadgeDecl)) {
  content = content.replace(oldSidebarBadgeDecl, newSidebarBadgeDecl);
  console.log('✅ Declaração de novenaBadges atualizada!');
}

// Substituir atualização do badge no caso de novena ativa
const oldActiveBadgeUpdate = [
  '                    if (sidebarBadge) {',
  '                        sidebarBadge.textContent = isTodayPrayed ? `Dia ${currentDay} ✓` : "Ativa";',
  '                        sidebarBadge.className = isTodayPrayed',
  '                            ? "shrink-0 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700"',
  '                            : "shrink-0 text-[9px] font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-700 animate-pulse";',
  '                    }'
].join(eol);

const newActiveBadgeUpdate = [
  '                    if (novenaBadges && novenaBadges.length) {',
  '                        novenaBadges.forEach(b => {',
  '                            b.textContent = isTodayPrayed ? `Dia ${currentDay} ✓` : "Ativa";',
  '                            b.className = isTodayPrayed',
  '                                ? "menu-novenas-badge shrink-0 text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700"',
  '                                : "menu-novenas-badge shrink-0 text-[9px] font-bold text-rose-800 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-300 dark:border-rose-700 animate-pulse";',
  '                        });',
  '                    }'
].join(eol);

if (content.includes(oldActiveBadgeUpdate)) {
  content = content.replace(oldActiveBadgeUpdate, newActiveBadgeUpdate);
  console.log('✅ Atualização de badges ativos atualizada!');
}

// Substituir atualização do badge no caso de novena inativa
const oldInactiveBadgeUpdate = [
  '                    if (sidebarBadge) {',
  '                        sidebarBadge.textContent = "9 Dias";',
  '                    }'
].join(eol);

const newInactiveBadgeUpdate = [
  '                    if (novenaBadges && novenaBadges.length) {',
  '                        novenaBadges.forEach(b => {',
  '                            b.textContent = "9 Dias";',
  '                            b.className = "menu-novenas-badge shrink-0 text-[9px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-800";',
  '                        });',
  '                    }'
].join(eol);

if (content.includes(oldInactiveBadgeUpdate)) {
  content = content.replace(oldInactiveBadgeUpdate, newInactiveBadgeUpdate);
  console.log('✅ Atualização de badges inativos atualizada!');
}

// 4. Atualizar toggleMobileMenu para forçar refresh dos badges ao abrir a gaveta móvel
const oldToggleMenu = [
  '        function toggleMobileMenu() {',
  '            document.getElementById(\'mobile-drawer\').classList.toggle(\'hidden\');',
  '        }'
].join(eol);

const newToggleMenu = [
  '        function toggleMobileMenu() {',
  '            const drawer = document.getElementById(\'mobile-drawer\');',
  '            if (drawer) {',
  '                drawer.classList.toggle(\'hidden\');',
  '                if (!drawer.classList.contains(\'hidden\')) {',
  '                    if (window.ReflectionsManager) ReflectionsManager.updateBadges();',
  '                    if (window.NovenasManager) NovenasManager.updateHomeCard();',
  '                }',
  '            }',
  '        }'
].join(eol);

if (content.includes(oldToggleMenu)) {
  content = content.replace(oldToggleMenu, newToggleMenu);
  console.log('✅ toggleMobileMenu atualizado com refresh de badges!');
}

// 5. Garantir que NovenasManager.updateHomeCard execute no window.onload
const oldOnload = [
  '            if (window.ReflectionsManager) {',
  '                ReflectionsManager.updateBadges();',
  '            }',
  '            router.navigate(\'home\');'
].join(eol);

const newOnload = [
  '            if (window.ReflectionsManager) {',
  '                ReflectionsManager.updateBadges();',
  '            }',
  '            if (window.NovenasManager) {',
  '                NovenasManager.updateHomeCard();',
  '            }',
  '            router.navigate(\'home\');'
].join(eol);

if (content.includes(oldOnload)) {
  content = content.replace(oldOnload, newOnload);
  console.log('✅ window.onload atualizado com NovenasManager.updateHomeCard()!');
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('🏁 Processamento concluído com sucesso!');
