/**
 * MOTOR LITÚRGICO & CÁLCULOS ASTRONÔMICOS DEVOCIONAIS
 * THESAURUS NOVENARUM — CATECISMO
 * 
 * Regras Litúrgicas Católicas:
 * 1. Algoritmo Astronômico de Meeus/Jones/Butcher para cálculo da Páscoa Gregoriana.
 * 2. Cálculo dinâmico das Festas Móveis (Sexta-feira Santa, Divina Misericórdia, Pentecostes).
 * 3. Cálculo das Novenas de Datas Fixas (Festa - 9 dias).
 * 4. Identificação de status em tempo real (em_andamento, dia 1-9, em_breve, festa_hoje, concluída).
 */

/**
 * Algoritmo Meeus/Jones/Butcher para cálculo da Páscoa Católica Gregoriana
 * @param {number} year - Ano civil (ex: 2026)
 * @returns {Date} Data da Páscoa ao meio-dia UTC
 */
export function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = Março, 4 = Abril
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

/**
 * Adiciona ou subtrai dias de uma data UTC com segurança
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

/**
 * Formata data para string ISO 'YYYY-MM-DD'
 */
export function toISODate(date) {
    if (!date) return '';
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Converte string 'YYYY-MM-DD' ou Date para objeto Date ao meio-dia UTC
 */
export function parseToUTCDate(input) {
    if (!input) return new Date();
    if (input instanceof Date) {
        return new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getDate(), 12, 0, 0));
    }
    if (typeof input === 'string') {
        const parts = input.split('T')[0].split('-');
        if (parts.length === 3) {
            return new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12, 0, 0));
        }
    }
    return new Date();
}

/**
 * Calcula a diferença em dias entre duas datas (Data2 - Data1)
 */
export function diffDays(date1, date2) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate());
    const utc2 = Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate());
    return Math.round((utc2 - utc1) / msPerDay);
}

/**
 * Calcula as datas da novena para um determinado ano civil
 * @param {Object} novena - Definição da novena do JSON
 * @param {number} year - Ano civil (ex: 2026)
 * @returns {Object} { startDate, endDate, feastDate, startISO, endISO, feastISO }
 */
export function calculateNovenaSchedule(novena, year) {
    if (novena.tipo === 'atemporal') {
        return {
            isAtemporal: true,
            startDate: null,
            endDate: null,
            feastDate: null,
            startISO: null,
            endISO: null,
            feastISO: null
        };
    }

    let feastDate;
    let startDate;

    if (novena.tipo === 'movel') {
        const easter = getEasterDate(year);
        if (novena.calculo_inicio?.base === 'pascoa') {
            const offsetInicio = Number(novena.calculo_inicio.offset_dias_inicio ?? 0);
            const offsetFesta = Number(novena.calculo_inicio.offset_dias_festa ?? 0);
            startDate = addDays(easter, offsetInicio);
            feastDate = addDays(easter, offsetFesta);
        } else {
            startDate = addDays(easter, -2);
            feastDate = addDays(easter, 7);
        }
    } else {
        // Novena Fixa (Festa - 9 dias)
        const mes = Number(novena.festa_liturgica.mes);
        const dia = Number(novena.festa_liturgica.dia);
        feastDate = new Date(Date.UTC(year, mes - 1, dia, 12, 0, 0));
        startDate = addDays(feastDate, -9);
    }

    // O 9º dia é sempre 8 dias após o início (início = Dia 1)
    const endDate = addDays(startDate, 8);

    return {
        isAtemporal: false,
        year,
        startDate,
        endDate,
        feastDate,
        startISO: toISODate(startDate),
        endISO: toISODate(endDate),
        feastISO: toISODate(feastDate)
    };
}

/**
 * Avalia o status em tempo real de uma novena para uma data de referência
 * @param {Object} novena 
 * @param {Date|string} referenceDate - Data atual (opcional, padrão: hoje)
 * @returns {Object} Informações de status completas
 */
export function evaluateNovenaStatus(novena, referenceDate = new Date()) {
    const todayUTC = parseToUTCDate(referenceDate);
    const currentYear = todayUTC.getUTCFullYear();
    const todayISO = toISODate(todayUTC);

    if (novena.tipo === 'atemporal') {
        return {
            id: novena.id,
            titulo: novena.titulo,
            tipo: 'atemporal',
            status: 'atemporal',
            statusLabel: 'Devoção Contínua',
            statusBadge: 'Atemporal',
            currentDay: null,
            daysUntilStart: 0,
            startISO: null,
            endISO: null,
            feastISO: null,
            isToday: false
        };
    }

    // Avalia para o ano atual
    let schedule = calculateNovenaSchedule(novena, currentYear);

    // Se a festa deste ano já passou há mais de 30 dias, calcula também o início do próximo ano para contagem regressiva
    if (todayISO > schedule.feastISO) {
        const nextYearSchedule = calculateNovenaSchedule(novena, currentYear + 1);
        const daysToNext = diffDays(todayUTC, nextYearSchedule.startDate);
        if (daysToNext > 0 && daysToNext <= 60) {
            schedule = nextYearSchedule;
        }
    }

    const startISO = schedule.startISO;
    const endISO = schedule.endISO;
    const feastISO = schedule.feastISO;

    // 1. Em andamento (Dia 1 ao Dia 9)
    if (todayISO >= startISO && todayISO <= endISO) {
        const currentDay = diffDays(schedule.startDate, todayUTC) + 1;
        return {
            id: novena.id,
            titulo: novena.titulo,
            tipo: novena.tipo,
            status: 'em_andamento',
            statusLabel: `Em Andamento: Dia ${currentDay} de 9`,
            statusBadge: `Dia ${currentDay}/9`,
            currentDay,
            daysRemaining: 9 - currentDay,
            startISO,
            endISO,
            feastISO,
            isToday: true,
            schedule
        };
    }

    // 2. Dia da Festa Litúrgica (após o 9º dia)
    if (todayISO === feastISO) {
        return {
            id: novena.id,
            titulo: novena.titulo,
            tipo: novena.tipo,
            status: 'festa_hoje',
            statusLabel: 'Solenidade / Festa Litúrgica Hoje!',
            statusBadge: 'Festa Hoje',
            currentDay: 9,
            daysRemaining: 0,
            startISO,
            endISO,
            feastISO,
            isToday: true,
            schedule
        };
    }

    // 3. Em breve (começa nos próximos 30 dias)
    if (todayISO < startISO) {
        const daysUntil = diffDays(todayUTC, schedule.startDate);
        return {
            id: novena.id,
            titulo: novena.titulo,
            tipo: novena.tipo,
            status: daysUntil <= 30 ? 'em_breve' : 'futura',
            statusLabel: daysUntil === 1 ? 'Começa amanhã!' : `Começa em ${daysUntil} dias (${schedule.startDate.getUTCDate()}/${schedule.startDate.getUTCMonth() + 1})`,
            statusBadge: daysUntil === 1 ? 'Amanhã' : `Em ${daysUntil}d`,
            currentDay: null,
            daysUntilStart: daysUntil,
            startISO,
            endISO,
            feastISO,
            isToday: false,
            schedule
        };
    }

    // 4. Já concluída neste ano
    const daysPast = diffDays(schedule.feastDate, todayUTC);
    return {
        id: novena.id,
        titulo: novena.titulo,
        tipo: novena.tipo,
        status: 'concluida',
        statusLabel: `Concluída em ${schedule.feastDate.getUTCDate()}/${schedule.feastDate.getUTCMonth() + 1}`,
        statusBadge: 'Concluída',
        currentDay: null,
        daysUntilStart: null,
        daysPast,
        startISO,
        endISO,
        feastISO,
        isToday: false,
        schedule
    };
}

/**
 * Retorna a lista de todas as novenas ativas no dia de hoje
 */
export function getActiveNovenas(novenasList = [], referenceDate = new Date()) {
    return novenasList
        .map(novena => evaluateNovenaStatus(novena, referenceDate))
        .filter(item => item.status === 'em_andamento' || item.status === 'festa_hoje');
}

/**
 * Retorna as próximas novenas que vão iniciar (ordenadas cronologicamente)
 */
export function getUpcomingNovenas(novenasList = [], referenceDate = new Date(), limit = 3) {
    return novenasList
        .map(novena => evaluateNovenaStatus(novena, referenceDate))
        .filter(item => item.status === 'em_breve' || item.status === 'futura')
        .sort((a, b) => (a.daysUntilStart ?? 999) - (b.daysUntilStart ?? 999))
        .slice(0, limit);
}

/**
 * Formata uma data para o padrão litúrgico brasileiro: '22 de Setembro'
 */
export function formatLiturgicalDate(dateOrISO) {
    if (!dateOrISO) return '';
    const d = parseToUTCDate(dateOrISO);
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${d.getUTCDate()} de ${months[d.getUTCMonth()]}`;
}

const LiturgicalEngine = {
    getEasterDate,
    addDays,
    toISODate,
    parseToUTCDate,
    diffDays,
    calculateNovenaSchedule,
    evaluateNovenaStatus,
    getActiveNovenas,
    getUpcomingNovenas,
    formatLiturgicalDate
};

if (typeof globalThis !== 'undefined') {
    globalThis.LiturgicalEngine = LiturgicalEngine;
}

export default LiturgicalEngine;
