"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Children,
  createElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";

type DailyLogPost = {
  id: string;
  section: string;
  title: string;
  date: string;
  blurb: string;
  beats: React.ReactNode[];
};

const dailyLogSections = ["Beyond Suicidal", "Homelessness"] as const;

type PostTheme = {
  accent: string;
  softBackground: string;
  softBorder: string;
};

type BeatChunk = {
  node: React.ReactNode;
  groupId: string;
  key: string;
  text?: string;
  inline?: boolean;
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
    id: "beyond-suicidal",
    section: "Beyond Suicidal",
    title: "Beyond Suicidal",
    date: "17jun26",
    blurb: "Pre-production, promise, refusal, and survival when every other option is vile.",
    beats: [
      <h2 key="h2" className="mt-2 font-display text-2xl text-(--chapter-accent) sm:text-3xl">
        💔❤️‍🔥Beyond Suicidal❤️‍🩹💝
      </h2>,
      <p key="1">
        There is a lot of space/time/pre production that goes into suicide. No one wakes up in their
        healthy life and ends it on a whim.
      </p>,
      <p key="2">
        i was first suicidal when my Mother and Younger Sister were assassinated. My Mom was the main
        motivation or influence for most of my life decisions and we had developed a sweet,
        respectfull, Adult to Adult relationship by the time i was in college at Berklee.
      </p>,
      <p key="3">
        My LittleSister and i had just Healed and reConnected our relationship after almost 10 yrs of
        distance.❤️‍🩹💓💞
      </p>,
      <p key="4">
        While i was sat on a couch the day after the event... fixated and borderline catatonic on how
        to escape the suffering...my Little Girl toddled over to mi, put her tiny hand on my left
        knee... and i Promised mySelf that i&apos;d Lîve until she was raised-well and out of the
        nest.
      </p>,
      <p key="5">
        Long after she graduated, my material/professional life was still dismal and wrought w
        violations.
      </p>,
      <p key="6">
        One of my Arrivals Of Understanding: in order to make big gold 💰💰💰and have financial
        security, one must hurt Children and do crime. [in the Evil Empire of The White Man].
      </p>,
      <p key="7" className="italic text-(--foreground)/90">
        *We&apos;ll dive into deets about The Empire and How To Detach another time🤿❤️‍🩹❤️‍🔥💖*
      </p>,
      <p key="8">
        &quot;If hurting Children is the only way left for mi to make money to survive, i Refuse.
        Before i become a portal of Darkness on this realm, i&apos;ll kill my Avatar.&quot;
      </p>,
      <p key="9">This is what i said to mi.</p>,
      <p key="10">Well, i committed to it. 💔💔💔</p>,
      <p key="11">i failed.</p>,
      <p key="12">
        i&apos;d told my Progeny that i would *NOT* make a mess and would simply walk into the woods
        if i missed my Exit.
      </p>,
      <p key="13">
        Beyond Suicidal: i do not want to die nor kill myself, but will do so if all other options
        for Basic Survival are vile.
      </p>,
      <p key="14">🌈</p>,
    ],
  },
  {
    id: "beyond-suicidal-woods-pix",
    section: "Beyond Suicidal",
    title: "Woods pix",
    date: "17jun26",
    blurb: "Laying on plastic garbage bags in the woods — sleeping by day, awake all night.",
    beats: [
      <h2 key="h2" className="mt-2 font-display text-2xl text-(--chapter-accent) sm:text-3xl">
        💔Beyond Suicidal❤️‍🔥
      </h2>,
      <p key="1">
        Hmmm- instead of bleeding out by my own hands, i&apos;m laying on plastic garbage bags on
        the floor of the woods, sleeping in the daytime, and awake all night.
      </p>,
      <p key="2">Interesting Parallel Reality. 🌈</p>,
      <figure key="photos" className="not-prose my-4 grid gap-4 sm:grid-cols-2">
        <Image
          src="/daily-logs/beyond-suicidal/woods-canopy.png"
          alt="Looking up through the tree canopy from the forest floor"
          width={900}
          height={1200}
          className="w-full rounded-xl border border-(--chapter-muted) object-cover"
        />
        <Image
          src="/daily-logs/beyond-suicidal/woods-selfie.png"
          alt="Lying on black plastic garbage bags among fallen leaves in the woods"
          width={900}
          height={1200}
          className="w-full rounded-xl border border-(--chapter-muted) object-cover"
        />
      </figure>,
    ],
  },
  {
    id: "09may26-day-log",
    section: "Homelessness",
    title: "Riding the Rain",
    date: "09may26",
    blurb: "Rainy day under the poncho, G&apos;s moto soliloquy, Lucky&apos;s night, and offering help from the heart.",
    beats: [
      <p key="1">06:43 i wake up on the black plastic bags i draped over the mattress cover. i slept undisturbed👍🏽👍🏽 Not quality sleep, tho, so i laid down for another bit.</p>,
      <p key="2">09:30 i got up, put on boots, peeked thru the kitchen window. Now that it&apos;s day, i can see the full property. So much potential! i killed a line of ants when i opened the back door. Those r the only bugs in here [plus, ONE dead roach grande].</p>,
      <p key="3">i had a chill and brief wake n bake outback, planned my timeline for the day. G said i could stay til 11:00.</p>,
      <p key="4">i was gonna organize some packages, but my toilet time took longer than planned. [irregular eating sked, random foods, unreliable water supply and dehydration all affect the Waste Management &amp; Scheduling🤓]</p>,
      <p key="5">i left the bathroom cleaner than i found it😁</p>,
      <p key="6">i cleared the space, took trash, locked the door.</p>,
      <p key="7">As i walked to the park, i saw G finishing the yard from yday, waved.</p>,
      <p key="8">Today is a rainy day. Here, in the sub tropics, that means ALL DAY wetness, pooling water, etc.</p>,
      <p key="9">i have no other safe place to be, so... the clothing bag and sneakers bag r going in the 2 now-damaged black plastic bags and into the woods. i put a little clear plastic bag on the bottom and top of backpack and set it under my seat. Bath supply bag goes next to that.</p>,
      <p key="10">i toss the poncho over mi, adjust it at length to be sure it covers bench and bags, and i ride the rain.</p>,
      <p key="11">_____</p>,
      <p key="12">~15:00</p>,
      <p key="13">i hear an obnoxious moto engine🙄 It&apos;s still drizzling. i see a biker go up the street on a chopper and wonder if it&apos;s G. It is😊</p>,
      <p key="14">He turned around, entered park, revving the throttle.</p>,
      <p key="15">&quot;U betta than this, why u out here like?...&quot;</p>,
      <p key="16">🤔🤔🤔🤔🤨</p>,
      <p key="17">i definitely know it is extremely irresponsible to drive moto in the rain on drugs. That man was Triple Pickled.</p>,
      <p key="18">i asked if he was referring to mi being outside, sitting in the rain, not getting a motel room... no response.</p>,
      <p key="19">i was SO in my GranDaddie Rainbow energies...zero flappability, zero disturbance... By the time he finished talking, he&apos;d come around to &quot;ur solid, Rainbow, ur good.&quot;</p>,
      <p key="20">...he revved and rolled away while still talking.</p>,
      <p key="21">This was really a soliloquy. i will ask him later about what he was wanting to express.</p>,
      <p key="22">i spent about 11 mins, making sure i wasn&apos;t upset about that interaction. i wasn&apos;t.</p>,
      <p key="23">________</p>,
      <p key="24">~19:39 Time to be ready to be social at Lucky&apos;s. i had a mental dilemma in leaving my clothing bag in the woods and even walked the park to find another tuck away. None better. i talked thru WHY my chosen spot is the best option:</p>,
      <p key="25">◦ inside the treeline- only druggies go in there to do drugs</p>,
      <p key="26">◦ in a black plastic bag- strew some leaves on there and the camo is decent</p>,
      <p key="27">◦ it&apos;s dusk- no one will be searching for a black garbage bag off the main path in the woods at night</p>,
      <p key="28">Any other spot is in view of traffic and closer to pedestrian traffic, including near Lucky&apos;s.</p>,
      <p key="29">Again, i walk away, knowing that i may lose 100% of my items, but cannot carry that bag for my current activity.</p>,
      <p key="30">______</p>,
      <p key="31">~20:20 i walk around the motel. As i had spoken it, i saw Ram. i stopped and said hey. He was just sparking that Flower gift from the day before. i invited him to come chat at Lucky&apos;s.</p>,
      <p key="32">i go sit at the far table on the patio. Not 7 minutes pass, and here comes G, walking. i was wondering how our interaction was gonna be after him revving up in the park. i knew he could likely forget it. We never mentioned it. He invited mi over to his table, introduced mi to a few people. i got him rolled up. He then asked for a pinch for a patróna there [she was off-put by him, as he was sloppy drinky].</p>,
      <p key="33">i spent most of my time chatting/listening to Frank. It was SWEET how Frank eventually balanced the Energy Exchange: he was DEEP into telling mi about the shitty shit w his adult Children and realized i was doing all that Listening and Advising w no drink! 😃 He got mi a PBR w limon.😎🎁</p>,
      <p key="34">Interestingly, we didn&apos;t chat anymore after he returned w the bevis. He was into his phone.</p>,
      <p key="35">After a few songs on the radio [i got the bar to switch OFF the HipHop and play better vibes!!!😁], Frank left.</p>,
      <p key="36">i sat long enuff to fade into dreaming, still hearing the Music.</p>,
      <p key="37">Then the vibe changed... one patron came out to talk on phone and i could tell the other person was a woman and he was weary w her. He went back in.</p>,
      <p key="38">i sat for a few, thinking i wanted to see G before i leave...and where am i rushing to ANYWAY?! 😅</p>,
      <p key="39">Bueno, i decided it was time to go and the vibe was altered and i wasn&apos;t enjoying the staff [DJ Gordito came out after mi &quot;Zoe doesn&apos;t want ur bags in the chair... not in the chair&quot; ...🤨...way too rude for our history.]</p>,
      <p key="40">i&apos;m lifting off my seat to put on bags and G comes flying outta the door like a western saloon scene! BACKWARD.</p>,
      <p key="41">&quot;¡Get outta my bar!&quot;</p>,
      <p key="42">He rolled on his back, got his bearings, stood up talking; he opened the door again and was dancing/gyrating like a way drunk gay gun slinger.😂</p>,
      <p key="43">&quot;Sir, ¡get off my property!&quot; said DJ Gordito from inside.</p>,
      <p key="44">i initially was gonna make sure he was ok, but he got up TALKING so i left him to whatever his mouth had gotten him into.</p>,
      <p key="45">i walked away while he was dancing in the doorway.🤣</p>,
      <p key="46">[it&apos;s NOT a funny event, but i see the humor in most things these days. #Perspective]</p>,
      <p key="47">i&apos;m sure he didn&apos;t see mi bc he was stumbling drunk 43 mins before.</p>,
      <p key="48">On the walk to recover my clothing bag, i ran a security drill: keep eyes up and avoid him at all cost.</p>,
      <p key="49">There&apos;s only one street to get my bag and he lives on it...i went thru all the considerations and then had a perfect trip. i didn&apos;t see nor hear him at all.</p>,
      <p key="50">He is obviously very hurt and damaged. 💔💔💔💔❤️‍🔥</p>,
      <p key="51">i kept it a good time anoche; i can see potential SEC concerns w him and look fwd to talking about everything.</p>,
      <p key="52">...only prob w talking about stuff later: he&apos;s gonna be drunk then, too! 🙃</p>,
      <p key="53">____</p>,
      <p key="54">i offered to Exchange work for use of the apt [it is 2 units, 3BR; he said it&apos;s an Air BnB...but it ain&apos;t makin not no type of income in its current condition! i can Help.😎 [i&apos;m also studying Immersive Southern US English...😜]]</p>,
      <p key="55">_____</p>,
      <p key="56">He has told mi several times - &quot;I gotta stop this drinkin...😣&quot;</p>,
      <p key="57">i would LUV to be able to Help him. He&apos;s precisely who i&apos;m intent to Assist. ❤️‍🩹❤️‍🔥💝</p>,
    ],
  },
  {
    id: "08may26-day-log",
    section: "Homelessness",
    title: "Element and the Rainbow",
    date: "08may26",
    blurb: "Element and Lady, the Rainbow pickup, pizza and fireside convos, sleep in a locked space.",
    beats: [
      <p key="1">05:37 Rolled up, almost packed, almost ready to walk for supplies and then go to park.</p>,
      <p key="2">My mind is focused on how best to lay on the bench. i have to stretch out my body. i don&apos;t have any need for recovery from Wed&apos;s cleanout, rather, from sitting on the benches all day and night.</p>,
      <p key="3">i knew i had 3 paper monies left. i decided to count the coins. i have 9💰. That is a significant difference that allows mi to plan drink/supplies for now AND a piece of food for later.👍🏽</p>,
      <p key="4">The overnight weather was comfy, about 65*. The garbage dump/port air has been heavy tho... yuk.</p>,
      <p key="5">___</p>,
      <p key="6">06:47</p>,
      <p key="7">i&apos;m sat on the park bench w a wake n bake w Dr Pepper, i see a man on bike w trailer. i wave, no response. i start thinking of how we choose to not talk to certain people... He rolled up. His name is Element. His chill pup in trailer is Lady.</p>,
      <p key="8">We greeted Grand Rising, good vibe. He said &quot;I see u have The Spliff... can I please take 2 pulls?&quot;</p>,
      <p key="9">i packed him a short Black n Mild FT😎</p>,
      <p key="10">The Herb hit him and he started rapping like listening to Doug Jackson [Jazz Trumpeter] talk and give a sermon.😆😁</p>,
      <p key="11">He faded away while talking. [Odd #2]</p>,
      <p key="12">Odd #1 He didn&apos;t hit the treeline to piss- he just walked a meter away and watered the leaves. Not a &quot;bad&quot; thing, but noteworthy.</p>,
      <p key="13">_____</p>,
      <p key="14">~15:00 And Then... &quot;😃RAINBOW!!&quot; from across the street... That turned into mi driving for an appliance pick up, having pizza and 🍻, and enjoying fireside convos in the rain.🥰</p>,
      <p key="15">And now, i&apos;m going to sleep in a -bug free, door locked, no one here but mi- space.🥰</p>,
      <p key="16">💝Much Appreciated.</p>,
      <p key="17">[💦Shower #2 after Sunrise!! Woo!]🌈</p>,
    ],
  },
  {
    id: "03may26-and-then",
    section: "Homelessness",
    title: "Nude Truth",
    date: "03may26",
    blurb: "Park bench on Sunny Sunday, new biz relaci&oacute;n, trust from the Nude Truth of Our WORD.",
    beats: [
      <p key="1">i&apos;m sat on the park bench. it&apos;s a Sunny Sunday after super rain Sat. Once again [still again], i don&apos;t know if i&apos;m sleeping under a roof tmw night or staying awake all night.</p>,
      <p key="2">The Difference of today: i now have a new biz relaci&oacute;n and he made the First Steps in Trust.</p>,
      <p key="3">It is RAD to Know we r both working thru broken Trust issues and we get to start from the Nude Truth of Our WORD.</p>,
      <p key="4">i&apos;m here for this.</p>,
      <p key="5">03may26</p>,
      <p key="6">🌈</p>,
    ],
  },
  {
    id: "02may26-stewardship",
    section: "Homelessness",
    title: "Stewardship and eating well",
    date: "02may26",
    blurb: "Daily food budgeting while homeless, and the protocols that keep me strong.",
    beats: [
      <p key="intro-1" className="lead text-lg text-(--foreground)/95">
        Eating Well is a challenge while homeless.
      </p>,
      <p key="intro-2">There IS a per/day breakdown of how to use gold that i have found:</p>,
      ...tiers.map((row) => (
        <div
          key={`tier-${row.usd}`}
          className="not-prose my-2 flex flex-col gap-1 rounded-xl border border-(--chapter-muted) bg-(--chapter-card)/80 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
        >
          <span className="shrink-0 font-pixel text-sm text-(--chapter-accent)">{row.usd}</span>
          <span className="text-[0.95rem] leading-snug text-(--foreground)/95">= {row.text}</span>
        </div>
      )),
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
    section: "Homelessness",
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
    id: "28apr26-and-then",
    section: "Homelessness",
    title: "Living Free",
    date: "28apr26",
    blurb: "Petrol at the park, Exxon tanker driver, James and the Living Free Biker Church invitation.",
    beats: [
      <p key="1">And Then...</p>,
      <p key="2">i smelled petrol at the park, walked to Exxon and saw a tanker and Driver, sitting w arms folded while unloading.</p>,
      <p key="3">He was on his feet when i doubled back.😄</p>,
      <p key="4">James was working, but chatted w mi at length, inviting mi to his Living Free Biker Church.</p>,
      <p key="5">[he told mi he has big gold, &quot;I&apos;m at the Top of the Food Chain&quot;, but i did not ask him for material Help bc i STILL do not walk around, scanning People&apos;s Pockets!😗]</p>,
      <p key="6">i would like to go to meet his church...a ver...</p>,
      <p key="7">28apr26</p>,
    ],
  },
  {
    id: "26apr26-and-then",
    section: "Homelessness",
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
    section: "Homelessness",
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
    section: "Homelessness",
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
  { accent: "#c9837f", softBackground: "rgba(201, 131, 127, 0.1)", softBorder: "rgba(201, 131, 127, 0.36)" },
  { accent: "#c79267", softBackground: "rgba(199, 146, 103, 0.1)", softBorder: "rgba(199, 146, 103, 0.36)" },
  { accent: "#b7a261", softBackground: "rgba(183, 162, 97, 0.1)", softBorder: "rgba(183, 162, 97, 0.34)" },
  { accent: "#78a082", softBackground: "rgba(120, 160, 130, 0.1)", softBorder: "rgba(120, 160, 130, 0.34)" },
  { accent: "#7696b7", softBackground: "rgba(118, 150, 183, 0.1)", softBorder: "rgba(118, 150, 183, 0.34)" },
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
  const isWordChar = (ch: string | undefined): boolean => Boolean(ch && /[A-Za-z0-9]/.test(ch));
  const isDashSeparatorAt = (source: string, index: number): boolean => {
    const prev = index > 0 ? source[index - 1] : undefined;
    const next = index + 1 < source.length ? source[index + 1] : undefined;
    return !(isWordChar(prev) && isWordChar(next));
  };
  const isBreakingSeparatorAt = (source: string, index: number): boolean => {
    const ch = source[index];
    if (!ch) return false;
    if (ch === "-") return isDashSeparatorAt(source, index);
    return (
      ch === "." ||
      ch === "," ||
      ch === ";" ||
      ch === "?" ||
      ch === ":" ||
      ch === "!" ||
      ch === "\""
    );
  };

  const splitInlinePunctuation = (value: string): string[] => {
    const normalizedValue = value.replace(/\s+/g, " ").trim();
    if (!normalizedValue) return [];

    const localChunks: string[] = [];
    let localBuffer = "";

    const pushLocalBuffer = () => {
      const trimmed = localBuffer.trim();
      if (trimmed) localChunks.push(trimmed);
      localBuffer = "";
    };

    for (let idx = 0; idx < normalizedValue.length; idx += 1) {
      if (normalizedValue.slice(idx, idx + 3) === "...") {
        pushLocalBuffer();
        localChunks.push("...");
        idx += 2;
        continue;
      }

      const ch = normalizedValue[idx];
      if (ch === "¿") {
        pushLocalBuffer();
        let questionChunk = ch;
        idx += 1;
        while (idx < normalizedValue.length) {
          questionChunk += normalizedValue[idx];
          if (normalizedValue[idx] === "?") break;
          idx += 1;
        }
        localChunks.push(questionChunk.trim());
        continue;
      }

      if (isBreakingSeparatorAt(normalizedValue, idx)) {
        let hasDashInRun = false;
        while (idx < normalizedValue.length && isBreakingSeparatorAt(normalizedValue, idx)) {
          const breakChar = normalizedValue[idx];
          if (breakChar === "-") {
            if (!hasDashInRun) {
              localBuffer += "-";
              hasDashInRun = true;
            }
          } else {
            localBuffer += breakChar;
          }
          idx += 1;
        }
        idx -= 1;
        pushLocalBuffer();
        continue;
      }

      localBuffer += ch;
    }

    pushLocalBuffer();
    return localChunks;
  };

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
    if (char === "¿") {
      pushBuffer();
      let questionChunk = char;
      index += 1;
      while (index < normalized.length) {
        questionChunk += normalized[index];
        if (normalized[index] === "?") break;
        index += 1;
      }
      chunks.push(questionChunk.trim());
      continue;
    }

    if (char === "[" || char === "(") {
      pushBuffer();
      const closingChar = char === "[" ? "]" : ")";
      let grouped = char;
      index += 1;
      while (index < normalized.length) {
        grouped += normalized[index];
        if (normalized[index] === closingChar) break;
        index += 1;
      }
      const groupText = grouped.trim();
      const inner = groupText.slice(1, groupText.endsWith(closingChar) ? -1 : undefined).trim();
      const innerChunks = splitInlinePunctuation(inner);

      if (innerChunks.length === 0) {
        chunks.push(groupText);
        continue;
      }

      for (let i = 0; i < innerChunks.length; i += 1) {
        const withOpening = i === 0 ? `${char}${innerChunks[i]}` : innerChunks[i];
        const withWrapping = i === innerChunks.length - 1 ? `${withOpening}${closingChar}` : withOpening;
        chunks.push(withWrapping.trim());
      }
      continue;
    }

    if (isBreakingSeparatorAt(normalized, index)) {
      let hasDashInRun = false;
      while (index < normalized.length && isBreakingSeparatorAt(normalized, index)) {
        const breakChar = normalized[index];
        if (breakChar === "-") {
          if (!hasDashInRun) {
            buffer += "-";
            hasDashInRun = true;
          }
        } else {
          buffer += breakChar;
        }
        index += 1;
      }
      index -= 1;
      pushBuffer();
      continue;
    }

    buffer += char;
  }

  pushBuffer();
  return chunks;
}

function expandBeatsToSentenceGranularity(beats: React.ReactNode[]): BeatChunk[] {
  const expanded: BeatChunk[] = [];

  for (let beatNumber = 0; beatNumber < beats.length; beatNumber += 1) {
    const beat = beats[beatNumber];
    const keyFromElement = isValidElement(beat) ? beat.key : null;
    const baseKey = String(keyFromElement ?? `beat-${beatNumber}`);
    const tierGroup = baseKey.startsWith("tier-") ? "stewardship-tiers" : baseKey;

    if (!isValidElement(beat) || beat.type !== "p") {
      if (isValidElement(beat) && (beat.type === "ul" || beat.type === "ol")) {
        const listElement = beat as React.ReactElement<{
          children?: React.ReactNode;
          className?: string;
        }>;
        const listItems = Children.toArray(listElement.props.children).filter(
          (child): child is React.ReactElement<{ children?: React.ReactNode }> =>
            isValidElement(child) && child.type === "li"
        );

        if (listItems.length > 1) {
          for (let itemIndex = 0; itemIndex < listItems.length; itemIndex += 1) {
            const item = listItems[itemIndex];
            const listNode = createElement(
              listElement.type,
              { className: listElement.props.className },
              item
            );
            expanded.push({
              node: listNode,
              groupId: tierGroup,
              key: `${baseKey}-li${itemIndex}`,
              inline: false,
            });
          }
          continue;
        }
      }

      expanded.push({ node: beat, groupId: tierGroup, key: baseKey, inline: false });
      continue;
    }

    const paragraph = beat as React.ReactElement<{ children?: React.ReactNode }>;
    const flattened = flattenText(paragraph.props.children);
    if (flattened === null) {
      expanded.push({ node: beat, groupId: baseKey, key: baseKey, inline: false });
      continue;
    }

    const chunks = splitIntoBeatChunks(flattened);
    if (chunks.length <= 1) {
      expanded.push({ node: beat, groupId: baseKey, key: baseKey, inline: false, text: flattened.trim() });
      continue;
    }

    for (let index = 0; index < chunks.length; index += 1) {
      expanded.push({
        node: <span key={`${baseKey}-s${index}`}>{chunks[index]}</span>,
        groupId: baseKey,
        key: `${baseKey}-s${index}`,
        text: chunks[index],
        inline: true,
      });
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

  const postsBySection = useMemo(
    () =>
      dailyLogSections.map((section) => ({
        section,
        posts: posts.filter((post) => post.section === section),
      })),
    []
  );
  const globalPostIndexById = useMemo(
    () => Object.fromEntries(posts.map((post, index) => [post.id, index] as const)),
    []
  );

  const activeBeats = selectedPostId ? expandedBeatsByPostId[selectedPostId] ?? [] : [];
  const totalBeats = activeBeats.length;
  const progress = totalBeats > 0 ? Math.round(((beatIndex + 1) / totalBeats) * 100) : 0;
  const visibleBeatNodes = useMemo(() => {
    if (activeBeats.length === 0) return [];
    const currentIndex = Math.max(0, Math.min(beatIndex, activeBeats.length - 1));
    const currentGroupId = activeBeats[currentIndex].groupId;
    let start = currentIndex;

    while (start > 0 && activeBeats[start - 1].groupId === currentGroupId) {
      start -= 1;
    }

    return activeBeats.slice(start, currentIndex + 1);
  }, [activeBeats, beatIndex]);

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

        <div className="not-prose mt-8 space-y-10">
          {postsBySection.map(({ section, posts: sectionPosts }) => (
            <div key={section}>
              <h2 className="font-display text-2xl text-(--chapter-accent) sm:text-3xl">{section}</h2>
              <div className="mt-4 grid gap-3">
                {sectionPosts.map((post) => {
                  const index = globalPostIndexById[post.id] ?? 0;
                  return (
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
                  );
                })}
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
            <div>
              {visibleBeatNodes.map((beat, index) => {
                const previous = index > 0 ? visibleBeatNodes[index - 1] : null;
                const inlineAfterComma = Boolean(
                  beat.inline &&
                    previous?.inline &&
                    typeof previous.text === "string" &&
                    previous.text.trim().endsWith(",")
                );

                if (inlineAfterComma) {
                  return (
                    <span key={beat.key} className="ml-1">
                      {beat.node}
                    </span>
                  );
                }

                return (
                  <div key={beat.key} className={index === 0 ? "" : "mt-3"}>
                    {beat.node}
                  </div>
                );
              })}
            </div>
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
