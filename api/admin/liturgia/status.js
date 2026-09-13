import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        const root = process.cwd();
        const litDir = path.join(root, 'data', 'liturgia');
        const result = {};
        const currentYear = new Date().getFullYear();
        const yearsToCheck = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];

        yearsToCheck.forEach(y => {
            const yDir = path.join(litDir, String(y));
            const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
            const expected = isLeap ? 366 : 365;

            if (fs.existsSync(yDir)) {
                const files = fs.readdirSync(yDir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
                result[y] = {
                    year: y,
                    count: files.length,
                    expected,
                    complete: files.length >= expected,
                    status: files.length >= expected ? 'Completo' : `${files.length}/${expected} dias`
                };
            } else {
                result[y] = {
                    year: y,
                    count: 0,
                    expected,
                    complete: false,
                    status: 'Pendente'
                };
            }
        });

        return res.status(200).json({
            success: true,
            years: result,
            currentYear,
            isUpdating: false
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
