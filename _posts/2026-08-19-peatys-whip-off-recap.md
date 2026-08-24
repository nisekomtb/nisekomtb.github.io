---
layout: story
categories: stories
title: "Peaty's Whip Off 2026"
subtitle: "NAMBA's First Contest at Twin Peaks"
# seoTitle now earns its place on KEYWORD rather than on the event name. The H1 leads with
# "Peaty's Whip Off 2026" since 2026-08-24, so the default tag would carry the event name
# anyway; what it would NOT carry is "Niseko". The H1 and subtitle say "Twin Peaks" and
# never say the region, which is the word anyone searching from outside Hokkaido types.
# Length is the secondary reason: base.html builds "title: subtitle - NAMBA", which for
# this post is 66 characters and gets clipped in results. This is 59 including the suffix.
# It deliberately ECHOES the H1 rather than reading as an unrelated headline; Google
# rewrites titles that diverge from the H1 it finds on the page.
seoTitle: "Peaty's Whip Off 2026: NAMBA's First Niseko Contest"
description: "Peaty's Whip Off 2026 was NAMBA's first ever contest: 13 riders threw whips off Launch Control at Twin Peaks in Niseko. How the day went, and who won."
author: tom-mortiboy
storyType: event-recap
# Card image for /stories/. Deliberately NOT the masthead crop: the masthead is a wide
# letterbox with the headline typeset over the middle of it, so at card proportions the
# subject sits behind text that is no longer there. Frame 44 is a clean whip that reads
# at 380px, and it already carries the -large and -xlarge WebP tiers the card srcset wants.
thumbnail: /assets/images/stories/peatys-whip-off/peatys-whip-off-44.jpg
thumbnailAlt: "Shiita Ogawa throwing his yellow bike sideways over the big jump at Twin Peaks"
masthead:
  img: /assets/images/bg/bg-header-whip-off.jpg
og:
  image: /assets/images/og/whip-off.jpg
---

<p class="story-lede">On 15 August we held the <a href="/events/peatys-whip-off-2026/">Peaty's Whip Off</a> at
<a href="/twin-peaks/">Twin Peaks</a>, our first ever contest. Thirteen riders, three categories, and it
definitely won't be our last.</p>

{% include story/chapter.html num="01" label="Right, so what's a whip off?" %}

<p>Whips are all about getting your bike sideways, and a whip off is all about who can do it the best.
Style, height and execution all come into play on the quest to be top dog.</p>

{% include story/figure.html
   tier="wide"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-18.jpg"
   alt="Shiita Ogawa with the bike fully sideways and flat over the big jump, competition plate on the handlebars"
   width="2400" height="1600" widths="800,1600,2400"
   caption="Shiita Ogawa showing us what an epic whip looks like." %}

{% include story/figure.html
   tier="text"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-08.jpg"
   alt="The three judges, Mark Wyckmans, Andy Meadows and Meg MacDonald, on the bank beside the trail with clipboards and score sheets"
   width="1600" height="2400" widths="800,1600"
   caption="Our guest judges: Mark, Andy and Meg, score sheets at the ready." %}

<!-- VIDEO REMOVED 2026-08-24. Two approaches tried here and both pulled: Meta's Instagram
     embed, then a direct <video> on a self-hosted file. Recording what was measured so a
     third attempt starts from facts rather than from scratch.

     THE SOURCE, if it comes back: assets/video/whip-off.mp4, 720x1280, 32.8s, HEVC, 14.3
     Mbps, 58.5 MB. That file is GITIGNORED, see the note in .gitignore. It is still on
     disk locally; it was never committed, which is deliberate.

       - 14.3 Mbps for 720x1280 is roughly twenty times what the resolution needs. The same
         clip at 2.5 Mbps is about 10 MB, at 1.5 Mbps about 6 MB, both indistinguishable at
         a 420px render width. Transcoding to H.264 shrinks it AND fixes the codec gaps
         below, so it is one job, not two.
       - HEVC playback was VERIFIED, not assumed: canPlayType returns "probably" for hev1
         and hvc1 on Chrome 151/macOS, and the element reached readyState 4 with the frame
         decoded. The gaps are Firefox everywhere, plus Chrome on Linux and older Android.
       - The export has a burned-in Instagram watermark and an opening title card, so a
         self-hosted copy still reads as a reposted reel. A clean master is worth having
         before this ships.
       - The Instagram embed itself caused NO layout shift, measured at two widths. Its
         real costs were a third-party connection to Meta and a white card on a dark page.
       - Poster frame: 20s into the clip is the best whip. Regenerate with
         `ffmpeg -ss 20 -i assets/video/whip-off.mp4 -frames:v 1 -q:v 4 out.jpg`.

     If a <video> returns, `.story-embed-frame` in story.css section 4 is still no help: it
     hard-codes aspect-ratio 16/9 and this is 9:16. A portrait tier needs adding there, or
     a width cap on the wrapper. -->

{% include story/chapter.html num="02" label="The jump line everyone laps" %}

<p>Since the opening of our jump line, Launch Control, in 2025 it has quickly become the most popular trail at Twin Peaks,
and thanks to the dedicated climb trail Repeat Offender, quick fire laps make for great progression.</p>

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-05.jpg"
   alt1="The Launch Control jump line running away empty through green summer forest, two figures small in the distance"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-06.jpg"
   alt2="A dirt roller on the jump line with someone standing beside the trail and spectators further along it"
   dims="2400x1600,2400x1600"
   widths="800,1600,2400"
   caption="Pretty rare to see Launch Control with nobody riding it, let alone on a Saturday." %}

{% include story/chapter.html num="03" label="Before the first run" %}

<p>Peaty's kindly supplied the prizes for the day, all on display at the end of Launch Control so you could
see what you were riding for. Waivers were signed in advance, so it was turn up, get your number, and go for a warm-up lap.</p>

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-01.jpg"
   alt1="The NAMBA event tent at the top of a dirt trail in summer birch forest, bikes lying on the ground and a few people gathered under it"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-02.jpg"
   alt2="Prizes laid out on a trestle table: folded shirts, teal bottles of Peaty's product and a red Peaty's box"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-03.jpg"
   alt3="A man in a NAMBA t-shirt standing behind the registration table under the event tent, bottles and boxes in front of him"
   src4="/assets/images/stories/peatys-whip-off/peatys-whip-off-04.jpg"
   alt4="The black event tent among the trees at the top of the trail with a group of riders and spectators gathered around it"
   dims="2400x1600,2400x1600,2400x1600,2400x1600"
   widths="800,1600,2400"
   caption="The tent at the hub, with a preview of what's up for grabs." %}

{% include story/figure.html
   tier="wide"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-07.jpg"
   alt="Riders and volunteers gathered on the trail for the rider briefing at the start of the day, one of the organisers holding up a board"
   width="2400" height="1600" widths="800,1600,2400"
   caption="The rider briefing, before the first warm-up laps." %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-60.jpg"
   alt1="A rider airborne over the jump with the bike turned sideways beneath them, between the Twin Peaks and NAMBA flags"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-61.jpg"
   alt2="Eita Moriyama in red trousers and a red helmet airborne over the jump between the Twin Peaks and NAMBA flags"
   dims="2400x1600,2400x1600"
   widths="800,1600,2400"
   caption="Warming-up those whips." %}

{% include story/chapter.html num="04" label="The women went first" %}

<p>Angharad, Stephanie and Sachi were up first, hitting the medium jumps at the start of Launch Control.</p>

{% include story/figure.html
   tier="text"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-62.jpg"
   alt="Sachi Matsuzawa, Stephanie Watanabe and Angharad Mortiboy laughing together with their bikes at the side of the trail"
   width="1600" height="2400" widths="800,1600"
   caption="" %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-52.jpg"
   alt1="Angharad Mortiboy, Stephanie Watanabe and Sachi Matsuzawa standing with their bikes on the trail before their runs, Angharad throwing a peace sign"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-11.jpg"
   alt2="Sachi Matsuzawa, plate 1 and the winner of the women's category, pushing her bike up the trail in a full-face helmet, spectators behind her"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-12.jpg"
   alt3="Angharad Mortiboy in a bright floral shirt, grinning, riding over a crest on the jump line with spectators clapping from the bank"
   src4="/assets/images/stories/peatys-whip-off/peatys-whip-off-36.jpg"
   alt4="Stephanie Watanabe riding up the trail on her orange Surly in an off-white top and black leggings, spectators clapping her through"
   src5="/assets/images/stories/peatys-whip-off/peatys-whip-off-50.jpg"
   alt5="Angharad Mortiboy airborne off the medium jump in her bright patterned shirt, both wheels well clear of the lip"
   src6="/assets/images/stories/peatys-whip-off/peatys-whip-off-51.jpg"
   alt6="Stephanie Watanabe airborne off the medium jump on her orange Surly in an off-white top, front wheel lifting off the lip"
   dims="2400x1600,2400x1600,2400x1600,2400x1600,1600x1067,1600x1067"
   widths="800,1600"
   caption="Sachi, Stephanie and Angharad." %}

{% include story/figure.html
   tier="text"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-49.jpg"
   alt="Sachi Matsuzawa airborne off the medium jump in tiger-print leggings, the bike turned sideways beneath her, between the Twin Peaks and NAMBA flags"
   width="1600" height="2000" widths="800,1600"
   caption="Sachi sending it." %}

{% include story/chapter.html num="05" label="Then on to the men's" %}

<p>Once the women's category had finished we all headed down to the bigger jump at the bottom of the line.</p>

{% include story/figure.html
   tier="text"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-59.jpg"
   alt="Kouya Hamaya in a navy t-shirt pushing his yellow Santa Cruz up the trail with plate 7 on the bars, Eita Moriyama alongside him with plate 10"
   width="1600" height="2400" widths="800,1600"
   caption="Kouya Hamaya and Eita Moriyama" %}

<p>Seiko from our trail crew in his natural habitat: he can be found lapping Launch Control whenever he's not on the tools.</p>

{% include story/figure.html
   tier="wide"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-54.jpg"
   alt="Seiko Doi riding back up the trail in his burgundy top and beige trousers, grinning broadly, spectators lining the bank behind him"
   width="2400" height="1600" widths="800,1600,2400"
   caption="Seiko on the way back up for another one." %}

{% include story/figure.html
   tier="text"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-34.jpg"
   alt="Seiko Doi in a burgundy top and beige trousers throwing a no-hander over the big jump, both hands off the bars and arms spread wide"
   width="1600" height="2400" widths="800,1600"
   caption="Both hands off." %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-14.jpg"
   alt1="Lucas in a yellow t-shirt high above the lip of the big jump, bike turned sideways beneath him, the Twin Peaks flag and spectators below"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-15.jpg"
   alt2="Kouya Hamaya in a navy shirt with plate 7 on the bars, whipping his bike flat over the big jump between the Twin Peaks and NAMBA flags"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-44.jpg"
   alt3="Shiita Ogawa in a black Santa Cruz tank throwing his yellow bike sideways over the big jump between the Twin Peaks and NAMBA flags"
   src4="/assets/images/stories/peatys-whip-off/peatys-whip-off-35.jpg"
   alt4="Eita Moriyama, who won the men's 16 and over, high above the lip of the big jump in red trousers and a black Santa Cruz jersey, both wheels clear of the ground"
   src5="/assets/images/stories/peatys-whip-off/peatys-whip-off-17.jpg"
   alt5="Sasha Cady seen from directly below the jump, dressed in black with olive socks, crossing the lip on a white bike against the trees"
   src6="/assets/images/stories/peatys-whip-off/peatys-whip-off-37.jpg"
   alt6="Danny Sopp of the NAMBA trail crew in a white helmet and olive t-shirt, bike turned sideways high between the Twin Peaks and NAMBA flags"
   src7="/assets/images/stories/peatys-whip-off/peatys-whip-off-47.jpg"
   alt7="A rider in black with a grey helmet, the bike turned right over beneath them, high between the Twin Peaks and NAMBA flags"
   src8="/assets/images/stories/peatys-whip-off/peatys-whip-off-43.jpg"
   alt8="Eita Moriyama in his black Santa Cruz jersey and red trousers with the bike completely flat and sideways above the jump"
   src9="/assets/images/stories/peatys-whip-off/peatys-whip-off-46.jpg"
   alt9="A rider in a full-face helmet with a mint-green bike turned sideways over the jump, the orange fork stanchions bright against the trees"
   src10="/assets/images/stories/peatys-whip-off/peatys-whip-off-45.jpg"
   alt10="A rider in a lime-green helmet and navy top with the bike turned sideways as they cross the lip of the big jump"
   src11="/assets/images/stories/peatys-whip-off/peatys-whip-off-42.jpg"
   alt11="A rider high above the jump with the bike flat and sideways beneath them, framed against a white sky between the event flags"
   src12="/assets/images/stories/peatys-whip-off/peatys-whip-off-48.jpg"
   alt12="A rider in a white and lime helmet with the bike laid over sideways as they come off the lip of the big jump"
   dims="2400x1600,2400x1600,2400x1600,2400x1600,2400x1600,2400x1600,2400x1600,1600x2400,2400x1600,2400x1600,1600x2400,2400x1600"
   widths="800,1600"
   caption="Twelve runs off the big jump at the bottom of the line. Click any of them for the full-size version." %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-70.jpg"
   alt1="A rider airborne over the jump in a white helmet, a photographer lying on the bank at the left shooting up at them"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-68.jpg"
   alt2="A rider airborne with the bike turned sideways, framed through out-of-focus ferns in the foreground"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-65.jpg"
   alt3="A rider airborne over the jump with the bike turned sideways, seen past a spectator standing in the foreground"
   src4="/assets/images/stories/peatys-whip-off/peatys-whip-off-66.jpg"
   alt4="A rider airborne over the jump between the flags, a spectator watching from the side of the trail in the foreground"
   dims="2400x1600,1600x2400,2400x1600,1600x2400"
   widths="800,1600"
   caption="Four more bangers." %}

{% include story/chapter.html num="06" label="Fifty people came to watch" %}

<p>We were genuinely stoked with the turnout for our first contest at Twin Peaks.</p>

{% include story/figure.html
   tier="full"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-10.jpg"
   alt="A dirt trail running down through the forest with spectators standing and sitting along both banks as riders come through"
   width="2400" height="1600" widths="800,1600,2400"
   caption="A great turn out." %}

{% include story/figure.html
   tier="text"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-57.jpg"
   alt="Spectators standing along the side of the trail clapping and cheering after a run, bikes on the ground in front of them"
   width="2400" height="1600" widths="800,1600,2400"
   caption="So many people came to watch and cheer on our riders." %}

<p>One of the most important jobs of the day: sticker duty. Handing them out to everyone is serious business, and we made sure everyone got something to remember the day by.</p>

{% include story/figure.html
   tier="text"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-33.jpg"
   alt="Holding out a NAMBA sticker to the camera, close up, with the event going on out of focus behind him"
   width="2400" height="1600"
   widths="800,1600,2400"
   caption="Who doesn't love a free sticker?" %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-69.jpg"
   alt1="Riders pushing their bikes back up the trail past spectators standing along the side, ferns on both sides"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-71.jpg"
   alt2="Riders and spectators standing on the trail between runs, one rider in a yellow t-shirt and one in red trousers"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-73.jpg"
   alt3="Two riders standing with their bikes at the top of the jump between runs, talking"
   src4="/assets/images/stories/peatys-whip-off/peatys-whip-off-64.jpg"
   alt4="An adult rider in a red and white full-face helmet riding up the trail with a young rider in a green helmet following close behind"
   dims="2400x1600,1600x2400,1600x2400,2400x1600"
   widths="800,1600"
   caption="More laps, more stoke." %}

{% include story/figure.html
   tier="wide"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-63.jpg"
   alt="A young rider in a full-face helmet riding up towards the camera while another rider is airborne over the jump behind, spectators on both banks"
   width="2400" height="1600" widths="800,1600,2400"
   caption="Chise and Sen with Sasha chasing them down." %}

<p>Once the scored runs had finished the riders gave us a real show of a party train, styling things out for the crowd.</p>

{% include story/figure.html
   tier="full"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-31.jpg"
   alt="The party train: one rider off the top of the big jump while the next two are already coming down the line behind him, spectators cheering from the bank"
   width="2400" height="1600" widths="800,1600,2400"
   caption="The party train: one lap for the crowd!" %}

{% include story/figure.html
   tier="wide"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-74.jpg"
   alt="The party train: one rider airborne over the jump while two more ride up towards the camera below, spectators filming from the right"
   width="2400" height="1600" widths="800,1600,2400"
   caption="Choo choo" %}

{% include story/chapter.html num="07" label="The kids were the best bit" %}

<p>It was great to see so many of the local kids coming up and riding at this level. It wasn't that long ago we were helping these same kids down intermediate runs at Twin Peaks. That's what happens when kids have somewhere like this to ride.</p>

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-22.jpg"
   alt1="The three local under-16 riders watching the runs, seen in profile: Sasha Cady on the left, Chise Watanabe in the middle, Sen Johnson on the right"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-19.jpg"
   alt2="Sen Johnson in a full-face helmet and yellow-lensed goggles looking towards the camera over the top of a dirt roller"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-20.jpg"
   alt3="Chise Watanabe in a white full-face helmet with red goggles riding towards the camera over a dirt crest"
   dims="2400x1600,2400x1600,2400x1600"
   widths="800,1600,2400"
   caption="Sasha, Chise and Sen. Three local kids and, between them, the whole under-16 podium." %}

{% include story/chapter.html num="08" label="Brake rotors and bragging rights" %}

<p>Winners received bragging rights, a pile of Peaty's kit, and a one-off custom medal.</p>

{% include story/figure.html
   tier="wide"
   src="/assets/images/stories/peatys-whip-off/peatys-whip-off-26.jpg"
   alt="Sachi Matsuzawa grinning as she holds up her winner's medal, made from an old brake rotor and a wooden disc burned with the Peaty's Whippet in a Devo energy dome, hung on a length of bike chain"
   width="2400" height="1600" widths="800,1600,2400"
   caption="Sachi Matsuzawa with the women's medal. Whippet + Devo hat." %}

<h3>Men 16 and over</h3>

{% include story/podium.html
   tier="text"
   n1="Eita Moriyama"
   n2="Kouya Hamaya"
   n3="Shiita Ogawa" %}

<h3>Men under 16</h3>

{% include story/podium.html
   tier="text"
   n1="Sasha Cady"
   n2="Sen Johnson"
   n3="Chise Watanabe" %}

<h3>Women</h3>

{% include story/podium.html
   tier="text"
   n1="Sachi Matsuzawa"
   n2="Stephanie Watanabe"
   n3="Angharad Mortiboy" %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-32.jpg"
   alt1="The men's 16 and over podium on top of the big jump: Kouya Hamaya second on the left, Eita Moriyama first in the centre wearing his medal, Shiita Ogawa third on the right"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-39.jpg"
   alt2="The under-16 podium on top of the big jump: Sen Johnson on the left, Sasha Cady in the centre with the winner's medal on a green chain, Chise Watanabe on the right, and Dan Graham in a straw hat handing out the prizes"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-38.jpg"
   alt3="The women's podium on top of the big jump: Stephanie Watanabe on the left, Sachi Matsuzawa in the centre holding her winner's medal, and Angharad Mortiboy waving on the right, between the NAMBA and Twin Peaks flags"
   dims="2400x1600,2400x1600,2400x1600"
   widths="800,1600,2400"
   caption="All three podiums, on top of the big jump." %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-27.jpg"
   alt1="Sasha Cady wearing the medal for winning the under-16 category, with Sen Johnson just visible to the left and Chise Watanabe standing to his right"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-28.jpg"
   alt2="Shiita Ogawa celebrating with both arms raised and a broad grin after his run, other riders around him"
   dims="1600x2400,2400x1600"
   widths="800,1600"
   caption="Sasha with the under-16 medal, and Shiita Ogawa just after announcing placing third." %}

{% include story/chapter.html num="09" label="We'll be doing it again" %}

<p>After the success of this year's event, we'll definitely be running it again next summer. Follow us on socials for news and updates, or subscribe to our feed on the <a href="/events/">events page</a>.</p>

<p>Coming from further away? Check out our guide to <a href="/plan-your-trip/">plan your trip</a>, which has the practical stuff about getting here and where to stay.</p>

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-29.jpg"
   alt1="Riders and volunteers celebrating on top of the jump, one of them lifted up, arms in the air, event flags behind"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-30.jpg"
   alt2="All of the day's winners posed together on top of the big jump behind a large NAMBA banner"
   dims="2400x1600,2400x1600"
   widths="800,1600,2400"
   caption="The winners." %}

{% include story/gallery.html
   tier="wide"
   src1="/assets/images/stories/peatys-whip-off/peatys-whip-off-21.jpg"
   alt1="Harry Tomkinson of the NAMBA trail crew riding down through the ferns, framed by out-of-focus fronds"
   src2="/assets/images/stories/peatys-whip-off/peatys-whip-off-23.jpg"
   alt2="Sen Johnson holding his bike at the side of the trail, back to the camera in a green helmet, two spectators talking and laughing beside him"
   src3="/assets/images/stories/peatys-whip-off/peatys-whip-off-25.jpg"
   alt3="Dan Graham, NAMBA's assistant operations manager, in a straw hat and crew t-shirt, in profile with the forest behind"
   dims="2400x1600,2400x1600,1600x2400"
   widths="800,1600"
   caption="Harry from the trail crew, Sen at the side of the trail, and Dan." %}

<div class="story-block story-cta">
  <a class="btn btn-primary" href="/join/">Become a member</a>
  <p class="story-smallprint">The trails and days like this one are paid for by members, sponsors
  and donations. Riding Twin Peaks is free and we want to keep it that way.</p>
</div>
