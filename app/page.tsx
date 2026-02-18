"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import allAnnouncements from "@/content/announcements-compiled.json";

export default function Home() {
  const topAnnouncements = allAnnouncements.slice(0, 3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);
  const [mobileOtherMenuOpen, setMobileOtherMenuOpen] = useState(false);
  const whatsappCommunityUrl =
    "https://chat.whatsapp.com/JRlV7XFUpNI3vC0DGhkO4i";

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-[#0a375d] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Image
              src="/cbc-logo-white.svg"
              alt="Carolinas Blending Conference"
              width={100}
              height={40}
              priority
            />
            <nav className="hidden md:flex gap-8 text-lg items-center">
              <Link
                href="/messages"
                className="hover:text-[#d4af37] transition"
              >
                Messages
              </Link>
              <Link
                href="/gospel-house"
                className="hover:text-[#d4af37] transition"
              >
                Charleston Gospel House
              </Link>
              <Link
                href="/visit-charleston"
                className="hover:text-[#d4af37] transition"
              >
                Visit Charleston
              </Link>
              <div className="relative">
                <button
                  onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                  onBlur={() => setTimeout(() => setOtherMenuOpen(false), 200)}
                  className="flex items-center gap-1 hover:text-[#d4af37] transition"
                  aria-label="Other menu items"
                >
                  Other
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      otherMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {otherMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-[#0a375d] rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50">
                    <a
                      href="#announcements"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      Announcements
                    </a>
                    <Link
                      href="/announcements"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      All Announcements
                    </Link>
                    <a
                      href="#schedule"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      Schedule
                    </a>
                    <a
                      href="#child-care"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      Child Care
                    </a>
                    <a
                      href="#gospel-trip"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      Gospel Trip
                    </a>
                    <a
                      href="#security"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      Security
                    </a>
                    <a
                      href="#about"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      About
                    </a>
                    <a
                      href="#location"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      Hotel & Location
                    </a>
                    <a
                      href="#register"
                      onClick={() => setOtherMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-[#0a375d] transition"
                    >
                      Register
                    </a>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#1a5080] rounded transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-10 h-10"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-8 pb-6 space-y-6">
              <Link
                href="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl hover:text-[#d4af37] transition py-2"
              >
                Messages
              </Link>
              <Link
                href="/gospel-house"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl hover:text-[#d4af37] transition py-2"
              >
                Charleston Gospel House
              </Link>
              <Link
                href="/visit-charleston"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl hover:text-[#d4af37] transition py-2"
              >
                Visit Charleston
              </Link>
              <div>
                <button
                  onClick={() => setMobileOtherMenuOpen(!mobileOtherMenuOpen)}
                  className="flex items-center gap-2 text-2xl hover:text-[#d4af37] transition py-2 w-full"
                  aria-label="Toggle other menu items"
                >
                  Other
                  <svg
                    className={`w-6 h-6 transition-transform duration-200 ${
                      mobileOtherMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileOtherMenuOpen && (
                  <div className="ml-6 mt-4 space-y-4 pl-4 border-l-2 border-[#d4af37]">
                    <a
                      href="#announcements"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      Announcements
                    </a>
                    <Link
                      href="/announcements"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      All Announcements
                    </Link>
                    <a
                      href="#schedule"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      Schedule
                    </a>
                    <a
                      href="#child-care"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      Child Care
                    </a>
                    <a
                      href="#gospel-trip"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      Gospel Trip
                    </a>
                    <a
                      href="#security"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      Security
                    </a>
                    <a
                      href="#about"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      About
                    </a>
                    <a
                      href="#location"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      Hotel & Location
                    </a>
                    <a
                      href="#register"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileOtherMenuOpen(false);
                      }}
                      className="block text-xl hover:text-[#d4af37] transition py-2"
                    >
                      Register
                    </a>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* WhatsApp Community CTA */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white border-2 border-[#0a375d] rounded-lg p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#0a375d]">
                  Conference Announcements and Communications
                </p>
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#0a375d] mt-2">
                  Join the Conference WhatsApp Community
                </h2>
                <p className="text-gray-700 mt-2">
                  Get real-time updates, announcements, and coordinate with
                  other saints during the gospel trip by joining the 2026
                  Carolinas Blending Conference WhatsApp group.
                </p>
              </div>
              <Link
                href={whatsappCommunityUrl}
                className="inline-flex items-center justify-center bg-[#25D366] hover:bg-[#1fb85a] text-white px-14 py-3 rounded-lg font-semibold text-lg transition"
                target="_blank"
                rel="noreferrer"
                aria-label="Join the CBC WhatsApp Community"
              >
                <Image
                  src="/whatsapp-wordmark-white.svg"
                  alt="WhatsApp"
                  width={160}
                  height={38}
                  className="h-8 w-auto scale-100 md:scale-125 md:shrink-0 md:max-w-none"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0a375d] to-[#1a5080] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
            Carolinas Blending Conference
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-serif">
            Proclaiming the Gospel, Christ as the Jubilee of Grace
          </p>
          <p className="text-xl mb-8">
            January 17-18, 2026 • Charleston, South Carolina
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="https://forms.gle/iiTvdr2i2frTQi6S6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#d4af37] hover:bg-[#c49f2f] text-[#0a375d] px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Register for Conference
            </a>
            <a
              href="https://forms.gle/CxSqzJqkYYaZtSqm7"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-gray-100 text-[#0a375d] px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Register Child Care
            </a>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {topAnnouncements.length > 0 && (
        <section id="announcements" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#0a375d] font-serif">
                Latest Announcements
              </h2>
              <Link
                href="/announcements"
                className="text-[#0a375d] hover:text-[#d4af37] font-semibold transition"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {topAnnouncements.map((announcement) => {
                const typeColors = {
                  important: "border-l-[#d4af37] bg-[#fffef7]",
                  update: "border-l-[#0a375d] bg-[#f0f4f8]",
                  info: "border-l-[#0a375d] bg-[#f0f4f8]",
                };
                const typeColor =
                  typeColors[announcement.type as keyof typeof typeColors] ||
                  "border-l-gray-500 bg-white";

                return (
                  <div
                    key={announcement.id}
                    className={`border-l-4 ${typeColor} p-6 rounded-r-lg shadow-sm`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-[#0a375d] font-serif">
                        {announcement.title}
                      </h3>
                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                        {new Date(announcement.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div
                      className="announcement-content text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: announcement.content }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Schedule Section */}
      <section id="schedule" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-bold text-[#0a375d] mb-8 text-center font-serif">
            Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-[#0a375d] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Day</th>
                  <th className="px-6 py-4 text-left">Event</th>
                  <th className="px-6 py-4 text-left">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Saturday 1/17
                  </td>
                  <td className="px-6 py-4 text-gray-900">Meeting 1</td>
                  <td className="px-6 py-4 text-gray-900">
                    10:00 AM - 12:00 PM
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900"></td>
                  <td className="px-6 py-4 text-gray-900">
                    FTTA trainees and YP and college student meeting
                  </td>
                  <td className="px-6 py-4 text-gray-900">5:00 PM - 6:00 PM</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900"></td>
                  <td className="px-6 py-4 text-gray-900">Meeting 2</td>
                  <td className="px-6 py-4 text-gray-900">7:30 PM - 9:30 PM</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Lord&apos;s Day 1/18
                  </td>
                  <td className="px-6 py-4 text-gray-900">Meeting 3</td>
                  <td className="px-6 py-4 text-gray-900">
                    10:00 AM - 12:00 PM
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900"></td>
                  <td className="px-6 py-4 text-gray-900">
                    Truth Sets Us Free at MLK Parade Coordination
                  </td>
                  <td className="px-6 py-4 text-gray-900">7:30 PM - 9:00 PM</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Monday 1/19
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    Downtown Charleston Sowing
                  </td>
                  <td className="px-6 py-4 text-gray-900">9:00 AM - 11:00 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Child Care Section */}
      <section id="child-care" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-[#0a375d] mb-8 text-center font-serif">
            Child Care
          </h2>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-gray-700 mb-4">
              Child care will be provided for the three conference meetings for
              children in
              <strong> kindergarten through 6th grade</strong>.
            </p>
            <p className="text-gray-700 mb-6">
              Children in <strong>middle school and high school</strong> are
              expected to attend the conference meetings.
            </p>

            <div className="bg-yellow-50 border-l-4 border-[#d4af37] p-6 mb-6">
              <h4 className="font-bold text-[#0a375d] mb-2">
                Sign-In/Out Location:
              </h4>
              <p className="text-gray-700">
                Registration desk by Conference Room C4
              </p>
              <p className="text-gray-700 mt-3">
                <strong>Important:</strong> Do NOT drop off kids more than 15
                minutes before meetings. Pick up kids right after the meeting.
              </p>
              <p className="text-gray-700 mt-3">
                Toddlers will need to be accompanied by at least a parent in
                room C4, and video streaming will be provided.
              </p>
            </div>

            <div className="text-center">
              <a
                href="https://forms.gle/CxSqzJqkYYaZtSqm7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0a375d] hover:bg-[#1a5080] text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
              >
                Register Each Child
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gospel Trip Section */}
      <section id="gospel-trip" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-[#0a375d] mb-8 text-center font-serif">
            Truth Sets Us Free Gospel Distribution
          </h2>

          <div className="bg-gray-50 p-8 rounded-lg shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-[#0a375d] mb-4">
              MLK Parade Distribution
            </h3>
            <p className="text-gray-700 mb-6">
              We will be distributing BFA materials and Bibles on MLK day during
              the Charleston MLK parade. We will be exercising our first
              amendment rights of free speech and will have the saints spread
              out in small groups.
            </p>

            <h4 className="text-xl font-bold text-[#0a375d] mb-3">
              Important Information:
            </h4>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start">
                <span className="text-[#d4af37] mr-2">•</span>
                <span>
                  Attend the Lord&apos;s Day TSUF Coordination Meeting at{" "}
                  <strong>7:30 PM</strong> if you want to participate
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#d4af37] mr-2">•</span>
                <span>Form small groups (ideal size: 5 saints per group)</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#d4af37] mr-2">•</span>
                <span>
                  Each team can pick up 50 Bibles, 50 Basic Elements books, and
                  50 Spiritual Nourishment books
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#d4af37] mr-2">•</span>
                <span>
                  Check out early Monday and arrive downtown by{" "}
                  <strong>9:00 AM</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#d4af37] mr-2">•</span>
                <span>Distribute materials until 11:00 AM or noon</span>
              </li>
            </ul>

            <div className="bg-[#0a375d] text-white p-6 rounded-lg">
              <p className="mb-2">
                <strong>Distribution Materials:</strong> T-shirts, vests, hats,
                and bags are available for pre-order
              </p>
              <p className="text-sm">
                Materials are primarily for saints joining the gospel trip.
                Leftover materials will be available for sale after the last
                conference meeting on Lord&apos;s Day at noon.
              </p>
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://tinyurl.com/CharlestonMLKparade"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#d4af37] hover:bg-[#c49f2f] text-[#0a375d] px-8 py-3 rounded-lg font-semibold text-lg transition"
              >
                View MLK Parade Details
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section id="security" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white border-2 border-[#0a375d] p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-[#0a375d] mb-4">
              Security Information
            </h3>
            <p className="text-gray-700 mb-4">
              We share the hotel with other guests. There will be brothers
              ushering and patrolling the meeting area during the meetings.
            </p>
            <p className="text-gray-700">
              If you see any suspicious activity, please contact the hotel front
              desk or
              <strong> Brother William Gould: (951) 640-7545</strong>
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-[#0a375d] mb-8 text-center font-serif">
            About the Conference
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              We are pleased to announce a Carolinas Blending Conference that
              will begin Saturday morning January 17th, 2026 and concludes
              Lord&apos;s Day afternoon on January 18th in Charleston, South
              Carolina, which has been designated as a GTCA target city for
              2026.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              The general subject of the conference is{" "}
              <strong>
                Proclaiming the Gospel, Christ as the Jubilee of Grace
              </strong>
              .
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              The following Monday is the Martin Luther King holiday, and we
              plan to distribute Bibles for America (BfA) Bibles and books in
              Charleston that day on January 19th and concluding Tuesday January
              20th. The Carolinas Blending Conference combined with the BfA
              distribution afterwards constitutes the inaugural event of
              <strong> The Truth Sets US Free</strong>, which includes a series
              of gospel events in 2026 as part of a broader burden to spread the
              truths of the Lord&apos;s recovery in the United States.
            </p>
            <div className="bg-[#0a375d] text-white p-6 rounded-lg">
              <p className="mb-2">
                <strong>Brother Minoru Chen</strong> will be joining the
                conference by Zoom
              </p>
              <p>
                <strong>Brother Tony Barba</strong> from BfA will be joining in
                person
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel & Location Section */}
      <section id="location" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-[#0a375d] mb-8 text-center font-serif">
            Hotel & Location
          </h2>
          <div className="bg-gradient-to-r from-[#0a375d] to-[#1a5080] text-white p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">
              Embassy Suites Charleston
            </h3>
            <p className="text-lg mb-2">
              Room Rate: <strong>$153</strong> per night plus taxes
            </p>
            <p className="mb-4">
              Includes complimentary breakfast, evening reception, and
              guest-room Wi-Fi
            </p>
            <p className="text-yellow-300">
              ⚠️ Cutoff date: <strong>December 30th, 2025</strong> (Extended)
            </p>
            <p className="text-sm mt-2">
              Room prices will likely go up after the cutoff date.
            </p>
          </div>

          <div className="bg-white border-2 border-[#0a375d] p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-[#0a375d] mb-4">
              Conference Location
            </h3>
            <p className="text-gray-700 mb-4">
              <strong>Conference Meetings:</strong> Convention Center Ballroom A
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Child Care Rooms:</strong> C4, C1, C2, and C3
            </p>
            
            <div className="bg-[#f0f4f8] p-6 rounded-lg mb-6">
              <h4 className="text-xl font-bold text-[#0a375d] mb-3">
                Getting to the Convention Center
              </h4>
              <p className="text-gray-700 mb-3">
                The convention center is a short walk from the Embassy Suites hotel. There are two convenient routes:
              </p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">•</span>
                  <span><strong>Indoor Skywalk:</strong> Take the skywalk from Level 2 of the hotel directly to the convention center</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#d4af37] mr-2">•</span>
                  <span><strong>Ground Floor:</strong> Walk outside from the hotel ground floor to the convention center entrance</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <a
                href="https://calea.charlestoncounty.org/files/Conference-Center-Space-Layout-Floor-Plan.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0a375d] hover:bg-[#1a5080] text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
              >
                View Convention Center Floor Plan
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-bold text-[#0a375d] mb-3">
                Check-out Information
              </h4>
              <p className="text-gray-700">
                Check-out time is 11 AM on Lord&apos;s Day and Monday. Please
                check out before the Lord&apos;s Day meeting or before the
                Monday distribution. Late check-out requests are not guaranteed
                for our group.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-xl font-bold text-[#0a375d] mb-3">Parking</h4>
              <p className="text-gray-700 mb-3">
                Parking is <strong>$10 per car per day</strong> at the Embassy
                Hotel parking lot.
              </p>
              <a
                href="/parking.png"
                target="_blank"
                className="text-[#0a375d] hover:text-[#1a5080] font-semibold underline"
              >
                View Parking Guide & Registration Instructions
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://tinyurl.com/Charlestoninfo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0a375d] hover:text-[#1a5080] font-semibold text-lg underline"
            >
              📍 View Local Restaurants & Sights
            </a>
          </div>
        </div>
      </section>

      {/* Visit Charleston Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-[#0a375d] mb-8 text-center font-serif">
            Visiting Charleston
          </h2>
          <p className="text-center text-gray-700 text-lg mb-12">
            Information for visiting Charleston and planning a future visit
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Visit Charleston Card */}
            <Link href="/visit-charleston" className="group">
              <div className="bg-gradient-to-br from-[#f0f4f8] to-white border-2 border-[#0a375d] rounded-lg p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-2xl font-bold text-[#0a375d] mb-4 group-hover:text-[#d4af37] transition">
                  Discover Charleston
                </h3>
                <p className="text-gray-700 mb-4">
                  Explore Charleston&apos;s rich history, vibrant food scene, and beautiful destinations. From BBQ to beaches, museums to waterfront parks—find your next adventure.
                </p>
                <span className="text-[#0a375d] font-semibold group-hover:text-[#d4af37] transition">
                  Learn More →
                </span>
              </div>
            </Link>

            {/* Charleston Gospel House Card */}
            <Link href="/gospel-house" className="group">
              <div className="bg-gradient-to-br from-[#fffef7] to-white border-2 border-[#d4af37] rounded-lg p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">🏡</div>
                <h3 className="text-2xl font-bold text-[#0a375d] mb-4 group-hover:text-[#d4af37] transition">
                  Charleston Gospel House
                </h3>
                <p className="text-gray-700 mb-4">
                  A fully-furnished 3-bedroom house available for saints visiting Charleston. Sleeps up to 10 individuals with a suggested donation of $75/night per family.
                </p>
                <span className="text-[#0a375d] font-semibold group-hover:text-[#d4af37] transition">
                  Book a Visit →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Register Section */}
      <section id="register" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-[#0a375d] mb-8 text-center font-serif">
            Register
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-[#0a375d] mb-4">
                Conference Registration
              </h3>
              <p className="text-gray-700 mb-6">
                Register for the Carolinas Blending Conference to help us with
                planning and coordination.
              </p>
              <a
                href="https://forms.gle/iiTvdr2i2frTQi6S6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0a375d] hover:bg-[#1a5080] text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
              >
                Register for Conference
              </a>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-[#0a375d] mb-4">
                Child Care Registration
              </h3>
              <p className="text-gray-700 mb-6">
                If you need child care during the meetings, please register each
                child individually.
              </p>
              <a
                href="https://forms.gle/CxSqzJqkYYaZtSqm7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#d4af37] hover:bg-[#c49f2f] text-[#0a375d] px-8 py-3 rounded-lg font-semibold text-lg transition"
              >
                Register Child Care
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a375d] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/cbc-logo-white.svg"
            alt="Carolinas Blending Conference"
            width={150}
            height={60}
            className="mx-auto mb-6"
          />
          <h3 className="text-2xl font-bold mb-4 font-serif">
            Carolinas Blending Conference 2026
          </h3>
          <p className="text-lg mb-2">January 17-18, 2026</p>
          <p className="mb-6">Charleston, South Carolina</p>
          <div className="flex gap-6 justify-center flex-wrap">
            <a
              href="https://forms.gle/iiTvdr2i2frTQi6S6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4af37] transition"
            >
              Register for Conference
            </a>
            <a
              href="https://forms.gle/CxSqzJqkYYaZtSqm7"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4af37] transition"
            >
              Register Child Care
            </a>
            <a
              href="https://tinyurl.com/Charlestoninfo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4af37] transition"
            >
              Area Information
            </a>
          </div>
          <div className="mt-8 text-sm text-gray-300">
            <p>Proclaiming the Gospel, Christ as the Jubilee of Grace</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#0a375d] hover:bg-[#1a5080] text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
