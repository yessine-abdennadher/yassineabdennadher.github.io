const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, 'docs');
const indexPath = path.join(docsPath, 'index.html');
const notFoundPath = path.join(docsPath, '404.html');
const nojekyllPath = path.join(docsPath, '.nojekyll');

// 1. Crée .nojekyll (fichier vide) pour empêcher GitHub Pages de traiter le site avec Jekyll
fs.writeFileSync(nojekyllPath, '');
console.log('.nojekyll créé');

// 2. Copie index.html en 404.html pour gérer le routing Angular (évite le 404 sur les routes directes)
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('404.html créé à partir de index.html');
} else {
  console.error('index.html introuvable dans docs/ — le build a-t-il bien tourné ?');
  process.exit(1);
}