/** Display-only showcase items for unclaimed BNY profiles.
 *  NOT products: no prices, no transactions — consent gate per PLAN-50-STORES.md.
 *  Derived solely from public directory descriptions (brooklynnavyyard.org). */

export interface ShowcaseItem {
  label: string;     // category-level, e.g. "Smoked fish & caviar"
  note: string;      // short editorial line grounded in the public description
  icon: string;      // emoji
}

export const BNY_SHOWCASE: Record<string, ShowcaseItem[]> = {
  "russ-daughters": [
    { label: "Smoked fish & caviar", note: "The appetizing classics this New York institution has served since 1914.", icon: "🐟" },
    { label: "Bagels & babka", note: "Baked at their Building 77 production bakery and kitchens.", icon: "🥯" },
    { label: "Nationwide shipping", note: "Their Navy Yard outpost doubles as a nationwide shipping hub.", icon: "📦" },
  ],
  "atoms": [
    { label: "Everyday sneakers", note: "Shoes focused on magical comfort and simple design.", icon: "👟" },
    { label: "Quarter sizing", note: "The first shoes to come in 1/4 sizes.", icon: "📏" },
    { label: "Thoughtful design", note: "Vogue called them possibly the most thoughtfully designed sneakers ever.", icon: "✨" },
  ],
  "catbird": [
    { label: "Boutique jewelry", note: "Designed and made locally in Brooklyn by a woman-owned studio.", icon: "💍" },
    { label: "Ethically sourced materials", note: "Conflict-free stones and responsibly sourced metals.", icon: "🌿" },
    { label: "Local manufacturing", note: "Design, manufacturing, and distribution under one Building 77 roof.", icon: "🏭" },
  ],
  "stick-with-me-sweets": [
    { label: "Hand-crafted bonbons", note: "Led by one of the Top Ten Chocolatiers of America.", icon: "🍬" },
    { label: "Chocolate truffles & caramels", note: "Luxurious confections named among America's best chocolate.", icon: "🍫" },
    { label: "Candy bars", note: "Featured in Oprah's Favorite Things, Vogue, and the Michelin Guide.", icon: "🎀" },
  ],
  "kings-county-distillery": [
    { label: "Bourbon", note: "Handmade at NYC's oldest operating whiskey distillery.", icon: "🥃" },
    { label: "Moonshine", note: "A signature spirit they've crafted since 2010.", icon: "🌙" },
    { label: "Other whiskeys", note: "Award winners praised by NYT, GQ, and The New Yorker.", icon: "🏆" },
  ],
  "aurate": [
    { label: "Fine jewelry", note: "A DTC brand focused on durable materials.", icon: "💎" },
    { label: "Transparent pricing", note: "Pricing openness is core to the brand's positioning.", icon: "🔍" },
    { label: "Sustainable practices", note: "Sustainability and tangible giving guide the company.", icon: "🌱" },
  ],
  "ecco-shoes": [
    { label: "Premium footwear", note: "A global brand aiming to lead in premium shoes.", icon: "👞" },
    { label: "Leather goods", note: "Crafted alongside the footwear line.", icon: "👜" },
    { label: "Quality craftsmanship", note: "The foundation of all of ECCO's work.", icon: "🛠️" },
  ],
  "noho-health-solutions": [
    { label: "Science-backed supplements", note: "Designed to help you feel a difference in your routine.", icon: "💊" },
    { label: "Health routine tools", note: "Tools that complement the supplement line.", icon: "🧰" },
    { label: "Yard-based manufacturing", note: "A national DTC brand producing at the Navy Yard.", icon: "🏭" },
  ],
  "brooklyn-roasting-company": [
    { label: "Sustainable coffees", note: "Fair Trade and Rainforest Alliance certified beans.", icon: "☕" },
    { label: "Daily local roasting", note: "Beans roasted locally every day.", icon: "🔥" },
    { label: "Renowned growing regions", note: "Sourced from the world's most renowned farms.", icon: "🌍" },
  ],
  "te-company": [
    { label: "Oolong teas", note: "Sourced directly from tea farmers of Taiwan.", icon: "🍵" },
    { label: "Tea snacks & teaware", note: "Retailed alongside loose-leaf teas and gifts.", icon: "🫖" },
    { label: "West Village tearoom", note: "Open since 2015 and featured in the New York Times.", icon: "🏠" },
  ],
  "lafayette-148-new-york": [
    { label: "Luxury womenswear", note: "A modern American fashion house led by women, for women.", icon: "👗" },
    { label: "Vertical integration", note: "One of the few genuinely vertically integrated fashion houses.", icon: "🧵" },
    { label: "BNY design headquarters", note: "Designing at the Navy Yard since the house's 1996 founding era.", icon: "🏙️" },
  ],
  "poolside": [
    { label: "Vacation fashion", note: "Clothing and accessories built for getaways.", icon: "🏖️" },
    { label: "Artisan collaborations", note: "Made with female artisans around the world.", icon: "🤝" },
    { label: "Global retail presence", note: "Stocked in over 100 stores worldwide.", icon: "🌐" },
  ],
  "crye-precision": [
    { label: "Protective equipment", note: "Combat-proven gear for U.S. Special Operations Forces.", icon: "🛡️" },
    { label: "Made in America", note: "Manufactured with American materials at the Navy Yard.", icon: "🇺🇸" },
    { label: "Military outfitting", note: "Equipment reaching nearly every U.S. service member.", icon: "🎖️" },
  ],
  "simulate": [
    { label: "Plant-based nuggets", note: "Chicken-like nuggets made from plants.", icon: "🌱" },
    { label: "Nutrition technology", note: "A startup applying technology to food.", icon: "🧪" },
    { label: "Alternative protein", note: "Reimagining a comfort-food staple without the chicken.", icon: "🍗" },
  ],
  "b-stuyvesant-champagne": [
    { label: "Champagne", note: "Sourced from France by a Black, woman-owned brand.", icon: "🥂" },
    { label: "Tradition meets innovation", note: "A transformative blend of old and new.", icon: "✨" },
    { label: "Inclusive celebration", note: "Celebrating inclusivity, diversity, and empowerment.", icon: "🎉" },
  ],
  "kitsby": [
    { label: "Baking kits & mixes", note: "Sold online for home bakers.", icon: "🧁" },
    { label: "Asian-inspired desserts", note: "Served at their Williamsburg dessert bar.", icon: "🍡" },
    { label: "Dessert restaurant", note: "A retail dessert bar alongside the kit business.", icon: "🍰" },
  ],
  "sulsung-foods": [
    { label: "Korean groceries", note: "A wide range of Korean food products online.", icon: "🛒" },
    { label: "Quality pantry staples", note: "High-quality goods at accessible prices.", icon: "🍜" },
    { label: "Online storefront", note: "Kim'C Market operates as an online grocery store.", icon: "💻" },
  ],
  "jalapa-jar": [
    { label: "Fresh salsas", note: "All-natural salsas stocked at Whole Foods and tri-state retailers.", icon: "🌶️" },
    { label: "Building 77 taco shop", note: "A taco counter inside the Navy Yard food hall.", icon: "🌮" },
    { label: "Event catering", note: "The team also caters events.", icon: "🎪" },
  ],
  "brooklyn-grange": [
    { label: "Rooftop-grown produce", note: "Over 50,000 lbs of organically cultivated produce per year.", icon: "🥬" },
    { label: "Honey & beekeeping", note: "Home to more than 40 honeybee hives.", icon: "🍯" },
    { label: "Weddings & events", note: "Hosted atop the world's largest rooftop soil farms.", icon: "💒" },
  ],
  "devore-fidelity": [
    { label: "Hand-built speakers", note: "State-of-the-art speakers built by hand in Brooklyn.", icon: "🔊" },
    { label: "Award-winning audio", note: "Renowned worldwide for performance and musicality.", icon: "🏆" },
    { label: "Brooklyn craftsmanship", note: "Every speaker made in the borough.", icon: "🛠️" },
  ],
  "teknikio": [
    { label: "Educational electronics sets", note: "Award-winning kits for hands-on learning.", icon: "🔌" },
    { label: "Buildable toys & gadgets", note: "Sets for building and activating your own creations.", icon: "🤖" },
    { label: "Wearable projects", note: "Electronics kits extend to wearables too.", icon: "⌚" },
  ],
  "turntable-lab-inc": [
    { label: "Vinyl records & CDs", note: "A DJ-focused music store's core stock.", icon: "🎵" },
    { label: "Turntables", note: "Gear for DJs and listeners alike.", icon: "🎧" },
    { label: "Headphones & accessories", note: "Rounding out the DJ toolkit.", icon: "🎚️" },
  ],
  "voltaic-systems": [
    { label: "Small solar panels", note: "Designed and manufactured for remote power.", icon: "☀️" },
    { label: "Battery packs", note: "Power for IoT sensors and personal electronics.", icon: "🔋" },
    { label: "Mounting systems", note: "Hardware to deploy remote power anywhere.", icon: "🔩" },
  ],
  "act-supplies": [
    { label: "Office technology & toner", note: "Part of an online catalog of over 50,000 items.", icon: "🖨️" },
    { label: "Desks & furniture", note: "Home and office furniture shipped across the U.S.", icon: "🪑" },
    { label: "Paper supplies", note: "Everyday workplace essentials, stocked and shipped.", icon: "📄" },
  ],
  "leeway-home": [
    { label: "Table-setting kits", note: "All-in-one kits combining ceramics, glassware, and flatware.", icon: "🍽️" },
    { label: "Ceramics & glassware", note: "Simple, affordable homewares.", icon: "🏺" },
    { label: "Direct-to-consumer homewares", note: "A DTC brand built around kit-based collections.", icon: "📦" },
  ],
  "sin": [
    { label: "Ceramic home goods", note: "Putting the fun into the functional.", icon: "🏺" },
    { label: "Playful design", note: "Pieces made to create warmth and happiness at home.", icon: "😊" },
    { label: "Home decor", note: "A ceramics brand with a worldwide-home mission.", icon: "🏡" },
  ],
  "stitchroom": [
    { label: "Custom pillows & cushions", note: "Made to order, as simple as retail.", icon: "🛋️" },
    { label: "Upholstery & banquettes", note: "Custom headboards, ottomans, and poufs too.", icon: "🪡" },
    { label: "Custom curtains", note: "Soft furnishings tailored to your space.", icon: "🪟" },
  ],
  "haptic-lab": [
    { label: "Sustainable art pieces", note: "Designs connecting people and the planet.", icon: "🎨" },
    { label: "Architect-led design", note: "Founded by architect Emily Fischer in 2009.", icon: "📐" },
    { label: "Certified B Corp", note: "Benefiting positive climate action since 2019 certification.", icon: "🌍" },
  ],
  "f-schumacher-co": [
    { label: "Luxury fabrics", note: "A style leader and design innovator since 1889.", icon: "🧵" },
    { label: "Wallcoverings & trims", note: "Signature offerings of the family-owned house.", icon: "🖼️" },
    { label: "Designer pillows", note: "Finishing pieces in the Schumacher collection.", icon: "🛏️" },
  ],
  "zero-maria-cornejo": [
    { label: "Minimalist luxury fashion", note: "A boutique known for architectural styles.", icon: "👗" },
    { label: "Women's collections", note: "Unusual, sculptural silhouettes for women.", icon: "🧥" },
    { label: "Boutique showcase", note: "Fashion presented in a curated boutique setting.", icon: "🏬" },
  ],
  "kirrin-finch": [
    { label: "Menswear-inspired apparel", note: "Designed to fit a range of women and non-binary folks.", icon: "👔" },
    { label: "Gender-inclusive fashion", note: "A DTC mission breaking down gender boundaries.", icon: "🌈" },
    { label: "Conscientious clothing", note: "A values-led approach to apparel making.", icon: "🌿" },
  ],
  "blackstock-weber": [
    { label: "Fashion & lifestyle goods", note: "A Brooklyn-based brand founded by Chris Echevarria.", icon: "👞" },
    { label: "Brooklyn design", note: "Rooted in the borough's style sensibility.", icon: "🏙️" },
    { label: "Founder-led brand", note: "Shaped by its founder's vision.", icon: "✒️" },
  ],
  "tracey-tanner": [
    { label: "Handmade leather accessories", note: "Made in the USA from the finest Italian leather.", icon: "👝" },
    { label: "Italian leather", note: "Premium material at the heart of every piece.", icon: "🇮🇹" },
    { label: "Brooklyn-made", note: "Crafted locally in Brooklyn.", icon: "🛠️" },
  ],
  "sartorous": [
    { label: "Suspenders & braces", note: "Top-quality accessories from a 12-plus-year specialist.", icon: "🤵" },
    { label: "Men's garters", note: "Part of a full range of classic accessories.", icon: "🎩" },
    { label: "Specialty accessories", note: "Produced and distributed by a dedicated accessory house.", icon: "🧷" },
  ],
  "piccolini-ny": [
    { label: "Kids' apparel & goods", note: "A one-stop hip kid-o shop.", icon: "🧒" },
    { label: "Playful style", note: "Hip, kid-focused finds in one place.", icon: "🎈" },
    { label: "One-stop shopping", note: "Everything for the little ones under one roof.", icon: "🛍️" },
  ],
  "jasco-designs": [
    { label: "Luxury goods", note: "Retail luxury offerings under the Lily Nily brand.", icon: "🎁" },
    { label: "Jewelry", note: "A core part of the retail line.", icon: "💍" },
    { label: "Lily Nily collection", note: "A retail brand with its own dedicated product site.", icon: "🌸" },
  ],
  "luxholdups": [
    { label: "Custom lucite furnishings", note: "Designed and fabricated in Brooklyn.", icon: "🪞" },
    { label: "Architectural hardware", note: "Metal and lucite hardware and shelving.", icon: "🔩" },
    { label: "Custom furniture", note: "Studio pieces sold through an active Etsy storefront.", icon: "🛋️" },
  ],
  "scott-jordan-furniture": [
    { label: "Furniture", note: "A dedicated furniture manufacturer.", icon: "🪑" },
    { label: "Manufactured pieces", note: "Furniture made by the company itself.", icon: "🏭" },
    { label: "Home furnishings", note: "Pieces for living spaces from a maker brand.", icon: "🏡" },
  ],
  "pagani-studio": [
    { label: "Handmade lighting fixtures", note: "Contemporary fixtures from a traditional design atelier.", icon: "💡" },
    { label: "Designer collaborations", note: "Over two decades with prestigious interior designers worldwide.", icon: "🤝" },
    { label: "Large-scale chandeliers", note: "Including a chandelier made for the Obama White House.", icon: "✨" },
  ],
  "lights-up": [
    { label: "Handmade lighting", note: "Wire frames and shades made by hand.", icon: "💡" },
    { label: "Brooklyn manufacturing", note: "Designing and making lighting locally since 1987.", icon: "🏭" },
    { label: "Family-run craft", note: "A family-run, woman-owned business.", icon: "👪" },
  ],
  "ojas": [
    { label: "High-efficiency speakers", note: "Audio gear with a cult following.", icon: "🔊" },
    { label: "Low-powered tube amplifiers", note: "A particular interest of the studio.", icon: "📻" },
    { label: "Natural sound", note: "Equipment aiming for realistic, natural listening.", icon: "🎶" },
  ],
  "fotofoto": [
    { label: "Refurbished disposable cameras", note: "Giving single-use cameras a second life.", icon: "📷" },
    { label: "Camera recycling", note: "Parts responsibly disposed of when necessary.", icon: "♻️" },
    { label: "Circular photography", note: "A sustainability-first take on a consumer camera.", icon: "🌍" },
  ],
  "ares-printing": [
    { label: "Folding cartons", note: "Paperboard packaging designed and manufactured since 1979.", icon: "📦" },
    { label: "Point-of-purchase displays", note: "Serving cosmetics, pharma, electronics, and food industries.", icon: "🖼️" },
    { label: "Sustainable printing", note: "Large sheet-fed presses running on 100% co-generated power.", icon: "🌱" },
  ],
  "packaging-plus-llc": [
    { label: "Catering to-go bags", note: "A wide range for food businesses.", icon: "🥡" },
    { label: "Custom printed shopping bags", note: "Branded bags for retail needs.", icon: "🛍️" },
    { label: "Packaging supplies", note: "Solutions for all your packaging needs.", icon: "📦" },
  ],
  "duggal-visual-solutions": [
    { label: "Visual experiences", note: "An industry leader spanning multiple Yard buildings.", icon: "🖼️" },
    { label: "Stadium-size installations", note: "From global rollouts to headline exhibitions.", icon: "🏟️" },
    { label: "Environment transformations", note: "Producing compelling, world-class events.", icon: "🎭" },
  ],
  "brinks": [
    { label: "Armored transport", note: "Global armored car service and valuables transport.", icon: "🚚" },
    { label: "Money processing", note: "Cash logistics from a global provider.", icon: "💵" },
    { label: "Vaulting services", note: "Secure vaulting and value-added solutions.", icon: "🔒" },
  ],
  "haddads-inc": [
    { label: "Production equipment rentals", note: "Serving 3,400-plus television and film productions.", icon: "🎬" },
    { label: "Worldwide rental fleet", note: "Hubs in New York, New Jersey, Michigan, and Massachusetts.", icon: "🚛" },
    { label: "Film & TV support", note: "A self-described leader in production rentals.", icon: "📺" },
  ],
  "atz-trading-inc": [
    { label: "Fresh & frozen seafood", note: "Direct import and export for restaurants and supermarkets.", icon: "🐟" },
    { label: "Dried foods & produce", note: "Pantry and fresh goods alongside the seafood line.", icon: "🥬" },
    { label: "Next-day tri-state delivery", note: "Plus customized packaging materials for food businesses.", icon: "🚚" },
  ],
  "barronarts": [
    { label: "Stretcher frames", note: "Claimed the finest in the world, shipped worldwide.", icon: "🖼️" },
    { label: "Artist panels & floater frames", note: "Built for discerning artists, galleries, and museums.", icon: "🎨" },
    { label: "Canvas stretching & priming", note: "Full custom services in-house.", icon: "🛠️" },
  ],
  "evan-hughes-studio": [
    { label: "Custom furniture", note: "Designed and built since 1978.", icon: "🪑" },
    { label: "Limited edition pieces", note: "Small-run designs from the studio.", icon: "✨" },
    { label: "Designer-builder craft", note: "Decades of design-and-build experience in one studio.", icon: "🛠️" },
  ],
};

export function showcaseFor(slug: string): ShowcaseItem[] {
  return BNY_SHOWCASE[slug] ?? [];
}
