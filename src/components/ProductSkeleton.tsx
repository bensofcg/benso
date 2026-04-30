'use client';

export function ProductSkeleton() {
  return (
    <div className="bento-card skeleton-card">
      {/* Image skeleton */}
      <div className="product-image-skeleton" />
      
      {/* Title skeleton */}
      <div className="skeleton-line skeleton-title" />
      
      {/* Description skeleton */}
      <div className="skeleton-line skeleton-description" />
      <div className="skeleton-line skeleton-description short" />
      
      {/* Price skeleton */}
      <div className="skeleton-line skeleton-price" />
      
      {/* Buttons skeleton */}
      <div className="skeleton-buttons">
        <div className="skeleton-button" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}

export function ServiceSkeleton() {
  return (
    <div className="bento-card skeleton-card">
      {/* Icon skeleton */}
      <div className="skeleton-icon" />
      
      {/* Title skeleton */}
      <div className="skeleton-line skeleton-title" />
      
      {/* Description skeleton */}
      <div className="skeleton-line skeleton-description" />
      <div className="skeleton-line skeleton-description short" />
      
      {/* Price skeleton */}
      <div className="skeleton-line skeleton-price" />
      
      {/* Buttons skeleton */}
      <div className="skeleton-buttons">
        <div className="skeleton-button" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}

export function EventSkeleton() {
  return (
    <div className="bento-card skeleton-card">
      {/* Title skeleton */}
      <div className="skeleton-line skeleton-title" />
      
      {/* Tags skeleton */}
      <div className="skeleton-tags">
        <div className="skeleton-tag" />
        <div className="skeleton-tag" />
      </div>
      
      {/* Description skeleton */}
      <div className="skeleton-line skeleton-description" />
      <div className="skeleton-line skeleton-description" />
      
      {/* Button skeleton */}
      <div className="skeleton-buttons">
        <div className="skeleton-button full-width" />
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="bento-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

export function ServicesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="bento-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ServiceSkeleton key={index} />
      ))}
    </div>
  );
}

export function EventsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="bento-grid">
      {Array.from({ length: count }).map((_, index) => (
        <EventSkeleton key={index} />
      ))}
    </div>
  );
}