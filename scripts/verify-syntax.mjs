import fs from 'fs';
import vm from 'vm';

function checkHtmlScripts(filePath) {
    console.log(`Verificando scripts em: ${filePath}`);
    const html = fs.readFileSync(filePath, 'utf8');
    const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
    let match;
    let index = 0;
    let errors = 0;

    while ((match = scriptRegex.exec(html)) !== null) {
        index++;
        const fullTag = match[0];
        const isModule = /type=["']module["']/i.test(fullTag);
        const code = match[1].trim();
        if (!code) continue;
        
        try {
            if (isModule) {
                new vm.SourceTextModule(code, { identifier: `${filePath}#script_${index}` });
            } else {
                new vm.Script(code, { filename: `${filePath}#script_${index}` });
            }
            console.log(`  ✓ Script inline #${index} (${isModule ? 'module' : 'classic'}) válido (${code.length} bytes)`);
        } catch (err) {
            console.error(`  ✗ Erro no script inline #${index}:`, err.message);
            errors++;
        }
    }

    if (errors === 0) {
        console.log(`=> Todos os scripts inline em ${filePath} são 100% válidos!\n`);
    } else {
        console.error(`=> Foram encontrados ${errors} erros em ${filePath}!\n`);
        process.exit(1);
    }
}

checkHtmlScripts('D:/Catecismo/index.html');
checkHtmlScripts('D:/Catecismo/novenas.html');
checkHtmlScripts('D:/Catecismo/assets/data/santos_images_index.js');
