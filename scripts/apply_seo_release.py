#!/usr/bin/env python3
"""Generate Atlas Arcade's search-focused landing pages and technical SEO files."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://atlas-arcade.pages.dev"
TODAY = "2026-08-12"

PAGES = [
    {
        "slug": "world-map-quiz",
        "title": "Free World Map Quiz: Find Every Country | Atlas Arcade",
        "description": "Play a free interactive world map quiz covering 197 countries. Practice country locations by region, use hints, review mistakes and track progress.",
        "eyebrow": "Interactive map practice",
        "h1": "A world map quiz built for learning, not guessing",
        "intro": "Atlas Arcade turns the world map into a fast, repeatable practice tool. You see a country name, capital or flag and locate the answer directly on the map. Start with ten questions, focus on one region or work toward a complete 197-country run.",
        "sections": [
            ("How the world map quiz works", "Choose Locate, Capitals, Flags, Map to Name, Mixed Mission or Spell All. The map supports mouse, keyboard and touch controls, so the same quiz works on a laptop, tablet or phone. Normal rounds include hints and skips; Competitive runs use the complete country set and apply a time penalty for mistakes."),
            ("Practice the places you actually miss", "A useful map quiz should do more than display a score. Atlas Arcade records which countries you have seen, solved and missed in your browser. Weak-spot practice brings difficult countries back into rotation, while the Study map lets you inspect capitals, neighbors, regions and map shapes at your own pace."),
            ("What is included in the 197-country set?", "The extended set contains the 193 United Nations member states plus Palestine, Vatican City, Kosovo and Taiwan. Small countries and island states use generous locator targets so they remain practical on phones without pretending their geography is larger than it really is."),
        ],
        "faqs": [
            ("Is the world map quiz free?", "Yes. Every game mode works without a subscription or account."),
            ("Can I practice one continent?", "Yes. Choose Africa, the Americas, Asia, Europe or Oceania when starting a round."),
            ("Does it work on a phone?", "Yes. The map supports touch dragging and pinch zoom, and the site can be added to a phone home screen."),
        ],
        "related": ["country-quiz", "capital-quiz", "flag-quiz", "learn-countries"],
    },
    {
        "slug": "country-quiz",
        "title": "Country Quiz: Learn 197 Countries on a Map | Atlas Arcade",
        "description": "Test your country knowledge with a free map-based country quiz. Learn locations, shapes, regions and borders across all 197 countries.",
        "eyebrow": "Country location practice",
        "h1": "Learn country locations by clicking the real map",
        "intro": "Country names are much easier to remember when they are tied to a shape and a place. Atlas Arcade asks you to locate countries on an interactive map, then reinforces the ones that take more than one try.",
        "sections": [
            ("Start small, then expand", "A ten-country round is enough for a quick review. Longer 25-country rounds build endurance, and All mode turns a region or the entire world into a complete challenge. Difficulty controls whether the round emphasizes familiar countries or includes every microstate and island target."),
            ("Learn shapes as well as names", "Map to Name reverses the usual quiz: the game highlights a country and asks you to type its name. That matters because recognition and recall are different skills. Mixed Mission rotates between names, capitals, flags and country shapes so your memory is not tied to one prompt style."),
            ("Use the study map between quizzes", "The Study view gives each country a compact field guide with its capital, region, area, neighbors and geography note. Favorite difficult countries, center the map on them and launch a regional quiz when you are ready to test yourself again."),
        ],
        "faqs": [
            ("How many countries are in the quiz?", "The full extended set includes 197 country records."),
            ("Can beginners use it?", "Yes. Explorer difficulty emphasizes larger and more familiar countries before introducing the hardest small targets."),
            ("Is progress saved?", "Local progress is saved in the browser. Optional accounts can be enabled by the site owner for cross-device syncing."),
        ],
        "related": ["world-map-quiz", "country-spelling-quiz", "europe-map-quiz", "africa-map-quiz"],
    },
    {
        "slug": "capital-quiz",
        "title": "World Capitals Quiz on an Interactive Map | Atlas Arcade",
        "description": "Practice world capitals by locating their countries on an interactive map. Study by continent, review mistakes and build lasting recall.",
        "eyebrow": "Capital city practice",
        "h1": "A world capitals quiz that keeps geography attached",
        "intro": "Instead of choosing from four text answers, Atlas Arcade gives you a capital city and asks you to locate its country. That extra geographic step helps connect the city name to a real part of the world.",
        "sections": [
            ("Why map-based capital practice helps", "A capital is not just a vocabulary word. Locating the country adds region, distance and neighboring places to the memory. After a correct answer, the game reveals the country and supporting facts so each question becomes a short study moment rather than a disposable multiple-choice result."),
            ("Choose the right scope", "Practice Europe before a trip, focus on Africa for a class unit or use the World scope for broad review. Weak-spots mode builds a set from countries that have caused trouble before. You can also favorite countries in the Study map and turn that list into a custom practice set."),
            ("Move from recognition to recall", "Begin with relaxed ten-question rounds, then increase the length. Mixed Mission is useful once capital prompts feel comfortable because it combines capitals with flags, names and reverse map recognition. Competitive mode is optional and best saved for after accuracy is stable."),
        ],
        "faqs": [
            ("Does the quiz include every national capital?", "It covers the capital data associated with the site's extended 197-country set, including explanatory notes where a country has a special capital arrangement."),
            ("Can I study capitals without a timer?", "Yes. Relaxed rounds have no per-question countdown."),
            ("Can I repeat missed countries?", "Yes. Finished rounds surface misses, and the progress screen can launch weak-spot practice."),
        ],
        "related": ["world-map-quiz", "country-quiz", "flag-quiz", "asia-map-quiz"],
    },
    {
        "slug": "flag-quiz",
        "title": "World Flag Quiz: Match Flags to Countries | Atlas Arcade",
        "description": "Play a free world flag quiz and locate each flag's country on the map. Practice by continent, review misses and learn all 197 countries.",
        "eyebrow": "Flag recognition practice",
        "h1": "Recognize the flag, then prove you know where it belongs",
        "intro": "Atlas Arcade's flag mode shows a real bundled flag image and asks you to locate the country on the world map. It tests two useful memories at once: visual recognition and geographic location.",
        "sections": [
            ("More useful than a text-only flag quiz", "Many flags share colors, stripes or symbols. Placing the answer on a map creates extra clues you can remember later: continent, coastline, neighboring countries and relative size. A wrong answer does not end the round; it becomes part of the learning record."),
            ("Practice similar flags by region", "Regional rounds reduce overload and make patterns easier to notice. Study European tricolors together, compare Central American flags or work through the island states of Oceania. When regional accuracy improves, switch to World or Mixed Mission to remove the contextual hint."),
            ("Keep the difficult ones in rotation", "Progress is stored locally and broken down by country. Weak-spot practice favors places that have accumulated misses. The Study map also lets you favorite countries manually, which is handy for look-alike flags you want to revisit."),
        ],
        "faqs": [
            ("Are the flags emojis?", "No. The site uses locally bundled flag artwork for consistent rendering across devices."),
            ("Can I play only African or European flags?", "Yes. Select a continent before starting Flag mode."),
            ("Is there a timed flag challenge?", "Yes, Competitive mode is optional and keeps a separate best time for Flag mode."),
        ],
        "related": ["world-map-quiz", "capital-quiz", "country-quiz", "oceania-map-quiz"],
    },
    {
        "slug": "country-spelling-quiz",
        "title": "Spell All Countries Quiz: Name 197 Countries | Atlas Arcade",
        "description": "Try to name and spell all 197 countries in any order. See live progress, map coverage and remaining countries in a free spelling challenge.",
        "eyebrow": "Complete recall challenge",
        "h1": "Can you name and spell all 197 countries?",
        "intro": "Spell All removes the prompts. Type any country you can remember, in any order, while the map fills in and the remaining count falls. It is a demanding but honest test of complete world-country recall.",
        "sections": [
            ("A different kind of geography quiz", "Prompted quizzes test recognition. Spell All asks you to generate the answer yourself, which exposes different gaps. You may recognize Kyrgyzstan instantly on a map but struggle to retrieve its name without a cue. The mode accepts common aliases and normalizes punctuation and accents while keeping ambiguous answers safe."),
            ("Use the map as feedback, not the answer", "Correct entries highlight countries and appear in the recent-answer list. The unsolved map regions help you notice broad gaps without naming the missing countries for you. You can pause and return to a normal Locate or Study session when a region needs reinforcement."),
            ("Build up to the complete run", "Start by naming one continent on paper or in shorter regional quizzes. Use Locate and Map to Name to strengthen shapes, then return to Spell All. A complete run is much more achievable when the countries are grouped in memory by region and neighbors rather than memorized as one long list."),
        ],
        "faqs": [
            ("Which country set does Spell All use?", "It uses the same extended 197-country set as Competitive mode."),
            ("Do accents and punctuation matter?", "The answer checker normalizes common accents, punctuation and several widely used aliases."),
            ("Can I leave and come back?", "A running game remains in the current tab, while completed progress is stored in the browser."),
        ],
        "related": ["country-quiz", "world-map-quiz", "learn-countries", "geography-games"],
    },
    {
        "slug": "learn-countries",
        "title": "How to Learn Every Country on the World Map | Atlas Arcade",
        "description": "A practical method for learning all countries: study by region, practice map recall, review weak spots and combine names, capitals and flags.",
        "eyebrow": "Geography study guide",
        "h1": "A practical way to learn every country on the map",
        "intro": "Trying to memorize the whole world at once is frustrating. A better approach is to learn connected groups, test them in several directions and keep difficult countries returning at sensible intervals.",
        "sections": [
            ("1. Learn one region at a time", "Begin with a continent or subregion that has manageable boundaries. Learn the anchor countries first: the largest shapes, peninsulas, islands and places at the edge of a region. Then attach smaller neighbors to those anchors. Atlas Arcade's continent scopes keep early rounds focused."),
            ("2. Alternate recognition and recall", "Locate mode gives you a name and asks for a place. Map to Name gives you a place and asks for the name. Use both. Add Flags and Capitals after the map structure is becoming familiar, then use Mixed Mission so the same country can be reached from several memory cues."),
            ("3. Review errors instead of restarting", "A mistake is useful information. Finish the round, inspect the missed-country list and launch weak-spot practice. The progress screen stores country-level attempts in your browser, so repeated trouble with small islands or closely packed regions becomes visible."),
            ("4. Increase difficulty only after accuracy", "Fast guessing can make a quiz feel exciting without improving recall. Begin relaxed, use hints when they teach you something and aim for clean ten-question rounds. Move to longer sets and Competitive timing after the locations are reliable."),
        ],
        "faqs": [
            ("How long does it take to learn all countries?", "It varies with prior knowledge and practice frequency. Short, repeated sessions are usually easier to sustain than occasional marathon sessions."),
            ("Should I learn capitals at the same time?", "Learn the rough map structure first, then add capitals in the same regional groups so the two memories support each other."),
            ("What should I do with tiny countries?", "Use zoom, locator targets and neighbor-based memory. Treat microstates as attachments to a familiar nearby country or coastline."),
        ],
        "related": ["world-map-quiz", "country-quiz", "country-spelling-quiz", "geography-games"],
    },
    {
        "slug": "geography-games",
        "title": "Free Geography Games for Countries, Capitals and Flags",
        "description": "Explore six free geography games for world countries, capitals, flags, map shapes and spelling. Play casually or track complete-run times.",
        "eyebrow": "Six ways to practice",
        "h1": "Geography games that train more than one kind of memory",
        "intro": "Atlas Arcade combines six related geography games in one map. Each mode changes the direction of recall, so you can move beyond recognizing familiar country names and build a more complete mental map.",
        "sections": [
            ("Locate", "See a country name and click its position. This is the clearest starting point for learning a new region and the fastest way to connect names with map locations."),
            ("Capitals and Flags", "Use a capital city or flag as the prompt, then locate the country. These modes preserve geography instead of turning capitals and flags into isolated trivia."),
            ("Map to Name", "The game highlights a country shape and asks you to type the name. Reverse recall catches countries that look familiar but cannot yet be named without a prompt."),
            ("Mixed Mission and Spell All", "Mixed Mission rotates through prompt types. Spell All removes prompts and asks you to name every country in any order. Both are strong end-stage checks after regional practice."),
        ],
        "faqs": [
            ("Do I need an account?", "No. Guest play and local progress work immediately."),
            ("Are there leaderboards?", "The site supports optional fastest-time boards when its online configuration is enabled. Personal bests can remain local otherwise."),
            ("Can students use it in class?", "Yes. The game is browser-based, has relaxed untimed rounds and supports keyboard, mouse and touch controls."),
        ],
        "related": ["world-map-quiz", "capital-quiz", "flag-quiz", "country-spelling-quiz"],
    },
    {
        "slug": "europe-map-quiz",
        "title": "Europe Map Quiz: Learn European Countries | Atlas Arcade",
        "description": "Practice European countries, capitals and flags on an interactive map. Learn crowded borders, microstates and regional geography with free quizzes.",
        "eyebrow": "Europe geography practice",
        "h1": "Learn the countries of Europe on an interactive map",
        "intro": "Europe combines familiar large countries with dense borders, peninsulas, islands and several microstates. Regional practice makes those crowded areas easier to separate before they are mixed into a world round.",
        "sections": [
            ("Build around geographic anchors", "Start with the Iberian Peninsula, the British Isles, Italy, Scandinavia and the large eastern countries. Then fill in the Benelux countries, the Balkans, the Baltic states and the central European cluster. Zoom is especially useful around the smallest targets."),
            ("Connect capitals to the map", "European capital names often appear in general knowledge quizzes, but attaching them to countries and neighbors makes them easier to retain. Switch from Locate to Capitals once the country shapes are stable, then use Mixed Mission to combine the cues."),
            ("Do not skip the microstates", "Vatican City, San Marino, Monaco, Liechtenstein and Andorra are easy to omit from a mental map. Atlas Arcade uses locator targets with generous hit areas while preserving their actual position. Practice them as neighbors of Italy, France, Spain, Switzerland and Austria."),
        ],
        "faqs": [
            ("Can I quiz only Europe?", "Yes. Select Europe as the map scope before starting any supported mode."),
            ("Does Europe include transcontinental countries?", "The site's bundled geography data assigns each country to a consistent quiz region for practice."),
            ("How do I practice the Balkans?", "Use Europe rounds, zoom into southeastern Europe and save difficult countries as favorites for a smaller custom set."),
        ],
        "related": ["world-map-quiz", "capital-quiz", "asia-map-quiz", "africa-map-quiz"],
    },
    {
        "slug": "africa-map-quiz",
        "title": "Africa Map Quiz: Learn African Countries | Atlas Arcade",
        "description": "Learn all African countries with an interactive map quiz. Practice locations, capitals and flags, then review weak spots by region.",
        "eyebrow": "Africa geography practice",
        "h1": "Learn every African country by shape, neighbor and region",
        "intro": "Africa has 54 widely recognized sovereign states and a map full of useful regional patterns. Learning those patterns is far more effective than memorizing an alphabetical list.",
        "sections": [
            ("Divide the continent into memorable groups", "Begin with North Africa and the Mediterranean coast, then work through West Africa, the Sahel, Central Africa, the Horn, East Africa and southern Africa. Use large anchor countries such as Algeria, the Democratic Republic of the Congo, Sudan, Ethiopia, Tanzania and South Africa to position smaller neighbors."),
            ("Watch the west-coast cluster", "West Africa contains many compact countries with similar sizes and shared borders. Practice that area in repeated short rounds, use Map to Name for reverse recall and pay attention to coast versus inland position. The Gambia, Guinea, Guinea-Bissau and Equatorial Guinea deserve separate repetition because their names are easy to blend."),
            ("Add capitals after locations", "Once country positions are becoming reliable, Capitals mode adds another layer without abandoning the map. Review misses in the progress screen and use the Study map to inspect neighboring countries before the next round."),
        ],
        "faqs": [
            ("How many countries are in Africa?", "The standard classroom count is 54 UN member states; regional datasets may also discuss disputed or dependent territories separately."),
            ("Can I practice African flags?", "Yes. Choose Flag mode with Africa as the scope."),
            ("What is the hardest part of the map?", "Many learners find the compact West African countries and the Great Lakes region require the most repeated map practice."),
        ],
        "related": ["world-map-quiz", "country-quiz", "capital-quiz", "europe-map-quiz"],
    },
    {
        "slug": "asia-map-quiz",
        "title": "Asia Map Quiz: Learn Asian Countries | Atlas Arcade",
        "description": "Practice Asian countries, capitals and flags on an interactive map. Learn Central Asia, Southeast Asia, the Middle East and island states.",
        "eyebrow": "Asia geography practice",
        "h1": "Turn Asia's size into a set of learnable regions",
        "intro": "Asia is the largest continent and includes enormous countries, compact peninsulas, inland republics and long island chains. Regional anchors make the map manageable.",
        "sections": [
            ("Learn the subregions separately", "Practice East Asia, Southeast Asia, South Asia, Central Asia, western Asia and the Caucasus as connected groups. Russia, China, India, Kazakhstan, Iran and Saudi Arabia provide large anchors. Smaller countries become easier when attached to a sea, mountain range, peninsula or large neighbor."),
            ("Give Central Asia its own sessions", "Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan and Uzbekistan are often mixed up because their names and locations are learned together. Repeated Map to Name rounds help separate their shapes, while capital prompts add another distinct cue once locations are stable."),
            ("Use zoom for islands and dense borders", "Southeast Asia and the eastern Mediterranean contain close targets and island geography. Zoom toward the pointer or pinch on a phone, then reset to see how the local cluster fits into the continent. Favorite the countries that continue to blend together."),
        ],
        "faqs": [
            ("Can I study Asia without the rest of the world?", "Yes. Asia is available as a dedicated quiz scope."),
            ("Does the quiz include island countries?", "Yes. The complete set includes Asian island states and uses practical locator targets for small places."),
            ("Which mode should I start with?", "Locate is the most direct starting mode; follow it with Map to Name and then Capitals or Flags."),
        ],
        "related": ["world-map-quiz", "capital-quiz", "europe-map-quiz", "oceania-map-quiz"],
    },
    {
        "slug": "americas-map-quiz",
        "title": "Americas Map Quiz: North, Central and South America",
        "description": "Learn countries across North America, Central America, the Caribbean and South America with interactive location, capital and flag quizzes.",
        "eyebrow": "Americas geography practice",
        "h1": "Learn the countries of the Americas from north to south",
        "intro": "The Americas scope combines huge mainland anchors with a narrow Central American chain and many Caribbean island states. Practice by geographic group so the scale changes do not hide the smaller countries.",
        "sections": [
            ("Use the mainland as a framework", "Canada, the United States, Mexico, Brazil and Argentina create a strong first structure. Add the Andean countries down South America's western edge, then fill in the northern coast, the Guianas and the southern cone."),
            ("Practice Central America as an ordered chain", "Belize, Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica and Panama are easier when learned in north-to-south order and connected to the Caribbean and Pacific coasts. Reverse Map to Name practice confirms that each shape is distinct."),
            ("Treat the Caribbean as its own map", "Island states require zoom and repeated regional review. Learn larger anchors such as Cuba and Hispaniola first, then attach the Bahamas, Jamaica, the Lesser Antilles and the remaining island countries. Flag mode is especially useful once their locations are familiar."),
        ],
        "faqs": [
            ("What does the Americas scope include?", "It includes the countries assigned to North America, Central America, the Caribbean and South America in the site's geography dataset."),
            ("Can I zoom into the Caribbean?", "Yes. The map supports high zoom levels and touch pinch zoom."),
            ("Can I practice capitals in South America?", "Yes. Select Capitals with the Americas scope and use favorites or weak spots for a narrower repeat set."),
        ],
        "related": ["world-map-quiz", "country-quiz", "africa-map-quiz", "oceania-map-quiz"],
    },
    {
        "slug": "oceania-map-quiz",
        "title": "Oceania Map Quiz: Learn Pacific Countries and Islands",
        "description": "Practice Australia, New Zealand and Pacific island countries with an interactive Oceania map quiz for locations, capitals and flags.",
        "eyebrow": "Oceania geography practice",
        "h1": "Learn Oceania without losing the islands in the ocean",
        "intro": "Oceania is geographically spread out, so a normal world map can make its island countries feel disconnected. Focused regional practice preserves their real positions while giving you enough zoom to work accurately.",
        "sections": [
            ("Begin with the large anchors", "Australia, New Zealand and Papua New Guinea establish the region's broad structure. From there, group the Pacific island countries into Melanesia, Micronesia and Polynesia. Relative direction and nearby island chains are more useful than trying to memorize isolated dots."),
            ("Use flags and capitals as extra anchors", "Many Pacific flags contain regional symbols, stars or shared historical patterns. Flag mode helps separate them visually, while Capitals mode gives each country another unique retrieval path. Keep the map visible so those facts remain connected to location."),
            ("Expect to use zoom", "Small island states use locator dots with generous tap areas. Zooming is part of the exercise, not a shortcut. After answering, reset the map occasionally to rebuild the country's position within the whole Pacific rather than only recognizing a close-up cluster."),
        ],
        "faqs": [
            ("Which countries are included in Oceania practice?", "The scope uses the Oceania assignments in the site's extended country dataset, including Pacific island states."),
            ("Does it work on a phone?", "Yes. Pinch to zoom and drag with one finger."),
            ("How should I memorize Pacific islands?", "Group them by subregion, learn a few anchor countries and practice relative positions repeatedly rather than relying on alphabetical lists."),
        ],
        "related": ["world-map-quiz", "flag-quiz", "asia-map-quiz", "americas-map-quiz"],
    },
]

BY_SLUG = {page["slug"]: page for page in PAGES}


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def json_script(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def page_html(page: dict[str, object]) -> str:
    slug = str(page["slug"])
    canonical = f"{BASE_URL}/{slug}/"
    sections = "\n".join(
        f'<section><h2>{html.escape(title)}</h2><p>{html.escape(copy)}</p></section>'
        for title, copy in page["sections"]
    )
    faqs = "\n".join(
        f'<details><summary>{html.escape(question)}</summary><p>{html.escape(answer)}</p></details>'
        for question, answer in page["faqs"]
    )
    related = "\n".join(
        f'<a href="../{related_slug}/"><strong>{html.escape(str(BY_SLUG[related_slug]["h1"]))}</strong><span>{html.escape(str(BY_SLUG[related_slug]["description"]))}</span></a>'
        for related_slug in page["related"]
    )
    structured = [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": page["title"],
            "description": page["description"],
            "url": canonical,
            "isPartOf": {
                "@type": "WebSite",
                "name": "Atlas Arcade",
                "url": f"{BASE_URL}/",
            },
            "about": {
                "@type": "Thing",
                "name": "World geography education",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Atlas Arcade", "item": f"{BASE_URL}/"},
                {"@type": "ListItem", "position": 2, "name": page["h1"], "item": canonical},
            ],
        },
    ]
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(str(page["title"]))}</title>
<meta name="description" content="{html.escape(str(page["description"]), quote=True)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{canonical}">
<link rel="icon" href="../assets/icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../seo-pages.css">
<meta name="theme-color" content="#07101d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Atlas Arcade">
<meta property="og:title" content="{html.escape(str(page["title"]), quote=True)}">
<meta property="og:description" content="{html.escape(str(page["description"]), quote=True)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{BASE_URL}/assets/social-preview.png">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{json_script(structured)}</script>
</head>
<body>
<header class="site-header">
<a class="brand" href="../" aria-label="Atlas Arcade home"><span aria-hidden="true">◎</span><span><strong>Atlas Arcade</strong><small>World map trainer</small></span></a>
<nav aria-label="Primary navigation"><a href="../">Play</a><a href="../geography-games/">Game modes</a><a href="../learn-countries/">Study guide</a></nav>
</header>
<main>
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="../">Atlas Arcade</a><span aria-hidden="true">›</span><span>{html.escape(str(page["eyebrow"]))}</span></nav>
<section class="hero">
<p class="eyebrow">{html.escape(str(page["eyebrow"]))}</p>
<h1>{html.escape(str(page["h1"]))}</h1>
<p class="lede">{html.escape(str(page["intro"]))}</p>
<div class="hero-actions"><a class="primary" href="../">Start a free quiz</a><a class="secondary" href="../geography-games/">Compare all modes</a></div>
<ul class="trust-row" aria-label="Highlights"><li>Free to play</li><li>197 countries</li><li>Phone and desktop</li><li>Local progress</li></ul>
</section>
<article class="article-card">
{sections}
</article>
<section class="play-card"><div><p class="eyebrow">Ready to practice?</p><h2>Open the interactive map</h2><p>Choose a mode, region, difficulty and round length. No account is required.</p></div><a class="primary" href="../">Play Atlas Arcade</a></section>
<section class="faq"><p class="eyebrow">Common questions</p><h2>About this geography practice</h2>{faqs}</section>
<section class="related"><p class="eyebrow">Keep learning</p><h2>Related geography guides</h2><div class="related-grid">{related}</div></section>
</main>
<footer><p>Atlas Arcade is a free browser-based geography game.</p><nav aria-label="Footer navigation"><a href="../world-map-quiz/">World map quiz</a><a href="../country-quiz/">Country quiz</a><a href="../capital-quiz/">Capitals</a><a href="../flag-quiz/">Flags</a></nav></footer>
</body>
</html>
'''


def update_homepage() -> None:
    path = ROOT / "index.html"
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"<title>.*?</title>", "<title>World Map Quiz & Geography Games | Atlas Arcade</title>", text, count=1, flags=re.S)
    text = re.sub(
        r'<meta\s+content="[^"]*"\s+name="description"\s*/?>',
        '<meta content="Play free world map, country, capital, flag and spelling quizzes covering 197 countries. Practice by region, study weak spots and track progress." name="description"/>',
        text,
        count=1,
    )
    replacements = {
        "og:title": "World Map Quiz & Geography Games | Atlas Arcade",
        "og:description": "Play six free geography games covering country locations, capitals, flags, map shapes and all 197 country names.",
        "twitter:title": "World Map Quiz & Geography Games | Atlas Arcade",
        "twitter:description": "Practice countries, capitals, flags and spelling on an interactive world map.",
    }
    for key, value in replacements.items():
        pattern = rf'(<meta\s+content=")[^"]*("\s+(?:property|name)="{re.escape(key)}"\s*/?>)'
        text = re.sub(pattern, rf'\g<1>{value}\g<2>', text, count=1)

    canonical = f'<link href="{BASE_URL}/" rel="canonical"/>'
    if 'rel="canonical"' in text:
        text = re.sub(r'<link[^>]+rel="canonical"[^>]*>', canonical, text, count=1)
    else:
        text = text.replace("</head>", canonical + "\n</head>", 1)

    if 'property="og:url"' not in text:
        text = text.replace("</head>", f'<meta content="{BASE_URL}/" property="og:url"/>\n</head>', 1)
    if 'name="robots"' not in text:
        text = text.replace("</head>", '<meta content="index, follow, max-image-preview:large" name="robots"/>\n</head>', 1)

    structured = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": f"{BASE_URL}/#website",
                "url": f"{BASE_URL}/",
                "name": "Atlas Arcade",
                "description": "Interactive world map quizzes for countries, capitals, flags and spelling.",
                "inLanguage": "en",
            },
            {
                "@type": "SoftwareApplication",
                "@id": f"{BASE_URL}/#app",
                "name": "Atlas Arcade",
                "url": f"{BASE_URL}/",
                "applicationCategory": "GameApplication",
                "operatingSystem": "Any modern web browser",
                "isAccessibleForFree": True,
                "description": "A free interactive geography game with six modes and an extended 197-country set.",
                "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
            },
        ],
    }
    marker = '<script id="atlasStructuredData" type="application/ld+json">'
    block = f'{marker}{json_script(structured)}</script>'
    if marker in text:
        text = re.sub(r'<script id="atlasStructuredData" type="application/ld\+json">.*?</script>', block, text, count=1, flags=re.S)
    else:
        text = text.replace("</head>", block + "\n</head>", 1)

    nav_marker = '<nav aria-label="Geography learning guides" class="setup-seo-links">'
    nav = f'''{nav_marker}
<a href="world-map-quiz/">World map quiz</a>
<a href="country-quiz/">Countries</a>
<a href="capital-quiz/">Capitals</a>
<a href="flag-quiz/">Flags</a>
<a href="learn-countries/">How to learn countries</a>
</nav>'''
    if nav_marker not in text:
        dialog_start = text.find('<dialog aria-labelledby="setupTitle"')
        modal_head = text.find('<div class="modal-head">', dialog_start)
        if dialog_start >= 0 and modal_head >= 0:
            text = text[:modal_head] + nav + "\n" + text[modal_head:]
        else:
            raise RuntimeError("Could not locate the setup dialog for internal guide links")

    write(path, text)


def append_home_styles() -> None:
    path = ROOT / "styles.css"
    text = path.read_text(encoding="utf-8")
    marker = "/* SEO guide links */"
    if marker not in text:
        text += f'''\n\n{marker}
.setup-seo-links {{
  display: flex;
  gap: 7px;
  margin: 14px 0 2px;
  overflow-x: auto;
  padding: 2px 1px 5px;
  scrollbar-width: thin;
}}
.setup-seo-links a {{
  flex: 0 0 auto;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--surface-2);
  color: var(--text-soft);
  padding: 7px 10px;
  font-size: .68rem;
  font-weight: 760;
  text-decoration: none;
}}
.setup-seo-links a:hover,
.setup-seo-links a:focus-visible {{
  border-color: var(--border-strong);
  color: var(--accent);
}}
'''
    write(path, text)


def ensure_js_array_items(text: str, variable: str, items: list[str]) -> str:
    match = re.search(rf"(const {re.escape(variable)} = \[)(.*?)(\n\];)", text, flags=re.S)
    if not match:
        raise RuntimeError(f"Could not locate JavaScript array {variable}")
    body = match.group(2).rstrip()
    for item in items:
        token = f"'{item}'"
        if token not in body:
            if body and not body.endswith(","):
                body += ","
            body += f"\n  {token}"
    return text[:match.start()] + match.group(1) + body + match.group(3) + text[match.end():]


def ensure_python_tuple_items(text: str, variable: str, items: list[str]) -> str:
    match = re.search(rf"({re.escape(variable)}\s*=\s*\()(.*?)(\n\))", text, flags=re.S)
    if not match:
        raise RuntimeError(f"Could not locate Python tuple {variable}")
    body = match.group(2).rstrip()
    for item in items:
        token = f'"{item}"'
        if token not in body and f"'{item}'" not in body:
            if body and not body.endswith(","):
                body += ","
            body += f"\n    {token},"
    return text[:match.start()] + match.group(1) + body + match.group(3) + text[match.end():]


def update_builders() -> None:
    slugs = [str(page["slug"]) for page in PAGES]
    mjs_path = ROOT / "build_public.mjs"
    mjs = mjs_path.read_text(encoding="utf-8")
    mjs = ensure_js_array_items(mjs, "runtimeFiles", ["seo-pages.css", "404.html"])
    mjs = ensure_js_array_items(mjs, "runtimeDirectories", slugs)
    write(mjs_path, mjs)

    py_path = ROOT / "build_public.py"
    py = py_path.read_text(encoding="utf-8")
    py = ensure_python_tuple_items(py, "RUNTIME_FILES", ["seo-pages.css", "404.html"])
    py = ensure_python_tuple_items(py, "RUNTIME_DIRECTORIES", slugs)
    write(py_path, py)


def update_service_worker() -> None:
    path = ROOT / "service-worker.js"
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"const CACHE_NAME = '[^']+';", "const CACHE_NAME = 'atlas-arcade-v2.1.0';", text, count=1)
    shell_items = ["./seo-pages.css"] + [f"./{page['slug']}/index.html" for page in PAGES]
    match = re.search(r"(const APP_SHELL = \[)(.*?)(\n\];)", text, flags=re.S)
    if not match:
        raise RuntimeError("Could not locate service-worker APP_SHELL")
    body = match.group(2).rstrip()
    for item in shell_items:
        token = f"'{item}'"
        if token not in body:
            if body and not body.endswith(","):
                body += ","
            body += f"\n  {token}"
    text = text[:match.start()] + match.group(1) + body + match.group(3) + text[match.end():]
    write(path, text)


def write_shared_css() -> None:
    write(ROOT / "seo-pages.css", '''
:root{color-scheme:dark;--bg:#07101d;--deep:#040a13;--surface:#0d1b2d;--surface2:#162a41;--border:rgba(155,189,224,.2);--text:#f6f9fc;--soft:#c2cfdd;--muted:#8295aa;--accent:#67e8f9;--accent2:#22d3ee;--green:#64e6a4;--shadow:0 24px 70px rgba(0,0,0,.34);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}html{background:var(--deep);scroll-behavior:smooth}body{min-height:100vh;margin:0;background:radial-gradient(circle at 15% 8%,rgba(34,211,238,.1),transparent 34rem),linear-gradient(145deg,var(--deep),var(--bg));color:var(--text);-webkit-font-smoothing:antialiased}a{color:inherit}.site-header{position:sticky;z-index:10;top:0;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:13px clamp(16px,4vw,48px);border-bottom:1px solid var(--border);background:rgba(7,16,29,.86);backdrop-filter:blur(18px)}.brand{display:flex;align-items:center;gap:10px;text-decoration:none}.brand>span:first-child{display:grid;width:40px;height:40px;place-items:center;border:1px solid rgba(103,232,249,.35);border-radius:13px;background:rgba(103,232,249,.1);color:var(--accent);font-size:1.35rem}.brand strong,.brand small{display:block}.brand small{margin-top:1px;color:var(--muted);font-size:.7rem}.site-header nav{display:flex;gap:18px}.site-header nav a,footer a{color:var(--soft);font-size:.8rem;font-weight:750;text-decoration:none}.site-header nav a:hover,footer a:hover{color:var(--accent)}main{width:min(980px,calc(100% - 28px));margin:0 auto;padding:28px 0 70px}.breadcrumb{display:flex;gap:8px;color:var(--muted);font-size:.72rem}.breadcrumb a{color:var(--accent);text-decoration:none}.hero{padding:clamp(46px,8vw,88px) 0 44px}.eyebrow{margin:0 0 12px;color:var(--accent);font-size:.72rem;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.hero h1{max-width:820px;margin:0;font-size:clamp(2.3rem,7vw,5.3rem);line-height:.98;letter-spacing:-.065em}.lede{max-width:760px;margin:22px 0 0;color:var(--soft);font-size:clamp(1rem,2vw,1.18rem);line-height:1.75}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.primary,.secondary{display:inline-flex;min-height:46px;align-items:center;justify-content:center;border-radius:13px;padding:11px 17px;font-weight:850;text-decoration:none}.primary{border:1px solid #8bf2ff;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#03232b;box-shadow:0 12px 28px rgba(34,211,238,.16)}.secondary{border:1px solid var(--border);background:rgba(22,42,65,.7);color:var(--text)}.trust-row{display:flex;flex-wrap:wrap;gap:8px;margin:27px 0 0;padding:0;list-style:none}.trust-row li{border:1px solid var(--border);border-radius:999px;background:rgba(22,42,65,.5);color:var(--muted);padding:7px 10px;font-size:.69rem}.article-card,.faq,.related{border:1px solid var(--border);border-radius:24px;background:linear-gradient(155deg,rgba(13,27,45,.92),rgba(22,42,65,.55));box-shadow:var(--shadow);padding:clamp(22px,5vw,44px)}.article-card{display:grid;gap:34px}.article-card section+section{border-top:1px solid var(--border);padding-top:32px}.article-card h2,.faq h2,.related h2,.play-card h2{margin:0;font-size:clamp(1.35rem,3vw,2rem);letter-spacing:-.035em}.article-card p,.faq p,.play-card p{margin:12px 0 0;color:var(--soft);font-size:.96rem;line-height:1.75}.play-card{display:flex;align-items:center;justify-content:space-between;gap:24px;margin:22px 0;border:1px solid rgba(100,230,164,.3);border-radius:22px;background:rgba(100,230,164,.07);padding:clamp(22px,4vw,34px)}.play-card .eyebrow{color:var(--green)}.faq,.related{margin-top:22px}.faq details{border-top:1px solid var(--border);padding:17px 0}.faq details:first-of-type{margin-top:22px}.faq summary{cursor:pointer;font-weight:800}.faq details p{font-size:.88rem}.related-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:22px}.related-grid a{display:block;border:1px solid var(--border);border-radius:15px;background:rgba(22,42,65,.58);padding:15px;text-decoration:none}.related-grid a:hover{border-color:rgba(103,232,249,.45);transform:translateY(-1px)}.related-grid strong,.related-grid span{display:block}.related-grid strong{font-size:.86rem}.related-grid span{margin-top:5px;color:var(--muted);font-size:.7rem;line-height:1.45}footer{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:24px clamp(16px,4vw,48px);border-top:1px solid var(--border);color:var(--muted);font-size:.72rem}footer nav{display:flex;flex-wrap:wrap;gap:14px}@media(max-width:680px){.site-header nav a:not(:first-child){display:none}.hero{padding-top:42px}.hero h1{font-size:clamp(2.2rem,13vw,4rem)}.play-card,footer{align-items:flex-start;flex-direction:column}.related-grid{grid-template-columns:1fr}.article-card,.faq,.related{border-radius:19px}.primary,.secondary{width:100%}}
'''.strip() + "\n")


def write_404() -> None:
    write(ROOT / "404.html", f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page Not Found | Atlas Arcade</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/seo-pages.css"><link rel="icon" href="/assets/icon.svg"></head><body><main><section class="hero"><p class="eyebrow">404</p><h1>That country is off the map.</h1><p class="lede">The page does not exist, but the world quiz is ready.</p><div class="hero-actions"><a class="primary" href="/">Play Atlas Arcade</a><a class="secondary" href="/world-map-quiz/">World map quiz guide</a></div></section></main></body></html>''')


def write_sitemap_and_robots() -> None:
    entries = [f"{BASE_URL}/"] + [f"{BASE_URL}/{page['slug']}/" for page in PAGES]
    urls = "\n".join(f"  <url><loc>{url}</loc><lastmod>{TODAY}</lastmod></url>" for url in entries)
    sitemap = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}
</urlset>
'''
    write(ROOT / "sitemap.xml", sitemap)
    write(ROOT / "robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {BASE_URL}/sitemap.xml\n")


def validate() -> None:
    ElementTree.parse(ROOT / "sitemap.xml")
    assert len(PAGES) == len(BY_SLUG)
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    assert f'href="{BASE_URL}/" rel="canonical"' in index
    assert "atlasStructuredData" in index
    assert "setup-seo-links" in index
    for page in PAGES:
        target = ROOT / str(page["slug"]) / "index.html"
        content = target.read_text(encoding="utf-8")
        assert f'{BASE_URL}/{page["slug"]}/' in content
        assert "<h1>" in content
        assert 'name="description"' in content


def main() -> None:
    for page in PAGES:
        write(ROOT / str(page["slug"]) / "index.html", page_html(page))
    write_shared_css()
    write_404()
    update_homepage()
    append_home_styles()
    update_builders()
    update_service_worker()
    write_sitemap_and_robots()
    validate()
    print(f"Generated {len(PAGES)} search landing pages and complete technical SEO files.")


if __name__ == "__main__":
    main()
