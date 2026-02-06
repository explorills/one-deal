import { useState } from 'react'
import {
  User,
  Bell,
  Palette,
  Shield,
  Sun,
  Moon,
  Monitor,
  Wallet,
  AlertTriangle,
  Globe,
  Twitter,
  ExternalLink,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { Button, Input } from '../components/ui'
import { useTheme } from '../context/ThemeContext'
import { formatAddress } from '../lib/utils'
import { users } from '../data/mock'

type SettingsSection = 'profile' | 'notifications' | 'appearance' | 'account'

const NAV_ITEMS: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
  { id: 'account', label: 'Account', icon: <Shield className="h-4 w-4" /> },
]

interface ToggleSwitchProps {
  enabled: boolean
  onToggle: () => void
  label: string
  description?: string
}

function ToggleSwitch({ enabled, onToggle, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
        {description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          enabled ? 'bg-brand-600' : 'bg-zinc-300 dark:bg-zinc-700',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            enabled ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const [section, setSection] = useState<SettingsSection>('profile')
  const { theme, setTheme } = useTheme()

  // Profile state
  const user = users[0]
  const [displayName, setDisplayName] = useState(user.displayName)
  const [bio, setBio] = useState(user.bio ?? '')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [twitter, setTwitter] = useState('')

  // Notification toggles
  const [notifications, setNotifications] = useState({
    itemSold: true,
    bidReceived: true,
    outbid: true,
    auctionEnding: false,
    newFollower: true,
    priceChange: false,
    newsletter: false,
  })

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Manage your account settings and preferences.
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar (desktop) / Tabs (mobile) */}
        <nav className="shrink-0 lg:w-56">
          {/* Mobile tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-zinc-200 pb-1 dark:border-zinc-800 lg:hidden">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-t-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                  section === item.id
                    ? 'border-b-2 border-brand-600 text-brand-600 dark:text-brand-400'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop sidebar */}
          <div className="hidden flex-col gap-1 lg:flex">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                  section === item.id
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            {/* Profile section */}
            {section === 'profile' && (
              <div className="flex flex-col gap-5">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Profile Information
                </h2>

                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell the world about yourself"
                    rows={3}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600"
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />

                <h3 className="mt-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
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

                <div className="flex justify-end pt-2">
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {/* Notifications section */}
            {section === 'notifications' && (
              <div className="flex flex-col">
                <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Notification Preferences
                </h2>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  <ToggleSwitch
                    enabled={notifications.itemSold}
                    onToggle={() => toggleNotification('itemSold')}
                    label="Item Sold"
                    description="Get notified when one of your items is sold"
                  />
                  <ToggleSwitch
                    enabled={notifications.bidReceived}
                    onToggle={() => toggleNotification('bidReceived')}
                    label="Bid Received"
                    description="Get notified when someone places a bid on your item"
                  />
                  <ToggleSwitch
                    enabled={notifications.outbid}
                    onToggle={() => toggleNotification('outbid')}
                    label="Outbid"
                    description="Get notified when you are outbid on an auction"
                  />
                  <ToggleSwitch
                    enabled={notifications.auctionEnding}
                    onToggle={() => toggleNotification('auctionEnding')}
                    label="Auction Ending"
                    description="Get notified when an auction you bid on is about to end"
                  />
                  <ToggleSwitch
                    enabled={notifications.newFollower}
                    onToggle={() => toggleNotification('newFollower')}
                    label="New Follower"
                    description="Get notified when someone follows you"
                  />
                  <ToggleSwitch
                    enabled={notifications.priceChange}
                    onToggle={() => toggleNotification('priceChange')}
                    label="Price Change"
                    description="Get notified when a watched item changes price"
                  />
                  <ToggleSwitch
                    enabled={notifications.newsletter}
                    onToggle={() => toggleNotification('newsletter')}
                    label="Newsletter"
                    description="Receive weekly marketplace updates and tips"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            )}

            {/* Appearance section */}
            {section === 'appearance' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Appearance
                </h2>

                {/* Theme selector */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: 'light', label: 'Light', icon: <Sun className="h-5 w-5" /> },
                      { id: 'dark', label: 'Dark', icon: <Moon className="h-5 w-5" /> },
                      { id: 'system', label: 'System', icon: <Monitor className="h-5 w-5" /> },
                    ] as const).map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          if (opt.id === 'system') {
                            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                            setTheme(prefersDark ? 'dark' : 'light')
                          } else {
                            setTheme(opt.id)
                          }
                        }}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors duration-150',
                          (opt.id === theme || (opt.id === 'system' && false))
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
                            : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700',
                        )}
                      >
                        <span
                          className={cn(
                            opt.id === theme
                              ? 'text-brand-600 dark:text-brand-400'
                              : 'text-zinc-500 dark:text-zinc-400',
                          )}
                        >
                          {opt.icon}
                        </span>
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Language
                  </label>
                  <select
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Espa&#241;ol</option>
                    <option value="fr">Fran&#231;ais</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">&#26085;&#26412;&#35486;</option>
                    <option value="zh">&#20013;&#25991;</option>
                  </select>
                </div>
              </div>
            )}

            {/* Account section */}
            {section === 'account' && (
              <div className="flex flex-col gap-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Account
                </h2>

                {/* Connected wallet */}
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <div className="mb-1 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Connected Wallet
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                    {formatAddress(user.address)}
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Disconnect
                  </Button>
                </div>

                {/* Danger zone */}
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
                  <div className="mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Danger Zone
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-red-600/80 dark:text-red-400/70">
                    Permanently delete your account and all associated data. This action cannot be
                    undone.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
