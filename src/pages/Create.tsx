import { useState } from 'react'
import { UploadSimple, Image } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function Create() {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Create NFT</h1>
      <p className="text-sm text-muted-foreground mb-8">Mint a new digital asset</p>

      <div className="flex flex-col gap-6">
        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <Image size={40} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Drop your file here</p>
          <p className="text-xs text-muted-foreground">PNG, GIF, WEBP, MP4. Max 100MB.</p>
        </div>

        {/* Form fields — bottom-line style */}
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</label>
          <input
            type="text"
            placeholder="Item name"
            className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1"
          />
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Description</label>
          <textarea
            placeholder="Describe your item..."
            rows={3}
            className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Price</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Currency</label>
            <select className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors mt-1">
              <option>ETH</option>
              <option>WETH</option>
              <option>USDC</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Collection</label>
          <select className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors mt-1">
            <option>Select collection</option>
          </select>
        </div>

        <Button size="lg" className="mt-4">
          <UploadSimple size={18} weight="bold" />
          Create Item
        </Button>
      </div>
    </div>
  )
}
