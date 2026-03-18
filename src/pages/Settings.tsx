import { Button } from '@/components/ui/Button'

export default function Settings() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your account</p>

      <div className="flex flex-col gap-6">
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Display Name</label>
          <input type="text" placeholder="Your name" className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Username</label>
          <input type="text" placeholder="@username" className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1 font-mono" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Bio</label>
          <textarea placeholder="Tell us about yourself..." rows={3} className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1 resize-none" />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</label>
          <input type="email" placeholder="you@example.com" className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mt-1" />
        </div>
        <Button size="lg" className="mt-4">Save Changes</Button>
      </div>
    </div>
  )
}
