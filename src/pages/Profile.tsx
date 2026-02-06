import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Copy,
  Check,
  Edit3,
  Image,
  Palette,
  Heart,
  Activity,
  FolderOpen,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react'
import { users, nfts, collections, activities } from '../data/mock'
import { cn, formatAddress, formatCompactNumber } from '../lib/utils'
import { Button, Avatar, Badge, Modal, Input } from '../components/ui'
import { NFTGrid } from '../components/nft/NFTGrid'
import { NFTCard } from '../components/nft/NFTCard'
import { ActivityRow } from '../components/nft/ActivityRow'
import { CollectionCard } from '../components/collection/CollectionCard'

export default function Profile() {
  const { address } = useParams<{ address: string }>()
  const user = users.find(u => u.address === address) ?? users[0]

  const [activeTab, setActiveTab] = useState('owned')
  const [copied, setCopied] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // Mock form state for edit modal
  const [editName, setEditName] = useState(user.displayName)
  const [editBio, setEditBio] = useState(user.bio ?? '')

  const ownedNfts = nfts.filter(n => n.owner.address === user.address)
  const createdNfts = nfts.filter(n => n.creator.address === user.address)
  const favoritedNfts = nfts.slice(0, 3) // mock favorites
  const userCollections = collections.filter(c => c.creator.address === user.address)
  const userActivities = activities.filter(
    a => a.from.address === user.address || a.to?.address === user.address,
  )

  function handleCopy() {
    navigator.clipboard.writeText(user.address).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'owned', label: `Owned`, icon: <Image className="h-4 w-4" /> },
    { id: 'created', label: `Created`, icon: <Palette className="h-4 w-4" /> },
    { id: 'favorited', label: `Favorited`, icon: <Heart className="h-4 w-4" /> },
    { id: 'activity', label: `Activity`, icon: <Activity className="h-4 w-4" /> },
    { id: 'collections', label: `Collections`, icon: <FolderOpen className="h-4 w-4" /> },
  ]

  const tabCounts: Record<string, number> = {
    owned: ownedNfts.length,
    created: createdNfts.length,
    favorited: favoritedNfts.length,
    activity: userActivities.length,
    collections: userCollections.length,
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-brand-600 to-purple-600 sm:h-64">
        {user.banner && (
          <img
            src={user.banner}
            alt="Profile banner"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Profile info */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative -mt-16 flex flex-col items-start gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          {/* Avatar */}
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            size="xl"
            className="h-28 w-28 border-4 border-white shadow-lg dark:border-zinc-900 sm:h-36 sm:w-36"
          />

          <div className="flex flex-1 flex-col gap-2 pb-2">
            {/* Name & verified */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {user.displayName}
              </h1>
              {user.isVerified && (
                <BadgeCheck className="h-6 w-6 text-brand-500" />
              )}
            </div>

            {/* Address + copy */}
            <button
              onClick={handleCopy}
              className="flex w-fit items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 transition-colors duration-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            >
              {formatAddress(user.address)}
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Bio */}
            {user.bio && (
              <p className="max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
                {user.bio}
              </p>
            )}
          </div>

          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="shrink-0"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Items', value: formatCompactNumber(user.stats.nftsOwned) },
            { label: 'Collections', value: formatCompactNumber(user.stats.collections) },
            { label: 'Volume', value: `${formatCompactNumber(user.stats.totalVolume)} ETH` },
            { label: 'Followers', value: formatCompactNumber(user.stats.followers) },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
            {tabs.map(tab => {
              const isActive = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200',
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  <Badge variant={isActive ? 'default' : 'outline'} className="ml-1">
                    {tabCounts[tab.id]}
                  </Badge>
                  {isActive && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-600 dark:bg-brand-400" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="py-6">
            {activeTab === 'owned' && (
              <NFTGrid>
                {ownedNfts.length > 0 ? (
                  ownedNfts.map(nft => (
                    <Link key={nft.id} to={`/nft/${nft.id}`}>
                      <NFTCard nft={nft} />
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No items owned yet.
                  </p>
                )}
              </NFTGrid>
            )}

            {activeTab === 'created' && (
              <NFTGrid>
                {createdNfts.length > 0 ? (
                  createdNfts.map(nft => (
                    <Link key={nft.id} to={`/nft/${nft.id}`}>
                      <NFTCard nft={nft} />
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No items created yet.
                  </p>
                )}
              </NFTGrid>
            )}

            {activeTab === 'favorited' && (
              <NFTGrid>
                {favoritedNfts.map(nft => (
                  <Link key={nft.id} to={`/nft/${nft.id}`}>
                    <NFTCard nft={nft} />
                  </Link>
                ))}
              </NFTGrid>
            )}

            {activeTab === 'activity' && (
              <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                {userActivities.length > 0 ? (
                  userActivities.map(act => (
                    <ActivityRow key={act.id} activity={act} />
                  ))
                ) : (
                  <p className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No activity yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'collections' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userCollections.length > 0 ? (
                  userCollections.map(col => (
                    <Link key={col.id} to={`/collection/${col.id}`}>
                      <CollectionCard collection={col} />
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No collections created yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="lg">
        <div className="flex flex-col gap-5">
          {/* Banner upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Banner Image
            </label>
            <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 transition-colors duration-150 hover:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500">
              <div className="flex flex-col items-center gap-1">
                <Image className="h-6 w-6" />
                <span className="text-xs">Upload banner image</span>
              </div>
            </div>
          </div>

          {/* Avatar upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Avatar
            </label>
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 transition-colors duration-150 hover:border-brand-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500">
              <Image className="h-5 w-5" />
            </div>
          </div>

          <Input
            label="Display Name"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            placeholder="Enter display name"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Bio</label>
            <textarea
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              placeholder="Tell the world about yourself"
              rows={3}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600"
            />
          </div>

          <Input
            label="Website"
            placeholder="https://yoursite.com"
            iconLeft={<ExternalLink className="h-4 w-4" />}
          />
          <Input label="Twitter" placeholder="@username" />
          <Input label="Discord" placeholder="username#0000" />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditOpen(false)}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
