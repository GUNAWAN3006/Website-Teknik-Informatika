const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const websiteDir = 'd:\\GUNAWAN\\S2\\Website';
const outputDir = path.join(websiteDir, 'extracted_data');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const pptFiles = fs.readdirSync(websiteDir).filter(f => f.endsWith('.pptx'));

pptFiles.forEach(file => {
    console.log(`Processing ${file}...`);
    const fileName = path.parse(file).name;
    const tempZip = path.join(websiteDir, `${fileName}.zip`);
    const extractPath = path.join(websiteDir, `temp_${fileName}`);

    // Copy to zip
    fs.copyFileSync(path.join(websiteDir, file), tempZip);

    // Extract
    try {
        if (fs.existsSync(extractPath)) {
            fs.rmSync(extractPath, { recursive: true, force: true });
        }
        execSync(`powershell -Command "Expand-Archive -Path '${tempZip}' -DestinationPath '${extractPath}'"`);
    } catch (err) {
        console.error(`Error extracting ${file}: ${err.message}`);
    }

    // Read slides
    const slidesDir = path.join(extractPath, 'ppt', 'slides');
    if (fs.existsSync(slidesDir)) {
        const slides = fs.readdirSync(slidesDir).filter(f => f.endsWith('.xml') && !f.startsWith('_'));
        // Sort slides by number
        slides.sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0]);
            const numB = parseInt(b.match(/\d+/)[0]);
            return numA - numB;
        });

        let allContent = [];
        slides.forEach(slideFile => {
            const xml = fs.readFileSync(path.join(slidesDir, slideFile), 'utf8');
            const textMatches = xml.match(/<a:t>([^<]+)<\/a:t>/g);
            if (textMatches) {
                const slideText = textMatches.map(m => m.replace(/<\/?a:t>/g, '')).join(' ');
                allContent.push({
                    slide: slideFile,
                    text: slideText
                });
            }
        });

        fs.writeFileSync(path.join(outputDir, `${fileName}.json`), JSON.stringify(allContent, null, 2));
    }

    // Cleanup
    fs.unlinkSync(tempZip);
    fs.rmSync(extractPath, { recursive: true, force: true });
});

console.log('Extraction complete.');
