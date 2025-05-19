// app/page.tsx
import AnimatedHome from "@/components/AnimatedHome"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <AnimatedHome />
      </main>
    </div>
  )
}
