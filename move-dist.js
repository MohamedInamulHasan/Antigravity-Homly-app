import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, 'Homly-App-Clean', 'dist');
const dest = path.join(__dirname, 'dist');

console.log(`Starting Move: ${source} -> ${dest}`);

try {
    if (fs.existsSync(dest)) {
        console.log('Cleaning destination...');
        fs.rmSync(dest, { recursive: true, force: true });
    }
    fs.mkdirSync(dest);

    if (!fs.existsSync(source)) {
        console.error(`ERROR: Source directory not found: ${source}`);
        console.error('Did the build fail?');
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
            console.log(`Copying file: ${path.basename(src)}`);
            fs.copyFileSync(src, destPath);
        }
    }

    copyRecursiveSync(source, dest);
    console.log('SUCCESS: Build moved to root dist folder.');

    // Create a vercel.json for serving if it doesn't exist or needs forcing
    // (Actually handled by repo file, but good to know we are set)

} catch (err) {
    console.error('FAILED to move files:', err);
    process.exit(1);
}
