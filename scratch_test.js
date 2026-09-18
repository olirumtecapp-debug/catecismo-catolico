if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
        }
    

        /* =========================================================================
           MOTOR DO MAPA MUNDIAL, CATÁLOGO E MODAL DOS SANTOS (PORTUGUÊS)
           ========================================================================= */
        let saintsLeafletMap = null;
        let currentSaintsViewMode = 'today';
        let selectedCenturyFilter = 'Todos';
        let selectedCausaFilter = null;
        let currentCatalogPage = 1;
        const CATALOG_PAGE_SIZE = 24;
        let activeModalSaint = null;

        function setSaintsViewMode(mode) {
            currentSaintsViewMode = mode;
            ['today', 'catalog', 'map'].forEach(m => {
                const panel = document.getElementById(`saints-mode-${m}`);
                const tab = document.getElementById(`saints-tab-${m}`);
                if (panel) panel.classList.toggle('hidden', m !== mode);
                if (tab) {
                    if (m === mode) {
                        tab.className = "px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all bg-mariana text-white shadow-sm flex items-center gap-2 whitespace-nowrap";
                    } else {
                        tab.className = "px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-slate-600 dark:text-slate-300 hover:text-mariana hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 whitespace-nowrap";
                    }
                }
            });

            if (mode === 'catalog') {
                renderCenturyChips();
                renderCausaChips();
                filterSaintsCatalog();
            }
            if (mode === 'map') {
                setTimeout(() => {
                    initSaintsMap();
                    if (saintsLeafletMap) saintsLeafletMap.invalidateSize();
                }, 150);
            }
        }

        function initSaintsMap() {
            const mapEl = document.getElementById('mapa-santidade');
            if (!mapEl || typeof L === 'undefined') return;

            if (saintsLeafletMap) {
                saintsLeafletMap.invalidateSize();
                return;
            }

            // Centralizado na Europa / Mediterrâneo com zoom adequado
            saintsLeafletMap = L.map('mapa-santidade', {
                center: [42.0, 14.0],
                zoom: 4,
                zoomControl: true,
                attributionControl: true
            });

            // Camadas Confiáveis e Livres (Sem exigência de API Key)
            const esriStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri &mdash; Santuários Católicos',
                maxZoom: 18
            });

            const osmStandard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19
            });

            const esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri &mdash; Satélite',
                maxZoom: 18
            });

            // Ativa camada detalhada de ruas e cidades como padrão
            esriStreet.addTo(saintsLeafletMap);

            // Controle para alternar o estilo do mapa
            L.control.layers({
                "🗺️ Mapa Mundial (Esri)": esriStreet,
                "🌍 OpenStreetMap": osmStandard,
                "🛰️ Satélite (Esri)": esriImagery
            }, null, { position: 'topright' }).addTo(saintsLeafletMap);

            const mapData = (window.SAINTS_DATA && window.SAINTS_DATA.mapSaints) ? window.SAINTS_DATA.mapSaints : [];
            const markers = [];

            const iconSanto = L.divIcon({
                className: 'custom-santo-pin',
                html: '<div style="background: #0284c7; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2.5px solid #f59e0b; box-shadow: 0 4px 10px rgba(0,0,0,0.35); cursor: pointer;">&#9768;</div>',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
                popupAnchor: [0, -18]
            });

            mapData.forEach(santo => {
                if (!santo.lat || !santo.lng) return;

                const popupHtml = `
                    <div style="min-width: 210px; max-width: 250px; padding: 12px; font-family: sans-serif; text-align: left;">
                        ${santo.image ? `<img src="${santo.image}" alt="${santo.name}" style="width: 100%; height: 115px; object-fit: cover; object-position: top; border-radius: 8px; margin-bottom: 8px;" onerror="this.style.display='none'">` : ''}
                        <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #d97706; margin-bottom: 2px;">
                            ${santo.seculo || 'Tradição Católica'} • ${santo.pais || 'Igreja Universal'}
                        </div>
                        <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">
                            ${santo.name}
                        </h4>
                        ${santo.santuario ? `<p style="font-size: 11px; color: #0284c7; font-weight: 600; margin: 0 0 4px 0;">📍 ${santo.santuario}</p>` : ''}
                        ${santo.virtudes ? `<p style="font-size: 11px; color: #64748b; font-style: italic; margin: 0 0 8px 0;">Virtudes: ${santo.virtudes}</p>` : ''}
                        <button onclick="openSaintModal('${santo.id}')" style="display: block; width: 100%; padding: 7px 10px; background: #0f172a; color: #fff; text-align: center; border-radius: 8px; font-size: 11px; font-weight: 700; border: none; cursor: pointer;">
                            Ver Biografia Completa ➔
                        </button>
                    </div>
                `;

                const m = L.marker([santo.lat, santo.lng], { icon: iconSanto })
                    .bindPopup(popupHtml, { maxWidth: 260 });
                markers.push(m);
            });

            if (markers.length > 0) {
                const group = L.featureGroup(markers).addTo(saintsLeafletMap);
                try {
                    saintsLeafletMap.fitBounds(group.getBounds().pad(0.1));
                } catch(e) {}
            }
        }

        // --- CATÁLOGO DE SANTOS ---
        function renderCenturyChips() {
            const container = document.getElementById('saints-century-chips');
            if (!container || !window.SAINTS_DATA?.centuries) return;
            container.innerHTML = window.SAINTS_DATA.centuries.map(c => {
                const active = c.name === selectedCenturyFilter;
                return `<button onclick="selectCenturyFilter('${c.name}')" class="px-3 py-1 rounded-full text-xs font-bold transition ${active ? 'bg-mariana text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">${c.name} (${c.count})</button>`;
            }).join('');
        }

        function renderCausaChips() {
            const container = document.getElementById('saints-causa-chips');
            if (!container || !window.SAINTS_DATA?.patronages) return;
            const allBtn = `<button onclick="selectCausaFilter(null)" class="px-3 py-1 rounded-full text-xs font-bold transition ${selectedCausaFilter === null ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">Todos os Patronatos</button>`;
            container.innerHTML = allBtn + window.SAINTS_DATA.patronages.map(p => {
                const active = p.name === selectedCausaFilter;
                return `<button onclick="selectCausaFilter('${p.name}')" class="px-3 py-1 rounded-full text-xs font-bold transition ${active ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">${p.name} (${p.count})</button>`;
            }).join('');
        }

        function selectCenturyFilter(century) {
            selectedCenturyFilter = century;
            currentCatalogPage = 1;
            renderCenturyChips();
            filterSaintsCatalog();
        }

        function selectCausaFilter(causa) {
            selectedCausaFilter = causa;
            currentCatalogPage = 1;
            renderCausaChips();
            filterSaintsCatalog();
        }

        function filterSaintsCatalog() {
            const grid = document.getElementById('saints-catalog-grid');
            if (!grid || !window.SAINTS_DATA?.catalog) return;

            const searchInp = document.getElementById('saints-search-input');
            const query = (searchInp ? searchInp.value : '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

            let list = window.SAINTS_DATA.catalog;

            // Filtro por Século
            if (selectedCenturyFilter !== 'Todos') {
                list = list.filter(s => s.seculo === selectedCenturyFilter || (s.seculos && s.seculos.includes(selectedCenturyFilter)));
            }

            // Filtro por Causa
            if (selectedCausaFilter) {
                list = list.filter(s => (s.causas && s.causas.includes(selectedCausaFilter)) || s.category === selectedCausaFilter);
            }

            // Filtro por Busca
            if (query) {
                list = list.filter(s => {
                    const norm = (s.name + ' ' + (s.pais || '') + ' ' + (s.virtudes || '') + ' ' + (s.bio || '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    return norm.includes(query);
                });
            }

            const total = list.length;
            const totalPages = Math.ceil(total / CATALOG_PAGE_SIZE) || 1;
            if (currentCatalogPage > totalPages) currentCatalogPage = totalPages;

            const start = (currentCatalogPage - 1) * CATALOG_PAGE_SIZE;
            const paged = list.slice(start, start + CATALOG_PAGE_SIZE);

            if (paged.length === 0) {
                grid.innerHTML = '<div class="col-span-full p-12 text-center text-sm text-slate-400 font-serif">Nenhum santo encontrado para os filtros selecionados.</div>';
            } else {
                grid.innerHTML = paged.map(s => {
                    return `
                        <article class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 card-shadow flex flex-col justify-between transition hover:-translate-y-1">
                            <div>
                                <div class="relative w-full h-56 rounded-2xl overflow-hidden mb-4 border border-amber-200/60 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                    <img src="${s.image}" alt="${s.name}" onerror="handleSaintImageError(this, '${s.name}')" class="w-full h-full object-cover object-top" loading="lazy">
                                    <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold uppercase tracking-wider">${s.seculo || 'Século Sagrado'}</span>
                                </div>
                                <h4 class="font-serif text-lg font-black text-mariana dark:text-slate-100 leading-tight mb-1.5">${s.name}</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-3 font-serif">${s.bio || 'Modelo de santidade, virtude cristã e intercessão diante de Deus.'}</p>
                            </div>
                            <div>
                                <div class="flex flex-wrap gap-1 mb-4">
                                    ${(s.causas || []).slice(0, 2).map(c => `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">${c}</span>`).join('')}
                                </div>
                                <button onclick="openSaintModal('${s.id}')" class="w-full py-2.5 rounded-xl bg-mariana hover:bg-mariana-dark text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5">
                                    <span>Conhecer História</span> <span>➔</span>
                                </button>
                            </div>
                        </article>
                    `;
                }).join('');
            }

            // Paginação
            const pag = document.getElementById('saints-catalog-pagination');
            if (pag) {
                if (totalPages <= 1) {
                    pag.innerHTML = '';
                } else {
                    let pagHtml = `<button onclick="currentCatalogPage--; filterSaintsCatalog();" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold ${currentCatalogPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}" ${currentCatalogPage === 1 ? 'disabled' : ''}>← Anterior</button>`;
                    pagHtml += `<span class="text-xs font-bold text-slate-500 px-3">Página ${currentCatalogPage} de ${totalPages}</span>`;
                    pagHtml += `<button onclick="currentCatalogPage++; filterSaintsCatalog();" class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold ${currentCatalogPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}" ${currentCatalogPage === totalPages ? 'disabled' : ''}>Próxima →</button>`;
                    pag.innerHTML = pagHtml;
                }
            }
        }

        // --- MODAL DO SANTO ---
        function openSaintModal(sId) {
            const all = [...(window.SAINTS_DATA?.catalog || []), ...(window.SAINTS_DATA?.mapSaints || [])];
            const s = all.find(x => x.id === sId || x.slug === sId);
            if (!s) return;

            const modal = document.getElementById('saint-modal');
            if (!modal) return;

            document.getElementById('sm-image').src = s.image || '';
            document.getElementById('sm-name').innerText = s.name || '';
            document.getElementById('sm-date').innerText = (s.seculo || '') + (s.pais ? ' • ' + s.pais : '');
            document.getElementById('sm-meta').innerText = s.virtudes ? 'Virtudes: ' + s.virtudes : '';

            const badges = document.getElementById('sm-badges');
            if (badges) {
                badges.innerHTML = (s.causas || []).map(c => `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">${c}</span>`).join('');
            }

            const bioBox = document.getElementById('sm-bio');
            if (bioBox) {
                if (s.richBio) {
                    bioBox.innerHTML = s.richBio;
                } else {
                    bioBox.innerHTML = `<p class="mb-3 leading-relaxed">${s.bio || 'Biografia venerável guardada na Tradição da Santa Igreja.'}</p>`;
                }
            }

            const prayerBox = document.getElementById('sm-prayer-box');
            const prayerEl = document.getElementById('sm-prayer');
            if (s.oracao || s.prayer) {
                if (prayerBox) prayerBox.classList.remove('hidden');
                if (prayerEl) prayerEl.innerText = s.oracao || s.prayer;
            } else {
                if (prayerBox) prayerBox.classList.add('hidden');
            }

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }

        function closeSaintModal() {
            const modal = document.getElementById('saint-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeSaintModal();
        });