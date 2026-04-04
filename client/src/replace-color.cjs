const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;
  content = content.replace(/violet/g, 'blue');
  content = content.replace(/139,92,246/g, '59,130,246');
  content = content.replace(/139, 92, 246/g, '59, 130, 246');
  content = content.replace(/#8B5CF6/gi, '#3B82F6');
  content = content.replace(/#C4B5FD/gi, '#93C5FD');
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced in ${filePath}`);
  }
}

function traversePath(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traversePath(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      replaceInFile(fullPath);
    }
  }
}

traversePath(__dirname);
console.log("Done");
