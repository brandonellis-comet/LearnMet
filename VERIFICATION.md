# Verification log

How content is checked: each claim is compared with a public primary source (Canada.ca, NAV CANADA, Transport Canada, NOAA, WMO). Each lesson page shows the sources checked and a list of items not confirmed.

Sources and how they were read:
- Public web pages read with the fetch tool. A fetch summary is treated as unconfirmed until the page text or a screenshot of it has been seen.
- Screenshots supplied by the owner (ECCC alert pages, TC AIM, NAV CANADA guide, MANAIR Ch. 7). Screenshot text is treated as primary text.
- Full PDFs read locally: MANOBS 8th ed. Am. 3 and MANAIR 8th ed. Am. 3 (March 2024).
- Anything not confirmed is listed on the lesson page under "not confirmed" and in the open items below. It is never presented as verified.

Standing rule: accuracy notices stay on every page until the owner says otherwise.

Study aid only. Crown-copyright and NAV CANADA text is paraphrased and linked, not copied. No controlled or intranet material is used.

## Cross-check rule (from 2026-10-27)
Every new claim needs two independent sources or is flagged single-source. New claims are compared with the lesson text and the sources already logged. Conflicts are recorded below, and the more authoritative source wins (Canadian government over US government over university or media).

## Status (as of 2026-10-27; 895 questions)

| Domain | Topics | Questions | Status | Last checked |
|--------|--------|-----------|--------|--------------|
| Observations (obs) | 5 | 91 | Surface observing checked against MANOBS. Radar and satellite re-checked against ECCC, NOAA, NWS and the NAV CANADA guide | 2026-10-27 |
| Codes (codes) | 10 | 264 | METAR, TAF, SYNOP (MANOBS Part B), GFA/SIGMET/AIRMET/FB, MANAIR Ch. 7 and 8, NAV CANADA product tables, ECCC analysis page. Station model from NOAA only | 2026-10-27 |
| Severe weather (severe) | 6 | 141 | Turbulence, wind shear, ECCC alerts and Impact Guides checked against AIM, MANAIR and ECCC pages. Others first pass | 2026-10-27 |
| Moisture (moisture) | 6 | 109 | Icing topic checked against AIM, MANAIR and AIR (incl. carburettor icing). Others first pass | 2026-10-27 |
| Applied (applied) | 5 | 59 | Aviation minima, flight categories and marine topics updated; others first pass | 2026-10-27 |
| Foundations (foundations) | 5 | 58 | Partly hardened 2026-10-27: layers (UCAR, SKYbrary), SALR (Haby), pressure-level heights (Navy table). Rest first pass | 2026-10-27 |
| Wind (wind) | 6 | 68 | Partly hardened 2026-10-27: jet streak quadrants (4 sources), gradient wind (2), boundary layer depth (AMS), Ferrel/ITCZ, anabatic. Rest first pass | 2026-10-26 |
| Air masses (airmass) | 4 | 47 | First pass. Frontal slopes and shear role in frontogenesis corrected | 2026-10-26 |
| Synoptic (synoptic) | 5 | 58 | First pass. Post-tropical, derecho, cyclone life span and long-wave wording corrected | 2026-10-26 |

## Corrections made on 2026-10-26

| Where | Was | Now | Source |
|-------|-----|-----|--------|
| Radar lesson | "Canada's radars are mostly C-band, about 5 cm" | C-band radars being replaced by dual-pol S-band; wavelength removed (not stated) | ECCC, About Canadian weather radar |
| Radar lesson | No mention of display units | Added: ECCC maps use mm/h (rain) and cm/h (snow); dBZ ranges marked as rule of thumb | ECCC radar page |
| Visibility | "Greatest distance a prominent object can be seen" | Greater of black-object distance by day and 1,000 candela lights at night; eye level 1.5 m; lower value reported; 15 SM maximum | MANOBS 4.1.1, 4.2, 4.5.1 |
| Wind | Height only | Two-minute mean, true north, 10 m over level terrain | MANOBS 3.2.1, 3.2.2 |
| Cloud heights | "Above ground" | From the official aerodrome level at airports | MANOBS 7.3.1 |
| METAR note | "Tower and ATIS winds are magnetic" | Removed (not confirmed in a Canadian source); METAR winds true | MANOBS 3.2.1 |
| Radiosonde | Ascent rate 5 m/s; burst 30 to 35 km; 90 min to 2 h | Rate removed (not in source); over 115,000 ft (about 35 km); more than two hours | NOAA JetStream |
| Radiosonde quiz | Upper-air winds "degrees true and knots, WMO practice" | Replaced with GPS tracking question | NOAA JetStream |
| Satellite | "Canada mainly covered by GOES-East"; polar 800 to 850 km | Claim removed; about 850 km, 105 min per orbit | NAV CANADA guide |
| TAF area and validity | "About 5 NM of aerodrome reference point"; "typically 24 or 30 hours" | Within 5 NM of the centre of the runway complex; four times daily; up to 30 hours | AIM MET 1.3.3, 3.1 |
| TAF TEMPO | "Less than half the period" | No more than half; does not change wind | NAV CANADA guide |
| TAF BECMG | "Gradual change over the period" | Permanent change over one to four hours | NAV CANADA guide |
| TAF PROB | "Probability of 30 or 40%" | Probability the condition occurs during the period, not duration; does not change wind | NAV CANADA guide |
| TAF amendments | "See course documents" | Amend for significant ceiling or visibility change; also wind, weather, freezing precipitation | AIM MET 3.1 |
| TAF midnight | Not covered | 24 for end at midnight (2912/2924), 00 for start | NAV CANADA guide |
| Altimeter | "Transition altitude" | Standard pressure region and altimeter setting region | CARs s. 602.37 |
| Models | "Run by the Canadian Meteorological Centre"; "a few km" | ECCC; GDPS 15 km, 10 days, 2 runs/day; HRDPS 2.5 km, 48 h, up to 4 runs/day | ECCC data catalogue |
| Surface chart | "Usually every 4 hPa" | 4 hPa from 1000 hPa; four analyses a day | NAV CANADA guide |
| Upper-air charts | Metres only | Added feet (5,000, 10,000, 18,000, 34,000 ft) and 00/12 UTC | NAV CANADA guide |
| Drills | Midnight validity coded as 00 at end | Coded 24; issue time set 20 minutes before validity | NAV CANADA guide, AIM |
| Tornadoes | EF0 105-137 km/h ... EF5 over 322 (US-style) | ECCC: EF0 90-130, EF1 135-175, EF2 180-220, EF3 225-265, EF4 270-310, EF5 315+ | ECCC, Enhanced Fujita scale for wind damage |
| Wind chill | "-28 and colder, 10 to 30 min" only | Full ECCC table: 10-30, 5-10, 2-5, under 2 minutes; faster in wind over 50 km/h | ECCC, Wind Chill Index |
| Warning criteria | Hail 2 cm, gusts 90 km/h, rain 50 mm/h, wind 65/90 km/h, blizzard numbers | Lesson and questions rewritten: ECCC replaced the criteria with Impact Guides; colours from the Alert Colour Matrix | ECCC criteria notice (2025-11-26), Impact Guides, How we choose alert colours |
| Blizzard | 40 km/h, 400 m, 4 h stated as fact | Marked unconfirmed; question now asks which Impact Guide covers blizzards (Visibility) | ECCC Impact Guides |
| Thunderstorm | Cumulus stage 10-15 min; single cell 30-60 min | Cumulus duration removed; single cell 30-45 min; squall line, pulse storm added | NOAA, Types of Thunderstorms |
| Microburst | 5-15 min, over 150 km/h | Removed; NOAA pulse-storm downbursts usually under 70 mph | NOAA, Types of Thunderstorms |
| Wind shear | LLWS = lowest 2,000 ft; "within 1,500 ft" in a quiz answer | AIM sets no height limit for wind shear; question rewritten | TC AIM MET 2.3 |
| Turbulence | CAT "upper levels"; mountain wave needs 25 kt | CAT above 15,000 ft ASL, not in cumuliform cloud (AIM); 25 kt removed | TC AIM MET 2.2.2 |
| Tropopause | Poles 8-10 km, mid-lat 11, tropics 16-18; lower in winter | NOAA: about 6 km poles, 9 km at 50 deg, 18-20 km equator; ISA uses 11 km; winter claim removed | NOAA JetStream, Layers of the atmosphere; ISO 2533 |
| Composition | 78 / 21 / 0.9 / 0.04 / 0-4% | 78.08 / 20.95 / 0.93 / 0.042 / up to about 4% | NOAA JetStream |
| Mesosphere | "Coldest part of the atmosphere" | Removed (not confirmed) | NOAA JetStream |
| Ozone layer | "Roughly 15 to 35 km" | Range removed (not confirmed) | NOAA JetStream |
| Pressure levels | 850 = 1,500 m; 500 = 5,500 m; 250 = 10,400 m | 1,460; 5,570; 10,360 m (computed from ISA equations) | ISO 2533 equations |
| Pressure vs height | 1 hPa per 8 m (about 30 ft) | About 8.3 m (about 27 ft), from hydrostatic equation and ISA density | Computed |
| Thickness | 540 dam rain/snow line as a bare rule | Kept with caveats: other sources use about 522 dam; deep layer is a weak snow indicator | NOAA NWS Houston (Haby) |
| SALR | "Typically 4 to 7 C per km; smaller in warm air" | About 5 typical, range 3.6 to 9.2 (ICAO via article); direction not confirmed | Lapse rate article citing ICAO |
| Chinook | Named only | Added belt location and humidity | Canadian Encyclopedia |
| Thermal wind | Backing = warm advection; veering = cold advection; "winds back ahead of a warm front" | Reversed: backing = cold advection, veering = warm advection (NH). Two quiz answers and the lesson note fixed | Albany ATM 317, Thermal Wind |
| Friction | 10-20 deg over water, 25-45 over land; speed fractions 1/3-1/2 and 2/3 | About 30 deg over land, less over water, 45+ in mountains; fractions removed | Penn State METEO 3 |
| Jet stream | "WMO definition 60 kt"; a few km deep; subtropical jet near 200 hPa, stable | FAA AC 00-6A: 50 kt (called arbitrary); 1,000-3,000 mi long, about 100-400 mi wide; subtropical about 13 km at 30 deg; WMO figure unconfirmed | FAA AC 00-6A, LibreTexts |
| CAT and jets | "Cold-air side and shear zones" | Cold (polar) side in an upper trough, with reason; new question | FAA AC 00-6A |
| Sea breeze | Starts late morning, peaks mid-afternoon, 10-20 km inland, triggers thunderstorms | Removed; front brings shift, temperature drop, moisture, cloud | NWS training notes |
| Katabatic / mountain breeze | Treated as the same | Separated; katabatic stronger, can exceed 100 kt | NWS training notes |
| Chinook | Named only | Up to 20 C rise in 1 hour; compression plus latent heat | NWS training notes |
| Nova Scotia sea breeze note | Stated as fact | Removed (no source) | |
| Cloud levels | High above 18,000-20,000 ft; Ns under low | WMO temperate: high 5-13 km (16,500-45,000 ft), middle 2-7 km, low to 2 km; Ns noted as middle (WMO) or low (NAV CANADA guide) | WMO Cloud Atlas; NAV CANADA guide |
| Rime ice | Stratiform, about -10 to -20 C | Below about -10 C and/or low liquid water | WMO, Aviation hazards: icing |
| Clear ice | 0 to -10 C | Above about -10 C and/or high liquid water | WMO, Aviation hazards: icing |
| Icing intensity | Not covered | Light, moderate, severe wording and SIGMET rule added; severe question rewritten | NAV CANADA guide |
| Supercooled water | "Common 0 to -20 C" | Claim removed; persists as low as -40 C | NWS cloud and precipitation notes |
| Droplet size | 0.01 mm | 0.02 mm; raindrop 2 mm; 20 micron threshold; hail over 5 mm | NWS cloud and precipitation notes |
| Ice pellets | "Raindrops refreeze" | Snow partly melts aloft, refreezes below | NWS Goodland |
| Fog winds | Radiation 2-7 kt, "strong wind lifts it"; 15 kt quiz figure | 2-7 kt thickens, stronger breeze prevents; advection 3-9 kt; upslope over 10-12 kt gives stratus; 15 kt removed | NWS Houston/Galveston fog guide |
| Fog spread | 2 C or less | Under 5 F (about 3 C); sea fog unlikely above 3 C | NWS Houston/Galveston fog guide |
| Ice fog | Not covered | -29 C and colder | NWS Houston/Galveston fog guide |
| Visibility term (fog lesson) | Prominent object definition | Matches MANOBS wording from Observations | MANOBS |
| Air mass size | "1,000 km or more" | Several hundred to a couple of thousand miles; uniform horizontally, not vertically | Penn State METEO 3 |
| cP / cA / mP / mT / cT sources | cP "northern Canada and Siberia"; Sahara; Maritimes weather | cP: Canada most common; cA added (Siberia, northern Canada); cT: SW US and northern Mexico; Maritimes claims removed | Penn State METEO 3 |
| Cold front slope | 1:50 to 1:100 | About 1:100 (warm 1:200); speeds up to 50 km/h and about 20 km/h added | Oklahoma Mesonet; Yu ESS 5; U of Alberta |
| Cold front passage | Pressure rises "sharply" | Pressure rises (sharply not confirmed) | Oklahoma Mesonet; U of Alberta |
| Front speed quiz | Speed equals wind component | Replaced with sourced speeds | U of Alberta; Yu ESS 5 |
| Frontogenesis | "Horizontal wind shear" as a driver; axis of dilatation "close to the front" | Shear only rotates isotherms; 45 degree rule; tilting and diabatic heating | NWS Louisville, Frontogenesis |
| Cold front weather band | 50 to 100 km | Marked unconfirmed | |
| Front symbols | Stated in quiz | Cold blue triangles, warm red semicircles, occluded purple confirmed for US charts (NWS WPC). The Canadian GFA has no occluded symbol (see 2026-10-27) | NWS WPC |
| Cyclone life span | "A few days" | Several days to a little more than a week; 500 hPa steering, about 16 kt summer and 27 kt winter | Univ. of Hawaii, Chapter 13 |
| Cyclone dissipation | "Becomes cold-cored" | Warm air cut off; cold air on both sides of the occlusion | Univ. of Hawaii, Chapter 13 |
| Bomb cyclone | 24 hPa at 60 N | Formula 24 x sin(lat)/sin 60 added; cold-season maritime event near warm currents | Sanders and Gyakum 1980 (via Wikipedia) |
| Long waves | "3 to 6 around the hemisphere" | Span 60-120 deg of longitude (so 3 to 6); speed 10 kt or less | NWS Houston/Galveston |
| Surface lows and jet | "Beneath the jet axis" | Strengthen near and just downstream of the long-wave trough axis | NWS Houston/Galveston |
| Derecho | "Hundreds of km" | 2025 definition: swath 400 km, gusts 93 km/h; April to August | Derecho article citing NOAA/ECCC |
| Mesoscale note | Atlantic Canada snowfall rate claim | Removed (no source) | |
| Tropical cyclone ingredients | SST warm to 50 m; peak mid-September | Deep warm layer; peak claim removed | UNC Asheville ATMS 103 |
| Post-tropical | Loses tropical structure, fronts, cold core | ECCC: used to be tropical; term adopted 1998; structure explanation marked unconfirmed; ECCC examples added | ECCC post-tropical page |
| Canadian Hurricane Centre | "Part of ECCC" | Meteorological Service of Canada, Atlantic Storm Prediction Centre, since 1987 | ECCC |
| Flight categories | IFR 500 to below 1,000 ft and/or 1 to below 3 SM | IFR: ceiling below 1,000 ft AGL or visibility below 3 SM; LIFR is a US category | NAV CANADA guide |
| VFR minima | "3 SM in most Class E below 10,000 ft" (US wording) | CARs 602.114 and 602.115 minima added; quiz uses CAR 602.114 | Canadian Aviation Regulations |
| Density altitude | Basic effects | Added METAR remark rule (200 ft or more) and takeoff roll example | NAV CANADA guide |
| Alternates | Vague | BECMG and TEMPO must meet alternate minima, PROB landing minima | NAV CANADA guide |
| Marine warnings | Thresholds only | Excluding gusts; hurricane force warning does not mean a hurricane expected; Beaufort sourced | ECCC marine warning program; NWS |
| Humidex | Named only | ECCC ranges added | ECCC |
| Tropical risk season | Peak mid-September; late August to October | August and September most storms; exposure facts and Fiona damage | ECCC hurricane FAQ |
| Freezing rain (Atlantic) | "One of the highest frequencies in Canada" | Eastern Canada incl. Atlantic provinces, St. Lawrence valley hotspot | ClimateData.ca |
| Fiona (synoptic) | News headlines | ECCC: eastern Nova Scotia, over $800 million insured damage | ECCC hurricane FAQ |

## Corrections and additions made on 2026-10-27

| Where | Was | Now | Source |
|-------|-----|-----|--------|
| Troposphere share of mass | About 80% (derived) | About 75% | SKYbrary, WCIA Weather 101 (two sources; WCIA is a TV station) |
| Boundary layer depth | Lowest 1 to 2 km; quiz answer "1 to 2 km" | No fixed depth: tens of metres (stable) to several km (convective); quiz rewritten | AMS Glossary (single source) |
| Jet stream definition | FAA 50 kt; WMO 60 kt unconfirmed | Unchanged. AMS also marks a jet at 50 kt on charts. WMO 60 kt still not confirmed | FAA AC 00-6A, AMS Glossary |
| Jet streak quadrants | Right entrance and left exit divergent (one source) | Confirmed by four sources; convergence in left entrance and right exit added | NWS Louisville, MetEd, EUMeTrain, Univ. at Albany |
| Surface wind turning | About 30 degrees over land (Penn State) | Kept. Albany range 20 to 40 land, 10 to 20 water added; consistent | Penn State, Univ. at Albany |
| Saturated lapse rate | Direction with temperature unconfirmed | About 4 to 5 C/km in very warm humid air, near dry rate in cold air | Haby (single source; AMS gives only the formula) |
| Valley breeze label | Valley breeze called anabatic | Anabatic applies to upslope flow on heated slopes | AMS Glossary |
| TAF lesson | BECMG "1 to 4 h"; TEMPO and PROB do not carry wind | BECMG normally 2 h or less, never over 4 h; TEMPO and PROB may carry wind; issue, update and amendment thresholds rewritten | MANAIR Ch. 2 |
| GFA, SIGMET, AIRMET, FB | No topic | New topic: GFA issue times and domains, SIGMET (WS 4 h, WV and WC 6 h), AIRMET (4 h, to FL240, only if not in GFA), FB code rules | MANAIR Ch. 3 to 6 |
| Front symbols (surface/GFA) | "Occluded usually purple" | Removed. GFA has no occluded symbol. Colours confirmed: cold blue triangles, warm red semicircles, stationary alternating | MANAIR Appendix C.2 |
| GFA symbols | Not covered | Added legend (L/H, movement, tropical cyclone, organized cloud, obstruction to vision, troughs) | MANAIR Appendix C |
| Station model | Pressure tendency "lower right" | Centre right (lower right is past weather). Layout confirmed from a US source only | NOAA JetStream, Surface Weather Plots |
| Isobar labels | "Often last two digits" | Traditionally last two digits (examples 24, 08, 92); US source | NOAA JetStream |
| Sig Wx charts | NAV CANADA guide only | MANAIR Ch. 7 content added: CAN SIG WX issue and valid times, NAT SIG WX, content rules, CB/TCU/ACC imply turbulence and icing, >50% chance wording, XX base, motion above 5 kt. MANAIR gives tops as FL240; guide says FL250 | MANAIR Ch. 7 |
| Guide versus MANAIR | Not noted | Differences recorded: surface wind and gust criteria, layer summation versus LYRS, QS versus STNR, turbulence labels, freezing level colour, Sig Wx tops, FB issue pattern. MANAIR 2024 treated as the standard | NAV CANADA guide; MANAIR |
| MANAIR terms | None | New topic from Chapter 8 definitions (ceiling, FL, AOR, MWO, CMAC, validity terms, organizations) | MANAIR Ch. 8 |
| Turbulence | Lenticular clouds always present in mountain wave | AIM: there may be no lenticular clouds. Added intensity terms, frequency terms, CAT above 15,000 ft, radar cannot detect turbulence, AIR detail | TC AIM MET 2.2.2; AIR 1.5, 2.7 to 2.10 |
| Wind shear | General | MANAIR WS group guidelines and AIM MET 2.3, AIR 2.8 microburst details | MANAIR; TC AIM |
| Icing | Types and temperatures only | MANAIR and AIM intensity, rime/clear/mixed, reporting; AIR in-flight and freezing rain; ground icing and de/anti-icing fluids; carburettor icing | MANAIR; TC AIM MET and AIR 2.3, 2.12 |
| Carburettor icing | "Up to about 20 C" misread | 20 C is the MOGAS difference; chart invalid on MOGAS | TC AIM AIR Figure 2.2 |
| ECCC alerts | Warning criteria in older form | All 14 Impact Guides; Frost moderate only (earlier "three impact levels for each hazard" removed); hurricane definitions (tropical storm 63 to 117 km/h, hurricane 118 km/h or more) | ECCC Impact Guides |
| ECCC alert types and colours | Not covered | Warnings, advisories, watches; yellow circle, orange diamond, red triangle; colour matrix cell by cell; statements are not alerts and not coloured; marine warnings separate | ECCC alert colour pages |
| Polygon and Alert Ready | Not covered | Polygon severe thunderstorm and tornado warnings from 11 to 12 Aug 2026; Alert Ready only for tornado warnings and severe thunderstorm warnings with gusts 130 km/h or more or hail 7 cm or more | ECCC backgrounder; screenshots |
| MetNotes and CAP | Not covered | MetNotes description; CAP Information Sheet 3 (March 2016) forms and sectors; its selected-areas list is from 2016 and its currency is unconfirmed | ECCC pages; CAP |
| Radar dBZ | "20 light, 30 to 40 moderate, 45 to 55 heavy, over 55 hail" | NOAA table: above 65 extremely heavy, 50 to 65 heavy, 40 to 50 moderate, 20 to 40 light; scale -35 to +85; labelled US guidance | NOAA JetStream |
| Anomalous propagation | "Beam bends toward the ground in strong inversions" | Superrefraction and ducting causing false echoes; "inversion" removed | NOAA JetStream, Radar Beams |
| Radar (new) | Basic | ZDR, correlation coefficient, debris signature, beam height examples, ECCC S-band versus C-band table, products and cautions, NAV CANADA guide scales (rain 300 mm/h, snow 40 cm/h, about 150 NM) | ECCC; NOAA; NAV CANADA guide |
| Satellite | "Water vapour about 6 to 7 micrometres" | 6.2, 6.9 and 7.3 micrometres; orbit figures (35,786 km; about 833 km NOAA, 850 km guide); visible, IR and water vapour interpretation from NWS | NOAA/NESDIS; NWS; NAV CANADA guide |
| Surface analysis | Not covered | ECCC page: four analyses a day, Preliminary and Complete versions; Surface Analysis (Preliminary, Canadian coverage), Upper Air Analysis, Snow Depth, Sea Surface Temperature and Sea Ice Cover map products to be decommissioned by end of 2026 (use MSC AniMet) | ECCC analysis charts page |
| Products and observation programs | None | New topic: product issue times and coverage, imagery update intervals, observation programs (METAR, METAR AUTO, LWIS, AUTO, SAWR, WxCam), AWOS and LWIS capabilities and lightning rules, MISG remarks | NAV CANADA guide |
| Synoptic code | No topic | New topic from MANOBS Part B chapters 14 and 15: schedule, section structure, Section 0 and 1 groups, present and past weather rules, Section 3 and Section 5 groups, coding examples | MANOBS 8th ed. Am. 3 |
| MANOBS | Many items | Lessons updated from the full PDF (wind, visibility, RVR, present weather, sky condition, temperature, pressure, remarks, METAR and SPECI coding) | MANOBS 8th ed. Am. 3 |

Guide edition: the NAV CANADA guide shows no edition date, but its satellite page has an example image dated 2026-05-15, so it has been updated since then. Older entries labelled "(2017)" are not supported and should be relabelled once the edition is confirmed.

## Not confirmed (open items)

Open
- ECCC selected-areas hazard sheets (CAP Information Sheet 3, 2016 list): currency unconfirmed. ECCC has been asked; awaiting a reply.
- Regional alert practice, and whether Alert Ready thresholds define warning criteria.
- Station model layout, last-two-digit isobar labels, and temperature units on Canadian charts: confirmed from US NOAA sources only. A Canadian source has not been found.
- Occluded front colours on charts other than the GFA; national analysis symbols versus GFA symbols.
- MANOBS: QFE and the MSLP reduction method; how ATIS and tower broadcasts fall under the magnetic-wind voice exception (12.2.1). MANOBS Part B now has a lesson (SYNOP); see the SYNOP open items below.
- WBF process (moisture, Precipitation processes): checked against AMS Glossary and College of DuPage (public, via fetch summaries). Reported by a sergeant as essential for the Met Tech QL3 course; course material not used. Peak near -12 C is from AMS only. No Canadian publication yet.
- MANOBS 11.2.3.1 (Amendment 3) source gap: the markers on the 400, 200 and 100 ft ceiling SPECI values have no footnote text; they link to the service-provider additional-limits bullet. The precision-approach note is linked only from the 3/4 and 1/4 SM visibility values. Lesson reworded to say so. Resolution needs ECCC or NAV CANADA.
- SYNOP (MANOBS Part B): WMO No. 306 not consulted; MANOBS calls the code FM 12-XIV Ext. in Ch. 14 to 15 but FM 12-XI in 1.3.1; Table 15-8 note says dd = 99 cannot be used while 15.3.4.2 limits it to speeds of 5 kt or less; the full ww list, CL, CM and CH tables and the example sequences are not taught; intermediate synoptic hours not checked.
- MANAIR: WMO header and FIR letter rules; WS SIGMET coordinate formats; Sig Wx symbol shapes described only in images; volcanic ash and radioactive release symbols; Upper-Level Sig Wx (FL250 to FL600) comes from the NAV CANADA guide only.
- NAV CANADA guide: edition date; the AWOS enhancement Y marks (read from a screenshot); the Upper Level Wind and Turbulence Forecast chart rows list valid times inconsistently; AWOS lightning distances (6, 10, 30 SM) not compared with MANOBS; radar 10-minute interval versus ECCC 6 minutes (likely older network).
- Turbulence: rotor cloud, Richardson number 0.25, mechanical and convective definitions, "extreme" turbulence undefined, mountain wave stable-layer wording.
- Carburettor icing: exact zone boundaries on Figure 2.2 were read visually. Rime and clear split at -10 C (WMO) versus AIM wording.
- Radar: Doppler radial velocity and the rotation signature, bright band, attenuation (standard practice, no fetched source). Canadian radar wavelength (not stated by ECCC).
- Satellite: Canadian source for visible, IR and water vapour interpretation; greyscale convention; comma cloud and anvil statements; which GOES satellites cover western Canada.
- Not yet checked against a Canadian source: military and briefing topics (no public source expected), climatology of the Atlantic region against ECCC normals.

Carried from the first pass (2026-10-26), not yet revisited
- Severe: supercell and mesocyclone definition, microburst size and approach sequence, blizzard numbers, nocturnal low-level jet details.
- Foundations: troposphere mass now 75% (SKYbrary; was 80% derived). Layers, ozone, ionosphere, mesopause, SALR direction and 300 hPa height now have public sources (UCAR, Haby, Navy table). Still open: pressure-tendency rule, Canadian chart label for 300 hPa, ICAO documents (only secondary articles read), physics topics 1, 2 and 4 are textbook-standard.
- Wind: Coriolis parameter, gradient wind, boundary layer depth, diurnal wind cycle, Ferrel cell, WMO jet definition, jet entrance and exit divergence.
- Moisture: mixing ratio conservation and wet-bulb ordering, CCN types, lifting mechanisms, cloud appearance descriptions, warm-front cloud sequence, Nova Scotia fog climatology.
- Air masses: k/w modification and stability, warm front passage changes, warm occlusion, ana and kata fronts, frontal inversion, baroclinic definition, Gulf Stream frontogenesis zone. No Canadian publication on air mass types was found.
- Synoptic: vorticity definitions and conservation, PVA link to upper divergence, MCS and MCC size criteria, polar lows, lake-effect snow, 5 degree Coriolis limit, warm core, right-front quadrant, Saffir-Simpson categories, why post-tropical transition happens, Fiona details.
- Applied: pressure altitude, crosswind trigonometry source, alternate-required rules (CAR 602.121 onward), freezing spray criteria, Strong Wind warning threshold, WBGT, military impact tables, briefing SOP format.
- CAPE and CIN, CSI formula, lifted index definitions, mandatory pressure level list.

Next accuracy step: a second pass with working Met Techs and the remaining Canadian manuals. All domains other than those marked above were a first pass using many US and university sources.
