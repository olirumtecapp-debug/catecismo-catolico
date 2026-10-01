import fs from 'fs';
import path from 'path';

const indexPath = path.resolve('index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const oldModal = `        function openPrayerModal(id) {
            const p = PrayerContentProvider.prayers.find(x => x.id === id);
            if (!p) return;
            const isFav = AppState.favorites.includes('prayer_' + id);
            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`
                <div class="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border relative">
                    <div class="absolute top-6 right-6 flex gap-3">
                        <button onclick="toggleFavorite('prayer_\${p.id}')" class="text-lg" title="Favoritar">\${isFav ? '⭐' : '☆'}</button>
                        <button onclick="closeModal()" class="text-slate-400 font-bold text-xl hover:text-red-500 transition">✕</button>
                    </div>
                    <div class="pr-16">
                        <span class="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold tracking-wider uppercase">\${p.category}</span>
                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-mariana mt-3 leading-tight">\${p.title}</h3>
                    </div>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <p class="font-serif text-base text-slate-800 leading-loose whitespace-pre-line">\${p.text}</p>
                    </div>
                    <button onclick="closeModal(); markPrayerDone();" class="w-full py-3.5 mariana-gradient text-white rounded-xl text-xs font-bold shadow-md transition hover:scale-105">🙏 Rezei esta oração (+10 XP)</button>
                </div>
            \`;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }`;

const newModal = `        function openPrayerModal(id) {
            const p = PrayerContentProvider.prayers.find(x => x.id === id);
            if (!p) return;
            const isFav = AppState.favorites.includes('prayer_' + id);
            const modal = document.getElementById('modal-container');
            modal.innerHTML = \`
                <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                    <div class="absolute top-6 right-6 flex items-center gap-2">
                        <button onclick="toggleFavorite('prayer_\${p.id}')" class="p-2 rounded-xl text-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Favoritar">\${isFav ? '⭐' : '☆'}</button>
                        <button onclick="closeModal()" class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">✕</button>
                    </div>
                    <div class="pr-16">
                        <span class="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-lg text-[10px] font-bold tracking-wider uppercase">\${p.category}</span>
                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-mariana dark:text-amber-200 mt-3 leading-tight">\${p.title}</h3>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-800/70 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <p class="font-serif text-base text-slate-800 dark:text-slate-100 leading-loose whitespace-pre-line select-text">\${p.text}</p>
                    </div>
                    <button onclick="closeModal(); markPrayerDone();" class="w-full py-3.5 mariana-gradient text-white rounded-xl text-xs font-bold shadow-md transition hover:scale-105 cursor-pointer">🙏 Rezei esta oração (+10 XP)</button>
                </div>
            \`;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }`;

content = content.replace(/\r\n/g, '\n');
if (content.includes(oldModal)) {
    content = content.replace(oldModal, newModal);
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log('✓ openPrayerModal updated with dark mode and beautiful design!');
} else {
    console.error('! Failed to find oldModal in index.html');
}
