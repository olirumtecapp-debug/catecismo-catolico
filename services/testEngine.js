import engine from './liturgicalEngine.js';

console.log("=== TESTE DO MOTOR LITÚRGICO ===");

const easter2026 = engine.getEasterDate(2026);
console.log("Páscoa 2026:", engine.toISODate(easter2026));

const santaTeresinha = {
    id: "santa-teresinha",
    titulo: "Novena a Santa Teresinha do Menino Jesus",
    tipo: "fixa",
    festa_liturgica: { mes: 10, dia: 1 }
};

const statusHoje = engine.evaluateNovenaStatus(santaTeresinha, "2026-09-22");
console.log("\nStatus de Santa Teresinha em 22/09/2026 (HOJE):", statusHoje);

if (statusHoje.status === 'em_andamento' && statusHoje.currentDay === 1) {
    console.log("✅ SUCESSO: Hoje 22/09 foi exatamente identificado como DIA 1 da Novena de Santa Teresinha!");
} else {
    console.error("❌ FALHA no cálculo do dia 1 de Santa Teresinha");
}

const aparecida = {
    id: "ns-aparecida",
    titulo: "Novena de Nossa Senhora Aparecida",
    tipo: "fixa",
    festa_liturgica: { mes: 10, dia: 12 }
};
const statusAparecida = engine.evaluateNovenaStatus(aparecida, "2026-09-22");
console.log("\nStatus de Aparecida em 22/09/2026:", statusAparecida.statusLabel, "dias até iniciar:", statusAparecida.daysUntilStart);

const geraldo = {
    id: "sao-geraldo-magela",
    titulo: "Novena de São Geraldo Magela",
    tipo: "fixa",
    festa_liturgica: { mes: 10, dia: 16 }
};
const statusGeraldo = engine.evaluateNovenaStatus(geraldo, "2026-09-22");
console.log("\nStatus de São Geraldo em 22/09/2026:", statusGeraldo.statusLabel, "Início:", statusGeraldo.startISO);

const edwiges = {
    id: "santa-edwiges",
    titulo: "Novena de Santa Edwiges",
    tipo: "fixa",
    festa_liturgica: { mes: 10, dia: 16 }
};
const statusEdwiges = engine.evaluateNovenaStatus(edwiges, "2026-09-22");
console.log("\nStatus de Santa Edwiges em 22/09/2026:", statusEdwiges.statusLabel, "Início:", statusEdwiges.startISO);

const luzia = {
    id: "santa-luzia",
    titulo: "Novena de Santa Luzia",
    tipo: "fixa",
    festa_liturgica: { mes: 12, dia: 13 }
};
const statusLuzia = engine.evaluateNovenaStatus(luzia, "2026-09-22");
console.log("\nStatus de Santa Luzia em 22/09/2026:", statusLuzia.statusLabel, "Início:", statusLuzia.startISO);
