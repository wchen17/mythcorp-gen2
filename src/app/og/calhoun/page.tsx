'use client';

import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';

const PHASES = [
  { tag: 'A', name: 'Strive', note: 'The founders explore, claim ground, establish order.' },
  { tag: 'B', name: 'Exploit', note: 'Rapid growth. Social roles still have room for newcomers.' },
  { tag: 'C', name: 'Stagnation', note: 'Every niche is filled. The surplus has nowhere to fit, and withdraws.' },
  { tag: 'D', name: 'Death', note: 'A generation never learns courtship, conflict, or care. The colony quietly runs out.' },
] as const;

function Section({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        {kicker}
      </p>
      <h2 className="themed-heading mt-2 text-2xl font-semibold md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-[color:var(--fg-muted)]">
        {children}
      </div>
    </section>
  );
}

export default function CalhounRambling() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-24">
        <DraftBanner note="A ramble about a mouse paradise, what people think it meant, and what it actually meant. Loosely a companion to the behavioral-sink mode in the lab." />

        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /OG · RAMBLINGS ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          The Calhoun Effect
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[color:var(--fg-muted)]">
          A perfect world for mice, and the slow, strange way it ended. The
          headline version of this story is wrong in a way that matters.
        </p>

        <Section kicker="the paradise" title="Universe 25">
          <p>
            Between 1968 and 1973, the ethologist John B. Calhoun built a pen at
            the U.S. National Institute of Mental Health and called it Universe
            25. Unlimited food and water. Endless nesting material. No predators,
            no disease, a climate held at a comfortable constant. A literal utopia
            for mice. He seeded it with four healthy pairs.
          </p>
          <p>
            The population doubled roughly every 55 days, peaked near 2,200, then
            slid all the way to extinction. The last mouse died with the food
            hoppers still full.
          </p>
        </Section>

        <Section kicker="the arc" title="Four phases to zero">
          <ul className="grid gap-3 sm:grid-cols-2">
            {PHASES.map((p) => (
              <li key={p.tag} className="themed-surface p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-lg font-semibold text-[color:var(--accent-soft)]">
                    {p.tag}
                  </span>
                  <span className="font-serif text-base font-semibold text-[color:var(--fg)]">
                    {p.name}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-[color:var(--fg-muted)]">{p.note}</p>
              </li>
            ))}
          </ul>
          <p>
            Calhoun named the most striking residents of the final phase{' '}
            <em className="text-[color:var(--fg)]">the beautiful ones</em>: mice
            that only ate, slept, and groomed. Flawless coats. No scars. No
            interest in mating, fighting, or raising young. They were, by every
            surface measure, the healthiest animals in the pen. They were also
            the end of it.
          </p>
        </Section>

        <Section kicker="the popular reading" title="What people think it meant">
          <p>
            The story that traveled was <strong className="text-[color:var(--fg)]">overpopulation</strong>.
            Too many bodies in too small a space, therefore doom; a tidy
            cautionary tale for a crowded planet. It fit the anxieties of the
            1970s, it made a clean headline, and so it spread.
          </p>
        </Section>

        <Section kicker="the true meaning" title="What it actually meant">
          <p>
            Space was never the binding constraint. There was room to the end.
            There was food to the end. What ran out was <em className="text-[color:var(--fg)]">roles</em>.
            Once every social niche was occupied, each new mouse arrived into a
            world that had no need for it. Stripped of a part to play, they did
            not fight harder for some scarce thing, because there was no scarce
            thing. They simply withdrew into grooming and waiting.
          </p>
          <blockquote className="border-l-2 border-[color:var(--accent-soft)] pl-4 text-[color:var(--fg)]">
            Calhoun called the endpoint a &ldquo;spiritual death&rdquo; that
            arrived well before the physical one. The danger was not too little.
            It was too much, with nothing to do.
          </blockquote>
          <p>
            Abundance without purpose turned out to be its own kind of famine.
            That is the part the headline drops, and it is the only part worth
            keeping.
          </p>
        </Section>

        <Section kicker="why this keeps me up" title="Merchants of doubt, merchants of slogans">
          <p>
            Here is the uncomfortable bit. The true meaning above was never
            hidden. Calhoun wrote it down plainly. Yet the version that traveled
            was the flatter, scarier, more useful one. That is not an accident of
            bad memory. It is a mechanism.
          </p>
          <p>
            <em className="text-[color:var(--fg)]">Merchant of Doubt</em> (the
            Oreskes and Conway book, and the documentary built from it) is about a
            specific trick. The tobacco and then the fossil-fuel industries
            learned you do not need to win the argument against science. You only
            need to manufacture <em className="text-[color:var(--fg)]">enough
            doubt</em> to stall it: rent a few credentialed-looking voices, demand
            impossible certainty, frame a settled finding as &ldquo;still
            debated.&rdquo;
          </p>
          <p>
            Manufacturing doubt and flattening meaning look like opposites, but
            they are the same move. Both cut a claim loose from the evidence that
            produced it. One does it by adding noise (&ldquo;we cannot really be
            sure&rdquo;); the other by adding a story (&ldquo;it was just
            overpopulation&rdquo;). Either way the original finding, nuance and
            all, stops traveling. What travels instead is the version that is easy
            to hold and convenient to believe.
          </p>
        </Section>

        <Section kicker="the throughline" title="Ideas have beautiful ones too">
          <p>
            The Universe 25 mice lost their roles and stopped becoming anything.
            Ideas have a version of the same failure. Detached from the work that
            produced them, they get groomed into slogans, flawless and inert, and
            stop meaning anything.
          </p>
          <p>
            The fix is the unglamorous one. Go back to the source. Sit with the
            messy version. Refuse the slogan even when the slogan happens to be on
            your side.
          </p>
        </Section>

        <div className="themed-surface mt-14 p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ see it run ]
          </p>
          <h2 className="themed-heading mt-2 text-xl font-semibold">
            Watch the sink form
          </h2>
          <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
            The lab has a behavioral-sink mode: a population of points that grows,
            crowds into a central sink, sheds the pale and still &ldquo;beautiful
            ones,&rdquo; then collapses. It loops through Calhoun&rsquo;s four
            phases.
          </p>
          <Link
            href="/experience?mode=calhoun"
            className="themed-button mt-4 inline-block px-5 py-2.5 text-sm tracking-[0.15em]"
          >
            ENTER THE BEHAVIORAL SINK →
          </Link>
        </div>

        <div className="mt-12 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          <p className="font-mono uppercase tracking-[0.3em] text-[color:var(--fg-subtle)]">
            sources
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              Calhoun, J. B. (1973), &ldquo;Death Squared: The Explosive Growth
              and Demise of a Mouse Population.&rdquo;
            </li>
            <li>
              Oreskes &amp; Conway (2010), <em>Merchant of Doubt</em>; the 2014
              documentary of the same name.
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=LuCans9euxY"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--accent)] underline underline-offset-4"
              >
                The video that sent me down this hole
              </a>
              .
            </li>
          </ul>
          <p className="mt-6">
            ← Back to{' '}
            <Link href="/og" className="text-[color:var(--accent)] underline underline-offset-4">
              the sketches
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
