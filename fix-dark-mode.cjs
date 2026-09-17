const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const dirsToScan = ['./src/pages', './src/components/site', './src/components'];
let files = [];
dirsToScan.forEach(dir => {
  if (fs.existsSync(dir)) {
    files = walkSync(dir, files);
  }
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .split('bg-[#0d0d0d]').join('bg-transparent')
    .split('bg-neutral-950').join('bg-transparent')
    .split('bg-[#121212]').join('bg-white dark:bg-[#121212]')
    .split('bg-[#151515]').join('bg-zinc-50 dark:bg-[#151515]')
    .split('text-white').join('text-zinc-900 dark:text-white')
    .split('text-neutral-400').join('text-zinc-600 dark:text-neutral-400')
    .split('text-neutral-300').join('text-zinc-700 dark:text-neutral-300')
    .split('border-white/5').join('border-black/5 dark:border-white/5');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated:', file);
  }
});
