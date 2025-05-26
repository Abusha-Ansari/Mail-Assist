export default function TemplateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-12">
      {/* <h1 className="text-2xl font-bold mb-6 text-foreground">Select any of the template to send Mail</h1> */}
      {children}
    </div>
  );
}
