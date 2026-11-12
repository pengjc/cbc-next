import Image from "next/image";
import Link from "next/link";
import "./conference-2027.css";

const hotelUrl = "https://www.hilton.com/en/hotels/myrobup-the-ellie-beach-resort-myrtle-beach/";

export default function Home() {
  return (
    <div className="conference-site">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#top" className="brand" aria-label="Carolinas Blending Conference home"><Image src="/cbc-logo.svg" alt="" width={82} height={48} priority /><span>CAROLINAS<br /><b>BLENDING CONFERENCE</b></span></a>
          <nav aria-label="Main navigation" className="main-nav">
            <a href="#schedule">Schedule</a><a href="#venue">Hotel &amp; travel</a><a href="#gospel-trips">Gospel trips</a><Link href="/archive/2026/messages">2026 recordings <span aria-hidden="true">↗</span></Link>
          </nav>
        </div>
      </header>
      <main id="main">
        <section id="top" className="hero">
          <Image className="hero-photo" src="/2027/oceanfront.webp" alt="Oceanfront patio overlooking the beach at The Ellie" fill priority sizes="100vw" />
          <div className="hero-shade" />
          <div className="hero-content wrap">
            <p className="eyebrow light">MYRTLE BEACH, SOUTH CAROLINA <span> / </span> JANUARY 2027</p>
            <h1>Come together<br /><em>by the sea.</em></h1>
            <p className="hero-intro">Carolinas Blending Conference</p>
            <div className="hero-rule" />
            <div className="hero-details"><p><strong>January 15–17, 2027</strong><br />Conference weekend</p><p><strong>The Ellie Beach Resort</strong><br />Myrtle Beach, South Carolina</p></div>
            <a className="button button-light" href="#schedule">Explore the weekend <span aria-hidden="true">↗</span></a>
          </div>
          <p className="hero-caption">THE ELLIE BEACH RESORT · SITE VISIT PHOTO</p>
        </section>

        <section className="welcome wrap section-pad">
          <p className="eyebrow">A WEEKEND TOGETHER <span> / </span> 01</p>
          <div className="welcome-grid"><h2>Gathering in the<br /><em>Carolinas.</em></h2><div><p className="lead">We look forward to a time of fellowship and blending with saints from across the Carolinas.</p><p>Join us in Myrtle Beach for the conference weekend, with meetings on Saturday and Lord’s Day and gospel trips following on Monday.</p><a className="text-link" href="#gospel-trips">Learn about the gospel trips <span aria-hidden="true">↗</span></a></div></div>
        </section>

        <section id="schedule" className="schedule-section section-pad">
          <div className="wrap"><div className="section-heading"><div><p className="eyebrow">THE WEEKEND <span> / </span> 02</p><h2>Make plans to join us.</h2></div><p>Here is an overview of the weekend. A detailed meeting schedule will be shared when available.</p></div>
            <div className="schedule-grid">
              <article><div className="date-num">15 <span>FRI</span></div><div className="schedule-line" /><h3>Arrival</h3><p>Guest-room reservations are planned for Friday and Saturday nights.</p></article>
              <article><div className="date-num">16 <span>SAT</span></div><div className="schedule-line" /><h3>Conference meetings</h3><p>Gather for the conference on Saturday. Meeting times are forthcoming.</p></article>
              <article><div className="date-num">17 <span>SUN</span></div><div className="schedule-line" /><h3>Conference meetings</h3><p>Continue in fellowship on Lord’s Day. Meeting times are forthcoming.</p></article>
              <article><div className="date-num">18 <span>MON</span></div><div className="schedule-line" /><h3>Gospel trips</h3><p>Gospel trips to Wilmington and Charleston follow the conference.</p></article>
            </div>
            <p className="small-note">Conference registration and the complete schedule will be announced here.</p>
          </div>
        </section>

        <section id="venue" className="venue-section section-pad"><div className="wrap">
          <div className="section-heading"><div><p className="eyebrow">THE PLACE <span> / </span> 03</p><h2>Meet us at The Ellie.</h2></div><p>A place to gather, stay, and enjoy the South Carolina coast together.</p></div>
          <div className="venue-grid"><figure className="photo-card main-photo"><Image src="/2027/meeting-space.webp" alt="Meeting space at The Ellie with windows overlooking the ocean" width={1600} height={1000} /><figcaption>Meeting space at The Ellie · site visit photo</figcaption></figure><div className="venue-copy"><p className="eyebrow">THE ELLIE BEACH RESORT MYRTLE BEACH</p><h3>By the ocean.<br /><em>Close to everything.</em></h3><p>The conference meetings and guest rooms will be at The Ellie Beach Resort, a beachfront hotel near Myrtle Beach International Airport and Market Common.</p><address>3200 South Ocean Boulevard<br />Myrtle Beach, SC 29577</address><a className="text-link" href={hotelUrl} target="_blank" rel="noopener noreferrer">Visit the hotel website <span aria-hidden="true">↗</span></a><br /><a className="text-link" href="https://www.hilton.com/en/hotels/myrobup-the-ellie-beach-resort-myrtle-beach/gallery/" target="_blank" rel="noopener noreferrer">Explore the hotel photo gallery <span aria-hidden="true">↗</span></a></div></div>
          <div className="details-grid"><article><span>01 / STAY</span><h3>Guest rooms</h3><p>Plan for Friday and Saturday nights, January 15 and 16, with departure on Sunday. Reservation information and the group booking link are forthcoming.</p></article><article><span>02 / FAMILIES</span><h3>Children’s arrangements</h3><p>Children’s meeting spaces are planned at the hotel. Age groups, registration, and other details will be shared when available.</p></article><article><span>03 / GETTING HERE</span><h3>Travel &amp; parking</h3><p>The hotel is less than ten minutes from Myrtle Beach International Airport. Conference parking details will be announced here.</p></article></div>
          <figure className="room-feature"><Image src="/2027/guest-room.webp" alt="A guest room at The Ellie with two beds and a balcony" width={1600} height={1000} /><figcaption>A guest room at The Ellie · site visit photo</figcaption></figure>
        </div></section>

        <section id="gospel-trips" className="trips-section section-pad"><div className="wrap"><div className="section-heading"><div><p className="eyebrow light">BEYOND THE WEEKEND <span> / </span> 04</p><h2>Going out together.</h2></div><p>On Monday, January 18, gospel trips will follow the conference in two neighboring cities.</p></div><div className="trip-grid"><article><span>01 / NORTH CAROLINA</span><h3>Wilmington</h3><p>Join the gospel trip to Wilmington on Monday.</p></article><article><span>02 / SOUTH CAROLINA</span><h3>Charleston</h3><p>Join the gospel trip to Charleston on Monday.</p></article></div><p className="trip-note">Departure times, meeting places, transportation, and participation details are forthcoming.</p></div></section>

        <section className="archive-section section-pad"><div className="wrap archive-inner"><div><p className="eyebrow">FROM THE ARCHIVE <span> / </span> 05</p><h2>Continue in the fellowship.</h2><p>Revisit the messages from the 2026 Carolinas Blending Conference in Charleston. Video and audio recordings are available.</p></div><div className="archive-links"><Link className="button button-dark" href="/archive/2026/messages">2026 conference recordings <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/archive/2026">Explore the 2026 archive <span aria-hidden="true">↗</span></Link></div></div></section>
      </main>
      <footer className="site-footer"><div className="wrap footer-inner"><div><Image src="/cbc-logo-white.svg" alt="Carolinas Blending Conference" width={86} height={45} /><p>Carolinas Blending Conference<br />Myrtle Beach, South Carolina · 2027</p></div><a href="#top">Back to top ↑</a></div></footer>
    </div>
  );
}
