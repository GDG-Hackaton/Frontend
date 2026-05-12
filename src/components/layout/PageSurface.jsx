export const PageSurface = ({ eyebrow, title, description, actions, children }) => {
  return (
    <div className="mt-16 min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight text-charcoal sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
              {description}
            </p>
          ) : null}
          {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </section>
      {children}
    </div>
  );
};
