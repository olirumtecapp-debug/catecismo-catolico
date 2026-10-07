import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const targetStr = '<div class="w-13 h-13 rounded-2xl overflow-hidden bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-700 shadow-xs shrink-0 flex items-center justify-center">';

const replacementStr = '<div class="w-14 h-14 min-w-[56px] max-w-[56px] h-[56px] max-h-[56px] rounded-2xl overflow-hidden bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-700 shadow-xs shrink-0 flex items-center justify-center relative">';

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replacementStr);
    console.log('Container class fixed!');
} else {
    console.warn('Target container string not found!');
}

// Garante style inline rígido na tag <img> para impedir que a imagem original de 1000px expanda o layout
const oldImg = '${full.imagem ? `<img src="${full.imagem}" alt="${full.titulo}" class="w-full h-full object-cover">`';
const newImg = '${full.imagem ? `<img src="${full.imagem}" alt="${full.titulo}" style="width:56px;height:56px;min-width:56px;max-width:56px;min-height:56px;max-height:56px;object-fit:cover;display:block;border-radius:14px;">`';

if (html.includes(oldImg)) {
    html = html.replace(oldImg, newImg);
    console.log('Image tag inline style fixed!');
} else {
    console.warn('oldImg string not found!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully!');
