/*
 * English guides written for what people in the US actually search
 * (shadow work journal prompts, beginners, digital/iPad, emotional healing journal).
 * Inline formatting in strings: **bold** and [link text](/path/ or https://…).
 * Voice: Khram brand guide §12 (dark, not dramatic; plain words; no cure or deadline promises).
 */

export type Block =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { prompts: string[]; start?: number }
  | { product: string }
  | { note: string };

export interface Source {
  label: string;
  url?: string;
}

export interface Guide {
  slug: string;
  /** <title> and search result title */
  metaTitle: string;
  /** H1 */
  title: string;
  description: string;
  eyebrow: string;
  published: string;
  updated: string;
  minutes: number;
  image: { src: string; alt: string; width: number; height: number };
  ogImage: string;
  lede: string;
  body: Block[];
  sources: Source[];
}

const crisisNote =
  "Khram journals and guides are self-reflection tools, not a substitute for professional mental health care. If you are in crisis or thinking about hurting yourself, call or text 988 in the US, contact your local emergency number, or find a helpline at [findahelpline.com](https://findahelpline.com).";

const sources = {
  jung: { label: "Jung, C. G. (1959). Aion: Researches into the Phenomenology of the Self. Collected Works, Vol. 9, Part II. Princeton University Press." },
  pennebaker1986: {
    label: "Pennebaker, J. W., & Beall, S. K. (1986). Confronting a traumatic event: Toward an understanding of inhibition and disease. Journal of Abnormal Psychology, 95(3), 274–281.",
    url: "https://doi.org/10.1037/0021-843X.95.3.274",
  },
  pennebaker1997: {
    label: "Pennebaker, J. W., Mayne, T. J., & Francis, M. E. (1997). Linguistic predictors of adaptive bereavement. Journal of Personality and Social Psychology, 72(4), 863–871.",
    url: "https://doi.org/10.1037/0022-3514.72.4.863",
  },
  smyth: {
    label: "Smyth, J. M. (1998). Written emotional expression: Effect sizes, outcome types, and moderating variables. Journal of Consulting and Clinical Psychology, 66(1), 174–184.",
    url: "https://pubmed.ncbi.nlm.nih.gov/9489272/",
  },
  frattaroli: {
    label: "Frattaroli, J. (2006). Experimental disclosure and its moderators: A meta-analysis. Psychological Bulletin, 132(6), 823–865.",
    url: "https://pubmed.ncbi.nlm.nih.gov/17073523/",
  },
  lieberman: {
    label: "Lieberman, M. D., et al. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), 421–428.",
    url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x",
  },
  kross: {
    label: "Kross, E., et al. (2014). Self-talk as a regulatory mechanism: How you do it matters. Journal of Personality and Social Psychology, 106(2), 304–324.",
    url: "https://pubmed.ncbi.nlm.nih.gov/24467424/",
  },
} satisfies Record<string, Source>;

export const guides: Guide[] = [
  {
    slug: "shadow-work-journal-for-beginners",
    metaTitle: "Shadow Work Journal for Beginners: How to Start Gently",
    title: "Shadow work for beginners: how to start a journal without drowning in it",
    description:
      "What shadow work is, how to start journaling about it safely, a simple 10-minute routine, 12 beginner prompts, and what to look for in a shadow work journal.",
    eyebrow: "Getting started",
    published: "2026-10-21",
    updated: "2026-10-21",
    minutes: 7,
    image: {
      src: "/images/art/indigo-night.webp",
      alt: "A painted full moon in a cloudy night sky with a glowing pale-blue butterfly",
      width: 1000,
      height: 700,
    },
    ogImage: "/images/og/indigo.jpg",
    lede: "Shadow work sounds bigger than it is. Most nights it's one honest question, ten minutes, and a page you never have to show anyone.",
    body: [
      { h2: "What shadow work actually means" },
      {
        p: "The idea comes from the psychiatrist Carl Jung. He used “the shadow” for the parts of ourselves we push out of view because they didn't feel safe or welcome when we were growing up: anger we learned to swallow, needs we were told were too much, envy, fear, even talents someone laughed at. Those parts don't disappear. They tend to show up sideways, in habits we can't explain and reactions that feel too big for the moment.",
      },
      {
        p: "Shadow work is the slow practice of noticing those parts and getting curious about them instead of fighting them. A journal suits it well, because writing slows your thoughts down enough to actually look at them.",
      },
      { p: "It isn't a diagnosis, a cure or a replacement for therapy. It's a way of paying attention." },

      { h2: "Signs it might be worth trying" },
      {
        ul: [
          "You say “I'm fine” and mean “I don't want to talk about it.”",
          "You replay conversations long after they're over.",
          "You say yes when you want to say no, then feel resentful.",
          "One small comment can ruin your whole day, and you're not sure why.",
          "You keep meeting the same pattern in different relationships.",
        ],
      },
      { p: "None of these mean something is wrong with you. They're simply good places to start looking." },

      { h2: "Three ground rules before you start" },
      {
        ol: [
          "**Go small.** Ten minutes is enough. Stop when the timer ends, even mid-sentence.",
          "**Write for nobody.** No grammar, no audience, no neat conclusions. Messy is the point.",
          "**Know your exit.** If a memory feels too heavy to hold alone, close the journal and do something that steadies you: a walk, a shower, a message to someone safe. Some things are better opened with a therapist in the room, and choosing that isn't failure.",
        ],
      },
      {
        p: "Research on expressive writing backs up going gently. In James Pennebaker's early studies, people wrote about a hard experience for 15 to 20 minutes on a few days in a row. Many felt worse right after writing, yet over the following months they visited the health center less often than people who wrote about neutral topics. Short, repeated sessions do more than one big emotional dump.",
      },

      { h2: "A simple 10-minute routine" },
      {
        ol: [
          "**Settle (1 minute).** Sit where you won't be interrupted. Take three slow breaths.",
          "**Read one prompt (1 minute).** Just one. Don't skip ahead.",
          "**Write (7 minutes).** Start with the first true sentence that comes, even if it's “I don't know.”",
          "**Close (1 minute).** Write one line about how you feel now. Then put the journal away.",
        ],
      },
      {
        p: "Night is when many people overthink most, which makes it a natural time to write. If nights make it worse for you, try the morning. Doing it regularly matters more than the hour.",
      },

      { h2: "12 shadow work prompts for beginners" },
      { p: "Take one per night. If a question feels too sharp, skip it and come back another time." },
      {
        prompts: [
          "What emotion am I most afraid of showing to others?",
          "When I hide this feeling, what am I trying to protect?",
          "What do I say “I'm fine” about most often?",
          "Whose approval do I still work for, even when they're not around?",
          "What did I learn as a child about anger? Who taught me?",
          "When did I last say yes when I meant no? What was I afraid would happen?",
          "What trait in other people irritates me most? Where might it live in me?",
          "What do I envy in someone else's life? What does that envy say I want?",
          "Which compliment do I brush off every time? Why is it hard to accept?",
          "What part of me did I hide to fit in?",
          "What would I do differently if no one could be disappointed in me?",
          "What do I need right now that I haven't asked for?",
        ],
      },
      { p: "Want more? Here are [60 shadow work and self-reflection prompts](/guides/shadow-work-journal-prompts/), grouped by theme." },

      { h2: "What to look for in a shadow work journal" },
      {
        ul: [
          "**Prompts in an order**, from noticing to understanding to change, so night one doesn't drop you into the deepest questions.",
          "**Room to write.** Three lines under a prompt don't leave space to think. Look for a full page per prompt.",
          "**A way to see small progress**, like a tracker you fill in after each night.",
          "**Plain language.** If the prompts read like a textbook, you'll stop opening it.",
          "**Honest claims.** Be wary of any journal that promises to heal trauma or fix anxiety in 30 days.",
        ],
      },

      { h2: "Where Khram fits" },
      {
        p: "We made [INDIGO](/products/indigo-digital/) for exactly this: 150+ prompts in three Acts (The Deep Night, The Still Water and The First Light), a full writing page after every prompt, and a 30-night moon tracker. It comes as a [digital PDF for iPad and tablets](/products/indigo-digital/) or as a paperback in [full color](/products/indigo-paperback-color/) or [black and white](/products/indigo-paperback-bw/).",
      },
      {
        p: "Not ready for a full journal? [7 Nights in INDIGO](/products/seven-nights/) is free: fourteen prompts from INDIGO for one week, pay what you want.",
      },
      { product: "seven-nights" },
      { note: crisisNote },
    ],
    sources: [sources.jung, sources.pennebaker1986],
  },

  {
    slug: "digital-shadow-work-journal",
    metaTitle: "Digital Shadow Work Journal for iPad: GoodNotes & Notability Guide",
    title: "How to use a digital shadow work journal on iPad (GoodNotes, Notability and more)",
    description:
      "Paper or digital? How to open a shadow work journal PDF in GoodNotes or Notability, pen colors that work on dark pages, finding your place, and keeping it private.",
    eyebrow: "Digital journaling",
    published: "2026-10-21",
    updated: "2026-10-21",
    minutes: 6,
    image: {
      src: "/images/products/indigo-digital-hero.webp",
      alt: "The INDIGO digital journal: the moonlit cover beside two inside pages, The Indigo Journey and The Feelings I Hide",
      width: 1280,
      height: 720,
    },
    ogImage: "/images/og/indigo-digital.jpg",
    lede: "A digital journal lives on the device you already reach for at night. Here's how to set one up so it feels close to paper, stays private, and doesn't get lost in your files.",
    body: [
      { h2: "Paper or digital?" },
      { p: "Both work. The best journal is the one you'll open again tomorrow." },
      {
        ul: [
          "**Digital** suits you if your tablet is already by the bed, you like to erase and rewrite, you want the journal behind a passcode, or you want to start tonight without waiting for shipping.",
          "**Paper** suits you if screens keep you awake, you love the feel of a pen, or you want a break from devices at night.",
        ],
      },
      { p: "Plenty of people use both: the digital file for nightly writing, a paperback for the nights they want to stay off screens." },

      { h2: "What you need" },
      {
        ul: [
          "A tablet and stylus: an iPad with Apple Pencil or another compatible stylus, or an Android tablet with a pen, such as a Samsung Galaxy Tab with S Pen.",
          "An app that lets you write on PDFs: GoodNotes, Notability, Noteshelf, Xodo, Samsung Notes or similar.",
          "The journal PDF.",
        ],
      },

      { h2: "How to open the PDF in your app" },
      { h3: "GoodNotes" },
      {
        ol: [
          "Download the PDF on your iPad. If you bought on Gumroad, the link is in your receipt email.",
          "Tap the Share icon and choose GoodNotes, or use Import inside GoodNotes and pick the file from Files.",
          "It opens as a new notebook. Rename it so it's easy to find.",
        ],
      },
      { h3: "Notability" },
      {
        ol: [
          "Download the PDF.",
          "Tap Share and choose Notability, or use Notability's own Import option and select the file.",
          "It opens as a new note, with every page ready to write on.",
        ],
      },
      { h3: "Other apps and Android" },
      {
        p: "Most PDF apps work the same way: open the file from the Files app or the share sheet. On Android, open it from your Downloads folder with Samsung Notes, Xodo or the PDF app you already use.",
      },

      { h2: "Pen colors that work on dark pages" },
      { p: "A dark journal is easy on the eyes at night, but black ink disappears on it. What works instead:" },
      {
        ul: [
          "**White, gold or lavender ink.** On INDIGO's indigo pages these show up best.",
          "**A medium pen width**, so your writing stays readable with the screen turned down.",
          "**Low brightness and a warm screen setting** (Night Shift on iPad) for late-night writing.",
        ],
      },

      { h2: "Finding your place each night" },
      {
        p: "A journal with 100+ pages needs a simple way back to where you stopped. Add a bookmark or favorite to the page you're on, or use the page thumbnails your app shows. [INDIGO](/products/indigo-digital/) is meant to be worked through in order, so you only ever need to find the last page you wrote on.",
      },

      { h2: "Keeping it private" },
      {
        ul: [
          "Lock your tablet with a passcode or Face ID.",
          "Check whether your notes app offers a lock for individual notebooks.",
          "Think about sync. If the app backs up to iCloud or Google Drive, your journal is there too. That helps if you lose the device; turn sync off for this notebook if you'd rather keep it in one place.",
          "Export a copy now and then (Share, then export as PDF) so your writing survives a change of app or device.",
        ],
      },

      { h2: "Can I print it?" },
      {
        p: "Usually yes, for personal use. Dark pages use a lot of ink, though, and most pens won't show up on them. If you'd rather write by hand, a print edition is easier: the [INDIGO black-and-white paperback](/products/indigo-paperback-bw/) gives every page a white writing panel, and the [full-color paperback](/products/indigo-paperback-color/) keeps the night-sky art (use a white, gold or silver gel pen).",
      },

      { h2: "Try it in your app first" },
      {
        p: "[7 Nights in INDIGO](/products/seven-nights/) is a free, pay-what-you-want PDF with fourteen prompts for one week. Open it in your app, try the pen colors, and see if writing on a screen feels right before you get the full [121-page INDIGO journal](/products/indigo-digital/).",
      },
      { product: "indigo-digital" },
      { note: crisisNote },
    ],
    sources: [],
  },

  {
    slug: "emotional-healing-journal",
    metaTitle: "Emotional Healing Journal: What Writing Can (and Can't) Do",
    title: "An emotional healing journal: what writing can do, what it can't, and how to use one",
    description:
      "What 40 years of research says about writing through hard feelings, how to journal without spiraling, and when a journal isn't enough. Honest, no 30-day promises.",
    eyebrow: "Healing journals",
    published: "2026-10-21",
    updated: "2026-10-21",
    minutes: 7,
    image: {
      src: "/images/art/indigo-lake.webp",
      alt: "A full moon over a still lake at night, wildflowers along the shore",
      width: 1000,
      height: 277,
    },
    ogImage: "/opengraph-image.jpg",
    lede: "A journal can't fix your life. It can give a feeling somewhere to go besides around and around in your head. That turns out to matter.",
    body: [
      { h2: "What the research says" },
      {
        p: "Psychologists have studied this for about 40 years under the name expressive writing. In the first studies, people wrote about their deepest thoughts and feelings on a difficult experience for 15 to 20 minutes, on several days in a row. Compared with people who wrote about neutral topics, they visited the health center less often in the months that followed (Pennebaker & Beall, 1986).",
      },
      {
        p: "Later reviews pooled many of these experiments and found a benefit that is real but small on average, for both physical and emotional measures (Smyth, 1998; Frattaroli, 2006). Small is the honest word. Writing helps some people a lot, some a little, and some not at all.",
      },
      {
        p: "One reason it may help: naming a feeling seems to take some of the heat out of it. In a brain-imaging study, simply putting a word to the emotion in a photo, like “angry” or “scared,” reduced activity in the amygdala, a part of the brain involved in alarm (Lieberman et al., 2007). Writing “I feel ashamed” is a small act of naming.",
      },

      { h2: "What a journal can't do" },
      {
        ul: [
          "It can't replace a therapist, a doctor or medication.",
          "It can't make every painful memory safe to open alone. If writing brings up panic, flashbacks or thoughts of hurting yourself, stop and reach out to someone.",
          "It doesn't work on a deadline. “Healed in 30 days” is marketing, not psychology.",
        ],
      },

      { h2: "How to write without spiraling" },
      {
        p: "The difference between processing and ruminating is direction. Rumination loops on “Why does this always happen to me?” Processing moves: what happened, what I felt, what it reminds me of, what I need.",
      },
      {
        ol: [
          "**Name it first.** Start with one feeling word: “Hurt.” “Embarrassed.” “Tired of trying.”",
          "**Describe, then make sense of it.** Write what happened, then what you felt, then what you think it means. In one study, people whose writing moved toward understanding over several days, using more words like “because” and “realize,” were the ones whose health improved most (Pennebaker, Mayne & Francis, 1997).",
          "**Set a timer.** Ten to twenty minutes. Stop when it rings.",
          "**Step back if you're stuck.** Write the moment as if it happened to a friend, or use your own name instead of “I.” Researchers call this self-distancing, and it can make hard feelings easier to look at (Kross et al., 2014).",
          "**End somewhere steady.** Finish with one line about what you'll do next: drink some water, go to sleep, text a friend.",
        ],
      },

      { h2: "What a good emotional healing journal includes" },
      {
        ul: [
          "Prompts that start with noticing before they ask you to change anything.",
          "Space after each prompt. Real feelings need more than three lines.",
          "A way to see the nights add up, like a simple tracker.",
          "Room for feelings that rarely get any: anger, envy, grief, being tired of being the strong one.",
          "A note on where to get help, because a responsible journal includes one.",
        ],
      },

      { h2: "How INDIGO is built" },
      {
        p: "[INDIGO](/products/indigo-digital/) follows that shape in three Acts. **The Deep Night** is for recognizing: the emotions you hide and the patterns you keep repeating. **The Still Water** is for understanding: gentle inner child work, the rules you learned growing up, the boundaries you never got to set. **The First Light** is for growing: what you need, what you value, what you're ready to change. Every prompt page is followed by a full page to write on, and a 30-night moon tracker lets you watch the nights add up.",
      },
      {
        p: "The name Khram (คราม) comes from the life of the person who makes these journals: a lot of mistakes, some dark years, and one sentence from the time they nearly died: \"I did the best I could.\" [Khram](/our-story/) means someone who has known the dark and still has light inside. INDIGO is built for that: it doesn't ask you to be healed first. Ten minutes tonight. Again tomorrow. Still here. Still walking.",
      },
      { product: "indigo-digital" },
      { note: crisisNote },
    ],
    sources: [sources.pennebaker1986, sources.smyth, sources.frattaroli, sources.lieberman, sources.pennebaker1997, sources.kross],
  },

  {
    slug: "shadow-work-journal-prompts",
    metaTitle: "60 Shadow Work & Self-Reflection Journal Prompts (Free List)",
    title: "60 shadow work and self-reflection journal prompts for quiet nights",
    description:
      "60 free journal prompts for shadow work and self-reflection, grouped by theme: hidden feelings, overthinking, people-pleasing, anger, envy, inner child, relationships and self-worth.",
    eyebrow: "Journal prompts",
    published: "2026-10-21",
    updated: "2026-10-21",
    minutes: 9,
    image: {
      src: "/images/products/seven-nights-hero.webp",
      alt: "7 Nights in INDIGO, a free mini journal: the moonlit cover and the first prompt page, Meeting Yourself",
      width: 1280,
      height: 720,
    },
    ogImage: "/images/og/seven-nights.jpg",
    lede: "Sixty questions, grouped so you can find the one you need tonight. Take one. Write for ten minutes. Leave the rest for another night.",
    body: [
      { h2: "How to use these prompts" },
      {
        ul: [
          "**One prompt per session.** Going deep on one question beats skimming ten.",
          "**If a question stings, that's information,** not a sign to push harder. Mark it and come back when you have more room.",
          "**Write the first honest answer,** then ask yourself “and under that?” once.",
          "**Date every entry.** Patterns show up over weeks, not single nights.",
        ],
      },
      { p: "New to this? Start with [shadow work for beginners](/guides/shadow-work-journal-for-beginners/), which covers a simple 10-minute routine and when to stop." },

      { h2: "Noticing what you hide" },
      {
        prompts: [
          "What feeling do I tend to hide, even from the people closest to me?",
          "What do I usually say instead of how I really feel?",
          "Which topic do I change the subject on, every time?",
          "When did I last cry, or almost cry? What was happening?",
          "At what point in my day do I go numb?",
          "If my body could talk about this week, what would it complain about?",
          "What am I pretending not to know?",
        ],
        start: 1,
      },

      { h2: "Overthinking" },
      {
        prompts: [
          "What conversation am I still replaying? What do I wish I'd said?",
          "What am I afraid people think of me right now? What evidence do I actually have?",
          "Which worry has been with me the longest? How old was I when it started?",
          "What decision am I stuck on, and what would “good enough” look like?",
          "When my mind races at night, what does it usually race toward?",
          "What would I tell a friend who kept thinking the thought I keep thinking?",
          "What am I trying to control that isn't mine to control?",
          "If I let this worry rest for one night, what am I afraid would happen?",
        ],
        start: 8,
      },

      { h2: "People-pleasing and boundaries" },
      {
        prompts: [
          "Who do I find it hardest to say no to? What happens in my body when I try?",
          "What did I agree to this month that I didn't want to do?",
          "Whose mood do I watch most closely? Since when?",
          "What do I believe will happen if I disappoint someone?",
          "Where do I give more than I get back?",
          "What boundary have I set and then quietly taken back?",
          "What would a kind, clear “no” sound like in my own words?",
          "Who in my life respects my limits without me having to explain them?",
        ],
        start: 16,
      },

      { h2: "Anger and resentment" },
      {
        prompts: [
          "What made me angry this week that I didn't say out loud?",
          "How was anger handled in the house I grew up in?",
          "Who do I still resent? What did I need from them that I didn't get?",
          "Where does anger sit in my body? What does it want me to do?",
          "What do I do instead of feeling angry: clean, scroll, apologize, go quiet?",
          "Now that I can name what made me angry, what would be fair to ask for?",
          "Which “small” thing keeps bothering me? What bigger thing might it stand for?",
        ],
        start: 24,
      },

      { h2: "Envy and the golden shadow" },
      {
        p: "Jung's shadow isn't only the dark stuff. People also disown good qualities, like confidence, ambition or playfulness, that weren't welcome at some point. These are sometimes called the golden shadow, and envy is often the clue.",
      },
      {
        prompts: [
          "Whose life do I envy right now? What exactly do I envy?",
          "What does that envy tell me I want for myself?",
          "What trait in other people irritates me most? Where might it live in me?",
          "Which compliment do I brush off every time?",
          "What talent or interest did I give up because someone laughed at it?",
          "Who do I admire, and which of their qualities am I afraid to claim?",
          "What would I try if I didn't need to be good at it?",
        ],
        start: 31,
      },

      { h2: "Inner child" },
      {
        prompts: [
          "What did I need most as a child that I didn't get enough of?",
          "What was I praised for growing up? What was I quietly punished for?",
          "Which family rule do I still follow without thinking?",
          "What did I learn about crying, needing help or asking for things?",
          "What did I love doing at eight years old? When did I stop?",
          "Write a short letter to yourself at the age when things got hard.",
          "What does the younger me need to hear from me now?",
          "What can I give myself this week that I wanted back then?",
        ],
        start: 38,
      },

      { h2: "Relationships and attachment" },
      {
        prompts: [
          "When someone takes a long time to reply, what story do I tell myself?",
          "What do I do when I feel someone pulling away?",
          "In relationships, am I more afraid of being left or of being trapped?",
          "What pattern keeps showing up in my relationships, even with different people?",
          "What did I learn about love from watching the adults around me?",
          "Who do I feel most like myself with? What do they do differently?",
          "What do I need from a partner or friend that I've never said out loud?",
          "Where do I lose myself in relationships?",
        ],
        start: 46,
      },

      { h2: "Self-worth and the inner critic" },
      {
        prompts: [
          "What does my inner critic say most often? Whose voice does it sound like?",
          "What would I have to achieve before I'd feel “enough”? Who set that bar?",
          "When did I last feel proud of myself, even quietly?",
          "What mistake do I keep punishing myself for?",
          "What would I forgive in a friend that I won't forgive in myself?",
          "What is one true, ordinary good thing about me?",
          "If I believed I was enough tonight, what would I stop doing?",
        ],
        start: 54,
      },

      { h2: "When to put the pen down" },
      {
        p: "Some questions open more than you expected. If you feel flooded, shaky or unsafe, stop writing. Breathe out slowly, get some water, go outside or talk to someone you trust. Coming back to a prompt next week, or with a therapist, is a good decision, not a failure.",
      },

      { h2: "Want them in order, with room to write?" },
      {
        p: "A list is a good start, but questions work better in a sequence. [INDIGO](/products/indigo-digital/) has 150+ prompts in three Acts, from noticing to understanding to growing, with a full page to write on after each one and a 30-night moon tracker. If you'd like to try first, [7 Nights in INDIGO](/products/seven-nights/) is free.",
      },
      { product: "indigo-digital" },
      { note: crisisNote },
    ],
    sources: [sources.jung],
  },
];

export const findGuide = (slug: string) => guides.find((g) => g.slug === slug);
