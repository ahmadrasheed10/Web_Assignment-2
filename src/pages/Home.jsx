import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Go out. Be there.</p>
          <h1 id="hero-title">Good moments.<br /><em>Great company.</em></h1>
          <p className="intro">A place to find your next live experience — from your favourite artists to a night of something new.</p>
          <Link className="button" to="/events">Explore events <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="ticket">
            <span>THE NEXT GOOD THING</span>
            <strong>BE<br />THERE.</strong>
            <div className="ticket-stub">LIVE / TOGETHER / IN PERSON</div>
          </div>
          <span className="art-caption">LESS SCROLLING. MORE LIVING.</span>
        </div>
      </section>
      <section id="explore" className="explore" aria-labelledby="explore-title">
        <p className="eyebrow">A little something for everyone</p>
        <h2 id="explore-title">Your next plan starts here.</h2>
        <div className="category-grid">
          <article><span className="category-number">01 / MUSIC</span><h3>Feel every beat.</h3><p>Concerts, favourite artists, and sounds worth discovering.</p></article>
          <article><span className="category-number">02 / SPORTS</span><h3>Join the crowd.</h3><p>Big games and the energy you only get from being there.</p></article>
          <article><span className="category-number">03 / ARTS & THEATRE</span><h3>See a new story.</h3><p>Stage performances, creative experiences, and memorable nights.</p></article>
        </div>
        <p className="development-note">Find a plan worth going out for. <Link to="/events">Browse upcoming events.</Link></p>
      </section>
    </>
  )
}
