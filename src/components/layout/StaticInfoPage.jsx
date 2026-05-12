import { PageSurface } from "./PageSurface";

export const StaticInfoPage = ({ title, eyebrow, description, sections = [] }) => {
  return (
    <PageSurface eyebrow={eyebrow} title={title} description={description}>
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {sections.map((section) => (
            <article
              key={section.heading}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <h2 className="text-lg font-semibold text-charcoal">{section.heading}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageSurface>
  );
};
