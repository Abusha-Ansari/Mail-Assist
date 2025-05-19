export default function DashboardPage() {
  return (
    <div className="container flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Your email dashboard
          </p>
        </div>
      </div>
    </div>
  )
}