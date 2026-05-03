export function DailyLogsContent() {
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

  return (
    <article className="prose prose-invert prose-p:leading-relaxed max-w-none font-body text-(--foreground) prose-headings:font-display prose-headings:text-(--chapter-accent) prose-strong:text-(--foreground) prose-li:marker:text-(--chapter-accent)">
      <h1 className="font-display text-3xl text-(--chapter-accent) sm:text-4xl">
        Daily logs
      </h1>

      <p className="lead text-lg text-(--foreground)/95">
        Eating Well is a challenge while homeless.
      </p>

      <p>
        There IS a per/day breakdown of how to use gold that i have found:
      </p>

      <div className="not-prose my-8 space-y-2">
        {tiers.map((row) => (
          <div
            key={row.usd}
            className="flex flex-col gap-1 rounded-xl border border-(--chapter-muted) bg-(--chapter-card)/80 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
          >
            <span className="shrink-0 font-pixel text-sm text-(--chapter-accent)">
              {row.usd}
            </span>
            <span className="text-[0.95rem] leading-snug text-(--foreground)/95">
              = {row.text}
            </span>
          </div>
        ))}
      </div>

      <p>
        My Stewardship allows mi to have a Loaves &amp; Fishes XP very regularly:
        even w the low 💰, i&apos;m able to choose how and where i spend the
        energy and my Order Of Operations tends to be comprehensive. Frankly, i
        do not LOOK, FEEL, nor SMELL like a homeless person bc of my protocols!
        😁
      </p>

      <p>
        Also- my Lifestyle of Gratitude helps mi be worthy of Receiving Help,
        keeping my spirit/mind clear, and utilizing the energy to the max
        efficiency. 💝🌈
      </p>

      <p className="text-sm tracking-wide text-(--chapter-muted-fg)">02may26</p>

      <hr className="my-10 border-(--chapter-muted)" />

      <h2 className="mt-12 font-display text-2xl text-(--chapter-accent) sm:text-3xl">
        RAD STUFF i HAVE DONE WHILE Homeless.
      </h2>
      <p className="text-2xl">✨⚡️🌈</p>

      <h3 className="mt-8 font-display text-xl text-(--chapter-accent)">
        ITHACA &apos;23-&apos;24
      </h3>
      <ul className="space-y-2">
        <li>🎤 Open mic nights at Sacred Root 🎸🎹</li>
        <li>Sat in on Tracy R&apos;s concert after mtg at open mic 🎵</li>
        <li>
          Tuned &amp; Touched the Piano at Loaves &amp; Fishes; created
          welcoming environment for other Musicians to Share 🎵💞
        </li>
        <li>Made a moving company 🚚📦</li>
        <li>
          🎹 Played Live Piano at a Korean karaoke house, once on my Birthday
          🥳🎤
        </li>
        <li>
          Installed an amp, setup wireless mic system; did maintenance on the
          audio gear in the suites of K-House
        </li>
        <li>
          Cleaned facility/restroom @ Sedīa Art gallery/Cannabis café multiple
          times; assisted w event setup
        </li>
        <li>
          Completely renovation-painted a classic, neo-colonial apartment
        </li>
      </ul>

      <h3 className="mt-10 font-display text-xl text-(--chapter-accent)">
        HARDEEVILE &apos;24-&apos;25
      </h3>
      <ul className="space-y-2">
        <li>
          Gave 50k of billable services to Owner of landscaping company and
          homeless outreach ministry, at no charge
        </li>
        <li>
          Called 911 for same Owner when he doused his eyes/face w gasoline on a
          jobsite
        </li>
        <li>
          Increased his property value by ~10% per junk car i moved [about 8
          vehicles]
        </li>
        <li>
          Pressure washed the entire exterior of main house minus the crammed
          back porch; hand-cleaned roof of main house and garage/apt
        </li>
        <li>
          Cleaned van i was authorized to freely use...the first three cleanings
          were GNARLY 😳; i set up a wash rack and washed all operational vehicles
          onsite, &gt; 4x. No one else washed vehicles, ever.
        </li>
        <li>
          Maintained regular/daily PMCS protocol for any vehicle i drove [pickup
          or van] and always reported any issue or low fuel, immediately.
        </li>
        <li>
          Provided regular and reliable work transport to WaffleHouse for
          homeless druggie woman.
        </li>
        <li>
          Created a sleeping area in garage workshop after i cleaned out the
          metal shavings, decayed animal carcass, dusty grime, garbage, and
          spiders.
        </li>
        <li>
          Cleaned out and organized backyard pavilion, created food prep/storage
          area, added chalk drawings
        </li>
        <li>
          Used a rake to START THE WHOLE PROCESS!!! 😁 ...and i uncovered over
          10k worth of tools [includes a tractor and its attachments 😉]
        </li>
        <li>
          Counselled the Owner on his business and psychospiritual needs &amp;
          deficiencies
        </li>
        <li>
          Successfully coached him in Safe Driving, to the point where he
          COMPLETELY STOPPED TXT DRIVING!! and regularly asked mi to drive him so
          he could conduct business.
        </li>
        <li>
          Was the 1st person to attend therapy session w him. His Family had
          never accompanied him.
        </li>
        <li>
          His younger Son [age 14] reported &quot;Dad&apos;s nowhere NEAR as bad
          [angry, explosive, violent] as he was before u got here!&quot;
        </li>
      </ul>

      <h3 className="mt-10 font-display text-xl text-(--chapter-accent)">
        EVERYWHERE:
      </h3>
      <p>
        i establish Healthy &amp; Respectfull relationships w all cashiers,
        workers, puppies, cats, and Humans in my neighborhood.
      </p>
      <p>
        Even when i&apos;m depressed/distraught/PTSD triggered, and am holding my
        Light close and just for mi, sentient beings can SeeFeel it and want to
        step closer.
      </p>
      <p>
        This is COMMUNITY BUILDING and, inherently, increased SECURITY for All
        ❣️❣️
      </p>

      <p className="mt-10 text-center font-display text-xl text-(--chapter-accent)">
        🌈 i Am The Grand Rainbow Conjunction. 🌈
      </p>

      <p className="mt-8 text-sm tracking-wide text-(--chapter-muted-fg)">
        11aug25
      </p>
    </article>
  );
}
