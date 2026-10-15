import React from "react";
import Hero from "@/components/home/Hero";
import Category from "@/components/home/Category";
import Sellers from "@/components/home/Sellers";
import Bridal from "@/components/home/Bridal";
import Arrivals from "@/components/home/Arrivals";
import Festive from "@/components/home/Festive";
import Inspiration from "@/components/home/Inspiration";
import Touch from "@/components/home/Touch";

export function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <Category />
      <Sellers />
      <Bridal />
      <Arrivals />
      <Festive />
      <Inspiration />
      <Touch />
    </div>
  );
}

export default HomePage;
