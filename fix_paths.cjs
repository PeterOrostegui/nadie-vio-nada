const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Add import if not exists
    const importStmt = "import { asset } from './utils';\n";
    // For nested files like src/components/..., we might need '../utils' but all our files are directly in src/
    
    let changed = false;

    // Fix src="/filename.png" -> src={asset('filename.png')}
    content = content.replace(/src="\/([^"]+\.[a-zA-Z0-9]+)"/g, (match, p1) => {
        changed = true;
        return `src={asset('${p1}')}`;
    });

    // Fix src={`/filename.png`} -> src={asset(`filename.png`)}
    content = content.replace(/src=\{\`\/([^\`]+)\`\}/g, (match, p1) => {
        changed = true;
        return `src={asset(\`${p1}\`)}`;
    });

    // Fix new Audio('/sounds/...') -> new Audio(asset('sounds/...'))
    content = content.replace(/new Audio\('\/([^']+)'\)/g, (match, p1) => {
        changed = true;
        return `new Audio(asset('${p1}'))`;
    });

    // Fix useTexture('/tablero_bg.jpg') -> useTexture(asset('tablero_bg.jpg'))
    content = content.replace(/useTexture\('\/([^']+)'\)/g, (match, p1) => {
        changed = true;
        return `useTexture(asset('${p1}'))`;
    });

    // Fix 'url(/dorso_evento.png)' -> `url(${asset('dorso_evento.png')})`
    content = content.replace(/'url\(\/([^)]+)\)'/g, (match, p1) => {
        changed = true;
        return `\`url(\${asset('${p1}')})\``;
    });

    // Check if we need to add the import
    if (changed && !content.includes('import { asset }')) {
        // Find the last import statement
        const importMatches = [...content.matchAll(/^import .*;?$/gm)];
        if (importMatches.length > 0) {
            const lastMatch = importMatches[importMatches.length - 1];
            const insertIndex = lastMatch.index + lastMatch[0].length;
            content = content.slice(0, insertIndex) + '\n' + importStmt + content.slice(insertIndex);
        } else {
            content = importStmt + content;
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

fs.readdirSync(srcDir).forEach(file => {
    if (file.endsWith('.jsx')) {
        fixFile(path.join(srcDir, file));
    }
});
