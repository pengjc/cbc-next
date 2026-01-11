const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const announcementsDir = path.join(__dirname, '../content/announcements');
const outputFile = path.join(__dirname, '../content/announcements-compiled.json');

function compileAnnouncements() {
  const files = fs.readdirSync(announcementsDir);
  
  const announcements = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.md$/, '');
      const fullPath = path.join(announcementsDir, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id: data.id,
        date: data.date,
        title: data.title,
        content: marked(content.trim()),
        type: data.type,
        slug,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(outputFile, JSON.stringify(announcements, null, 2));
  console.log(`✅ Compiled ${announcements.length} announcements to ${outputFile}`);
}

compileAnnouncements();
