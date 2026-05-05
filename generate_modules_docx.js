const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const websiteDir = 'd:\\GUNAWAN\\S2\\Website';
const files = [
    "Materi 1 - Pengantar Visi Komputer Lanjutan.docx",
    "Materi 2 - Konsep Dasar Citra Digital dan Manipulasi dengan Python.docx",
    "Materi 3 - Filtering Citra Digital Pemahaman Spasial dan Frekuensi.docx",
    "Materi 4 - Jaringan Saraf Tiruan.docx",
    "Materi 5 - Pembelajaran Mesin Lanjutan dalam Computer Vision.docx",
    "Materi 6 - Convolutional Neural Network.docx",
    "Materi 7 - Advanced Computer Vision.docx",
    "Materi 8 - Kerangka Kerja Pembelajaran Mendalam untuk Visi Komputer.docx"
];

const shortTitles = [
    "01. Introduction",
    "02. Digital Image",
    "03. Filtering",
    "04. ANN Basics",
    "05. Advanced ML",
    "06. CNN",
    "07. Applications",
    "08. Frameworks"
];

async function generateModules() {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const moduleNum = i + 1;
        const filePath = path.join(websiteDir, file);
        const title = file.replace(`Materi ${moduleNum} - `, '').replace('.docx', '');

        console.log(`Processing ${file}...`);
        
        let htmlContent = '';
        try {
            const result = await mammoth.convertToHtml({path: filePath});
            htmlContent = result.value; // The generated HTML
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
            continue;
        }

        let sidebarNav = '';
        for (let j = 0; j < files.length; j++) {
            sidebarNav += `<li><a href="module-${j + 1}.html" class="${moduleNum === (j + 1) ? 'active' : ''}">${shortTitles[j]}</a></li>\n                    `;
        }

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Materi ${moduleNum}: ${title} | Advanced Computer Vision</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="bg-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
    </div>

    <header>
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <a href="index.html" class="logo">ADVANCED COMPUTER VISION</a>
            <nav>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="index.html#modules">Modules</a></li>
                    <li><a href="index.html#about">About</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="module-layout">
            <aside class="sidebar">
                <h4>Course Modules</h4>
                <ul class="sidebar-nav">
                    ${sidebarNav.trim()}
                </ul>
            </aside>

            <article class="content-section">
                <p style="color: var(--primary); font-weight: 600; margin-bottom: 0.5rem;">Materi ${moduleNum}</p>
                <h2>${title}</h2>
                <div class="module-content docx-content">
                    ${htmlContent}
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

        fs.writeFileSync(path.join(websiteDir, `module-${moduleNum}.html`), html);
    }
    console.log('Modules generation using docx complete.');
}

generateModules();
