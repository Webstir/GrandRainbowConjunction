"use client";

import type { ReactNode } from "react";

type FaqItem = {
  question: string;
  paragraphs: ReactNode[];
};

const FAQS: FaqItem[] = [
  {
    question: "¿Why don't u get a job?",
    paragraphs: [
      <>
        i have achieved Obsolescence: since before the AI Era, i have been
        disqualified from regular, high school diploma–requiring positions. i
        have ceded to lying on my applications, omitting my education
        coursework, degrees, and higher functions. i have avoided sharing ways
        i can be a Value-Add to any organization because the HR interviewer
        always seems to end the interview when i ask <em>A</em> question.
      </>,
    ],
  },
  {
    question: "¿Why don't u get welfare?",
    paragraphs: [
      <>
        i have sat inside a food pantry, inside the welfare office, with the
        social worker AND her trainee/shadow, with her filling out the welfare
        packet, mi signing it. i — AGAIN — received ZERO welfare benefits, nor
        an explanation. [in this example, i was in Ithaca w St John&apos;s
        Services and i DID get a bus pass.]
      </>,
    ],
  },
  {
    question: "¿Why don't u stay in a shelter?",
    paragraphs: [
      <>
        i went to the shelter system after failing suicide. The Church took mi
        there. It was the most ludicrous, obvious Plantation psyops i&apos;ve
        ever witnessed. Ultimately, the staff violently accosted mi — THREE
        people, touching mi thru the dinner table and chairs, and one from
        behind — in addition to their forced indoctrination [Sermon* For Dinner
        Exchange], the HVAC system was caked full of black mold, the showers
        were full of various colors of mold, and the mandatory shower shoes were
        never cleaned between users. [&quot;Where do i put my used shower
        shoes?&quot; &quot;Where the hell did ya get em?! Well, put it there,
        damn!&quot;]
      </>,
      <>
        The shelters r another Prison Experiment: the security team of St
        John&apos;s Ithaca touched mi between my legs during security checks,
        multiple times. The bedroom doors HAD to stay opened at all times and
        the bathroom/toilet was always so dirty, i requested cleaning supplies
        along w my bed linens each day. ¡Yuk! 🤢
      </>,
    ],
  },
  {
    question: "¿Did u try The Church?",
    paragraphs: [
      <>
        The Church took mi to the moldy shelter. They also offered mi a
        tent… but i could not pitch it on their bigass campus! [seriously, this
        church sits on what looks like half of Binghamton University&apos;s
        property!] People have recalled how i used to work for The Church and
        asked ¿Why not work for them? The Reason is: i have directly seen the
        corruption by being the Right Hand to The Man [i worked very closely w
        spiritual leaders], i&apos;ve been bad-touched by The Man, and i
        see/feel the same corruption in The Church as w capitalism.
      </>,
    ],
  },
  {
    question: "¿Why don't u drive a bigrig?",
    paragraphs: [
      <>
        i LOVE DRIVING! 🤩 But….. ALL the motor carriers run their companies
        like gangsters and the last company i drove for stole my 💰💰💰 AND
        left mi in a vehicle that would get mi and my Class A License in
        trouble w DOT. [because they stole less than 10k from mi, no attorney i
        called was interested in the stolen wages case.]
      </>,
      <>
        Additionally, the motor carriers&apos; job solicitations have
        stipulations like &quot;must have X verifiable miles in Y past
        years&quot; which ALWAYS exclude mi. [20 years of Class A licensure w
        ZERO INCIDENTS, ZERO CRIMINAL RECORD, ZERO ACCIDENTS, and ZERO CUSTOMER
        COMPLAINTS and they can&apos;t aggregate…!]
      </>,
    ],
  },
  {
    question: "¿Why don't u teach Music?",
    paragraphs: [
      <>i do not have a Teaching Credential in any US state and do not have gold to procure one.</>,
    ],
  },
  {
    question: "¿R u a Help-Refusing Complainer?",
    paragraphs: [
      <>
        i have recently been labelled a Help-Refusing Complainer. Actually, i
        Accept all real Help! 🤓 Whatever i see as a PROBLEM is actually part
        of an equation, looking for solution. i only refuse &quot;help&quot; if
        it&apos;s something i have PROVEN does not work a/o does not apply to
        my situation. [For example: i have had suggestions of drug rehab
        residencies… but i&apos;m not a druggie, therefore, i do not qualify! i
        have had recommendations to join the military… 👴🏽 but i&apos;m too old!
        i have had prompting to go to a Talk Doctor, but they only take notes on
        my rad and relevant Healthy Perspectives, Etc… 🙄]
      </>,
    ],
  },
];

export function FaqsAccordion() {
  return (
    <aside
      className="not-prose my-10 rounded-2xl border border-(--chapter-muted) bg-(--chapter-card)/60 px-4 py-6 sm:px-6"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="mb-4 font-display text-lg text-(--chapter-accent)">
        The Homelessness Catch 22: The FAQs
      </h3>
      <div className="space-y-2">
        {FAQS.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-(--chapter-muted)/80 bg-(--background)/40 open:border-(--chapter-accent)/35"
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-medium text-(--foreground) marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                <span className="text-pretty pr-2">{item.question}</span>
                <span
                  className="mt-0.5 shrink-0 text-(--chapter-muted-fg) transition-transform group-open:rotate-180"
                  aria-hidden
                >
                  ▼
                </span>
              </span>
            </summary>
            <div className="border-t border-(--chapter-muted)/60 px-4 pb-4 pt-3 text-sm leading-relaxed text-(--chapter-muted-fg) [&_em]:text-(--foreground)/90">
              {item.paragraphs.map((p, i) => (
                <p key={i} className={i > 0 ? "mt-3" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
      <p className="mt-6 border-t border-(--chapter-muted)/60 pt-4 text-sm italic text-(--chapter-muted-fg)">
        *One of the repeat &quot;preachers&quot; wore a t shirt w
        &quot;H.N.I.C.&quot; emblazoned on the chest. 😶
      </p>
      <p className="mt-3 text-center text-lg" aria-hidden>
        🌈
      </p>
    </aside>
  );
}
