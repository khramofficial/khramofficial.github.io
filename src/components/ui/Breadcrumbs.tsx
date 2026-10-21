export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9rem] text-lavender" role="list">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true" className="text-gold/60">
                /
              </span>
            ) : null}
            {item.href ? (
              <a href={item.href} className="text-lavender no-underline hover:text-gold">
                {item.label}
              </a>
            ) : (
              <span aria-current="page" className="text-ivory/90">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
