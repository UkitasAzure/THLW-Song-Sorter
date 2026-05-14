// 2008/7/3 Scripted by K-Factory@migiwa
// 2009/1/27 Modified by K-Factory@migiwa
// 2014/6/29 Modified by nkeronkow
// 2018/11/26 Added to relick's github, changes tracked there
// github.com/relick/touhou-song-sorter

// *****************************************************************************
"use strict";
const str_CenterT = 'Tie!';
const str_CenterB = 'Undo last choice';

const str_ImgPath = 'images/';
const str_YouPath = 'https://www.youtube.com/embed/';
const str_YouLink = 'https://www.youtube.com/watch?v=';

// Up to which position should images be shown for?
var int_ResultRank = 3;

// Maximum number of result rows before being broken off into another table.
var maxRows = 42;

// Letty waz here
const deepFreeze = obj => {
	Object.keys(obj).forEach(prop => {
		if (typeof obj[prop] === 'object') deepFreeze(obj[prop]);
	}); return Object.freeze(obj);
};

// * Game and album titles
// name: used in the selection table before starting a sort
// image: 180x180px CD artwork
// shortName: used during the sort
// abbrev: abbreviated form (used in the final result table)
const TITLE = deepFreeze({
	L1: { name: "L1 Characters", image: "XHi6YmD.jpg", shortName: "L1", abbrev: "L1", },
	RETRO: { name: "Retro Festival", image: "XHi6YmD.jpg", shortName: "Retro Festival", abbrev: "Retro", },
	UFES: { name: "Ultra Festival", image: "Imp5ltX.jpg", shortName: "Ultra Festival", abbrev: "UFes", },
	MV: { name: "Relics and Music Videos", image: "9Bgvih5.jpg", shortName: "Relic/MV", abbrev: "Relic/MV", },
	GENIC: { name: "Genic Characters", image: "9Bgvih5.jpg", shortName: "Genic", abbrev: "Genic", },
	EXFES: { name: "EX Festival", image: "8YV2A7P.jpg", shortName: "EX Festial", abbrev: "EXFes", },
	EPIC: { name: "Epic", image: "eyprldJ.jpg", shortName: "Epic", abbrev: "Epic", },
	PFES: { name: "Pure Festival", image: "60c5lGk.jpg", shortName: "Pure Festival", abbrev: "PFes", },
	MM: { name: "Mastermind", image: "LohRYHX.jpg", shortName: "Mastermind", abbrev: "MM", },
	BP: { name: "Aya Pass", image: "n1inkfk.jpg", shortName: "Aya Pass", abbrev: "BP", },
	UY: { name: "Ultra Yukkuri", image: "aZAL5nF.jpg", shortName: "Ultra Yukkuri", abbrev: "UY", },
	STORY: { name: "Story Theme", image: "X0DDCGf.jpg", shortName: "Story Theme", abbrev: "Story", },
	STAGE: { name: "Stage Theme", image: "c3yK3I6.jpg", shortName: "Stage Theme", abbrev: "Stage", },
	OTHERS: { name: "Others", image: "9mxFAor.jpg", shortName: "Others", abbrev: "Others", },

});

const getTitleData = function (songTitleDataObj) {
	// We'll have to handle individual song overrides either way (mostly going to be coming from old saved data)

	const titleData = TITLE[songTitleDataObj.title];

	if (!songTitleDataObj.extra) {
		return {
			name: titleData.name,
			image: songTitleDataObj.image || titleData.image,
			shortName: songTitleDataObj.shortName || titleData.shortName,
			abbrev: songTitleDataObj.abbrev || titleData.abbrev,
		};
	}

	// Also handle extra overrides
	const extraTitleData = EXTRA_TITLES[songTitleDataObj.extra];
	return {
		name: titleData.name,
		image: songTitleDataObj.image || extraTitleData.image || titleData.image,
		shortName: songTitleDataObj.shortName || extraTitleData.shortName || titleData.shortName,
		abbrev: songTitleDataObj.abbrev || extraTitleData.abbrev || titleData.abbrev,
	};
}

const CATEGORY = deepFreeze({
	L1: { name: "L1 Universe", titles: ["L1"], height: "240px", },
	Multiverses: { name: "Other Multiverses", titles: ["RETRO", "UFES", "MV", "GENIC", "EXFES", "EPIC", "MV", "PFES", "MM", "BP", "UY"], height: "120px", },
	Others: { name: "Others", titles: ["STORY", "STAGE", "OTHERS"], height: "120px", },
});

// * Music information
// [Index: Meaning]
// 0: Track name
const TRACK_NAME = 0;
// 1: Set of titles that this track appears in
const TRACK_TITLES = 1;
// 2: Object specifying the title to draw data from, and any overrides
const TRACK_TITLE_DATA = 2;
// 3: Youtube video ID
const TRACK_YOUTUBE_ID = 3;
// 4: Description of track
const TRACK_DESCRIPTION = 4;
// 5: If the *exact* same track appears in a later game then it should use [1] to specify rather than setting as arrangement.
const TRACK_IS_ARRANGEMENT = 5;
	const ORIGINAL_TRACK = 0;
	const ARRANGED_TRACK = 1;
// 6: Track type, Album tracks should all be marked as OTHER_THEME.
const TRACK_TYPE = 6;
	const STAGE_THEME = 0;
	const BOSS_THEME = 1;
	const STAGE_AND_BOSS_THEME = 2;
	const OTHER_THEME = 3;

// Old song data format, for transitioning old save data
// 2: Image filename
const LEGACY_TRACK_IMAGE = 2;
// 4: Title (game/album) name
const LEGACY_TRACK_TITLE_NAME = 4;
// 5: Title (game/album) abbreviation
const LEGACY_TRACK_TITLE_ABBREV = 5;

var ary_SongData = [
	//L1 EoSD
	["Fantasy Telegnosis (Hachimitsu-Lemon) - Reimu",									new Set([TITLE.L1]), { title: "L1", }, "2YMWIDdTleA", "L1 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Love-Colored Master Spark (Tokyo Active NEETs) - Marisa",							new Set([TITLE.L1]), { title: "L1", }, "HcqPZr_prUE", "L1 Marisa", ORIGINAL_TRACK, BOSS_THEME],
	["Bouquet to the Ashen Duomo (Tokyo Active NEETs) - Rumia",							new Set([TITLE.L1]), { title: "L1", }, "akhUOgt-73o", "L1 Rumia", ORIGINAL_TRACK, BOSS_THEME],
	["Lunate Elf (Kokyo Active NEETs) - Daiyousei",		   								new Set([TITLE.L1]), { title: "L1", }, "QcfRX1rQRUM", "L1 Daiyousei", ORIGINAL_TRACK, BOSS_THEME],
	["Kohan Natsukaze Tai (Tokyo Active NEETs) - Cirno",								new Set([TITLE.L1]), { title: "L1", }, "7ZNvLwWzatk", "L1 Cirno", ORIGINAL_TRACK, BOSS_THEME],
	["Sunset of Meiji 17 (Zyukucho (COOL&CREATE)) - Meiling",							new Set([TITLE.L1]), { title: "L1", }, "Z6nyZQeMCF8", "L1 Meiling", ORIGINAL_TRACK, BOSS_THEME],
	["StepIllumination [Garage Refix by Musicarus] (flap+frog) - Koakuma",				new Set([TITLE.L1]), { title: "L1", }, "mtL4iFh_UG8", "L1 Koakuma", ORIGINAL_TRACK, BOSS_THEME],
	["Extratrack [Musicarus Jackin' Remix] (flap+frog) - Patchouli",					new Set([TITLE.L1]), { title: "L1", }, "PzbmmORoBPQ", "L1 Patchouli", ORIGINAL_TRACK, BOSS_THEME],
	["Night of Nights (BeatMario (COOL&CREATE)) - Sakuya",								new Set([TITLE.L1]), { title: "L1", }, "VHj4LRjxHj0", "L1 Sakuya", ORIGINAL_TRACK, BOSS_THEME],
	["Heavenly Red (Hachimitsu-Lemon) - Remilia",										new Set([TITLE.L1]), { title: "L1", }, "Q8C3NrW7Qno", "L1 Remilia", ORIGINAL_TRACK, BOSS_THEME],
	["Saishuu Kichiki Imouto Flandre-S (BeatMario (COOL&CREATE)) - Flandre",			new Set([TITLE.L1]), { title: "L1", }, "JKBVhEMlTW8", "L1 Flandre", ORIGINAL_TRACK, BOSS_THEME],

	//L1 PCB
	["WHITE WIREPULLER (BeatMario (COOL&CREATE) - Letty",								new Set([TITLE.L1]), { title: "L1", }, "PX9nLxTyKSs", "L1 Letty", ORIGINAL_TRACK, BOSS_THEME],
	["The Troublesome Black Cat's Travelogue (ShibayanRecords, O-LIFE JAPAN) - Chen",	new Set([TITLE.L1]), { title: "L1", }, "ZdO5p9LaVn0", "L1 Chen", ORIGINAL_TRACK, BOSS_THEME],
	["Iris (Foxtail-Grass Studio) - Alice",												new Set([TITLE.L1]), { title: "L1", }, "tzDdQaT8xQE", "L1 Alice", ORIGINAL_TRACK, BOSS_THEME],
	["Path by the Murmuring Stream (Foxtail-Grass Studio) - Lily White",		   		new Set([TITLE.L1]), { title: "L1", }, "Fp3AgbW6C7w", "L1 Lily White", ORIGINAL_TRACK, BOSS_THEME],
	["Ghostly Band ~ Phantom Ensemble (Kokyo Active NEETs) - Prismriver Sister",		new Set([TITLE.L1]), { title: "L1", }, "pzjW24W_o_E", "L1 Lunasa, L1 Merlin, L1 Lyrica", ORIGINAL_TRACK, BOSS_THEME],
	["Unpaid Gardener (O-LIFE JAPAN) - Youmu",											new Set([TITLE.L1]), { title: "L1", }, "aW6-FgwqMi0", "L1 Youmu", ORIGINAL_TRACK, BOSS_THEME],
	["BORDER OF STRIKE (BeatMario (COOL&CREATE)) - Yuyuko",								new Set([TITLE.L1]), { title: "L1", }, "pdxGMoyETgY", "L1 Yuyuko", ORIGINAL_TRACK, BOSS_THEME],
	["Indigo Dance (Melodic Taste) - Ran",												new Set([TITLE.L1]), { title: "L1", }, "pdxGMoyETgY", "L1 Ran", ORIGINAL_TRACK, BOSS_THEME],
	["Danmaku Breakdown (BeatMario (COOL&CREATE)) - Yukari",							new Set([TITLE.L1]), { title: "L1", }, "glCWsdU0okc", "L1 Yukari", ORIGINAL_TRACK, BOSS_THEME],

	//IAMP
	["After The Festival (Hachimitsu-Lemon) - Suika",									new Set([TITLE.L1]), { title: "L1", }, "sW9hdMUdGgw", "L1 Suika", ORIGINAL_TRACK, BOSS_THEME],

	//L1 IN
	["Running Through The Firefly Wind (Foxtail-Grass Studio) - Wriggle",				new Set([TITLE.L1]), { title: "L1", }, "K7H1g1jJxFU", "L1 Wriggle", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Deaf to All but the Song (O-LIFE JAPAN) - Mystia",					new Set([TITLE.L1]), { title: "L1", }, "z2Ekcg-8-jQ", "L1 Mystia", ORIGINAL_TRACK, BOSS_THEME],
	["Crazy Keine (BeatMario (COOL&CREATE)) - Keine",									new Set([TITLE.L1]), { title: "L1", }, "w-2qjqRPgeE", "L1 Keine", ORIGINAL_TRACK, BOSS_THEME],
	["Sunset Circus (Butaotome) - Tewi",		   										new Set([TITLE.L1]), { title: "L1", }, "7urtQ8fSXRs", "L1 Tewi", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Lunatic Eyes (O-LIFE JAPAN) - Reisen",								new Set([TITLE.L1]), { title: "L1", }, "9pvmDp6JGko", "L1 Reisen", ORIGINAL_TRACK, BOSS_THEME],
	["Galaxy in a Pot (Butaotome) - Eirin",												new Set([TITLE.L1]), { title: "L1", }, "MXv8ofCK6AI", "L1 Eirin", ORIGINAL_TRACK, BOSS_THEME],
	["HELP ME ERINNNNNN!! (BeatMario (COOL&CREATE)) - Kaguya",							new Set([TITLE.L1]), { title: "L1", }, "Mj4TwUQfMWQ", "L1 Kaguya", ORIGINAL_TRACK, BOSS_THEME],
	["HAKURO (Sound Refil) - Hakutaku Keine",											new Set([TITLE.L1]), { title: "L1", }, "VA5zeSGJiF4", "L1A Keine", ORIGINAL_TRACK, BOSS_THEME],
	["Monpe Guardian (O-LIFE JAPAN) - Mokou",											new Set([TITLE.L1]), { title: "L1", }, "mQl0nErhmzw", "L1 Mokou", ORIGINAL_TRACK, BOSS_THEME],

	//L1 POFV
	["Life of a Tengu (Tokyo Active NEETs) - Aya",										new Set([TITLE.L1]), { title: "L1", }, "EDlLC4G5Jz4", "L1 Aya", ORIGINAL_TRACK, BOSS_THEME],
	["One More Doll (Butaotome) - Medicine",											new Set([TITLE.L1]), { title: "L1", }, "gyMsrBIpehQ", "L1 Medicine", ORIGINAL_TRACK, BOSS_THEME],
	["Gensokyo, Past and Present (Tokyo Active NEETs) - Yuuka",							new Set([TITLE.L1]), { title: "L1", }, "AN6SjDkfQmM", "L1 Yuuka", ORIGINAL_TRACK, BOSS_THEME],
	["Raging Sanzu River (BeatMario (COOL&CREATE)) - Komachi",		   					new Set([TITLE.L1]), { title: "L1", }, "S_g_0XZty-g", "L1 Komachi", ORIGINAL_TRACK, BOSS_THEME],
	["Judgement Days (BeatMario (COOL&CREATE)) - Eiki",									new Set([TITLE.L1]), { title: "L1", }, "kUcfl16ArKE", "L1 Eiki", ORIGINAL_TRACK, BOSS_THEME],

	//L1 MOF
	["October Harvest Romantica (Butaotome) - Shizuha",									new Set([TITLE.L1]), { title: "L1", }, "T6F8bq8173A", "L1 Shizuha", ORIGINAL_TRACK, BOSS_THEME],
	["Grilled Autumn Flavors (Butaotome) - Minoriko",									new Set([TITLE.L1]), { title: "L1", }, "fT3__o2jSdw", "L1 Minoriko", ORIGINAL_TRACK, BOSS_THEME],
	["Scars of the Gods (Tokyo Active NEETs) - Hina",									new Set([TITLE.L1]), { title: "L1", }, "Rrbd6PXW3s8", "L1 Hina", ORIGINAL_TRACK, BOSS_THEME],
	["Kappa Doki Doki (Zykucho (COOL&CREATE)) - Nitori",		   						new Set([TITLE.L1]), { title: "L1", }, "Pur5yrmrSLU", "L1 Nitori", ORIGINAL_TRACK, BOSS_THEME],
	["A Rather Enjoyable Waterfall Life (O-LIFE JAPAN) - Momiji",						new Set([TITLE.L1]), { title: "L1", }, "PqeVkC0zMeI", "L1 Momiji", ORIGINAL_TRACK, BOSS_THEME],
	["Since Lady Sanae Won't Let Me (Melodic Taste) - Sanae",							new Set([TITLE.L1]), { title: "L1", }, "DPQlBXR1xdI", "L1 Sanae", ORIGINAL_TRACK, BOSS_THEME],
	["The Pillars Only I Shook (Zykucho (COOL&CREATE)) - Kanako",						new Set([TITLE.L1]), { title: "L1", }, "RBDb-wqqUQs", "L1 Kanako", ORIGINAL_TRACK, BOSS_THEME],
	["Last Boss'n (Zykucho (COOL&CREATE)) - Suwako",									new Set([TITLE.L1]), { title: "L1", }, "Wh7ri4p7KA0", "L1 Suwako", ORIGINAL_TRACK, BOSS_THEME],

	//L1 SWR
	["Flame from the Black Sea (IRON ATTACK) - Iku",									new Set([TITLE.L1]), { title: "L1", }, "DJR1OL4EI-o", "L1 Iku", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Catastrophe in Bhava-Agra (O-LIFE JAPAN) - Tenshi",					new Set([TITLE.L1]), { title: "L1", }, "IVTbo5Bs-XQ", "L1 Tenshi", ORIGINAL_TRACK, BOSS_THEME],

	//L1 SA
	["The Illusory Air Hole ~ Loop Place (Tokyo Active NEETs) - Kisume",				new Set([TITLE.L1]), { title: "L1", }, "atxA8fQ6yWs", "L1 Kisume", ORIGINAL_TRACK, BOSS_THEME],
	["Forbidden Yamametal ~ Theme of Yamame (Zykucho (COOL&CREATE)) - Yamame",			new Set([TITLE.L1]), { title: "L1", }, "1FZAt4F0mXk", "L1 Yamame", ORIGINAL_TRACK, BOSS_THEME],
	["Green Limits (IOSYS) - Parsee",													new Set([TITLE.L1]), { title: "L1", }, "hCYxJ2WkqMk", "L1 Parsee", ORIGINAL_TRACK, BOSS_THEME],
	["Sakazuki ~ Theme of Yuugi (Zykucho (COOL&CREATE)) - Yuugi",		   				new Set([TITLE.L1]), { title: "L1", }, "dJ-9_KH5IZk", "L1 Yuugi", ORIGINAL_TRACK, BOSS_THEME],
	["Satori Musou (BeatMario (COOL&CREATE)) - Satori",									new Set([TITLE.L1]), { title: "L1", }, "i5w6cnqnQIw", "L1 Satori", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Corpse Voyage (O-LIFE JAPAN) - Rin",									new Set([TITLE.L1]), { title: "L1", }, "FcR00PHHnak", "L1 Rin", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Solar Sect of Nuclear Wisdom (O-LIFE JAPAN) - Utsuho",				new Set([TITLE.L1]), { title: "L1", }, "Ng5h92MDggU", "L1 Utsuho", ORIGINAL_TRACK, BOSS_THEME],
	["Awakening ~ Theme of Koishi (Zykucho (COOL&CREATE)) - Koishi",					new Set([TITLE.L1]), { title: "L1", }, "Jnjl6XkLJx0", "L1 Koishi", ORIGINAL_TRACK, BOSS_THEME],

	//L1 UFO
	["Metal-esque Nazrin (O-LIFE JAPAN) - Nazrin",										new Set([TITLE.L1]), { title: "L1", }, "Al-dKs7ZF-k", "L1 Nazrin", ORIGINAL_TRACK, BOSS_THEME],
	["Monster Train: Spare Umbrella Express Night Carnival (Butaotome) - Kogasa",		new Set([TITLE.L1]), { title: "L1", }, "I9Ysiqgtgo0", "L1 Kogasa", ORIGINAL_TRACK, BOSS_THEME],
	["Cascara Girl (Tokyo Active NEETs) - Ichirin",										new Set([TITLE.L1]), { title: "L1", }, "2ah4CF5KFig", "L1 Ichirin", ORIGINAL_TRACK, BOSS_THEME],
	["The Leisurely Captain's Job (O-LIFE JAPAN) - Murasa",		   						new Set([TITLE.L1]), { title: "L1", }, "GyjMCrQnFOQ", "L1 Murasa", ORIGINAL_TRACK, BOSS_THEME],
	["The Killing of Bishamonten (Tokyo Active NEETs) - Shou",							new Set([TITLE.L1]), { title: "L1", }, "EBRN0h_LGuM", "L1 Shou", ORIGINAL_TRACK, BOSS_THEME],
	["Akatsuki Skyscraper (Tokyo Active NEETs) - Byakuren",								new Set([TITLE.L1]), { title: "L1", }, "luoHPFKg9mg", "L1 Byakuren", ORIGINAL_TRACK, BOSS_THEME],
	["Grudge:Arrow (IOSYS) - Nue",														new Set([TITLE.L1]), { title: "L1", }, "0gLwyM-YzLk", "L1 Nue", ORIGINAL_TRACK, BOSS_THEME],

	//DS
	["Youkai Mountain (Melodic Taste) - Hatate",										new Set([TITLE.L1]), { title: "L1", }, "Hs2XDlWJCaY", "L1 Hatate", ORIGINAL_TRACK, BOSS_THEME],

	//L1 TD
	["Metal-esque Youkai Girl at the Gate (O-LIFE JAPAN) - Kyouko",						new Set([TITLE.L1]), { title: "L1", }, "yBnnXrzqr0Q", "L1 Kyouko", ORIGINAL_TRACK, BOSS_THEME],
	["Gravestone Carving (Tokyo Active NEETs) - Yoshika",								new Set([TITLE.L1]), { title: "L1", }, "-zUdMJE1Td4", "L1 Yoshika", ORIGINAL_TRACK, BOSS_THEME],
	["Sadistic Yuan Xian (Tokyo Active NEETs) - Seiga",									new Set([TITLE.L1]), { title: "L1", }, "RhcLn0anq10", "L1 Seiga", ORIGINAL_TRACK, BOSS_THEME],
	["Down in the Mausoleum (Tokyo Active NEETs) - Tojiko",		   						new Set([TITLE.L1]), { title: "L1", }, "7WINm5MgQRA", "L1 Tojiko", ORIGINAL_TRACK, BOSS_THEME],
	["Infidel Extermination (O-LIFE JAPAN) - Futo",										new Set([TITLE.L1]), { title: "L1", }, "WW-djztw-Kw", "L1 Futo", ORIGINAL_TRACK, BOSS_THEME],
	["True Administrator (Tokyo Active NEETs) - Miko",									new Set([TITLE.L1]), { title: "L1", }, "QnAM8OlPV8o", "L1 Miko", ORIGINAL_TRACK, BOSS_THEME],
	["Sado Mami Holic (BeatMario (COOL&CREATE)) - Mamizou",								new Set([TITLE.L1]), { title: "L1", }, "HQreevmuZ5Q", "L1 Mamizou", ORIGINAL_TRACK, BOSS_THEME],

	//HM
	["Invisible Passion (O-LIFE JAPAN) - Kokoro",										new Set([TITLE.L1]), { title: "L1", }, "TXHId9tCRY0", "L1 Kokoro", ORIGINAL_TRACK, BOSS_THEME],

	//L1 DDC
	["Metal-esque Mermaid from the Uncharted Land (O-LIFE JAPAN) - Wakasagihime",		new Set([TITLE.L1]), { title: "L1", }, "p0TV2f-V_is", "L1 Wakasagihime", ORIGINAL_TRACK, BOSS_THEME],
	["Dorodoro-Don (O-LIFE JAPAN) - Sekibanki",											new Set([TITLE.L1]), { title: "L1", }, "v_qQfh3ubWU", "L1 Sekibanki", ORIGINAL_TRACK, BOSS_THEME],
	["Enjoying The Full Moon (O-LIFE JAPAN) - Kagerou",									new Set([TITLE.L1]), { title: "L1", }, "dJc4oMK78II", "L1 Kagerou", ORIGINAL_TRACK, BOSS_THEME],
	["A Tangle of Purple and Brown (O-LIFE JAPAN) - Tsukumo Sister",		   			new Set([TITLE.L1]), { title: "L1", }, "MPZK3pwGWhI", "L1 Benben & L1 Yatsuhashi", ORIGINAL_TRACK, BOSS_THEME],
	["Lossy Logic (AramiTama) - Seija",													new Set([TITLE.L1]), { title: "L1", }, "_nBUKRwGRKI", "L1 Seija", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Corpse Voyage (O-LIFE JAPAN) - Rin",									new Set([TITLE.L1]), { title: "L1", }, "FcR00PHHnak", "L1 Rin", ORIGINAL_TRACK, BOSS_THEME],
	["Castle Rave (DiGiTAL WiNG) - Shinmyoumaru",										new Set([TITLE.L1]), { title: "L1", }, "Ng5h92MDggU", "L1 Shinmyoumaru", ORIGINAL_TRACK, BOSS_THEME],
	["Raison D'être (IOSYS) - Raiko",													new Set([TITLE.L1]), { title: "L1", }, "ucFREWg0Rto", "L1 Raiko", ORIGINAL_TRACK, BOSS_THEME],

	//ULIL
	["Physical Magician (O-LIFE JAPAN) - Sumireko",										new Set([TITLE.L1]), { title: "L1", }, "Q3W5uX0GCEA", "L1 Sumireko", ORIGINAL_TRACK, BOSS_THEME],

	//L1 LOLK
	["Metal-esque The Rabbit Has Landed (O-LIFE JAPAN) - Seiran",						new Set([TITLE.L1]), { title: "L1", }, "luMm6bR0aH4", "L1 Seiran", ORIGINAL_TRACK, BOSS_THEME],
	["Nostalgic Steps (O-LIFE JAPAN) - Ringo",											new Set([TITLE.L1]), { title: "L1", }, "JTA0UOuj-nY", "L1 Ringo", ORIGINAL_TRACK, BOSS_THEME],
	["Like a Spring Night's Dream (Melodic Taste) - Doremy",							new Set([TITLE.L1]), { title: "L1", }, "VTPfwGZ73Kc", "L1 Doremy", ORIGINAL_TRACK, BOSS_THEME],
	["Over Ambivalence (Melodic Taste) - Sagume",		   								new Set([TITLE.L1]), { title: "L1", }, "TjfzeNEcLJ0", "L1 Sagume", ORIGINAL_TRACK, BOSS_THEME],
	["Innocent Madness, Smiling Violence (Melodic Taste) - Clownpiece",					new Set([TITLE.L1]), { title: "L1", }, "Bd6Qz8swE8A", "L1 Clownpiece", ORIGINAL_TRACK, BOSS_THEME],
	["Primary Primary (Butaotome) - Junko",												new Set([TITLE.L1]), { title: "L1", }, "CZj-3RpO93A", "L1 Junko", ORIGINAL_TRACK, BOSS_THEME],
	["Trine Intention (Melodic Taste) - Hecatia",										new Set([TITLE.L1]), { title: "L1", }, "WsfXKqruj1A", "L1 Hecatia", ORIGINAL_TRACK, BOSS_THEME],

	//AOCF
	["J&S W3 (flap+frog) - Yorigami Sister",											new Set([TITLE.L1]), { title: "L1", }, "JH0LTBoFIJk", "L1 Joon & Shion", ORIGINAL_TRACK, BOSS_THEME],

	//L1 HSIFS
	["The Fairy Dreams of Midwinter (O-LIFE JAPAN) - Eternity",							new Set([TITLE.L1]), { title: "L1", }, "Yk5EToySs3Q", "L1 Eternity", ORIGINAL_TRACK, BOSS_THEME],
	["Yamanba's Six Attacks (Zykucho (COOL&CREATE)) - Nemuno",							new Set([TITLE.L1]), { title: "L1", }, "t2S6Ox0Ro6Y", "L1 Nemuno", ORIGINAL_TRACK, BOSS_THEME],
	["Red Pair Melody (Zykucho (COOL&CREATE)) - Aunn",									new Set([TITLE.L1]), { title: "L1", }, "f-uQtRgK2rI", "L1 Aunn", ORIGINAL_TRACK, BOSS_THEME],
	["Running Jizo (Zykucho (COOL&CREATE)) - Narumi",		   							new Set([TITLE.L1]), { title: "L1", }, "W56AwYgFETE", "L1 Narumi", ORIGINAL_TRACK, BOSS_THEME],
	["Funky Back Dancers (O-LIFE JAPAN) - Mai & Satono",								new Set([TITLE.L1]), { title: "L1", }, "Uyy55SwrG6k", "L1 Mai & L1 Satono", ORIGINAL_TRACK, BOSS_THEME],
	["A Strong and Dignified Figure (O-LIFE JAPAN) - Okina",							new Set([TITLE.L1]), { title: "L1", }, "sWmgzaVCaG0", "L1 Okina", ORIGINAL_TRACK, BOSS_THEME],

	//L1 WBAWC
	["Nobody Knows Her Mourning (IRON ATTACK) - Eika",									new Set([TITLE.L1]), { title: "L1", }, "Hs_rF-9Oyu0", "L1 Eika", ORIGINAL_TRACK, BOSS_THEME],
	["Baby Drown (IRON ATTACK) - Urumi",												new Set([TITLE.L1]), { title: "L1", }, "xPB2wiOzXtY", "L1 Urumi", ORIGINAL_TRACK, BOSS_THEME],
	["The Angel's Trial (O-LIFE JAPAN) - Kutaka",										new Set([TITLE.L1]), { title: "L1", }, "OUeHjKdvl2w", "L1 Kutaka", ORIGINAL_TRACK, BOSS_THEME],
	["Avant-Garde Leader (O-LIFE JAPAN) - Yachie",		   								new Set([TITLE.L1]), { title: "L1", }, "9YG2pqg2kuc", "L1 Yachie", ORIGINAL_TRACK, BOSS_THEME],
	["Armored Ally of Allegiance (O-LIFE JAPAN) - Mayumi",								new Set([TITLE.L1]), { title: "L1", }, "-VG0lSVCRYw", "L1 Mayumi", ORIGINAL_TRACK, BOSS_THEME],
	["Manifestation of the Impenetrable Realm (O-LIFE JAPAN) - Keiki",					new Set([TITLE.L1]), { title: "L1", }, "Zfx3IT8IaYI", "L1 Keiki", ORIGINAL_TRACK, BOSS_THEME],
	["MUSCLEHEAD (Cajiva's Gadget Shop) - Saki",										new Set([TITLE.L1]), { title: "L1", }, "Ckffp6y-g-w", "L1 Saki", ORIGINAL_TRACK, BOSS_THEME],

	//SFW
	["GREED (AramiTama) - Yuuma",														new Set([TITLE.L1]), { title: "L1", }, "sf9HBTyjOas", "L1 Yuuma", ORIGINAL_TRACK, BOSS_THEME],

	//L1 UM
	["LUCKY CAT [Instrumental] (Chocofan) - Mike",										new Set([TITLE.L1]), { title: "L1", }, "dg7bNKnfMC0", "L1 Mike", ORIGINAL_TRACK, BOSS_THEME],
	["Forbidden Yamametal ~ Theme of Yamame (Zykucho (COOL&CREATE)) - Yamame",			new Set([TITLE.L1]), { title: "L1", }, "1FZAt4F0mXk", "L1 Takane", ORIGINAL_TRACK, BOSS_THEME],
	["Sharp Edge [Instrumental] (DiGiTAL WiNG) - Sannyo",								new Set([TITLE.L1]), { title: "L1", }, "K5_6GorxiJw", "L1 Sannyo", ORIGINAL_TRACK, BOSS_THEME],
	["INKYA and YOKYA RAVE [Instrumental] (DiGiTAL WiNG) - Misumaru",		   			new Set([TITLE.L1]), { title: "L1", }, "EDqzDVNuZxE", "L1 Misumaru", ORIGINAL_TRACK, BOSS_THEME],
	["Stargazing at Underground (AramiTama) - Tsukasa",									new Set([TITLE.L1]), { title: "L1", }, "048IxaB-X8U", "L1 Tsukasa", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Corpse Voyage (O-LIFE JAPAN) - Rin",									new Set([TITLE.L1]), { title: "L1", }, "FcR00PHHnak", "L1 Megumu", ORIGINAL_TRACK, BOSS_THEME],
	["Last Day (Para-Dot) - Chimata",													new Set([TITLE.L1]), { title: "L1", }, "GN_5HF9KmBo", "L1 Chimata", ORIGINAL_TRACK, BOSS_THEME],
	["Get The Truth [Instrumental] (K2E+Cradle) - Momoyo",								new Set([TITLE.L1]), { title: "L1", }, "nPwQ3s8GOts", "L1 Momoyo", ORIGINAL_TRACK, BOSS_THEME],

	//L1 UDOALG
	["Beautiful Sky in Kunlun (k-waves LAB) - Biten",									new Set([TITLE.L1]), { title: "L1", }, "Pz6p_8LJdNU", "L1 Biten", ORIGINAL_TRACK, BOSS_THEME],
	["Servus Plutonis (Cajiva's Gadget Shop) - Enoko",									new Set([TITLE.L1]), { title: "L1", }, "G1yvTG7XV7M", "L1 Enoko", ORIGINAL_TRACK, BOSS_THEME],
	["ChupacabRhythm (AramiTama) - Chiyari",											new Set([TITLE.L1]), { title: "L1", }, "sx1A4zj2BdU", "L1 Chiyari", ORIGINAL_TRACK, BOSS_THEME],
	["The Path to Yomi Where None Turn Back (Mormimori Atsushi & Uma)",		   			new Set([TITLE.L1]), { title: "L1", }, "QmjmsNk_a_Q", "L1 Hisami", ORIGINAL_TRACK, BOSS_THEME],
	["Advance Nothingness (YushiNoki) - Zanmu",											new Set([TITLE.L1]), { title: "L1", }, "NdJ5IaU_JIk", "L1 Zanmu", ORIGINAL_TRACK, BOSS_THEME],

	//L1 FW (PLACEHOLDER)
	//["The Fairy Dreams of Midwinter (O-LIFE JAPAN) - Ubame",						new Set([TITLE.L1]), { title: "L1", }, "Yk5EToySs3Q", "L1 Ubame", ORIGINAL_TRACK, BOSS_THEME],
	//["Yamanba's Six Attacks (Zykucho (COOL&CREATE)) - Chimi",						new Set([TITLE.L1]), { title: "L1", }, "t2S6Ox0Ro6Y", "L1 Chimi", ORIGINAL_TRACK, BOSS_THEME],
	//["Red Pair Melody (Zykucho (COOL&CREATE)) - Nareko",								new Set([TITLE.L1]), { title: "L1", }, "f-uQtRgK2rI", "L1 Nareko", ORIGINAL_TRACK, BOSS_THEME],
	//["Running Jizo (Zykucho (COOL&CREATE)) - Yuiman",		   							new Set([TITLE.L1]), { title: "L1", }, "W56AwYgFETE", "L1 Yuiman", ORIGINAL_TRACK, BOSS_THEME],
	//["Funky Back Dancers (O-LIFE JAPAN) - Ariya",								new Set([TITLE.L1]), { title: "L1", }, "Uyy55SwrG6k", "L1 Ariya", ORIGINAL_TRACK, BOSS_THEME],
	//["A Strong and Dignified Figure (O-LIFE JAPAN) - Nina",							new Set([TITLE.L1]), { title: "L1", }, "sWmgzaVCaG0", "L1 Nina", ORIGINAL_TRACK, BOSS_THEME],
	
	//Printworks
	["The Night of a White Chirstmas (Butaotome) - Sunny",								new Set([TITLE.L1]), { title: "L1", }, "5GYXv8EelQA", "L1 Sunny", ORIGINAL_TRACK, BOSS_THEME],
	["Narcoleptic Dream (Butaotome) - Luna",											new Set([TITLE.L1]), { title: "L1", }, "_8XlWWO_mvA", "L1 Luna", ORIGINAL_TRACK, BOSS_THEME],
	["Getting Brighter (Butaotome) - Star",												new Set([TITLE.L1]), { title: "L1", }, "sf9vkmm6qUg", "L1 Star", ORIGINAL_TRACK, BOSS_THEME],
	["Winter Lament x Nostalgia (Butaotome) - Akyuu",		   							new Set([TITLE.L1]), { title: "L1", }, "tQ2fE_C8FUo", "L1 Akyuu", ORIGINAL_TRACK, BOSS_THEME],
	["God Slash (O-LIFE JAPAN) - Watatsuki Sister",										new Set([TITLE.L1]), { title: "L1", }, "_aSaKSEmy2w", "L1 Toyohime & L1 Yorihime", ORIGINAL_TRACK, BOSS_THEME],
	["La Belle Au Bois Dormant (flap+frog) - Kasen",									new Set([TITLE.L1]), { title: "L1", }, "BkbRTFCvURg", "L1 Kasen", ORIGINAL_TRACK, BOSS_THEME],
	["Suzurine (AramiTama) - Kosuzu",													new Set([TITLE.L1]), { title: "L1", }, "QEdT_eg06rM", "L1 Kosuzu", ORIGINAL_TRACK, BOSS_THEME],
	["21nHAND (Cajiva's Gadget Shop) - Ibaraki-Douji's Arm",							new Set([TITLE.L1]), { title: "L1", }, "rdB8HrZ2VPk", "L1 Kasen Arm", ORIGINAL_TRACK, BOSS_THEME],
];
