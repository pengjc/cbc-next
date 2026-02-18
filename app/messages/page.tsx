import Image from "next/image";
import Link from "next/link";
import { messages } from "@/lib/messages";

interface Message {
  id: string;
  title: string;
  date: string;
  description: string;
  vimeoUrl: string;
  audioUrl?: string;
}

// Extract Vimeo video ID from URL
function getVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export default function MessagesPage() {
  const availableMessages = messages.filter((msg) => msg.vimeoUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a375d] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/cbc-logo-white.svg"
                alt="Carolinas Blending Conference"
                width={100}
                height={40}
                priority
              />
            </Link>
            <Link
              href="/"
              className="text-white hover:text-[#d4af37] transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a375d] to-[#1a5080] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            Conference Messages
          </h1>
          <p className="text-xl mb-2">
            Proclaiming the Gospel, Christ as the Jubilee of Grace
          </p>
          <p className="text-lg opacity-90">
            January 17-18, 2026 • Charleston, South Carolina
          </p>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {availableMessages.length > 0 ? (
            <div className="space-y-8">
              {availableMessages.map((message, index) => {
                const vimeoId = getVimeoId(message.vimeoUrl);
                return (
                  <div
                    key={message.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="grid md:grid-cols-3 gap-6 p-6">
                      {/* Video Info */}
                      <div className="md:col-span-1">
                        <div className="bg-[#0a375d] text-white p-4 rounded-lg mb-4">
                          <span className="text-sm font-semibold">
                            MESSAGE {index + 1}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0a375d] mb-3 font-serif">
                          {message.title}
                        </h2>
                        <div className="space-y-2 text-gray-700 mb-4">
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(message.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {message.description}
                        </p>
                      </div>

                      {/* Vimeo Player */}
                      <div className="md:col-span-2">
                        {vimeoId ? (
                          <div className="rounded-lg overflow-hidden aspect-video">
                            <iframe
                              src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0&badge=0`}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              title={message.title}
                            ></iframe>
                          </div>
                        ) : (
                          <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
                            <p className="text-gray-500">
                              Invalid Vimeo URL
                            </p>
                          </div>
                        )}
                        
                        {/* Audio Player */}
                        {message.audioUrl && (
                          <div className="mt-6">
                            <div className="bg-[#f0f4f8] p-4 rounded-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <svg className="w-5 h-5 text-[#0a375d]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                                <h3 className="font-semibold text-[#0a375d]">Audio Only</h3>
                              </div>
                              <audio
                                controls
                                preload="metadata"
                                className="w-full"
                              >
                                <source src={message.audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                              <div className="mt-3 text-sm text-gray-600">
                                <a
                                  href={message.audioUrl}
                                  download
                                  className="text-[#0a375d] hover:text-[#1a5080] font-semibold"
                                >
                                  Download MP3 →
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg text-center">
              <p className="text-yellow-800 text-lg">
                Conference messages will be available soon. Please check back
                later.
              </p>
            </div>
          )}

          {/* Additional Information */}
          <div className="mt-12 bg-[#f0f4f8] p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-[#0a375d] mb-4 font-serif">
              About the Messages
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These messages were given during the 2026 Carolinas Blending
              Conference in Charleston, South Carolina. The conference focused
              on proclaiming the gospel and experiencing Christ as the Jubilee
              of Grace.
            </p>
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
          <Link
            href="/"
            className="text-[#d4af37] hover:text-white transition font-semibold"
          >
            Return to Conference Website
          </Link>
        </div>
      </footer>
    </div>
  );
}
