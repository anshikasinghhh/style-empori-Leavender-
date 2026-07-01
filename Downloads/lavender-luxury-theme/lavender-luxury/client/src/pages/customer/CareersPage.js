import React from 'react';
import Hero from '../../components/careers/Hero';
import About from '../../components/careers/About';
import WhyWork from '../../components/careers/WhyWork';
import CareerGrid from '../../components/careers/CareerGrid';
import WhoWeAreLookingFor from '../../components/careers/WhoWeAreLookingFor';
import Growth from '../../components/careers/Growth';
import HiringProcess from '../../components/careers/HiringProcess';
import ApplySection from '../../components/careers/ApplySection';
import FAQ from '../../components/careers/FAQ';
import CTA from '../../components/careers/CTA';

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <WhyWork />
      <CareerGrid />
      <WhoWeAreLookingFor />
      <HiringProcess />
      <Growth />
      <ApplySection />
      <FAQ />
      <CTA />
    </div>
  );
}
