const fs = require('fs');
const path = require('path');

const dataDir = 'd:\\GUNAWAN\\S2\\Website\\extracted_data';
const outputDir = 'd:\\GUNAWAN\\S2\\Website';

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

files.forEach((file, index) => {
    const moduleNum = index + 1;
    const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const title = file.replace(/^\d+_/, '').replace('.json', '').replace(/-/g, ' ');

    let sectionsHtml = '';
    content.forEach((slide, sIdx) => {
        if (sIdx === 0) return; // Skip title slide as it's usually the main header
        
        let text = slide.text;
        // Basic cleanup and formatting
        // If it looks like code, wrap it
        if (text.includes('import ') || text.includes('cv2.') || text.includes('plt.')) {
            // Try to split text and code
            const codeParts = text.match(/[a-zA-Z0-9_]+\s*=\s*[^;]+|import\s+[a-zA-Z0-9_]+|from\s+.+\s+import\s+.+/g);
            if (codeParts) {
                // This is a very basic heuristic, but good for a demo
                sectionsHtml += `
                <div class="slide-block">
                    <h3>Slide ${sIdx + 1}</h3>
                    <div class="code-block">${text.replace(/&quot;/g, '"').replace(/&apos;/g, "'")}</div>
                </div>`;
                return;
            }
        }

        sectionsHtml += `
        <div class="slide-block">
            <h3>Slide ${sIdx + 1}</h3>
            <p>${text}</p>
        </div>`;
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module ${moduleNum}: ${title} | Advanced CV</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="bg-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
    </div>

    <header>
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <a href="index.html" class="logo">ADVANCED CV</a>
            <nav>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="index.html#modules">Modules</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="module-layout">
            <aside class="sidebar">
                <h4>Course Modules</h4>
                <ul class="sidebar-nav">
                    <li><a href="module-1.html" class="${moduleNum === 1 ? 'active' : ''}">01. Introduction</a></li>
                    <li><a href="module-2.html" class="${moduleNum === 2 ? 'active' : ''}">02. Digital Image</a></li>
                    <li><a href="module-3.html" class="${moduleNum === 3 ? 'active' : ''}">03. Filtering</a></li>
                    <li><a href="module-4.html" class="${moduleNum === 4 ? 'active' : ''}">04. ANN Basics</a></li>
                    <li><a href="module-5.html" class="${moduleNum === 5 ? 'active' : ''}">05. Advanced ML</a></li>
                    <li><a href="module-6.html" class="${moduleNum === 6 ? 'active' : ''}">06. CNN</a></li>
                    <li><a href="module-7.html" class="${moduleNum === 7 ? 'active' : ''}">07. Applications</a></li>
                    <li><a href="module-8.html" class="${moduleNum === 8 ? 'active' : ''}">08. Frameworks</a></li>
                </ul>
            </aside>

            <article class="content-section">
                <p style="color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Module ${moduleNum}</p>
                <h2>${title}</h2>
                <div class="module-content">
                    ${sectionsHtml}
                </div>
                
                <div style="margin-top: 4rem; display: flex; justify-content: space-between;">
                    ${moduleNum > 1 ? `<a href="module-${moduleNum - 1}.html" style="color: var(--primary); text-decoration: none;">&larr; Previous Module</a>` : '<span></span>'}
                    ${moduleNum < 8 ? `<a href="module-${moduleNum + 1}.html" style="color: var(--primary); text-decoration: none;">Next Module &rarr;</a>` : '<span></span>'}
                </div>
            </article>
        </div>
    </main>

    <footer style="padding: 4rem 0; border-top: 1px solid var(--glass-border); text-align: center; margin-top: 4rem;">
        <p style="color: var(--text-dim);">&copy; 2026 Advanced Computer Vision Portal.</p>
    </footer>

    <script src="main.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(outputDir, `module-${moduleNum}.html`), html);
});

console.log('Modules generated.');
