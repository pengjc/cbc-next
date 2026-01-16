import Link from "next/link";
import allAnnouncements from "@/content/announcements-compiled.json";

export default function AnnouncementsPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0a375d] to-[#1a5080] text-white py-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/"
            className="inline-flex items-center text-white hover:text-[#d4af37] mb-4 transition"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-serif">
            All Announcements
          </h1>
          <p className="text-lg mt-2">
            Stay updated with the latest conference news
          </p>
        </div>
      </header>

      {/* Announcements List */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {allAnnouncements.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p className="text-xl">No announcements at this time.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {allAnnouncements.map((announcement) => {
                const typeColors = {
                  important: "border-l-[#d4af37] bg-[#fffef7]",
                  update: "border-l-[#0a375d] bg-[#f0f4f8]",
                  info: "border-l-[#0a375d] bg-[#f0f4f8]"
                };
                const typeColor = typeColors[announcement.type as keyof typeof typeColors] || "border-l-gray-500 bg-white";
                
                const typeBadges = {
                  important: "bg-[#d4af37] text-[#0a375d]",
                  update: "bg-[#0a375d] text-white",
                  info: "bg-[#0a375d] text-white"
                };
                const typeBadge = typeBadges[announcement.type as keyof typeof typeBadges] || "bg-gray-100 text-gray-800";

                return (
                  <article
                    key={announcement.id}
                    className={`border-l-4 ${typeColor} p-6 rounded-r-lg shadow-md hover:shadow-lg transition`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-semibold text-[#0a375d] font-serif">
                          {announcement.title}
                        </h2>
                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${typeBadge}`}>
                          {announcement.type}
                        </span>
                      </div>
                      <time className="text-sm text-gray-600 whitespace-nowrap ml-4">
                        {new Date(announcement.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                    <div 
                      className="announcement-content text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: announcement.content }}
                    />
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
