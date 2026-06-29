const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
    // Backgrounds
    { regex: /(background|backgroundColor|background-color):\s*['"]?(#ffffff|#fff|#FFF|#FFFFFF|white)['"]?/g, replace: '$1: var(--card-bg)' },
    { regex: /(background|backgroundColor|background-color):\s*['"]?(#f8f8f7|#F8F8F7)['"]?/g, replace: '$1: var(--bg)' },
    { regex: /(background|backgroundColor|background-color):\s*['"]?(#f3f4f6|#f9fafb)['"]?/g, replace: '$1: var(--bg-secondary)' },

    // Texts
    { regex: /color:\s*['"]?(#1c1917|#1C1917|#222222|#222|#000|#000000|black)['"]?/g, replace: 'color: var(--text-heading)' },
    { regex: /color:\s*['"]?(#44403c|#44403C|#57534e|#57534E|#5f5f5f|#5F5F5F|#333|#333333)['"]?/g, replace: 'color: var(--text-body)' },
    { regex: /color:\s*['"]?(#78716c|#78716C|#8a8179|#8A8179|#a8a29e|#A8A29E|#666|#666666|#999|#999999)['"]?/g, replace: 'color: var(--text-muted)' },

    // Borders
    { regex: /border:\s*['"]?1px solid (#e5e7eb|#e7e3df|#E7E3DF|#e2e8f0)['"]?/g, replace: 'border: 1px solid var(--border)' },
    { regex: /border:\s*['"]?1px solid (#f3f4f6|#f2efeb|#F2EFEB)['"]?/g, replace: 'border: 1px solid var(--border-light)' },
    { regex: /border-color:\s*['"]?(#e5e7eb|#e7e3df|#E7E3DF)['"]?/g, replace: 'border-color: var(--border)' },
    { regex: /border-bottom:\s*['"]?1px solid (#e5e7eb|#e7e3df|#E7E3DF|#f2efeb|#F2EFEB)['"]?/g, replace: 'border-bottom: 1px solid var(--border-light)' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directoryPath);
let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(r => {
        content = content.replace(r.regex, (match, p1) => {
            if (r.replace.includes('$1')) {
                return r.replace.replace('$1', p1);
            }
            return r.replace;
        });
    });

    // Special cases for Recharts axes and labels where stroke is hardcoded
    content = content.replace(/stroke=['"]?#1C1917['"]?/gi, 'stroke="var(--text-heading)"');
    content = content.replace(/stroke=['"]?#57534E['"]?/gi, 'stroke="var(--text-body)"');
    content = content.replace(/stroke=['"]?#78716C['"]?/gi, 'stroke="var(--text-muted)"');
    content = content.replace(/fill=['"]?#1C1917['"]?/gi, 'fill="var(--text-heading)"');
    content = content.replace(/fill=['"]?#57534E['"]?/gi, 'fill="var(--text-body)"');
    content = content.replace(/fill=['"]?#78716C['"]?/gi, 'fill="var(--text-muted)"');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        modifiedCount++;
    }
});

console.log(`Total files modified: ${modifiedCount}`);
