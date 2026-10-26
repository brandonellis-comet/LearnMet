# METAR Quick Reference

Verify against the current Transport Canada / NAV CANADA / MANOBS documentation before relying on this. Study aid only.

## Order of groups

`TYPE STATION DDHHMMZ WIND VIS [RVR] WX CLOUD TEMP/DEW ALTIMETER REMARKS`

Example: `METAR CYHZ 261200Z 27015G25KT 15SM -RA BKN020 OVC060 08/06 A2985 RMK SC6AC2 SLP112`

| Group | Reads as |
|-------|----------|
| `CYHZ` | Station (ICAO) |
| `261200Z` | Day 26, 1200 UTC |
| `27015G25KT` | Wind from 270 deg true, 15 kt, gusting 25 kt |
| `15SM` | Visibility 15 statute miles (Canada reports in SM) |
| `-RA` | Light rain |
| `BKN020` | Broken cloud at 2,000 ft AGL |
| `OVC060` | Overcast at 6,000 ft AGL |
| `08/06` | Temp 8 C, dew point 6 C |
| `A2985` | Altimeter setting 29.85 inHg |

## Cloud cover

| Code | Meaning | Oktas |
|------|---------|-------|
| SKC / CLR | Clear | 0 |
| FEW | Few | 1-2 |
| SCT | Scattered | 3-4 |
| BKN | Broken | 5-7 |
| OVC | Overcast | 8 |

## Weather intensity and descriptors

- Intensity: `-` light, none moderate, `+` heavy
- Descriptors: `TS` thunderstorm, `SH` showers, `FZ` freezing, `BL` blowing, `DR` drifting
- Phenomena: `RA` rain, `SN` snow, `DZ` drizzle, `FG` fog, `BR` mist, `HZ` haze, `GR` hail, `PL` ice pellets, `UP` unknown precip

## To add as you study

- [ ] Remarks section codes
- [ ] Variable wind (`dddVddd`) and `VRB`
- [ ] Flight category criteria (VFR / MVFR / IFR / LIFR)
- [ ] TAF groups: `FM`, `BECMG`, `TEMPO`, `PROB`
