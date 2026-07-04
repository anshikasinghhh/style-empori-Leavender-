import React from 'react';
import Header from '../../components/craftsmanship/Header';
import Craftsmanship from '../../components/craftsmanship/Craftsmanship';
import Purpose from '../../components/craftsmanship/Purpose';
import Closing from '../../components/craftsmanship/Closing';

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Craftsmanship />
      <Purpose />
      <Closing />
    </div>
  );
}
