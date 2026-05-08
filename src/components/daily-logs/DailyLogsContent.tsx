"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";

type DailyLogPost = {
  id: string;
  title: string;
  date: string;
  blurb: string;
  beats: React.ReactNode[];
};

type PostTheme = {
  accent: string;
  softBackground: string;
  softBorder: string;
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
        Today, i went to Compassion Christian Center Henderson Plantation...again...
      </p>,
      <p key="2">
        My Obj was to acquire a TENT.
        <br />
        SUCCESS. [no handle nor strap on tent bag]
      </p>,
      <p key="3">_____</p>,
      <p key="4">i was the first person in line.</p>,
      <p key="5">
        Woman at the intake desk was aggravatingly flighty. i asked if she was on caffeine... she
        said no and i explained my observation.
      </p>,
      <p key="6">
        i gave the same explanation to the interviewer woman who was trying to proselytize mi.🙄
        [this one dropped her Holiness Mask as i answered her question about my relación w Christ.]
      </p>,
      <p key="7">
        i went into the clothing room, found nada, chatted w Trudy about Family [one of her Sons
        self-medicates]... and about Christians being FAKE w &quot;How ya doin?&quot; and NOT
        listening/caring for the honest answer. i gave her my xp as dual diagnosis counselor...oddly,
        her attention waned, as happens when i walk heavy in Truth🌟]
      </p>,
      <p key="8">
        It started raining before i left, so i stayed under the porch cover; i went back in to ask
        if they had a cup o&apos; café bc my body energy is Near Zero today, even w two B12 tabs. No
        coffee, but Janice found mi some non-garbage snacks and a water.
      </p>,
      <p key="9">
        The short staffer woman that walked in w her man just after i arrived talked to mi for a sec
        and then went to the back, returning w a PONCHO😃 Surprise and sweet and needed! i told her
        she is a sweet and warm spirit. We embraced🤗 &quot;It&apos;s the Jesus in me...&quot; i replied
        w a commentary on Seed Of The Divine.🥑🌱
      </p>,
      <p key="10">
        i left, but walked back in to ask about any laundry benefits. i replied to the suggestions
        from the staffer (Pesky Little Hermanita!) w &quot;Gurl, how am i gonna take the bus to
        downtown w no gold?? My charm?&quot;... under her breath, she said, &quot;U got alot of
        it&quot;😅
      </p>,
      <p key="11">
        [to be sure, there are laundry services downtown. i&apos;m about 20 miles away. i also would
        never trust any of those &quot;resource providers&quot; with my laundry.]
      </p>,
      <p key="12">
        i&apos;m ALLWAYS TOO HEAVY for all of these people and NONE has a clue that i&apos;m a former
        minister.
      </p>,
      <p key="13">
        i went out front to wait out the rain. 3 Chatham County cops walk up behind a staffer, enter
        bldg.
      </p>,
      <p key="14">
        When they came out again, a White druggie skank woman was w them. i was minding my biz,
        checking weather on phone and felt her SPIRIT LATCH onto mi and she walked over and stood next
        to mi like &quot;Ah! There u are...sorry I&apos;m late.&quot; GROSS. i immediately stepped into
        the rain, walked to opposite side of porch. Not one minute later, while the burly cop was
        starting his questionnaire on her, she straight lined over to mi again [violating my airspace
        again]. i used my Field Commander Voz- &quot;That&apos;s the last time i&apos;m moving my feet.
        Don&apos;t violate my space again.&quot; Claro, the cop watched and did nada.
      </p>,
      <p key="15">i recalled seeing an overhead cover outback at the food loading area, so i went there.</p>,
      <p key="16">
        The food bag was full of unusable items, so i asked for canned chicken, beef... i got it. And,
        instead of the same blue carry bag, i got a happy tropical bag.
      </p>,
      <p key="17">
        Ray viejo asked if i was former military...&quot;I was wondering if u prefer this lifestyle
        [homeless] vs being in service.&quot; i got to share my USA is the Bad Guys commentary and
        refusal to be Portal Of Darkness.
      </p>,
      <p key="18">
        He came over to shake my hand, i gave him the forearm grasp, he added his other hand [which
        says &quot;I really wanna hug u!!!!&quot; 😉☺️]
      </p>,
      <p key="19">
        It is a unique challenge to be Present, Authentic, and Measured when around these people.
      </p>,
      <p key="20">i Know they&apos;re all tricked.</p>,
      <p key="21">i also Know they are all accountable for their actions, so ....</p>,
      <p key="22">
        i did VERY WELL in walking my path which is divergent: The Destitute Homeless Man &amp; The
        Minister.⚡️🌟⚡️
      </p>,
      <p key="23">01may26</p>,
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
        DJ D was home and unavailable.
      </p>,
      <p key="3">
        M took Jay out for walkies and eventually came to sit at table while i ate beans and rice
        and a baked potato and salad [D&apos;s oil blend plus sal y vinegar was smackalish 😋]
      </p>,
      <p key="4">
        D and i had been having a good convo, enjoying our 1 on 1 😊
      </p>,
      <p key="5">
        i got to see M&apos;s mind and mood slide from Bienvenidos! to ¿Ya te vas? 😲😲😲
      </p>,
      <p key="6">
        The Grand: D knows that i am Witness to what he has to deal with. His wife&apos;s mind is
        deteriorated and damaging relaciónes. And i got triggered by her abrupt mood/speech change
        while in the confined space of the dining nook...!
      </p>,
      <p key="7">
        He &amp; i will continue talking, if he chooses to.
      </p>,
      <p key="8">
        [i believe he said &quot;Don&apos;t worry about taking food to motel--- there&apos;ll be more
        tomorrow.&quot; INVITATION! (?)]
      </p>,
      <p key="9">
        He is obviously open for Healing Ops... ❤️‍🩹❤️‍🩹❤️‍🩹
      </p>,
      <p key="10">A ver... 🌈</p>,
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
        i was &quot;hoping&quot; [🙄hoping is a waste🙄] that they would not go into the treeline bc
        my bag is there.
      </p>,
      <p key="3">*They dismounted at a table and chatted.</p>,
      <p key="4">Then, they walked to the treeline.</p>,
      <p key="5">
        My attention and pulse rate went higher than expected as i envisioned my RESPONSE to them,
        should they touch my bag.
      </p>,
      <p key="6">They bypassed it.</p>,
      <p key="7">
        As they did, i marked my sightlines and hearing range. They were clearly audible and visible.
      </p>,
      <p key="8">
        When they finished their session, they stopped near my bag [reusable large grocery bag, wrapped
        in black trash bag].
      </p>,
      <p key="9">i vocalized a reactive &quot;Chu chuui!&quot;...weakly.</p>,
      <p key="10">
        i realized they were energetically not interested in it and i stayed silent.
      </p>,
      <p key="11">
        They walked out w the woman looking chill and the man looking like an 84 yr old
        Parkinson&apos;s patient, shuffling his slow walk and clenching his shaking fists that were near
        his belt buckle.
      </p>,
      <p key="12">AFFECTED.</p>,
      <p key="13">
        He sat on their table, she stood, they chatted, and then they oozed out of the park.
      </p>,
      <p key="14">No interaction.</p>,
      <p key="15">[tho i did toss them the Peace fingers*]</p>,
      <p key="16">22apr26</p>,
      <p key="17">#Homeless</p>,
      <p key="18">#HomelessSecurity</p>,
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

const postThemes: PostTheme[] = [
  { accent: "#ef4444", softBackground: "rgba(239, 68, 68, 0.12)", softBorder: "rgba(239, 68, 68, 0.45)" },
  { accent: "#f97316", softBackground: "rgba(249, 115, 22, 0.12)", softBorder: "rgba(249, 115, 22, 0.45)" },
  { accent: "#eab308", softBackground: "rgba(234, 179, 8, 0.12)", softBorder: "rgba(234, 179, 8, 0.45)" },
  { accent: "#22c55e", softBackground: "rgba(34, 197, 94, 0.12)", softBorder: "rgba(34, 197, 94, 0.45)" },
  { accent: "#3b82f6", softBackground: "rgba(59, 130, 246, 0.12)", softBorder: "rgba(59, 130, 246, 0.45)" },
];

const DAILY_LOG_PROGRESS_KEY = "dailyLogsProgressByPost";

function flattenText(node: React.ReactNode): string | null {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (Array.isArray(node)) {
    const parts: string[] = [];
    for (const child of node) {
      const value = flattenText(child);
      if (value === null) return null;
      parts.push(value);
    }
    return parts.join("");
  }
  if (isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    if (node.type === "br") return " ";
    return flattenText(element.props.children);
  }
  return null;
}

function splitIntoBeatChunks(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let buffer = "";

  const pushBuffer = () => {
    const trimmed = buffer.trim();
    if (trimmed) chunks.push(trimmed);
    buffer = "";
  };

  for (let index = 0; index < normalized.length; index += 1) {
    if (normalized.slice(index, index + 3) === "...") {
      pushBuffer();
      chunks.push("...");
      index += 2;
      continue;
    }

    const char = normalized[index];
    if (char === "." || char === "," || char === "[" || char === "]" || char === "(" || char === ")") {
      pushBuffer();
      chunks.push(char);
      continue;
    }

    buffer += char;
  }

  pushBuffer();
  return chunks;
}

function expandBeatsToSentenceGranularity(beats: React.ReactNode[]): React.ReactNode[] {
  const expanded: React.ReactNode[] = [];

  for (const beat of beats) {
    if (!isValidElement(beat) || beat.type !== "p") {
      expanded.push(beat);
      continue;
    }

    const paragraph = beat as React.ReactElement<{ children?: React.ReactNode }>;
    const flattened = flattenText(paragraph.props.children);
    if (flattened === null) {
      expanded.push(beat);
      continue;
    }

    const chunks = splitIntoBeatChunks(flattened);
    if (chunks.length <= 1) {
      expanded.push(beat);
      continue;
    }

    const baseKey = beat.key ?? `beat-${expanded.length}`;
    for (let index = 0; index < chunks.length; index += 1) {
      expanded.push(cloneElement(beat, { key: `${String(baseKey)}-s${index}` }, chunks[index]));
    }
  }

  return expanded;
}

export function DailyLogsContent() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [beatIndex, setBeatIndex] = useState(0);
  const [savedProgress, setSavedProgress] = useState<Record<string, number>>({});
  const touchStart = useRef<{ y: number; x: number } | null>(null);
  const expandedBeatsByPostId = useMemo(
    () =>
      Object.fromEntries(
        posts.map((post) => [post.id, expandBeatsToSentenceGranularity(post.beats)] as const)
      ),
    []
  );

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [selectedPostId]
  );
  const selectedPostIndex = selectedPost ? posts.findIndex((post) => post.id === selectedPost.id) : -1;
  const selectedTheme =
    selectedPostIndex >= 0 ? postThemes[selectedPostIndex % postThemes.length] : postThemes[0];
  const previousPost = selectedPostIndex > 0 ? posts[selectedPostIndex - 1] : null;
  const nextPost = selectedPostIndex >= 0 && selectedPostIndex < posts.length - 1 ? posts[selectedPostIndex + 1] : null;

  const activeBeats = selectedPostId ? expandedBeatsByPostId[selectedPostId] ?? [] : [];
  const totalBeats = activeBeats.length;
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
    const targetBeats = expandedBeatsByPostId[id] ?? [];
    const maxBeat = Math.max(0, targetBeats.length - 1);
    setBeatIndex(Math.max(0, Math.min(fromBeat, maxBeat)));
  };

  const leavePost = () => {
    setSelectedPostId(null);
    setBeatIndex(0);
  };

  const openSiblingPost = (direction: "prev" | "next") => {
    if (selectedPostIndex < 0) return;
    const targetIndex = direction === "next" ? selectedPostIndex + 1 : selectedPostIndex - 1;
    if (targetIndex < 0 || targetIndex >= posts.length) return;
    startPost(posts[targetIndex].id);
  };

  const advance = () => {
    if (totalBeats === 0) return;
    setBeatIndex((prev) => Math.min(prev + 1, totalBeats - 1));
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
              className="rounded-2xl border bg-(--chapter-card)/80 p-4 text-left"
              style={{
                borderColor: postThemes[index % postThemes.length].softBorder,
                backgroundColor: postThemes[index % postThemes.length].softBackground,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="font-display text-lg"
                    style={{ color: postThemes[index % postThemes.length].accent }}
                  >
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
                  className="rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition"
                  style={{
                    borderColor: postThemes[index % postThemes.length].accent,
                    color: postThemes[index % postThemes.length].accent,
                  }}
                >
                  Start over
                </button>
                {savedProgress[post.id] > 0 &&
                  savedProgress[post.id] < (expandedBeatsByPostId[post.id]?.length ?? 1) - 1 && (
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
    <article
      className="prose prose-invert prose-p:leading-relaxed max-w-none font-body text-(--foreground) prose-headings:font-display prose-li:marker:text-(--chapter-accent)"
      style={{ ["--chapter-accent" as string]: selectedTheme.accent }}
    >
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
          className="h-full rounded-full transition-all duration-200"
          style={{ backgroundColor: selectedTheme.accent, width: `${progress}%` }}
        />
      </div>

      <div
        role="application"
        aria-label="Tap to continue this daily log"
        className="min-h-[50vh] cursor-pointer select-none rounded-2xl border p-5 sm:p-6"
        style={{ borderColor: selectedTheme.softBorder, backgroundColor: selectedTheme.softBackground }}
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
            {activeBeats[beatIndex] ?? null}
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
            ? nextPost
              ? "End of post. Tap Next post to keep reading."
              : "End of final post. Use All posts to revisit anything."
            : "Tap/click/space to continue · ← to go back · Swipe up/down on mobile."}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (beatIndex >= totalBeats - 1) {
              openSiblingPost("next");
              return;
            }
            advance();
          }}
          disabled={beatIndex >= totalBeats - 1 && !nextPost}
          className="rounded-full border px-4 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: selectedTheme.accent, color: selectedTheme.accent }}
        >
          {beatIndex >= totalBeats - 1 ? (nextPost ? "Next post →" : "End of logs") : "Next →"}
        </button>
      </div>

      <div className="not-prose mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => openSiblingPost("prev")}
          disabled={!previousPost}
          className="rounded-full border border-(--chapter-muted) px-3 py-1 text-xs uppercase tracking-wider text-(--chapter-muted-fg) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous post
        </button>
        <button
          type="button"
          onClick={() => openSiblingPost("next")}
          disabled={!nextPost}
          className="rounded-full border px-3 py-1 text-xs uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50"
          style={{ borderColor: selectedTheme.accent, color: selectedTheme.accent }}
        >
          Next post
        </button>
      </div>
    </article>
  );
}
