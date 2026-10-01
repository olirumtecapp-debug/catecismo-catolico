import fs from 'fs';
import path from 'path';

const enginePath = path.resolve('services/liturgicalEngine.js');
let code = fs.readFileSync(enginePath, 'utf8').replace(/\r\n/g, '\n');

const adventFns = `
/**
 * Calcula o calendário litúrgico perpétuo do Advento para qualquer ano civil (2026, 2027, 2028...)
 * Regra Canônica Católica: O 1º Domingo do Advento é o 4º domingo que antecede o Natal (25 de Dezembro).
 * @param {number} year - Ano civil
 * @returns {Object} { year, startDate, endDate, christmasDate, startISO, endISO, christmasISO, totalDays }
 */
export function getAdventSchedule(year) {
    const y = Number(year) || new Date().getFullYear();
    const christmas = new Date(Date.UTC(y, 11, 25, 12, 0, 0));
    const dayOfWeek = christmas.getUTCDay();
    const daysBeforeChristmas = dayOfWeek === 0 ? 28 : (dayOfWeek + 21);
    
    const adventStart = new Date(christmas);
    adventStart.setUTCDate(christmas.getUTCDate() - daysBeforeChristmas);
    
    const adventEnd = new Date(christmas);
    adventEnd.setUTCDate(christmas.getUTCDate() - 1); // 24 de dezembro
    
    const totalDays = diffDays(adventStart, adventEnd) + 1;

    return {
        year: y,
        startDate: adventStart,
        endDate: adventEnd,
        christmasDate: christmas,
        startISO: toISODate(adventStart),
        endISO: toISODate(adventEnd),
        christmasISO: toISODate(christmas),
        totalDays
    };
}

/**
 * Avalia o status litúrgico do Advento para uma data específica
 * @param {Date|string} dateInput - Data a avaliar
 * @returns {Object} { isActive, isBefore, isAfter, currentDay, currentWeek, totalDays, daysUntilStart, schedule }
 */
export function getAdventStatus(dateInput) {
    const today = parseToUTCDate(dateInput);
    const year = today.getUTCFullYear();
    const schedule = getAdventSchedule(year);
    
    const diffStart = diffDays(schedule.startDate, today);
    const diffEnd = diffDays(today, schedule.endDate);
    
    const isActive = (diffStart >= 0 && diffEnd >= 0);
    const currentDay = isActive ? (diffStart + 1) : null;
    
    // Determinar a semana litúrgica (1, 2, 3 ou 4)
    let currentWeek = null;
    if (isActive) {
        currentWeek = Math.min(4, Math.floor(diffStart / 7) + 1);
    }
    
    return {
        isActive,
        isBefore: diffStart < 0,
        isAfter: diffEnd < 0,
        currentDay,
        currentWeek,
        totalDays: schedule.totalDays,
        daysUntilStart: diffStart < 0 ? Math.abs(diffStart) : 0,
        schedule
    };
}
`;

const oldLiturgicalEngineObj = `const LiturgicalEngine = {
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
};`;

const newLiturgicalEngineObj = `const LiturgicalEngine = {
    getEasterDate,
    addDays,
    toISODate,
    parseToUTCDate,
    diffDays,
    calculateNovenaSchedule,
    evaluateNovenaStatus,
    getActiveNovenas,
    getUpcomingNovenas,
    formatLiturgicalDate,
    getAdventSchedule,
    getAdventStatus
};`;

if (!code.includes('getAdventSchedule')) {
    code = code.replace(oldLiturgicalEngineObj, adventFns + '\n' + newLiturgicalEngineObj);
    fs.writeFileSync(enginePath, code, 'utf8');
    console.log('✓ services/liturgicalEngine.js atualizado com o Motor Litúrgico Perpétuo do Advento!');
} else {
    console.log('= services/liturgicalEngine.js já continha as funções do Advento');
}
