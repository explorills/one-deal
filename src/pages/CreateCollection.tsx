import { useState } from 'react'
import { Image, Globe, Twitter } from 'lucide-react'
import { cn } from '../lib/utils'
import { Button, Input, Badge } from '../components/ui'
import { COLLECTION_CATEGORIES } from '../lib/constants'
import type { Collection, CollectionCategory, CollectionStats } from '../types'
import { CollectionCard } from '../components/collection/CollectionCard'
import { users } from '../data/mock'

export default function CreateCollection() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('')
  const [royalty, setRoyalty] = useState(5)
  const [payoutAddress, setPayoutAddress] = useState('')
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')
  const [discord, setDiscord] = useState('')

  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  function handleBannerFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  // Build a preview collection for the CollectionCard
  const previewStats: CollectionStats = {
    floorPrice: 0,
    totalVolume: 0,
    items: 0,
    owners: 0,
    listedPercentage: 0,
    sevenDayChange: 0,
  }

  const previewCollection: Collection = {
    id: 'preview',
    name: name || 'Collection Name',
    description: description || '',
    image: logoPreview || 'https://picsum.photos/seed/preview-logo/400',
    banner: bannerPreview || 'https://picsum.photos/seed/preview-banner/1400/400',
    creator: {
      address: users[0].address,
      username: users[0].username,
      displayName: users[0].displayName,
      avatar: users[0].avatar,
      isVerified: true,
    },
    isVerified: false,
    category: (category as CollectionCategory) || 'art',
    stats: previewStats,
    createdAt: new Date().toISOString(),
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Create Collection
      </h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Create a new collection to group and showcase your NFTs.
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Form */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Banner upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Banner Image
            </label>
            <label className="cursor-pointer">
              <div
                className={cn(
                  'flex h-40 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors duration-150',
                  'border-zinc-300 bg-zinc-50 hover:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-brand-500',
                )}
              >
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-500">
                    <Image className="h-8 w-8" />
                    <span className="text-xs">Recommended: 1400 x 400px</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerFile}
                className="hidden"
              />
            </label>
          </div>

          {/* Logo upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Logo Image
            </label>
            <label className="cursor-pointer">
              <div
                className={cn(
                  'flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors duration-150',
                  'border-zinc-300 bg-zinc-50 hover:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-brand-500',
                )}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-zinc-400 dark:text-zinc-500">
                    <Image className="h-6 w-6" />
                    <span className="text-[10px]">350x350</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFile}
                className="hidden"
              />
            </label>
          </div>

          <Input
            label="Name *"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Abstract Horizons"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your collection..."
              rows={4}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
            >
              <option value="">Select category</option>
              {COLLECTION_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Royalty */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Royalty Percentage
              </label>
              <Badge>{royalty}%</Badge>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              value={royalty}
              onChange={e => setRoyalty(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-zinc-400">
              <span>0%</span>
              <span>25%</span>
            </div>
          </div>

          <Input
            label="Payout Address"
            value={payoutAddress}
            onChange={e => setPayoutAddress(e.target.value)}
            placeholder="0x..."
          />

          {/* Social links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Social Links
            </h3>
            <Input
              label="Website"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yoursite.com"
              iconLeft={<Globe className="h-4 w-4" />}
            />
            <Input
              label="Twitter"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
              placeholder="@username"
              iconLeft={<Twitter className="h-4 w-4" />}
            />
            <Input
              label="Discord"
              value={discord}
              onChange={e => setDiscord(e.target.value)}
              placeholder="discord.gg/..."
            />
          </div>

          <Button className="mt-4 w-full sm:w-auto">Create Collection</Button>
        </div>

        {/* Preview */}
        <div className="w-full lg:w-72">
          <div className="sticky top-24">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Preview
            </h3>
            <CollectionCard collection={previewCollection} />
          </div>
        </div>
      </div>
    </div>
  )
}
