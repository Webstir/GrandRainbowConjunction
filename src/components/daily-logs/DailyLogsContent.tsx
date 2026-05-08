"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

type DailyLogPost = {
  id: string;
  title: string;
  date: string;
  blurb: string;
  beats: React.ReactNode[];
};

const tiers = [
  { usd: "$7", text: "breakfast combo 🍳🥐" },
  { usd: "$10", text: "footlong hotdog and a cheeseburger 🍔🌭" },
  {
    usd: "$18",
    text: "a Cracker Barrel entrée plus three side dishes that can be extended 12 hrs",
  },
  { usd: "$30", text: "food for today and maybe all of tomorrow" },
  { usd: "$40", text: "🍕 one badass pizza, delivered" },
  { usd: "$60", text: "2 full days of food & drink" },
  {
    usd: "$100",
    text: "3 days of food & drink, body soap, 4 biërs, one gram of Flower Medicina",
  },
  {
    usd: "$200",
    text: "same as 100, plus work pants and 2 tshirts, 1/4 oz of Flower and accessories",
  },
  { usd: "$500", text: "same as 200 + 3 nights in motel" },
  {
    usd: "$1k",
    text: "Next Level; one week in motel, plus restocked hygiene supplies, one week of food, 1/2 oz of Flower",
  },
];

const posts: DailyLogPost[] = [
  {
    id: "02may26-stewardship",
    title: "Stewardship and eating well",
    date: "02may26",
    blurb: "Daily food budgeting while homeless, and the protocols that keep me strong.",
    beats: [
      <p key="intro-1" className="lead text-lg text-(--foreground)/95">
        Eating Well is a challenge while homeless.
      </p>,
      <p key="intro-2">There IS a per/day breakdown of how to use gold that i have found:</p>,
      <div key="tiers" className="not-prose my-6 space-y-2">
        {tiers.map((row) => (
          <div
            key={row.usd}
            className="flex flex-col gap-1 rounded-xl border border-(--chapter-muted) bg-(--chapter-card)/80 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="shrink-0 font-pixel text-sm text-(--chapter-accent)">{row.usd}</span>
            <span className="text-[0.95rem] leading-snug text-(--foreground)/95">= {row.text}</span>
          </div>
        ))}
      </div>,
      <p key="intro-3">
        My Stewardship allows mi to have a Loaves &amp; Fishes XP very regularly: even w the low 💰,
        i&apos;m able to choose how and where i spend the energy and my Order Of Operations tends to
        be comprehensive. Frankly, i do not LOOK, FEEL, nor SMELL like a homeless person bc of my
        protocols! 😁
      </p>,
      <p key="intro-4">
        Also- my Lifestyle of Gratitude helps mi be worthy of Receiving Help, keeping my spirit/mind
        clear, and utilizing the energy to the max efficiency. 💝🌈
      </p>,
    ],
  },
  {
    id: "01may26-compassion-center",
    title: "Compassion Center field log",
    date: "01may26",
    blurb: "Tent secured, weather, cops, boundaries, and grounded presence under pressure.",
    beats: [
      <p key="1" className="lead text-lg text-(--foreground)/95">
        Today, i went to Compassion Christian Center Henderson Plantation... again...
      </p>,
      <p key="2">My Obj was to acquire a TENT. SUCCESS. [no handle nor strap on tent bag]</p>,
      <p key="3">
        i was the first person in line. Woman at the intake desk was aggravatingly flighty. i asked
        if she was on caffeine... she said no and i explained my observation.
      </p>,
      <p key="4">
        i went into the clothing room, found nada, chatted w Trudy about Family [one of her Sons
        self-medicates]... and about Christians being FAKE w &quot;How ya doin?&quot; and NOT
        listening/caring for the honest answer.
      </p>,
      <p key="5">
        It started raining before i left, so i stayed under the porch cover; i went back in to ask
        if they had a cup o&apos; café bc my body energy is Near Zero today, even w two B12 tabs.
      </p>,
      <p key="6">
        The short staffer woman that walked in w her man just after i arrived talked to mi for a sec
        and then went to the back, returning w a PONCHO 😃 Surprise and sweet and needed!
      </p>,
      <p key="7">
        i left, but walked back in to ask about any laundry benefits. i replied to the suggestions
        from the staffer w &quot;Gurl, how am i gonna take the bus to downtown w no gold??&quot;
      </p>,
      <p key="8">
        i&apos;m ALLWAYS TOO HEAVY for all of these people and NONE has a clue that i&apos;m a former
        minister.
      </p>,
      <p key="9">
        i went out front to wait out the rain. 3 Chatham County cops walk up behind a staffer, enter
        bldg... one woman kept violating my space, and i held my boundary.
      </p>,
      <p key="10">
        i recalled seeing an overhead cover outback at the food loading area. The food bag was full
        of unusable items, so i asked for canned chicken, beef... i got it.
      </p>,
      <p key="11">
        Ray viejo asked if i was former military and i shared my refusal to be Portal Of Darkness. He
        came over to shake my hand and we had a real moment.
      </p>,
      <p key="12">
        It is a unique challenge to be Present, Authentic, and Measured when around these people.
      </p>,
      <p key="13">
        i did VERY WELL in walking my path which is divergent: The Destitute Homeless Man &amp; The
        Minister. ⚡️🌟⚡️
      </p>,
    ],
  },
  {
    id: "26apr26-and-then",
    title: "And Then...",
    date: "26apr26",
    blurb: "An intimate home moment, relational shifts, and healing signals.",
    beats: [
      <p key="1">
        i&apos;m running a load of laundry and sitting at D &amp; M&apos;s dining table. ☺️
      </p>,
      <p key="2">
        i got to see M&apos;s mind and mood slide from Bienvenidos! to ¿Ya te vas? 😲😲😲
      </p>,
      <p key="3">
        D knows that i am Witness to what he has to deal with. His wife&apos;s mind is deteriorated
        and damaging relaciónes.
      </p>,
      <p key="4">
        He &amp; i will continue talking, if he chooses. He is obviously open for Healing Ops...
        ❤️‍🩹❤️‍🩹❤️‍🩹 A ver... 🌈
      </p>,
    ],
  },
  {
    id: "22apr26-park-security",
    title: "Park security watch",
    date: "22apr26",
    blurb: "Threat detection, situational awareness, and choosing calibrated response.",
    beats: [
      <p key="1">
        Two druggies rolled into the park on bikes. My energy sensors detected them at the fence
        while i was half asnooze.
      </p>,
      <p key="2">
        They dismounted at a table and chatted. Then, they walked to the treeline. My pulse rate went
        higher than expected as i envisioned my RESPONSE, should they touch my bag.
      </p>,
      <p key="3">
        When they finished their session, they stopped near my bag. i vocalized a reactive
        &quot;Chu chuui!&quot;... weakly.
      </p>,
      <p key="4">
        They walked out w the woman looking chill and the man looking like an 84 yr old Parkinson&apos;s
        patient. AFFECTED.
      </p>,
      <p key="5">
        No interaction. [tho i did toss them the Peace fingers*] #Homeless #HomelessSecurity
      </p>,
    ],
  },
  {
    id: "11aug25-rad-stuff",
    title: "Rad stuff while homeless",
    date: "11aug25",
    blurb: "A living record of service, artistry, and practical impact across cities.",
    beats: [
      <h2 key="h2" className="mt-2 font-display text-2xl text-(--chapter-accent) sm:text-3xl">
        RAD STUFF i HAVE DONE WHILE Homeless. ✨⚡️🌈
      </h2>,
      <p key="ithaca-title" className="font-display text-xl text-(--chapter-accent)">
        ITHACA &apos;23-&apos;24
      </p>,
      <ul key="ithaca-list" className="space-y-2">
        <li>🎤 Open mic nights at Sacred Root 🎸🎹</li>
        <li>Sat in on Tracy R&apos;s concert after mtg at open mic 🎵</li>
        <li>Made a moving company 🚚📦</li>
        <li>🎹 Played Live Piano at a Korean karaoke house, once on my Birthday 🥳🎤</li>
      </ul>,
      <p key="hard-title" className="font-display text-xl text-(--chapter-accent)">
        HARDEEVILE &apos;24-&apos;25
      </p>,
      <ul key="hard-list" className="space-y-2">
        <li>Gave 50k of billable services to owner, at no charge.</li>
        <li>Increased property value by ~10% per junk car moved.</li>
        <li>Maintained regular PMCS protocol on every vehicle i drove.</li>
        <li>Successfully coached owner into fully stopping text driving.</li>
      </ul>,
      <p key="everywhere-1">
        EVERYWHERE: i establish Healthy &amp; Respectfull relationships w cashiers, workers, puppies,
        cats, and Humans in my neighborhood.
      </p>,
      <p key="everywhere-2">
        This is COMMUNITY BUILDING and, inherently, increased SECURITY for All ❣️❣️
      </p>,
      <p key="close" className="text-center font-display text-xl text-(--chapter-accent)">
        🌈 i Am The Grand Rainbow Conjunction. 🌈
      </p>,
    ],
  },
];

const DAILY_LOG_PROGRESS_KEY = "dailyLogsProgressByPost";

export function DailyLogsContent() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [beatIndex, setBeatIndex] = useState(0);
  const [savedProgress, setSavedProgress] = useState<Record<string, number>>({});
  const touchStart = useRef<{ y: number; x: number } | null>(null);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [selectedPostId]
  );

  const visibleBeats = selectedPost ? selectedPost.beats.slice(0, beatIndex + 1) : [];
  const totalBeats = selectedPost?.beats.length ?? 0;
  const progress = totalBeats > 0 ? Math.round(((beatIndex + 1) / totalBeats) * 100) : 0;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DAILY_LOG_PROGRESS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, number>;
      setSavedProgress(parsed);
    } catch {
      // Ignore malformed storage and keep defaults.
    }
  }, []);

  useEffect(() => {
    if (!selectedPostId) return;
    const previous = savedProgress[selectedPostId];
    if (previous === undefined || previous === beatIndex) return;
    const next = { ...savedProgress, [selectedPostId]: beatIndex };
    setSavedProgress(next);
    window.localStorage.setItem(DAILY_LOG_PROGRESS_KEY, JSON.stringify(next));
  }, [selectedPostId, beatIndex, savedProgress]);

  const startPost = (id: string, fromBeat = 0) => {
    setSelectedPostId(id);
    const targetPost = posts.find((post) => post.id === id);
    const maxBeat = Math.max(0, (targetPost?.beats.length ?? 1) - 1);
    setBeatIndex(Math.max(0, Math.min(fromBeat, maxBeat)));
  };

  const leavePost = () => {
    setSelectedPostId(null);
    setBeatIndex(0);
  };

  const advance = () => {
    if (!selectedPost) return;
    setBeatIndex((prev) => Math.min(prev + 1, selectedPost.beats.length - 1));
  };

  const retreat = () => {
    setBeatIndex((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (!selectedPost) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space" || e.code === "ArrowRight") {
        e.preventDefault();
        advance();
      }
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        retreat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPost, beatIndex]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
    touchStart.current = { y: e.clientY, x: e.clientX };
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!touchStart.current) return;
    const dy = e.clientY - touchStart.current.y;
    const dx = e.clientX - touchStart.current.x;
    touchStart.current = null;
    if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx)) {
      if (dy < 0) advance();
      else retreat();
    }
  };

  if (!selectedPost) {
    return (
      <article className="prose prose-invert prose-p:leading-relaxed max-w-none font-body text-(--foreground) prose-headings:font-display prose-headings:text-(--chapter-accent)">
        <h1 className="font-display text-3xl text-(--chapter-accent) sm:text-4xl">Daily logs</h1>
        <p className="lead text-lg text-(--foreground)/95">
          Pick a post to begin a tap-essay reading flow.
        </p>

        <div className="not-prose mt-8 grid gap-3">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="rounded-2xl border border-(--chapter-muted) bg-(--chapter-card)/80 p-4 text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg text-(--chapter-accent)">
                    {String(index + 1).padStart(2, "0")} · {post.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-(--chapter-muted-fg)">
                    {post.date}
                  </p>
                </div>
                <span className="rounded-full border border-(--chapter-muted) px-2.5 py-1 text-[10px] uppercase tracking-wider text-(--chapter-muted-fg)">
                  {post.beats.length} beats
                </span>
              </div>
              <p className="mt-2 text-sm text-(--foreground)/90">{post.blurb}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => startPost(post.id)}
                  className="rounded-full border border-(--chapter-accent) px-3 py-1 text-xs uppercase tracking-wider text-(--chapter-accent) transition hover:bg-(--chapter-accent)/10"
                >
                  Start over
                </button>
                {savedProgress[post.id] > 0 && savedProgress[post.id] < post.beats.length - 1 && (
                  <button
                    type="button"
                    onClick={() => startPost(post.id, savedProgress[post.id])}
                    className="rounded-full border border-(--chapter-muted) px-3 py-1 text-xs uppercase tracking-wider text-(--chapter-muted-fg) transition hover:border-(--chapter-accent) hover:text-(--chapter-accent)"
                  >
                    Resume beat {savedProgress[post.id] + 1}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="prose prose-invert prose-p:leading-relaxed max-w-none font-body text-(--foreground) prose-headings:font-display prose-headings:text-(--chapter-accent) prose-li:marker:text-(--chapter-accent)">
      <div className="not-prose mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={leavePost}
          className="rounded-full border border-(--chapter-muted) px-4 py-1.5 text-sm text-(--chapter-muted-fg) hover:border-(--chapter-accent) hover:text-(--chapter-accent)"
        >
          ← All posts
        </button>
        <p className="text-xs uppercase tracking-wider text-(--chapter-muted-fg)">
          {selectedPost.date} · beat {beatIndex + 1} of {totalBeats}
        </p>
      </div>

      <h1 className="font-display text-3xl text-(--chapter-accent) sm:text-4xl">{selectedPost.title}</h1>

      <div className="not-prose mb-6 mt-4 h-1.5 w-full overflow-hidden rounded-full bg-(--chapter-muted)">
        <div
          className="h-full rounded-full bg-(--chapter-accent) transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        role="application"
        aria-label="Tap to continue this daily log"
        className="min-h-[50vh] cursor-pointer select-none rounded-2xl border border-(--chapter-muted) bg-(--chapter-card)/40 p-5 sm:p-6"
        onClick={advance}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={beatIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {visibleBeats.map((beat, index) => (
              <div key={index} className={index === 0 ? "" : "mt-4"}>
                {beat}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="not-prose mt-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            retreat();
          }}
          disabled={beatIndex === 0}
          className="rounded-full border border-(--chapter-muted) px-4 py-1.5 text-sm text-(--foreground) disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Back
        </button>
        <p className="text-center text-sm text-(--chapter-muted-fg)">
          {beatIndex >= totalBeats - 1
            ? "End of post. Tap All posts to choose another."
            : "Tap/click/space to continue · ← to go back · Swipe up/down on mobile."}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            advance();
          }}
          disabled={beatIndex >= totalBeats - 1}
          className="rounded-full border border-(--chapter-accent) px-4 py-1.5 text-sm text-(--chapter-accent) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </article>
  );
}
