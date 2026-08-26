# Twin Peaks Birthday 2026

Event brief. Everything settled in the Tom / Angharad planning call, plus what is
still open and who it sits with.

**Status:** draft, not launched. Last updated 26 August 2026.

---

## At a glance

| | |
|---|---|
| Name | Twin Peaks Birthday (both languages, untranslated) |
| Subtitle | Three years of Twin Peaks (EN) · ツインピークス3周年 (JA) |
| Date | Saturday 19 September 2026 |
| Rain date | Sunday 20 September 2026 |
| Time | 9:00am to 5:00pm, plus an evening afterparty |
| Venue | Twin Peaks Bike Park, Niseko |
| Format | One day, two halves: dig in the morning, games in the afternoon |
| Adult | ¥5,000 |
| Child (under 16) | ¥2,500 |
| Sales channel | Ecwid |
| Capacity | No published cap. Internal target ~80 |
| Pages | `/events/twin-peaks-birthday-2026/` · `/ja/events/twin-peaks-birthday-2026/` |

The park opened 16 September 2023, so the 19th is genuinely the third-anniversary
weekend. The 21st is Respect for the Aged Day, which is why there is room to slip
to Sunday without wrecking anyone's plans.

---

## Naming

**Settled: Twin Peaks Birthday, untranslated, in both languages.** The English name
is the wordmark and appears identically on the Japanese page. Each language then
carries its own subtitle:

| | Title | Subtitle |
|---|---|---|
| EN | Twin Peaks Birthday | Three years of Twin Peaks |
| JA | Twin Peaks Birthday | ツインピークス3周年 |

The Japanese subtitle does the decoding work, so a Japanese reader gets the meaning
without the name being translated.

### Options considered and dropped

- **誕生祭 (tanjosai)**, birthday festival. Was the working name. Dropped after
  feedback that it read childish. The likely cause is that 誕生祭 is strongly
  associated with idol and anime character birthday events in current usage.
- **三歳 (sansai)**, three years old. Cute personification of the park, but it
  amplified the same problem and expires after this year.
- **感謝祭 (kanshasai)**, appreciation festival. The standard Japanese name for a
  customer or fan appreciation event. Strong fit for a volunteer-built park saying
  thank you, and worth revisiting for a future edition.
- **秋祭り (aki matsuri)**, autumn festival. Maps well onto the games-and-prize-draw
  format, but risks implying a large free public festival.
- **3周年 (sanshunen)**, 3rd anniversary. Accurate but corporate.
- **Community Day.** Generic, and it collides with the dig days and Nakama Rides
  already in the calendar.

Keeping the name in English also sidesteps the register problem entirely: as a
loanword, "Birthday" does not carry the kids-party association in Japanese that
誕生祭 does.

---

## Schedule

| Time | Activity |
|---|---|
| 9:00am | Registration |
| 9:30am | Kick-off talk |
| 9:45am | Trail building begins |
| 12:00pm | Tools down |
| 12:30pm | BBQ lunch |
| 1:00pm | Bike games |
| 4:00pm | Raffle draw |
| 5:00pm | Event ends |
| Evening | Afterparty, venue to be announced |

Crew arrive earlier than the published 9:00am. Tents and setup happen while the
dig groups are up on the hill, so nothing needs to be finished before registration.

Two things drove the shape of this. Digging runs to 12:00 rather than a shorter
session because two hours is not enough to get anything done, and the raffle sits
at 4:00pm in daylight rather than late in the evening so riders driving back to
Sapporo can see the draw and still get home at a reasonable hour.

---

## Tickets and pricing

| Ticket | Price |
|---|---|
| Adult day pass | ¥5,000 |
| Child day pass (under 16) | ¥2,500 |

- Under 16 counts as a child.
- Under 12 must be accompanied by a paying adult.
- No separate evening or afternoon-only ticket this year. One pass covers the day.
- Children get the t-shirt and lunch, no beer, which is what gets them to roughly
  half the adult price.

For reference: Soil Searching 2024 was ¥3,000 adult / ¥1,500 child. Trail Days 2025
was ¥5,000 all-day and ¥1,000 evening-only.

---

## What's included

- Limited edition event t-shirt
- BBQ lunch
- Pow Bar
- One beer, adults only
- Raffle tickets, with more earned through the afternoon games

Volunteers get lunch free.

Catering budget: aim for ¥1,000 a head, with room up to about ¥1,500 average once
adults and children even out. Menu to be confirmed, which is why the page says
"lunch included" and nothing more specific. Announce the caterer separately once
it is locked, as its own social post.

---

## The dig

Runs as a normal NAMBA dig day. Groups head up, tools and gloves and instruction
provided, no experience needed.

**The dig is optional.** There is a tick box at checkout for it. Someone who only
wants the afternoon can turn up for lunch. The tick box also gives a headcount for
group sizing, which is the reason previous years capped numbers at all.

Minimum viable scope if nothing more ambitious is ready: build more features in the
skills park.

---

## The games

Bike-related mini games around the base area through the afternoon.

- Small challenges done on your own bike. No race skills, no special bike.
- Each challenge completed earns raffle tickets. Doing more means better odds.
- Whether riders can re-attempt the same challenge is an operational detail, not
  decided, and does not need to be on the page.
- The page deliberately does not list what the activities are.
- Open question: whether any challenges are age-banded for younger kids. Can be
  settled later.

---

## The raffle

- Drawn at 4:00pm at the base, with everyone still on site.
- Only participants are entered. No tickets sold separately.
- Prizes are already being collected.

Prize list is still to come. When it lands it goes **inline on the event page** as a
prize grid, not on a standalone `/raffle/` page. Follow the 2025 layout, which is
recoverable from git:

```
git show 008acbf:raffle/index.html
```

That structure is rows of prize cards, each with title, description, inclusions,
images, sponsor logos, quantity and a note. There is also a `_data/prizes.yml`
already in the repo worth checking before rebuilding anything by hand.

---

## The t-shirt

- Limited edition, made for this event only, not sold afterwards.
- Everyone gets one, including children.
- **Single colour print.** Badge on the front, larger design on the back.
- Base design is Joe's Twin Peaks badge, possibly modified, with a third-birthday
  line added. Ask Joe about a variant.
- **Do not use the trail crew / staff top designs.** Staff tops stay visually
  distinct from anything participants wear.
- Shirt colour undecided. Yellow with black, purple and blue were all floated.
- The design is not revealed before the day. Handing them out and everyone putting
  them on at once is part of the event.

**Ordering.** Supplier lead time is about 10 days, so orders go in two weeks before
the event. Anyone signing up inside that window is told their size is not
guaranteed. Remaining shirts get ordered in larger sizes so people can be fitted
on the day. This is on the page and in the sidebar.

---

## Afterparty

Deliberately separate from the raffle. Unofficial and low commitment: pick a bar in
Hirafu and go take it over.

Worth asking a venue for a drinks discount for anyone in an event t-shirt in
exchange for bringing them the trade. Rhythm have offered to host if a formal venue
is wanted.

The page says "watch this space" rather than naming anywhere, so nothing is locked.

---

## Capacity

No cap published, and no cap set in Ecwid for now.

Internal target is around 80 t-shirts. Assuming roughly 10 volunteers, that is
about 70 attendees, which would be a big event. For comparison, Trail Days 2025 was
around 70 and the Peaty's Whip Off drew 50.

Ecwid stock control can be hidden from the storefront if a limit is wanted later
without displaying it. Reassess two weeks out, when the shirt order goes in.

---

## Weather

Saturday only. If Saturday is bad the whole event moves to Sunday 20 September.
Monday the 21st is a public holiday, so the weekend absorbs it.

---

## Ecwid

**Product 859390827, `twin-peaks-birthday`, currently DISABLED.** In the Events
category (200192502), modelled on Soil Searching 2024. Adult ¥5,000 with a
`-2500` absolute price modifier on the child choice. `isShippingRequired: false`,
`unlimited: true`. Masthead image set as the main image with EN and JA alt text.

Options, all bilingual:

| Option | Type | Required |
|---|---|---|
| Type: Adult / Child (under 16) | radio | yes |
| Participant name (JA asks for 漢字・カタカナ) | text | yes |
| T-shirt size: Kids 130, Kids 150, XS to XXL | select | yes |
| Joining the morning trail build? | radio | yes |
| Dietary requirements | text | no |
| What language(s) do you speak? | checkbox | no |
| Agreement to the Event Participation Terms | radio | yes |

The terms link is a gold line at the top of the product description, pointing at
`/events/waiver/` (JA: `/ja/events/waiver/`). Ecwid renders option labels as plain
text, so the description is the only place on a product that takes a link.

Still to do:

- [ ] Confirm the t-shirt size run against the actual supplier
- [ ] Decide whether to expose or hide stock control
- [ ] Enable the product, then uncomment `storeProductId` and `storeProductSlug`
      in both post files

Uncommenting `storeProductSlug` renders the Buy ticket button and the "by signing
up you agree to our Event Participation Terms" line.

---

## Where it lives

| File | Purpose |
|---|---|
| `_posts/2026-09-19-twin-peaks-birthday.md` | EN event post |
| `ja/_posts/2026-09-19-twin-peaks-birthday.md` | JA event post |
| `_includes/event-stats.html` | Three-years stat panel, figures computed from data |
| `assets/images/events/2026/twin-peaks-birthday/` | Images: masthead 4-tier WebP + AVIF, thumb, monk, dig ×2, prizes ×2 |
| `_includes/event-figure.html` | Two-up image pairs and inline photo credits |

The stat panel pulls trail km and trail count from `_data/trails.yml` and visitor
numbers from `_data/impact.yml`, so it will not go stale. It currently shows
3 years old · 17.8km · 20 trails · 19,000+ rider visits since 2024.

---

## Open items

| Item | Owner | Blocking launch |
|---|---|---|
| Mirror the current EN copy into the JA post | Claude | Yes |
| Enable the Ecwid product, uncomment the two front matter lines | Tom | Yes |
| Confirm the t-shirt size run with the supplier | Tom | Yes |
| Confirm event partners before adding any logos | Tom | Yes if partners are shown |
| Prize list, then build the prize grid | Tom | No, can be added after launch |
| Decide on photo credits for Alister Buckingham's four images | Tom | No |
| T-shirt design brief to Joe | Angharad | No |
| Shirt colour | Angharad | No |
| Caterer | Angharad | No |
| Afterparty venue | Angharad | No |
| Flip `draft:` to `false` on **both** posts together | Tom | Yes |

Right now EN is `draft: false` and JA is `draft: true`, which puts the English card
in the events index and calendar feed with no Japanese counterpart and no ticket
button. Both should be `true` until launch, then flipped together.

The JA post has all the same images, credits and layout, but its body copy is the
earlier version and has not caught up with the EN rewrite.

Photo credits: the masthead and the monk shot are Jinya Nishiwaki
(instagram.com/jingypsy) and are credited. The first dig photo is Chad Clark /
Sea and Summit Media. The second dig photo and both raffle photos are Alister
Buckingham. None of those three are credited yet.

Store-wide, unrelated to this event: Ecwid's legal pages still point at the dead
namtba.com domain while `requireTermsAgreementAtCheckout` is `true`. The API token
lacks `update_store_profile`, so this has to be fixed in the Ecwid admin under
Settings > Legal Pages. Correct URLs are `namba.ngo/terms/`, `namba.ngo/privacy/`
and `namba.ngo/about/`, each with a `/ja/` twin.

No partners are listed on the page yet. The copy mentions a Pow Bar and a beer
because both were treated as given in planning, but no sponsor logos are shown
until 2026 partners are confirmed.

---

## Decided against

- A separate evening-only or afterparty-only ticket.
- A standalone `/raffle/` page. Prizes go on the event page.
- Publishing an attendee cap.
- A separate under-6 price band. Simplified to a single under-16 child rate.
- Revealing the t-shirt design before the day.
- Naming the afterparty venue on the page before it is confirmed.
