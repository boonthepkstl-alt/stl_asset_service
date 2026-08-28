import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, FolderTree, Package } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Card, Badge, StatusBadge, Alert, EmptyState } from '@/components/ui';
import { getAssetIcon } from '@/data/asset-icons';
import { categories } from '@/data/fixtures/mockData';
import { useAssets } from '@/hooks/useAssets';

// RAISE-FR-ASSET-002 / Prototype P-005 "Category & Hierarchy" (F-25, OPEN-FINDINGS.md): the
// screen didn't exist at all -- confirmed via grep across navigation.ts/constants.ts/App.tsx.
// This is a scoped-down first cut, not the full taxonomy Prototype P-005 sketches (Computer >
// Notebook/Desktop, Network > Switch/Router, etc.) -- that hierarchy is explicitly illustrative,
// not finalized business data (Prototype §11; AC-ASSET-002's own "NOT TESTABLE YET" note), and
// no PRD/Design document confirms any parent/child grouping beyond the flat `category` string
// Asset already carries. The one parent/child relationship that IS real data is "a category
// contains the assets assigned to it" -- so that's what this tree shows: each category (parent)
// expands to the real assets registered under it (children), satisfying AC-ASSET-002-01's
// "categories displayed in a parent/child hierarchy" display mechanism without inventing
// sub-category content nobody has confirmed. Further taxonomy depth remains TBD.
export function CategoriesPage() {
  const navigate = useNavigate();
  const { assets, loading, error, refetch } = useAssets({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (category: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <AppShell current="categories" onNavigate={(id) => navigate(`/${id}`)} breadcrumb={[{ label: 'RAISE' }, { label: 'Category & Hierarchy' }]}>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-heading font-bold text-surface-900">Category & Hierarchy</h1>
          <p className="text-body text-surface-500">
            Asset categories and the assets registered under each one. Further sub-category
            taxonomy is not yet defined (Prototype §11) -- this first cut shows the confirmed
            parent/child relationship: category → its assets.
          </p>
        </div>

        {error ? (
          <Alert variant="error" title="Unable to load categories">
            {error}{' '}
            <button onClick={refetch} className="underline font-medium">
              Retry
            </button>
          </Alert>
        ) : loading ? (
          <Card className="p-8 text-center text-body text-surface-400">Loading categories...</Card>
        ) : (
          <Card className="p-2">
            {categories.map((category) => {
              const categoryAssets = assets.filter((a) => a.category === category);
              const isOpen = expanded.has(category);
              return (
                <div key={category} className="border-b border-surface-100 last:border-0">
                  <button
                    onClick={() => toggle(category)}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-surface-50 rounded-md transition-colors"
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4 text-surface-400 shrink-0" /> : <ChevronRight className="h-4 w-4 text-surface-400 shrink-0" />}
                    <FolderTree className="h-4 w-4 text-brand-500 shrink-0" />
                    <span className="text-body font-medium text-surface-900 flex-1">{category}</span>
                    <Badge variant="neutral">{categoryAssets.length} asset{categoryAssets.length === 1 ? '' : 's'}</Badge>
                  </button>
                  {isOpen && (
                    <div className="pl-11 pb-2">
                      {categoryAssets.length === 0 ? (
                        <p className="text-caption text-surface-400 py-2">No assets currently in this category.</p>
                      ) : (
                        categoryAssets.map((asset) => {
                          const Icon = getAssetIcon(asset.type);
                          return (
                            <button
                              key={asset.id}
                              onClick={() => navigate(`/assets/${asset.id}`)}
                              className="w-full flex items-center gap-3 py-2 text-left hover:bg-surface-50 rounded-md transition-colors -ml-1 pl-1"
                            >
                              <Icon className="h-4 w-4 text-surface-400 shrink-0" />
                              <span className="text-body text-surface-800 flex-1 min-w-0 truncate">{asset.name}</span>
                              <span className="text-caption text-surface-400 font-mono">{asset.code}</span>
                              <StatusBadge status={asset.status} />
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {categories.length === 0 && (
              <EmptyState icon={<Package className="h-8 w-8 text-surface-400" />} title="No categories defined" description="No asset categories exist yet." />
            )}
          </Card>
        )}
      </div>
    </AppShell>
  );
}
