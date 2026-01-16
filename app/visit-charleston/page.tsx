import Link from "next/link";
import Image from "next/image";

export default function VisitCharlestonPage() {
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
            Welcome to Charleston, South Carolina!
          </h1>
          <p className="text-lg mt-2">
            Discover one of America&apos;s most historic and beloved cities
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Quick Facts Section with Image */}
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-[#0a375d] mb-6 font-serif">Quick Facts & Stats</h2>
                <div className="text-gray-900 space-y-4 text-lg leading-relaxed">
                  <p>
                    <strong>Founded in 1670</strong> – one of the country&apos;s oldest settlements!
                  </p>
                  <p>
                    Named the <strong>#1 Best City in the U.S.</strong> for twelve consecutive years by <em>Travel + Leisure</em> Magazine
                  </p>
                  <p>
                    <strong>City population:</strong> ~165,000; larger Charleston metropolitan area population: ~870,000
                  </p>
                  <p>
                    Home to <strong>major employers in healthcare, manufacturing, and aerospace</strong>, such as Boeing, Bosch, Mercedes Benz, Medical University of South Carolina (top 13% hospital nationally)
                  </p>
                  <p>
                    <strong>Median housing price</strong> across major residential areas (Summerville & West Ashley): $450,000
                  </p>
                  <p>
                    Home to 10+ colleges, 120-140 elementary-high schools, and 20+ active homeschool groups
                  </p>
                </div>
              </div>
              
              {/* Charleston Image */}
              <div className="flex items-start">
                <Image 
                  src="/image1.jpg"
                  alt="Charleston harbor view"
                  width={498}
                  height={366}
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Two Column Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Dining Options */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-[#0a375d] mb-6 font-serif">Dining Options</h2>
              <p className="text-gray-900 mb-4 text-lg">
                Charleston is home to a robust and diverse food scene. Favorites include:
              </p>
              <ul className="space-y-2 text-gray-900 text-lg">
                <li><strong>Lewis Barbecue</strong> (Texas BBQ)</li>
                <li><strong>Palmira Barbecue</strong> (Puerto Rican BBQ)</li>
                <li><strong>Leon&apos;s Oyster Shop</strong> (fried chicken, seafood)</li>
                <li><strong>Rudy Royale</strong> (fried chicken, Southern)</li>
                <li><strong>Berkeley&apos;s</strong> (sandwiches & salads)</li>
                <li><strong>Da Toscana Porchetta Shop</strong> (sandwiches & salads)</li>
                <li><strong>Miller&apos;s All Day</strong> (brunch)</li>
                <li><strong>Harken</strong> (bakery & coffee)</li>
                <li><strong>Welton&apos;s Tiny Bakeshop</strong> (bakery & coffee)</li>
                <li><strong>Second State Coffee</strong> (coffee)</li>
              </ul>
              <div className="mt-6 flex justify-center">
                <Image 
                  src="/image4.png"
                  alt="Charleston dining"
                  width={511}
                  height={288}
                  className="rounded-lg shadow-sm"
                />
              </div>
            </div>

            {/* Activities & Destinations */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-[#0a375d] mb-6 font-serif">Activities & Destinations</h2>
              <p className="text-gray-900 mb-4 text-lg">
                With its rich history as a port city, Charleston offers a variety of educational and cultural sites, as well as beautiful parks and oceanside destinations:
              </p>
              <ul className="space-y-2 text-gray-900 text-lg">
                <li><strong>Charleston Museum</strong> - <em>$15 per adult</em></li>
                <li><strong>Old Exchange & Provost Dungeon tour</strong> - <em>$16</em></li>
                <li><strong>Mace Brown Museum of Natural History</strong> - <em>free</em></li>
                <li><strong>Charleston City Market</strong> - <em>free</em></li>
                <li><strong>Folly Beach Pier</strong> - <em>free</em></li>
                <li><strong>Shem Creek Boardwalk</strong> - <em>free</em></li>
                <li><strong>The Battery / White Point Gardens</strong> - <em>free</em></li>
                <li><strong>Waterfront Park / Pineapple Fountain</strong> - <em>free</em></li>
              </ul>
              <div className="mt-6 flex justify-center">
                <Image 
                  src="/image2.png"
                  alt="Charleston waterfront"
                  width={470}
                  height={313}
                  className="rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Come Visit Section */}
          <div className="bg-gradient-to-r from-[#fffef7] to-[#fff9e6] border-l-4 border-[#d4af37] rounded-lg shadow-md p-8 md:p-12">
            <h2 className="text-3xl font-bold text-[#0a375d] mb-6 font-serif">Come visit us again soon!</h2>
            <div className="text-gray-900 space-y-4 text-lg leading-relaxed">
              <p>
                There are currently <strong>~10 saints regularly meeting in Charleston</strong> and <strong>~20 warm door contacts</strong>.
              </p>
              <p>
                A 3-bed, 2-bath &quot;GTCA House&quot; has been completely furnished and is ready to receive visiting saints! Hosting capacity is up to 10 individuals or 2 family units.
              </p>
              <div className="mt-6 text-center">
                <Link 
                  href="/gtca-house"
                  className="inline-block bg-[#0a375d] text-white px-8 py-3 rounded-lg hover:bg-[#1a5080] transition font-semibold text-lg"
                >
                  Learn More About the GTCA House
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
