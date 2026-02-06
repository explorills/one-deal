import { useState } from 'react'
import {
  Upload,
  FileImage,
  X,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { collections } from '../data/mock'
import { Button, Input, Badge } from '../components/ui'

interface TraitPair {
  id: string
  type: string
  value: string
}

const STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Pricing' },
]

const DURATIONS = [
  { value: '1h', label: '1 hour' },
  { value: '6h', label: '6 hours' },
  { value: '24h', label: '24 hours' },
  { value: '3d', label: '3 days' },
  { value: '7d', label: '7 days' },
]

export default function Create() {
  const [step, setStep] = useState(1)

  // Step 1 state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  // Step 2 state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [supply, setSupply] = useState('1')
  const [externalLink, setExternalLink] = useState('')
  const [traits, setTraits] = useState<TraitPair[]>([])

  // Step 3 state
  const [pricingMethod, setPricingMethod] = useState<'fixed' | 'auction'>('fixed')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('7d')
  const [royalty, setRoyalty] = useState(10)

  // Validation display
  const [showErrors, setShowErrors] = useState(false)

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  function addTrait() {
    setTraits(prev => [...prev, { id: crypto.randomUUID(), type: '', value: '' }])
  }

  function updateTrait(id: string, field: 'type' | 'value', val: string) {
    setTraits(prev => prev.map(t => (t.id === id ? { ...t, [field]: val } : t)))
  }

  function removeTrait(id: string) {
    setTraits(prev => prev.filter(t => t.id !== id))
  }

  function handleNext() {
    if (step === 1 && !previewUrl) {
      setShowErrors(true)
      return
    }
    if (step === 2 && !name.trim()) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    setStep(s => Math.min(s + 1, 3))
  }

  function handleBack() {
    setShowErrors(false)
    setStep(s => Math.max(s - 1, 1))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Create NFT</h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Create and list your unique digital asset on the marketplace.
      </p>

      {/* Progress indicator */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s.id)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-150',
                step === s.id
                  ? 'bg-brand-600 text-white'
                  : step > s.id
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
              )}
            >
              {step > s.id ? <Check className="h-4 w-4" /> : s.id}
            </button>
            <span
              className={cn(
                'hidden text-sm font-medium sm:block',
                step === s.id
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 dark:text-zinc-500',
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 sm:w-16',
                  step > s.id ? 'bg-green-500' : 'bg-zinc-200 dark:bg-zinc-800',
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Form area */}
        <div className="flex-1">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Upload File
              </h2>
              <div
                onDragOver={e => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors duration-150',
                  dragOver
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
                    : showErrors && !previewUrl
                      ? 'border-red-400 bg-red-50/50 dark:border-red-600 dark:bg-red-900/10'
                      : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600',
                )}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 rounded-lg object-contain"
                    />
                    <button
                      onClick={() => setPreviewUrl(null)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors duration-150 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-500" />
                    <p className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Drag and drop your file here
                    </p>
                    <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
                      PNG, JPG, GIF, SVG, WEBP. Max 50MB.
                    </p>
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" className="pointer-events-none">
                        <FileImage className="h-4 w-4" />
                        Browse Files
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
              {showErrors && !previewUrl && (
                <p className="mt-2 text-sm text-red-500">Please upload an image file.</p>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Item Details
              </h2>

              <Input
                label="Name *"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Abstract Horizon #42"
                error={showErrors && !name.trim() ? 'Name is required' : undefined}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell buyers about your NFT..."
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Collection
                </label>
                <select
                  value={selectedCollection}
                  onChange={e => setSelectedCollection(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
                >
                  <option value="">Select a collection</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Supply"
                type="number"
                value={supply}
                onChange={e => setSupply(e.target.value)}
                placeholder="1"
                min={1}
              />

              <Input
                label="External Link"
                value={externalLink}
                onChange={e => setExternalLink(e.target.value)}
                placeholder="https://yoursite.com/item"
              />

              {/* Properties */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Properties
                  </label>
                  <Button variant="ghost" size="sm" onClick={addTrait}>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                {traits.length === 0 && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    No properties added yet. Properties show up underneath your item.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {traits.map(trait => (
                    <div key={trait.id} className="flex items-center gap-2">
                      <input
                        value={trait.type}
                        onChange={e => updateTrait(trait.id, 'type', e.target.value)}
                        placeholder="Type (e.g. Color)"
                        className="h-9 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-ring dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                      />
                      <input
                        value={trait.value}
                        onChange={e => updateTrait(trait.id, 'value', e.target.value)}
                        placeholder="Value (e.g. Blue)"
                        className="h-9 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-ring dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                      />
                      <button
                        onClick={() => removeTrait(trait.id)}
                        className="shrink-0 rounded-md p-1.5 text-zinc-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Pricing
              </h2>

              {/* Pricing method toggle */}
              <div className="flex gap-3">
                {(['fixed', 'auction'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => setPricingMethod(method)}
                    className={cn(
                      'flex-1 rounded-xl border-2 px-4 py-4 text-center transition-colors duration-150',
                      pricingMethod === method
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'
                        : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700',
                    )}
                  >
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        pricingMethod === method
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-zinc-700 dark:text-zinc-300',
                      )}
                    >
                      {method === 'fixed' ? 'Fixed Price' : 'Timed Auction'}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {method === 'fixed'
                        ? 'Set a price for buyers.'
                        : 'Allow bids over a time period.'}
                    </p>
                  </button>
                ))}
              </div>

              {/* Price input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {pricingMethod === 'fixed' ? 'Price' : 'Starting Price'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-16 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-600"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      ETH
                    </span>
                  </div>
                </div>
              </div>

              {/* Duration (auction only) */}
              {pricingMethod === 'auction' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 transition-colors duration-150 focus-ring hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
                  >
                    {DURATIONS.map(d => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Royalty slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Royalty
                  </label>
                  <Badge>{royalty}%</Badge>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={royalty}
                  onChange={e => setRoyalty(Number(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => {}}>
                Create NFT
              </Button>
            )}
          </div>
        </div>

        {/* Preview sidebar */}
        <div className="w-full lg:w-80">
          <div className="sticky top-24">
            <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Preview
            </h3>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              {/* Image */}
              <div className="aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="NFT Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-600">
                    <FileImage className="h-12 w-12" />
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="flex flex-col gap-2 p-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedCollection
                    ? collections.find(c => c.id === selectedCollection)?.name
                    : 'No collection'}
                </span>
                <h4 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {name || 'Untitled'}
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.998 1.5l-7.5 12 7.5 4.5 7.5-4.5-7.5-12zm0 18.5l-7.5-4.5 7.5 10.5 7.5-10.5-7.5 4.5z" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {price || '0.00'}
                    </span>
                  </div>
                  {pricingMethod === 'auction' && (
                    <Badge variant="outline">Auction</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
