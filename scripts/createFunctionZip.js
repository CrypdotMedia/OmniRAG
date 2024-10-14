import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addFolderToZip(folderPath, zip) {
  const files = fs.readdirSync(folderPath);
  
  for (const file of files) {
    if (file === 'node_modules') continue;
    
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      zip.file(filePath, fs.readFileSync(filePath));
    } else if (stats.isDirectory()) {
      addFolderToZip(filePath, zip.folder(file));
    }
  }
}

// Add src/functions folder to zip
addFolderToZip('src/functions', zip);

// Generate zip file
zip.generateAsync({ type: 'nodebuffer' })
  .then(function(content) {
    fs.writeFileSync('function.zip', content);
    console.log('function.zip created successfully');
  });