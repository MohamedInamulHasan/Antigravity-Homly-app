import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceBase = path.join(__dirname, 'Homly-App-Clean');
const source = path.join(sourceBase, 'dist');
const dest = path.join(__dirname, 'dist');

console.log(`[INFO] Current Directory: ${__dirname}`);
console.log(`[INFO] Source Base: ${sourceBase}`);
console.log(`[INFO] Target Source: ${source}`);
console.log(`[INFO] Destination: ${dest}`);

try {
    if (fs.existsSync(dest)) {
        console.log('[ACTION] Cleaning destination...');
        fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.mkdirSync(dest);

    if (!fs.existsSync(source)) {
        console.error(`[ERROR] Source directory not found: ${source}`);
        console.log('[DEBUG] Listing contents of Homly-App-Clean:');
        try {
            const files = fs.readdirSync(sourceBase);
            console.log(files.join('\n'));
        } catch (dirErr) {
            console.error(`[CRITICAL] Could not read Homly-App-Clean: ${dirErr.message}`);
        }
        process.exit(1);
    }

    // Recursive copy function
    function copyRecursiveSync(src, destPath) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
            fs.readdirSync(src).forEach(childItemName => {
                copyRecursiveSync(path.join(src, childItemName), path.join(destPath, childItemName));
            });
        } else {
            console.log(`[COPY] ${path.basename(src)}`);
            fs.copyFileSync(src, destPath);
        }
    }

    copyRecursiveSync(source, dest);
    console.log('[SUCCESS] Build output successfully moved to root dist folder.');

} catch (err) {
    console.error('[FATAL] Script execution failed:', err);
    process.exit(1);
}
