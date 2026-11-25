import React from "react";
import Hero from "@/components/home/Hero";
import Category from "@/components/home/Category";
import Sellers from "@/components/home/Sellers";
import Arrivals from "@/components/home/Arrivals";
import Testimonial from "@/components/home/Testimonial";
import Touch from "@/components/home/Touch";

export function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <Category />
      <Sellers />
      <Arrivals />
      <Testimonial />
      <Touch />
    </div>
  );
}

export default HomePage;
