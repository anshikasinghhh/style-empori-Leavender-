import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { ProductCard, EmptyState } from '../../components/common/LoadingSpinner';
import { PRODUCTS } from '../../utils/data';

export default function WishlistPage() {
  const { products } = useSelector(s => s.wishlist);
  const wishlistProducts = products || [];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
        {wishlistProducts.length > 0 && <span className="badge-primary">{wishlistProducts.length} saved items</span>}
      </div>
      {wishlistProducts.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Save items you love and come back to them anytime"
          action={<Link to="/products" className="btn-primary">Explore Products</Link>} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {wishlistProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
