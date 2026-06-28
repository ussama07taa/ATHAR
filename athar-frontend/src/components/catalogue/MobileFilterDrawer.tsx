'use client';

import { X, SlidersHorizontal } from 'lucide-react';
import { FilterPanel, CatalogueFiltersProps } from '@/components/catalogue/CatalogueFilters';

interface MobileFilterDrawerProps extends CatalogueFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  onOpen,
  ...filterProps
}: MobileFilterDrawerProps) {
  const activeCount =
    (filterProps.selectedBrand ? 1 : 0) +
    (filterProps.selectedSize ? 1 : 0) +
    (filterProps.priceMin > filterProps.priceRange.min ||
    filterProps.priceMax < filterProps.priceRange.max
      ? 1
      : 0);

  return (
    <>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Overlay */}
          <div 
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(2px)'
            }}
          />
          
          {/* Content */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '90vh',
            background: '#fff',
            borderRadius: '20px 20px 0 0',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: 0
              }}>
                Filtres {activeCount > 0 && `(${activeCount})`}
              </p>
              <button 
                onClick={onClose}
                style={{ background: 'none', border: 'none', padding: 8, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <FilterPanel {...filterProps} showHeader={false} />

            <button
              onClick={onClose}
              style={{
                marginTop: '30px',
                width: '100%',
                background: '#111',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Voir les résultats
            </button>
          </div>
        </div>
      )}
    </>
  );
}
