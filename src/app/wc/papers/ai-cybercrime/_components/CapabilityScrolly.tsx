'use client';

import { useState } from 'react';
import { Scrolly, type ScrollyStep } from '../../_components/Scrolly';
import { CapabilityRamp } from './CapabilityRamp';

const STEPS: ScrollyStep[] = [
  {
    id: 'stage-1',
    body: (
      <div>
        <h3 className="font-serif text-2xl font-semibold text-[color:var(--fg)]">
          Stage 1, Unreliable Agent
        </h3>
        <p className="mt-3 text-[color:var(--fg-muted)]">
          Today. The model drafts the spear-phishing email but a human still picks
          targets, runs the campaign, and patches mistakes. Manus AI ran a
          payment-processing site end to end in a 2024 demo, and stalled hard the
          moment anything off-script happened.
        </p>
        <p className="mt-3 text-sm text-[color:var(--fg-subtle)]">
          The bottleneck is not creativity, it is reliability. Five-step plans, yes.
          Fifty, no.
        </p>
      </div>
    ),
  },
  {
    id: 'stage-2',
    body: (
      <div>
        <h3 className="font-serif text-2xl font-semibold text-[color:var(--fg)]">
          Stage 2, Reliable Agent
        </h3>
        <p className="mt-3 text-[color:var(--fg-muted)]">
          Grace et al. (2024) puts a 50% probability on autonomous site
          construction by 2028. At this point, an attacker briefs the model on a
          target and walks away. The model handles ten-plus sub-tasks, picks tools,
          recovers from common errors.
        </p>
        <p className="mt-3 text-sm text-[color:var(--fg-subtle)]">
          The deskilling shock lands here: technical mastery stops being the gate.
        </p>
      </div>
    ),
  },
  {
    id: 'stage-3',
    body: (
      <div>
        <h3 className="font-serif text-2xl font-semibold text-[color:var(--fg)]">
          Stage 3, Superhuman Coder
        </h3>
        <p className="mt-3 text-[color:var(--fg-muted)]">
          Long-horizon planning across days. Self-improving code review. Novel
          exploit synthesis from primitives, not just recombination. The same
          survey assigns a 50% chance to autonomous fine-tuning of frontier models
          by 2028, which is the upstream capability for this.
        </p>
        <p className="mt-3 text-sm text-[color:var(--fg-subtle)]">
          Defenders relying on signature matching are now permanently behind.
        </p>
      </div>
    ),
  },
  {
    id: 'stage-4',
    body: (
      <div>
        <h3 className="font-serif text-2xl font-semibold text-[color:var(--fg)]">
          Stage 4, Superhuman Attacker
        </h3>
        <p className="mt-3 text-[color:var(--fg-muted)]">
          Cross-domain synthesis (cyber + social + physical). Campaign-level
          autonomy. The attacker is the AI; the human just initiates. HLMI median
          forecast moved from 2060 to 2047 between the 2022 and 2024 surveys, so
          the timeline shortens with each iteration.
        </p>
        <p className="mt-3 text-sm text-[color:var(--fg-subtle)]">
          Alignment becomes the dominant unknown. The defensive surface is no
          longer the relevant frame.
        </p>
      </div>
    ),
  },
];

export function CapabilityScrolly() {
  const [active, setActive] = useState(0);
  const stageNum = (active + 1) as 1 | 2 | 3 | 4;
  return (
    <Scrolly
      figure={<CapabilityRamp activeStageNum={stageNum} />}
      steps={STEPS}
      onActiveChange={setActive}
    />
  );
}
