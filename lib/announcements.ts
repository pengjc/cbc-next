import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Announcement {
  id: number;
  date: string;
  title: string;
  content: string;
  type: 'important' | 'update' | 'info';
  slug: string;
}

const announcementsDirectory = path.join(process.cwd(), 'content/announcements');

export function getAllAnnouncements(): Announcement[] {
  const fileNames = fs.readdirSync(announcementsDirectory);
  const allAnnouncements = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(announcementsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        id: data.id,
        date: data.date,
        title: data.title,
        content: content.trim(),
        type: data.type,
        slug,
      };
    });

  // Sort by date (newest first)
  return allAnnouncements.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getTopAnnouncements(count: number = 3): Announcement[] {
  const allAnnouncements = getAllAnnouncements();
  return allAnnouncements.slice(0, count);
}
