import { HistoricalQuake } from '../types/seismic';

export const HISTORICAL_QUAKES: HistoricalQuake[] = [
  {
    id: 'bhuj-2001',
    name: '2001 Bhuj (Kutch) Earthquake',
    year: 2001,
    date: 'January 26, 2001',
    location: 'Kutch District, Bhuj, Gujarat',
    country: 'India',
    magnitude: 7.7,
    depthKm: 16,
    fatalities: '20,085',
    damageUsd: '$5.5 Billion (Over ₹20,000 Crore)',
    ruptureLengthKm: 120,
    faultMechanism: 'Intraplate Blind Thrust (South Wagad Fault / Kutch Mainland Fault)',
    summary: 'Struck on India’s 52nd Republic Day. An intraplate blind thrust fault ruptured in the Kachchh rift basin. Over 300,000 homes were leveled in Bhuj, Anjar, Bhachau, and Gandhidham; multi-story residential apartment towers collapsed 300 km away in Ahmedabad due to open-stilt ground floor column failure.',
    lessonsLearned: [
      'Catalyzed the complete revision of Indian seismic building codes (IS 1893:2002 & IS 13920).',
      'Led to the establishment of the Gujarat State Disaster Management Authority (GSDMA), which won the UN Sasakawa Award.',
      'Demonstrated the fatal vulnerability of soft-story parking basements and floating columns in Indian urban high-rises.',
      'Spurred widespread seismic retrofitting of schools, hospitals, and civil infrastructure throughout western India.'
    ],
    tsunamiGenerated: false,
    coordinates: [23.419, 70.232]
  },
  {
    id: 'latur-1993',
    name: '1993 Latur (Killari) Earthquake',
    year: 1993,
    date: 'September 30, 1993',
    location: 'Killari, Latur & Osmanabad Districts, Marathwada',
    country: 'India',
    magnitude: 6.2,
    depthKm: 10,
    fatalities: '9,748',
    damageUsd: '$350 Million',
    ruptureLengthKm: 25,
    faultMechanism: 'Intraplate Stable Continental Region (Kurduwadi Fault / Deccan Basalt)',
    summary: 'Struck during early morning Ganesh Visarjan celebrations in a supposedly stable continental region (SCR) of the Indian peninsular shield. Heavy unreinforced stone-and-mud roofs collapsed on sleeping families, causing near-total mortality in 52 villages despite a moderate magnitude of 6.2.',
    lessonsLearned: [
      'Completely shattered the myth that the stable peninsular Indian shield is free from deadly earthquakes.',
      'Prompted the upgrading of Maharashtra and southern peninsular zones in the official BIS Seismic Hazard Map.',
      'Demonstrated that traditional stone masonry with mud mortar requires horizontal concrete bands (lintel & roof bands) for seismic survival.'
    ],
    tsunamiGenerated: false,
    coordinates: [18.06, 76.56]
  },
  {
    id: 'assam-1950',
    name: '1950 Great Assam-Tibet Earthquake',
    year: 1950,
    date: 'August 15, 1950',
    location: 'Assam & Arunachal Pradesh border',
    country: 'India & Tibet',
    magnitude: 8.6,
    depthKm: 15,
    fatalities: '4,800+',
    damageUsd: '$25 Million (1950 USD, billions today)',
    ruptureLengthKm: 300,
    faultMechanism: 'Continental Suture Collision (Main Himalayan Thrust / Mishmi Thrust)',
    summary: 'The 6th largest earthquake of the 20th century. The massive rupture altered river courses; the Subansiri River dammed by rockfalls burst 8 days later, submerging entire valleys. Millions of logs and debris choked the Brahmaputra River, and extensive landslides destroyed tea gardens across Upper Assam.',
    lessonsLearned: [
      'Showcased how large-magnitude earthquakes in the Himalayas trigger massive secondary river blockages, outburst floods, and landscape restructuring.',
      'Proved that the northeastern Himalayan syntaxial bend experiences extreme tectonic strain accumulation (~45 mm/year).'
    ],
    tsunamiGenerated: false,
    coordinates: [28.5, 96.5]
  },
  {
    id: 'shillong-1897',
    name: '1897 Great Shillong Plateau Earthquake',
    year: 1897,
    date: 'June 12, 1897',
    location: 'Shillong Plateau, Meghalaya & Assam',
    country: 'India',
    magnitude: 8.1,
    depthKm: 32,
    fatalities: '1,542+',
    damageUsd: 'Colonial devastation across 390,000 km²',
    ruptureLengthKm: 110,
    faultMechanism: 'Blind Pop-up Thrust (Oldham Fault / Dauki Fault Splay)',
    summary: 'A monumental milestone in earth sciences. Richard Dixon Oldham examined this earthquake and published the first definitive identification of primary P-waves, secondary S-waves, and surface waves on seismograms. Accelerations exceeded 1.0g; massive boulders were thrown into the air, and stone structures across Shillong and Guwahati were completely leveled.',
    lessonsLearned: [
      'Founded modern observational seismology through R.D. Oldham’s discovery of seismic wave phases.',
      'Led to the widespread adoption of traditional Assam-type lightweight timber (Ikra) architecture, which has saved thousands of lives in subsequent tremors.'
    ],
    tsunamiGenerated: false,
    coordinates: [26.0, 91.8]
  },
  {
    id: 'kangra-1905',
    name: '1905 Kangra Valley Earthquake',
    year: 1905,
    date: 'April 4, 1905',
    location: 'Kangra, Dharamshala, Kullu, Himachal Pradesh',
    country: 'India',
    magnitude: 7.8,
    depthKm: 25,
    fatalities: '20,000+',
    damageUsd: 'Extensive provincial destruction',
    ruptureLengthKm: 280,
    faultMechanism: 'Himalayan Frontal Thrust / Main Boundary Thrust',
    summary: 'Devastated the Kangra, Dharamshala, and Kullu valleys of Himachal Pradesh. Over 100,000 buildings were flattened, including the ancient Kangra Fort. Shaking was felt across Lahore, Amritsar, Delhi, and Shimla.',
    lessonsLearned: [
      'Identified the central Himalayan seismic gap as an area of severe accumulated tectonic stress.',
      'Showed the extreme vulnerability of unreinforced stone rubble masonry on steep mountain slopes.'
    ],
    tsunamiGenerated: false,
    coordinates: [32.25, 76.25]
  },
  {
    id: 'bihar-1934',
    name: '1934 Great Bihar–Nepal Earthquake',
    year: 1934,
    date: 'January 15, 1934',
    location: 'Northern Bihar (Munger, Muzaffarpur, Patna) & Nepal',
    country: 'India & Nepal',
    magnitude: 8.0,
    depthKm: 15,
    fatalities: '10,700+',
    damageUsd: 'Massive agricultural & city destruction',
    ruptureLengthKm: 130,
    faultMechanism: 'Continental Thrust (Main Himalayan Thrust / HFT)',
    summary: 'One of the most destructive natural disasters in northern Indian history. Massive soil liquefaction erupted across the Indo-Gangetic plain, with sand geysers and mud craters sinking buildings in Munger and Muzaffarpur. Patna and Kathmandu sustained widespread structural devastation.',
    lessonsLearned: [
      'First comprehensive scientific documentation of soil liquefaction and slumping in the deep Gangetic alluvium.',
      'Spurred Mahatma Gandhi and Rajendra Prasad to coordinate extensive citizen disaster relief campaigns.'
    ],
    tsunamiGenerated: false,
    coordinates: [26.5, 86.5]
  },
  {
    id: 'kashmir-2005',
    name: '2005 Kashmir Earthquake',
    year: 2005,
    date: 'October 8, 2005',
    location: 'Muzaffarabad / Uri, Tangdhar, Baramulla, J&K',
    country: 'India & Pakistan border',
    magnitude: 7.6,
    depthKm: 26,
    fatalities: '86,000+ (overall); ~1,400 in Jammu & Kashmir',
    damageUsd: '$5.2 Billion',
    ruptureLengthKm: 75,
    faultMechanism: 'Blind Thrust (Balakot-Bagh Fault & Main Boundary Thrust)',
    summary: 'A devastating shallow rupture in the western Himalayan syntaxis. Uri and Tangdhar in Jammu & Kashmir were almost completely destroyed, and thousands of landslides cut off mountain roads for weeks.',
    lessonsLearned: [
      'Led directly to the Government of India passing the Disaster Management Act of 2005 and establishing the National Disaster Management Authority (NDMA) and NDRF battalions.',
      'Proved that traditional Dhajji-Dewari and Taq timber-laced masonry survived shaking far better than non-ductile modern concrete.'
    ],
    tsunamiGenerated: false,
    coordinates: [34.493, 73.629]
  },
  {
    id: 'valdivia-1960',
    name: '1960 Great Chilean Earthquake (Valdivia)',
    year: 1960,
    date: 'May 22, 1960',
    location: 'Valdivia, Biobío & Araucanía Regions',
    country: 'Chile',
    magnitude: 9.5,
    depthKm: 25,
    fatalities: '1,655 to 6,000',
    damageUsd: '$3.5 Billion (2024 equivalent)',
    ruptureLengthKm: 1000,
    faultMechanism: 'Megathrust Subduction (Nazca under South American plate)',
    summary: 'The most powerful earthquake ever recorded in modern instrumented history. The rupture spanned nearly 1,000 kilometers along the southern Chilean coast, triggering trans-oceanic tsunami waves exceeding 25 meters.',
    lessonsLearned: [
      'Pioneered global tsunami warning coordination through UNESCO and NOAA.',
      'Demonstrated that subduction zones can rupture across immense contiguous megathrust segments.',
      'Spurred Chile to formulate mandatory reinforced concrete shear-wall building codes that save thousands of lives today.'
    ],
    tsunamiGenerated: true,
    coordinates: [-38.29, -73.05]
  },
  {
    id: 'sumatra-2004',
    name: '2004 Indian Ocean Earthquake & Boxing Day Tsunami',
    year: 2004,
    date: 'December 26, 2004',
    location: 'Off the west coast of northern Sumatra & Andaman Sea',
    country: 'Indonesia (affected India, Sri Lanka, Thailand, 14 nations)',
    magnitude: 9.1,
    depthKm: 30,
    fatalities: '227,898 (including 12,405 in India)',
    damageUsd: '$15 Billion',
    ruptureLengthKm: 1300,
    faultMechanism: 'Megathrust Subduction (Indo-Australian under Burma microplate)',
    summary: 'One of the deadliest natural disasters in human history. The earthquake caused vertical seabed displacement of several meters across a 1,300 km rupture line, displacing an estimated 30 cubic kilometers of ocean water. In India, tsunami waves struck the Andaman and Nicobar Islands, Tamil Nadu, Kerala, and Andhra Pradesh.',
    lessonsLearned: [
      'Created the Indian Ocean Tsunami Warning and Mitigation System (IOTWMS) with the Indian Tsunami Early Warning Centre at INCOIS Hyderabad.',
      'Highlighted the critical need for coastal mangrove preservation as natural wave energy dampers.'
    ],
    tsunamiGenerated: true,
    coordinates: [3.316, 95.854]
  },
  {
    id: 'tohoku-2011',
    name: '2011 Great East Japan Earthquake & Tsunami',
    year: 2011,
    date: 'March 11, 2011',
    location: 'Off the Pacific coast of Tohoku, Honshu',
    country: 'Japan',
    magnitude: 9.1,
    depthKm: 29,
    fatalities: '19,759',
    damageUsd: '$360 Billion (Costliest natural disaster in history)',
    ruptureLengthKm: 500,
    faultMechanism: 'Megathrust Subduction (Pacific plate under Okhotsk plate)',
    summary: 'The most powerful earthquake recorded in Japan. The seafloor shifted 50 meters horizontally and 7 meters vertically. The resulting tsunami overtopped sea walls up to 10 meters high, devastating coastal cities and triggering the Fukushima Daiichi nuclear accident.',
    lessonsLearned: [
      'Proved that earthquake early warning systems (EEW) via smartphones and automated train braking saved tens of thousands of lives.',
      'Led to unprecedented nuclear safety overhaul and decentralized community tsunami vertical evacuation towers.'
    ],
    tsunamiGenerated: true,
    coordinates: [38.297, 142.372]
  },
  {
    id: 'kahramanmaras-2023',
    name: '2023 Turkey–Syria Earthquake Doublet',
    year: 2023,
    date: 'February 6, 2023',
    location: 'Kahramanmaraş, Gaziantep, Hatay & NW Syria',
    country: 'Turkey & Syria',
    magnitude: 7.8,
    depthKm: 10,
    fatalities: '59,259',
    damageUsd: '$104 Billion',
    ruptureLengthKm: 350,
    faultMechanism: 'Left-lateral Strike-Slip (East Anatolian Fault Zone)',
    summary: 'A rare and violent seismic doublet. A magnitude 7.8 mainshock was followed just nine hours later by an energetic magnitude 7.5 aftershock on an adjacent branch fault. Extreme peak ground acceleration (exceeding 2.0g) caused widespread pancake collapse of multi-story buildings.',
    lessonsLearned: [
      'Showcased the severe vulnerability of soft-story ground-level retail spaces and non-ductile reinforced concrete framing.',
      'Stressed the imperative for uncompromised building code enforcement and mandatory seismic retrofitting.'
    ],
    tsunamiGenerated: false,
    coordinates: [37.174, 37.032]
  }
];
