'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { api } from '@/trpc/react';

interface CourseFiltersProps {
  filters: {
    category: string;
    price: '' | 'free' | 'paid';
  };
  setFilters: (filters: {
    category: string;
    price: '' | 'free' | 'paid';
  }) => void;
}

export function CourseFilters({ filters, setFilters }: CourseFiltersProps) {
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  // Fetch categories dynamically from the API
  const { data: categoriesData, isLoading } = api.public.category.getAll.useQuery();
  const categories = categoriesData?.map(category => category.name) || [];

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          className="w-full justify-between p-4 font-bold"
          onClick={() => setOpenCategory(!openCategory)}
        >
          Category
          <span>{openCategory ? '−' : '+'}</span>
        </Button>

        {openCategory && (
          <div className="p-4 space-y-3 border-t">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={filters.category === category}
                  onChange={() => setFilters({
                    ...filters,
                    category: filters.category === category ? '' : category,
                    // Reset level filter when category changes
                  })}
                  className="h-4 w-4 rounded border-input bg-background"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          className="w-full justify-between p-4 font-bold"
          onClick={() => setOpenPrice(!openPrice)}
        >
          Price
          <span>{openPrice ? '−' : '+'}</span>
        </Button>

        {openPrice && (
          <div className="p-4 space-y-3 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="price-free"
                checked={filters.price === 'free'}
                onChange={() => setFilters({
                  ...filters,
                  price: filters.price === 'free' ? '' : 'free'
                })}
                className="h-4 w-4 rounded border-input bg-background"
              />
              <label
                htmlFor="price-free"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Free
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="price-paid"
                checked={filters.price === 'paid'}
                onChange={() => setFilters({
                  ...filters,
                  price: filters.price === 'paid' ? '' : 'paid'
                })}
                className="h-4 w-4 rounded border-input bg-background"
              />
              <label
                htmlFor="price-paid"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Paid
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}