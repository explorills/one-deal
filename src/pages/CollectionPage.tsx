import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, Button } from '../components/ui'
import { CollectionBanner } from '../components/collection/CollectionBanner'
import { CollectionStats } from '../components/collection/CollectionStats'
import { NFTCard } from '../components/nft/NFTCard'
import { NFTGrid } from '../components/nft/NFTGrid'
import { ActivityRow } from '../components/nft/ActivityRow'
import { SortDropdown, type SortOption } from '../components/search/SortDropdown'
import { nfts, collections, activities } from '../data/mock'
import { cn } from '../lib/utils'
import type { ActivityType } from '../types'

const collectionTabs = [
  { id: 'items', label: 'Items' },
  { id: 'activity', label: 'Activity' },
]

const activityFilterOptions: { id: ActivityType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'sale', label: 'Sales' },
  { id: 'listing', label: 'Listings' },
  { id: 'bid', label: 'Bids' },
  { id: 'transfer', label: 'Transfers' },
  { id: 'mint', label: 'Mints' },
]

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const collection = collections.find(c => c.id === id)
  const [activeTab, setActiveTab] = useState('items')
  const [sort, setSort] = useState<SortOption>('recently-listed')
  const [activityFilter, setActivityFilter] = useState<ActivityType | 'all'>('all')

  const collectionNFTs = nfts.filter(n => n.collection.id === id)
  const collectionActivities = activities.filter(a => a.nft.collection.id === id)

  const sortedNFTs = [...collectionNFTs].sort((a, b) => {
    switch (sort) {
      case 'price-low-high':
        return a.price - b.price
      case 'price-high-low':
        return b.price - a.price
      case 'most-favorited':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const filteredActivities =
    activityFilter === 'all'
      ? collectionActivities
      : collectionActivities.filter(a => a.type === activityFilter)

  const handleNFTClick = useCallback(
    (nft: { id: string }) => navigate(`/nft/${nft.id}`),
    [navigate],
  )

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Collection not found
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          The collection you're looking for doesn't exist.
        </p>
        <Button variant="outline" onClick={() => navigate('/explore')}>
          Back to Explore
        </Button>
      </div>
    )
  }

  return (
    <div className="-mx-4 flex flex-col gap-6 pb-16 sm:-mx-6">
      {/* Banner */}
      <CollectionBanner collection={collection} />

      {/* Stats + tabs content */}
      <div className="px-4 sm:px-6">
        {/* Stats bar */}
        <CollectionStats stats={collection.stats} className="mb-6" />

        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {collection.description}
        </p>

        {/* Tabs */}
        <Tabs tabs={collectionTabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-4">
          {/* Items tab */}
          {activeTab === 'items' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {sortedNFTs.length} {sortedNFTs.length === 1 ? 'item' : 'items'}
                </span>
                <SortDropdown value={sort} onChange={setSort} />
              </div>
              {sortedNFTs.length > 0 ? (
                <NFTGrid>
                  {sortedNFTs.map(nft => (
                    <NFTCard key={nft.id} nft={nft} onClick={handleNFTClick} />
                  ))}
                </NFTGrid>
              ) : (
                <div className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No items in this collection
                </div>
              )}
            </div>
          )}

          {/* Activity tab */}
          {activeTab === 'activity' && (
            <div>
              {/* Activity type filter */}
              <div className="mb-4 flex flex-wrap gap-2">
                {activityFilterOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setActivityFilter(opt.id)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150',
                      activityFilter === opt.id
                        ? 'bg-brand-600 text-white'
                        : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                {filteredActivities.length > 0 ? (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredActivities.map(act => (
                      <ActivityRow key={act.id} activity={act} />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No activity found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
