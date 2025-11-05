import { notFound } from "next/navigation";

const pageCopy: Record<
  string,
  { eyebrow: string; heading: string; body: string }
> = {
  shop: {
    eyebrow: "Limited Releases",
    heading: "Shop the Collection",
    body: "Shop the exclusive Cart Dept capsule collection.",
  },
  collection: {
    eyebrow: "The World's Cultural Cars",
    heading: "The Collection",
    body: "Cart Dept is the biggest collection of cultural automotives in the world. Because we care about culture.",
  },
  events: {
    eyebrow: "Calendar",
    heading: "Upcoming Events",
    body: "Join us for events, automotive exhibitions, and more.",
  },
};

const shopPlaceholders = [
  { id: "cart-01", title: "Cart 01", tag: "Shirt 01" },
  { id: "cart-02", title: "Cart 02", tag: "Shirt 02" },
  { id: "cart-03", title: "Cart 03", tag: "Shirt 03" },
  { id: "cart-04", title: "Cart 04", tag: "Shirt 04" },
  { id: "cart-05", title: "Cart 05", tag: "Shirt 05" },
  { id: "cart-06", title: "Cart 06", tag: "Shirt 06" },
  { id: "cart-07", title: "Cart 07", tag: "Shirt 07" },
  { id: "cart-08", title: "Cart 08", tag: "Shirt 08" },
];

interface SectionPageProps {
  params: Promise<{ section: string }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section } = await params;
  const content = pageCopy[section];
  const isShop = section === "shop";

  if (!content) {
    notFound();
  }

  return (
    <section className="text-white">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">{content.eyebrow}</p>
        <h1 className="mt-6 text-5xl font-semibold uppercase tracking-[0.2em]">{content.heading}</h1>
        <p className="mt-6 text-base text-white/70">{content.body}</p>
      </header>

      {isShop ? (
        <div className="shop-grid mt-12">
          {shopPlaceholders.map((item, index) => (
            <div
              key={item.id}
              className="flex aspect-[3/4] flex-col justify-between rounded-3xl border border-white/20 bg-white/5 p-5 text-left backdrop-blur-sm transition hover:border-white/40"
            >
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">Drop {index + 1}</div>
              <div>
                <p className="text-sm text-white/60">{item.tag}</p>
                <p className="text-2xl font-semibold">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 w-full rounded-3xl border border-white/15 bg-white/5 p-10 text-left text-white/70 backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Placeholder</p>
          <p className="mt-6 text-3xl font-semibold text-white">Single feature panel</p>
          <p className="mt-4 text-base text-white/70">
            A full-width module stands in for future story content for the {content.heading.toLowerCase()} release.
          </p>
        </div>
      )}
    </section>
  );
}

export function generateStaticParams() {
  return Object.keys(pageCopy).map((section) => ({ section }));
}
