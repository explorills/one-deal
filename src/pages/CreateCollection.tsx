import { useState } from 'react'
import { Image, UploadSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'
import { COLLECTION_CATEGORIES } from '@/lib/constants'

export default function CreateCollection() {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Create Collection</h1>
      <p className="text-sm text-muted-foreground mb-8">Set up a new NFT collection</p>

      <div className="flex flex-col gap-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <Image size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Collection image</p>
          <p className="text-xs text-muted-foreground">Recommended: 400x400</p>
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</label>
          <input type="text" placeholder="Collection name" className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1" />
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Description</label>
          <textarea placeholder="Describe your collection..." rows={3} className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1 resize-none" />
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Category</label>
          <select className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors mt-1">
            {COLLECTION_CATEGORIES.filter((c) => c.value !== 'all').map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <Button size="lg" className="mt-4">
          <UploadSimple size={18} weight="bold" />
          Create Collection
        </Button>
      </div>
    </div>
  )
}
