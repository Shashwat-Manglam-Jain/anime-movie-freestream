import Link from "next/link";

interface ContentRowProps {
  title: string;
  href?: string;
  children: React.ReactNode;
}

export function ContentRow({ title, href, children }: ContentRowProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            View All →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {children}
      </div>
    </section>
  );
}
