import Image from "next/image";
import Link from "next/link";
import { UpdatesProvider, UpdateActions, UpdatesPrompt } from "./components/ConferenceUpdates";
import "./conference-2027.css";

const hotelUrl = "https://www.hilton.com/en/hotels/myrobup-the-ellie-beach-resort-myrtle-beach/";
const reviewsUrl = "https://www.tripadvisor.com/Hotel_Review-g54359-d27165487-Reviews-The_Ellie_Beach_Resort_Myrtle_Beach_Tapestry_By_Hilton-Myrtle_Beach_South_Carolina.html";

export default function Home() {
  return (
    <div className="conference-site">
      <UpdatesProvider>
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
            <h1>General Subject<br /><em>TBD</em></h1>
            <p className="hero-intro">2027 Carolinas Blending Conference</p>
            <div className="hero-rule" />
            <div className="hero-details"><p><strong>January 15–17, 2027</strong><br />Conference weekend</p><p><strong>The Ellie Beach Resort</strong><br />Myrtle Beach, South Carolina</p></div>
            <UpdateActions tone="light" />
            <a className="hero-explore" href="#schedule">Explore the weekend <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-caption">THE ELLIE BEACH RESORT · SITE VISIT PHOTO</p>
        </section>

        <section className="welcome wrap section-pad">
          <p className="eyebrow">A WEEKEND TOGETHER <span> / </span> 01</p>
          <div className="welcome-grid"><h2>Blending the churches<br />in the <em>Carolinas.</em></h2><div><p className="lead">We look forward to a time of fellowship and blending with saints from across the Carolinas.</p><p>Join us in Myrtle Beach for meetings on Saturday and Lord’s Day, followed by gospel trips beginning Lord’s Day evening and gospel activities on Monday.</p><a className="text-link" href="#gospel-trips">Learn about the gospel trips <span aria-hidden="true">↗</span></a><UpdatesPrompt welcome /></div></div>
        </section>

        <section id="schedule" className="schedule-section section-pad">
          <div className="wrap"><div className="section-heading"><div><p className="eyebrow">THE WEEKEND <span> / </span> 02</p><h2>Make plans to join us.</h2></div><p>Join us for conference meetings in Myrtle Beach, followed by gospel trips to Wilmington and Charleston.</p></div>
            <div className="schedule-grid">
              <article><div className="date-num">15 <span>FRI</span></div><div className="schedule-line" /><h3>Arrival</h3><p>Guest-room reservations are planned for Friday and Saturday nights.</p></article>
              <article><div className="date-num">16 <span>SAT</span></div><div className="schedule-line" /><h3>Conference meetings</h3><p>10:00 AM and 7:30 PM at The Ellie.</p></article>
              <article><div className="date-num">17 <span>LORD’S DAY</span></div><div className="schedule-line" /><h3>Conference &amp; gospel trips</h3><p>Conference meeting at 10:00 AM at The Ellie. Gospel trip coordination at 7:30 PM in Wilmington and Charleston.</p></article>
              <article><div className="date-num">18 <span>MON</span></div><div className="schedule-line" /><h3>Gospel distributions</h3><p>Bibles for America or The Truth Sets Us Free distributions at the MLK Day parades in Wilmington and Charleston.</p></article>
            </div>
            <p className="small-note">Conference registration and further details will be announced here.</p>
            <UpdatesPrompt />
          </div>
        </section>

        <section id="venue" className="venue-section section-pad"><div className="wrap">
          <div className="section-heading"><div><p className="eyebrow">THE PLACE <span> / </span> 03</p><h2>Meet us at The Ellie.</h2></div></div>
          <div className="venue-grid"><figure className="photo-card main-photo"><Image src="/2027/meeting-space.webp" alt="Meeting space at The Ellie with windows overlooking the ocean" width={1600} height={1000} /><figcaption>Meeting space at The Ellie · site visit photo</figcaption></figure><div className="venue-copy"><p className="eyebrow">THE ELLIE BEACH RESORT MYRTLE BEACH</p><h3>A place to meet<br /><em>and stay together.</em></h3><p>The Ellie Beach Resort is a beachfront hotel where both the conference meetings and guest rooms will be located. Our main meetings will be in the Carolina Ballroom.</p><p>Tripadvisor classifies The Ellie as a four-star hotel. Guests rate The Ellie 4.3 out of 5 on Tripadvisor, as of November 2026.</p><a className="text-link" href={reviewsUrl} target="_blank" rel="noopener noreferrer">See the hotel classification and guest reviews <span aria-hidden="true">↗</span></a><address>3200 South Ocean Boulevard<br />Myrtle Beach, SC 29577</address><a className="text-link" href={hotelUrl} target="_blank" rel="noopener noreferrer">Visit the hotel website <span aria-hidden="true">↗</span></a><br /><a className="text-link" href="https://www.hilton.com/en/hotels/myrobup-the-ellie-beach-resort-myrtle-beach/gallery/" target="_blank" rel="noopener noreferrer">Explore the hotel photo gallery <span aria-hidden="true">↗</span></a></div></div>
          <div className="details-grid"><article><span>01 / STAY</span><h3>Guest rooms</h3><p>Plan for Friday and Saturday nights, January 15 and 16, with departure on Lord’s Day. Reservation information and the group booking link are forthcoming.</p></article><article><span>02 / FAMILIES</span><h3>Children’s arrangements</h3><p>Childcare will be provided during all three conference meetings for children in kindergarten through 6th grade, with three separate children’s rooms in the Atlantic Ballroom.</p><p>Middle school and high school students are expected to attend the conference meetings. Registration and further details will be shared when available.</p><p>The indoor pools will be open during the conference weekend. Families can also enjoy the game room, with Ping-Pong, cornhole, Connect Four, and foosball, as well as mini golf at the resort.</p></article><article><span>03 / GETTING HERE</span><h3>Travel &amp; parking</h3><p>The hotel is less than ten minutes from Myrtle Beach International Airport. Conference parking details will be announced here.</p></article></div>
          <figure className="room-feature"><Image src="/2027/guest-room.webp" alt="A guest room at The Ellie with two beds and a balcony" width={1600} height={1000} /><figcaption>A guest room at The Ellie · site visit photo</figcaption></figure>
        </div></section>

        <section id="gospel-trips" className="trips-section section-pad">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow light">GOSPEL TRIPS <span> / </span> 04</p>
                <h2>Gospel distribution at the MLK parades.</h2>
                <a className="tsuf-logo-link" href="https://www.tsuf.us/" target="_blank" rel="noopener noreferrer" aria-label="Visit The Truth Sets Us Free website">
                  <Image src="/tsuf-logo.svg" alt="The Truth Sets Us Free" width={155} height={135} />
                </a>
                <div className="distribution-links">
                  <a href="https://bfa.org/" target="_blank" rel="noopener noreferrer">Bibles for America <span aria-hidden="true">↗</span></a>
                  <a href="https://www.tsuf.us/" target="_blank" rel="noopener noreferrer">The Truth Sets Us Free <span aria-hidden="true">↗</span></a>
                </div>
              </div>
              <p>Our gospel activities on Monday, January 18, will be Bibles for America or The Truth Sets Us Free distributions at the MLK Day parades in Wilmington and Charleston. Coordination in each city will be at 7:30 PM on Lord’s Day, January 17.</p>
            </div>
            <div className="trip-grid">
              <article>
                <span>01 / NORTH CAROLINA</span>
                <h3>Wilmington</h3>
                <p><strong>Lord’s Day, January 17:</strong> Coordination at 7:30 PM in Wilmington.</p>
                <p><strong>Monday, January 18:</strong> Gospel distribution at Wilmington’s MLK Day parade.</p>
                <div className="trip-parade">
                  <h4>Parade information</h4>
                  <p>The 2027 parade time and route are forthcoming.</p>
                  <p>In 2026, the parade began at 11:00 AM on January 19 in downtown Wilmington. The route began at Brunswick Street, traveled south on Third Street, turned onto Princess Street, and concluded on Fourth Street.</p>
                  <a href="https://www.wilmingtonnc.gov/Events-directory/MLK-Day-Parade" target="_blank" rel="noopener noreferrer">View Wilmington’s 2026 parade information <span aria-hidden="true">↗</span></a>
                </div>
              </article>
              <article>
                <span>02 / SOUTH CAROLINA</span>
                <h3>Charleston</h3>
                <p><strong>Lord’s Day, January 17:</strong> Coordination at 7:30 PM in Charleston.</p>
                <p><strong>Monday, January 18:</strong> Gospel distribution at Charleston’s MLK Day parade.</p>
                <div className="trip-parade">
                  <h4>Parade information</h4>
                  <p>The MLK Day Parade begins at 10:00 AM downtown, starting at Burke High School and ending at Mother Emanuel AME Church.</p>
                  <a href="https://www.charlestoncvb.com/events/mlk-day-parade~29070/" target="_blank" rel="noopener noreferrer">View Charleston parade information <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            </div>
            <p className="trip-note">Distribution arrangements, meeting places, departure times, transportation, and participation details for both cities will be shared when available.</p>
            <UpdatesPrompt light />
          </div>
        </section>

        <section className="archive-section section-pad"><div className="wrap archive-inner"><div><p className="eyebrow">FROM THE ARCHIVE <span> / </span> 05</p><h2>Conference archives</h2><p>Revisit the messages from the 2026 Carolinas Blending Conference in Charleston. Video and audio recordings are available.</p></div><div className="archive-links"><Link className="button button-dark" href="/archive/2026/messages">2026 conference recordings <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/archive/2026">Explore the 2026 archive <span aria-hidden="true">↗</span></Link></div></div></section>
      </main>
      <footer className="site-footer"><div className="wrap footer-inner"><div><Image src="/cbc-logo-white.svg" alt="Carolinas Blending Conference" width={86} height={45} /><p>Carolinas Blending Conference<br />Myrtle Beach, South Carolina · 2027</p></div><a href="#top">Back to top ↑</a></div></footer>
      </UpdatesProvider>
    </div>
  );
}
