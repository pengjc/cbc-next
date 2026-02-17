import Link from "next/link";

export default function GTCAHousePage() {
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
            Charleston Gospel House
          </h1>
          <p className="text-lg mt-2">
            Visit Charleston, South Carolina
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="prose prose-lg max-w-none text-gray-900">
              <p className="text-xl font-semibold text-[#0a375d] mb-6">
                <strong>The Charleston Gospel House is now fully furnished and available</strong> to host saints who are interested in visiting Charleston, South Carolina!
              </p>

              <p className="mb-6 text-gray-900">
                The 3-bedroom, 2-bathroom house is located in a quiet, safe, suburban neighborhood ~30 minutes from the heart of downtown Charleston. All rooms are fully furnished, including a kitchen with cooking basics, plates and silverware. The house can host <strong>up to 10 individuals or two family units:</strong>
              </p>

              <ul className="mb-6 space-y-2 text-gray-900">
                <li><strong>Master bedroom:</strong> 1 king bed (2 individuals, 4 with air mattress)</li>
                <li><strong>Bedroom 1:</strong> 1 twin bed, 1 bunk bed (3 individuals)</li>
                <li><strong>Bedroom 2:</strong> 1 daybed with trundle (2 individuals)</li>
                <li><strong>Living room:</strong> ample space for 2 air mattresses (2 individuals)</li>
              </ul>

              <p className="mb-6 text-gray-900">
                There is a tax-deductible suggested donation of $75/night per family unit that would go towards a Charleston fund maintained by the church in Columbia. Local AirBnBs of similar size average ~$350 per night.
              </p>

              <p className="mb-6 text-gray-900">
                For larger groups (e.g., those who are interested in visiting with their small group), the <strong>combined hosting capacity</strong> with the Charleston Gospel House and local saints is <strong>4-5 families</strong>.
              </p>

              <div className="bg-[#fffef7] border-l-4 border-[#d4af37] p-6 mb-6">
                <p className="text-lg text-gray-900">
                  We warmly invite you to <strong>fill out this <a href="https://docs.google.com/forms/d/e/1FAIpQLSfBcwjs1iJJIMMHdEeVGSNv2Zsp3UUx4XG5ljTwZ81sJR7NFw/viewform?usp=sharing&ouid=100558536713451051214" className="text-[#0a375d] hover:text-[#d4af37] underline transition" target="_blank" rel="noopener noreferrer">form</a></strong> to sign up for a visit to Charleston. We hope to see you soon!
                </p>
              </div>

              <p className="text-center">
                <a 
                  href="https://photos.app.goo.gl/2QpPmdY6qCFA7TG36" 
                  className="inline-block bg-[#0a375d] text-white px-8 py-3 rounded-lg hover:bg-[#1a5080] transition font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Updated Photos
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
