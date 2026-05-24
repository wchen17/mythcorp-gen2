'use client';

import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';
import { ProgressFigures } from './_components/ProgressFigures';

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

export default function DoubtRambling() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-24">
        <DraftBanner note="A companion to the Calhoun ramble: how doubt gets manufactured to delay action, and the one honest reason for optimism anyway." />

        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /OG · RAMBLINGS ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          Manufactured Doubt
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[color:var(--fg-muted)]">
          You do not have to win an argument against science. You only have to
          make it look unsettled for long enough. Here is the trick, the cost,
          and the curve it could not stop.
        </p>

        <Section kicker="the playbook" title="Doubt is the product">
          <p>
            <em className="text-[color:var(--fg)]">Merchant of Doubt</em>, the
            Oreskes and Conway book and the documentary built from it, traces a
            single tactic across decades. The tobacco industry knew it could not
            disprove that smoking caused cancer, so it did something cheaper: it
            funded just enough contrarian research to keep the question looking
            open. An internal memo put it plainly, doubt was the product they
            were selling.
          </p>
          <p>
            The same consultants, sometimes literally the same people, later took
            the method to acid rain, the ozone hole, and climate change. The goal
            was never to be right. It was to delay, because every year the debate
            looked alive was another year of business as usual.
          </p>
        </Section>

        <Section kicker="the cost" title="Delay is the win condition">
          <p>
            This is the part worth sitting with. A manufactured controversy does
            not need to convince you. It just needs to move you from
            &ldquo;acting&rdquo; to &ldquo;waiting for more data.&rdquo; Inaction
            is the default, and doubt protects the default for free. Decades got
            spent that way.
          </p>
        </Section>

        <Section kicker="and yet" title="The curve it could not stop">
          <p>
            Here is the honest reason for optimism, and it is not
            &ldquo;everything is fine.&rdquo; While the doubt machine bought time
            for the old order, the replacement technologies kept getting cheaper
            on a schedule that turned out to be almost boringly predictable.
          </p>
          <ProgressFigures />
          <p>
            Solar modules cost over seventy dollars a watt in the 1970s and about
            eleven cents a watt now. Electric cars went from a rounding error to
            roughly one in five new cars sold worldwide in about a decade. Neither
            curve cares whether the talk shows called the question settled.
          </p>
        </Section>

        <Section kicker="the true meaning" title="The slogan is not the story">
          <p>
            The popular framing of climate is a shouting match between two
            slogans, doom and denial. Both are easy to hold and both are wrong in
            the same way: they cut the claim loose from the evidence. The actual
            story is quieter and stranger, a learning curve, the kind of thing
            that does not fit on a placard but does fit on a log-scale chart.
          </p>
          <p>
            That is the same failure mode as the{' '}
            <Link href="/og/calhoun" className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]">
              Calhoun ramble
            </Link>
            : a finding gets flattened into whatever version travels easiest.
            Manufacturing doubt and manufacturing a slogan are two ways to do the
            same damage.
          </p>
          <p>
            So the positive thing we can do is unglamorous and specific. Read the
            curve, not the controversy. Build and deploy the cheap clean thing
            faster than the doubt can be re-manufactured. Refuse to let
            &ldquo;it&rsquo;s still debated&rdquo; set the pace when the price per
            watt has already made up its mind.
          </p>
        </Section>

        <div className="mt-12 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          <p className="font-mono uppercase tracking-[0.3em] text-[color:var(--fg-subtle)]">
            sources
          </p>
          <ul className="mt-2 space-y-1">
            <li>Oreskes &amp; Conway (2010), <em>Merchant of Doubt</em>; the 2014 documentary.</li>
            <li>Solar learning curve: Swanson&rsquo;s law; Our World in Data, IRENA. Module price anchors are approximate.</li>
            <li>EV share: IEA Global EV Outlook; Our World in Data. Anchors approximate, in-between years interpolated.</li>
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
