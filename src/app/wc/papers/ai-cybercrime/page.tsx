'use client';

import Link from 'next/link';
import { SiteHeader } from '../../../components/SiteHeader';
import { BarrierToEntry } from './_components/BarrierToEntry';
import { CapabilityRamp } from './_components/CapabilityRamp';
import { ExpertQuadrant } from './_components/ExpertQuadrant';
import { AttackChain } from './_components/AttackChain';
import { GovernanceTrilemma } from './_components/GovernanceTrilemma';
import { CapabilityLadder } from './_components/CapabilityLadder';

// Walkthrough source: Pioneer Scholars 2025 final paper by Weibao Chen.
// This page is the living web version, paraphrased and annotated.
// Original PDF + reviewer eval kept locally; do not include verbatim text.

export default function AiCybercrimePaper() {
  return (
    <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-6 pt-24 pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /wc/papers/ai-cybercrime ]
        </p>
        <h1 className="themed-heading mt-3 text-3xl font-bold leading-[1.05] sm:text-5xl">
          The AI-driven democratization of cybercrime
        </h1>
        <p className="mt-3 text-base text-[color:var(--fg-muted)] sm:text-lg">
          A forecast of emergent threats, in four stages.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[color:var(--fg-subtle)]">
          <span className="themed-pill px-3 py-1 font-mono uppercase tracking-widest">
            living draft
          </span>
          <span className="themed-pill px-3 py-1 font-mono uppercase tracking-widest">
            Weibao Chen, 2025
          </span>
          <span className="themed-pill px-3 py-1 font-mono uppercase tracking-widest">
            Pioneer Scholars Institute
          </span>
        </div>

        <div className="mt-10 themed-surface p-5 text-sm leading-relaxed text-[color:var(--fg-muted)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)] mb-2">
            [ ABSTRACT ]
          </p>
          <p>
            Generative AI is changing who can run sophisticated cyberattacks. Where
            spear-phishing, custom malware, and command-and-control infrastructure
            used to require nation-state-level resources or rare individual skill,
            modern models translate plain-language intent into working exploits.
            The barrier is shifting from technical mastery to access to a model.
          </p>
          <p className="mt-3">
            This paper combines a literature review with a four-stage taxonomy of
            agent capability ranging from today&rsquo;s unreliable assistants to
            potentially superhuman attackers, anchored to a 2024 expert survey of
            2,000+ AI researchers (Grace et al.). The taxonomy is the spine; the
            visualizations below let you poke at it.
          </p>
        </div>

        <Section eyebrow="[ FIGURE 1 ]" title="The barrier collapses">
          <p>
            Pre-AI, a layperson trying to mount a serious offensive campaign needed
            elite skill, four-figure budgets, and weeks of work. Post-AI, the
            same layperson can lean on conversational models that handle the
            technical translation. Toggle below to see what changes.
          </p>
          <BarrierToEntry />
        </Section>

        <Section eyebrow="[ FIGURE 2 ]" title="Agent capability ramp">
          <p>
            The four-stage taxonomy maps observed capability today onto expert
            forecasts for the rest of the decade. Drag the year slider to step
            through each stage&rsquo;s technical requirements and what an attacker
            could realistically do at that level.
          </p>
          <CapabilityRamp />
        </Section>

        <Section eyebrow="[ FIGURE 3 ]" title="Stage hurdles, side by side">
          <p>
            Same taxonomy, different cut: each stage paired with the technical
            hurdles a model has to clear to operate at that level. Bottom rungs
            are observed evidence, top rungs are projection (the diagonal
            hatching marks them as such).
          </p>
          <CapabilityLadder />
        </Section>

        <Section eyebrow="[ FIGURE 4 ]" title="Where AI did the work">
          <p>
            A real-world heist (Hong Kong CFO case, Feb 2024, 25M USD) walked
            through one step at a time. Each step is tagged by where AI did the
            work: human-only, AI-assisted, or AI end-to-end.
          </p>
          <AttackChain />
        </Section>

        <Section eyebrow="[ FIGURE 5 ]" title="The expert debate">
          <p>
            Where do leading voices fall on AI&rsquo;s effect on offence vs
            defence? Click any quadrant for the argument summary. Stances are
            paraphrased from public statements, not verbatim quotes.
          </p>
          <ExpertQuadrant />
        </Section>

        <Section eyebrow="[ FIGURE 6 ]" title="Governance trilemma">
          <p>
            Three policy levers as a triangle: open-source access, regulation,
            and antitrust. Drag the point inside to mix the three. The verdict
            reads off which threat surface stays exposed at that blend.
          </p>
          <GovernanceTrilemma />
        </Section>

        <Section eyebrow="[ THE SHAPE ]" title="Why this matters">
          <p>
            Two structural points the paper keeps coming back to:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-[color:var(--fg)]">Deskilling, not just distribution.</strong>{' '}
              Earlier waves of hacking democratization spread tools to more
              hobbyists. AI removes the requirement to <em>understand</em> the
              tool. The pool of plausible attackers grows by orders of magnitude.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Asymmetric novelty.</strong>{' '}
              Offensive AI generates new variants at machine scale. Most current
              defenses pattern-match against known signatures. The arms race is
              structurally tilted while defenders catch up.
            </li>
          </ul>
        </Section>

        <Section eyebrow="[ HONEST NOTE ]" title="What the reviewer flagged">
          <p>
            The original paper was a first-time research project graded B+. The
            reviewer (Prof. Suleyman Uludag, U. Michigan-Flint CS) liked the
            taxonomy and the use of expert-survey grounding, but flagged three
            things this living version intends to address:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-[color:var(--fg)]">Repetition.</strong>{' '}
              Some sections restated each other. The web version is structured
              around figures, not chapters, which forces tighter prose.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Speculation vs evidence.</strong>{' '}
              Stages 3 and 4 were highly conjectural. Visualizations here mark
              forecast ranges in muted color so the user can see where the
              evidence stops and the projection begins.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Depth.</strong>{' '}
              Heavy reliance on secondary sources. Each figure is being paired
              with a primary citation list as it expands.
            </li>
          </ul>
        </Section>

        <Section eyebrow="[ STATUS ]" title="Where this goes next">
          <p>
            This page is the scaffold. Each section of the original paper will
            land here in turn, with the dense passages compressed and the
            interesting numbers turned into widgets. The end state is closer to
            a Bartosz Ciechanowski piece than a PDF: scrollable, pokeable,
            something you can actually share.
          </p>
          <p>
            Eventually, the stable version goes to arXiv as a preprint. Until
            then, this is the working surface.
          </p>
        </Section>

        <div className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          ← Back to <Link href="/wc/papers" className="text-[color:var(--accent)] underline underline-offset-4">/wc/papers</Link>
        </div>
      </article>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="themed-heading mt-2 text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-[color:var(--fg-muted)]">
        {children}
      </div>
    </section>
  );
}
