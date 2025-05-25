export default function TemplateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-12">
      {/* <h1 className="text-2xl font-bold mb-6 text-foreground">Fill in the details</h1> */}
      {children}
    </div>
  );
}
