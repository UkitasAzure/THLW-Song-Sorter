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
	PH: { name: "PH Festival", image: "n1inkfk.jpg", shortName: "PH Festival", abbrev: "PH", },
	EPIC: { name: "Epic", image: "eyprldJ.jpg", shortName: "Epic", abbrev: "Epic", },
	PFES: { name: "Pure Festival", image: "60c5lGk.jpg", shortName: "Pure Festival", abbrev: "PFes", },
	MM: { name: "Mastermind", image: "LohRYHX.jpg", shortName: "Mastermind", abbrev: "MM", },
	BP: { name: "Aya Pass", image: "n1inkfk.jpg", shortName: "Aya Pass", abbrev: "BP", },
	UY: { name: "Ultra Yukkuri", image: "aZAL5nF.jpg", shortName: "Ultra Yukkuri", abbrev: "UY", },
	STORY: { name: "Story Theme", image: "X0DDCGf.jpg", shortName: "Story Theme", abbrev: "Story", },
	STAGE: { name: "Stage Theme", image: "c3yK3I6.jpg", shortName: "Stage Theme", abbrev: "Stage", },
	OTHERS: { name: "Others (Collabs & Misc)", image: "9mxFAor.jpg", shortName: "Others", abbrev: "Others", },

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
	Multiverses: { name: "Other Multiverses", titles: ["RETRO", "UFES", "MV", "GENIC", "EXFES", "EPIC", "PFES", "MM", "BP", "UY"], height: "120px", },
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
	["Kappa Doki Doki (Zyukucho (COOL&CREATE)) - Nitori",		   						new Set([TITLE.L1]), { title: "L1", }, "Pur5yrmrSLU", "L1 Nitori", ORIGINAL_TRACK, BOSS_THEME],
	["A Rather Enjoyable Waterfall Life (O-LIFE JAPAN) - Momiji",						new Set([TITLE.L1]), { title: "L1", }, "PqeVkC0zMeI", "L1 Momiji", ORIGINAL_TRACK, BOSS_THEME],
	["Since Lady Sanae Won't Let Me (Melodic Taste) - Sanae",							new Set([TITLE.L1]), { title: "L1", }, "DPQlBXR1xdI", "L1 Sanae", ORIGINAL_TRACK, BOSS_THEME],
	["The Pillars Only I Shook (Zyukucho (COOL&CREATE)) - Kanako",						new Set([TITLE.L1]), { title: "L1", }, "RBDb-wqqUQs", "L1 Kanako", ORIGINAL_TRACK, BOSS_THEME],
	["Last Boss'n (Zyukucho (COOL&CREATE)) - Suwako",									new Set([TITLE.L1]), { title: "L1", }, "Wh7ri4p7KA0", "L1 Suwako", ORIGINAL_TRACK, BOSS_THEME],

	//L1 SWR
	["Flame from the Black Sea (IRON ATTACK) - Iku",									new Set([TITLE.L1]), { title: "L1", }, "DJR1OL4EI-o", "L1 Iku", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Catastrophe in Bhava-Agra (O-LIFE JAPAN) - Tenshi",					new Set([TITLE.L1]), { title: "L1", }, "IVTbo5Bs-XQ", "L1 Tenshi", ORIGINAL_TRACK, BOSS_THEME],

	//L1 SA
	["The Illusory Air Hole ~ Loop Place (Tokyo Active NEETs) - Kisume",				new Set([TITLE.L1]), { title: "L1", }, "atxA8fQ6yWs", "L1 Kisume", ORIGINAL_TRACK, BOSS_THEME],
	["Forbidden Yamametal ~ Theme of Yamame (Zyukucho (COOL&CREATE)) - Yamame",			new Set([TITLE.L1]), { title: "L1", }, "1FZAt4F0mXk", "L1 Yamame", ORIGINAL_TRACK, BOSS_THEME],
	["Green Limits (IOSYS) - Parsee",													new Set([TITLE.L1]), { title: "L1", }, "hCYxJ2WkqMk", "L1 Parsee", ORIGINAL_TRACK, BOSS_THEME],
	["Sakazuki ~ Theme of Yuugi (Zyukucho (COOL&CREATE)) - Yuugi",		   				new Set([TITLE.L1]), { title: "L1", }, "dJ-9_KH5IZk", "L1 Yuugi", ORIGINAL_TRACK, BOSS_THEME],
	["Satori Musou (BeatMario (COOL&CREATE)) - Satori",									new Set([TITLE.L1]), { title: "L1", }, "i5w6cnqnQIw", "L1 Satori", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Corpse Voyage (O-LIFE JAPAN) - Rin",									new Set([TITLE.L1]), { title: "L1", }, "FcR00PHHnak", "L1 Rin", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Solar Sect of Nuclear Wisdom (O-LIFE JAPAN) - Utsuho",				new Set([TITLE.L1]), { title: "L1", }, "Ng5h92MDggU", "L1 Utsuho", ORIGINAL_TRACK, BOSS_THEME],
	["Awakening ~ Theme of Koishi (Zyukucho (COOL&CREATE)) - Koishi",					new Set([TITLE.L1]), { title: "L1", }, "Jnjl6XkLJx0", "L1 Koishi", ORIGINAL_TRACK, BOSS_THEME],

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
	["Yamanba's Six Attacks (Zyukucho (COOL&CREATE)) - Nemuno",							new Set([TITLE.L1]), { title: "L1", }, "t2S6Ox0Ro6Y", "L1 Nemuno", ORIGINAL_TRACK, BOSS_THEME],
	["Red Pair Melody (Zyukucho (COOL&CREATE)) - Aunn",									new Set([TITLE.L1]), { title: "L1", }, "f-uQtRgK2rI", "L1 Aunn", ORIGINAL_TRACK, BOSS_THEME],
	["Running Jizo (Zyukucho (COOL&CREATE)) - Narumi",		   							new Set([TITLE.L1]), { title: "L1", }, "W56AwYgFETE", "L1 Narumi", ORIGINAL_TRACK, BOSS_THEME],
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
	["LUCKY CAT [Instrumental] (Chocofan) - Mike",										new Set([TITLE.L1]), { title: "L1", }, "-9cGZMiQz_g", "L1 Mike", ORIGINAL_TRACK, BOSS_THEME],
	["GREEN (Para-Dot) - Takane",														new Set([TITLE.L1]), { title: "L1", }, "Dv4K7TvxYLI", "L1 Takane", ORIGINAL_TRACK, BOSS_THEME],
	["Sharp Edge [Instrumental] (DiGiTAL WiNG) - Sannyo",								new Set([TITLE.L1]), { title: "L1", }, "K5_6GorxiJw", "L1 Sannyo", ORIGINAL_TRACK, BOSS_THEME],
	["INKYA and YOKYA RAVE [Instrumental] (DiGiTAL WiNG) - Misumaru",		   			new Set([TITLE.L1]), { title: "L1", }, "EDqzDVNuZxE", "L1 Misumaru", ORIGINAL_TRACK, BOSS_THEME],
	["Stargazing at Underground (AramiTama) - Tsukasa",									new Set([TITLE.L1]), { title: "L1", }, "048IxaB-X8U", "L1 Tsukasa", ORIGINAL_TRACK, BOSS_THEME],
	["dawngazer (Para-Dot) - Megumu",													new Set([TITLE.L1]), { title: "L1", }, "ZeWO-7qWkZw", "L1 Megumu", ORIGINAL_TRACK, BOSS_THEME],
	["Last Day (Para-Dot) - Chimata",													new Set([TITLE.L1]), { title: "L1", }, "GN_5HF9KmBo", "L1 Chimata", ORIGINAL_TRACK, BOSS_THEME],
	["Get The Truth [Instrumental] (K2E+Cradle) - Momoyo",								new Set([TITLE.L1]), { title: "L1", }, "nPwQ3s8GOts", "L1 Momoyo", ORIGINAL_TRACK, BOSS_THEME],

	//L1 UDOALG
	["Beautiful Sky in Kunlun (k-waves LAB) - Biten",									new Set([TITLE.L1]), { title: "L1", }, "Pz6p_8LJdNU", "L1 Biten", ORIGINAL_TRACK, BOSS_THEME],
	["Servus Plutonis (Cajiva's Gadget Shop) - Enoko",									new Set([TITLE.L1]), { title: "L1", }, "G1yvTG7XV7M", "L1 Enoko", ORIGINAL_TRACK, BOSS_THEME],
	["ChupacabRhythm (AramiTama) - Chiyari",											new Set([TITLE.L1]), { title: "L1", }, "sx1A4zj2BdU", "L1 Chiyari", ORIGINAL_TRACK, BOSS_THEME],
	["The Path to Yomi Where None Turn Back (Mormimori Atsushi & Uma)",		   			new Set([TITLE.L1]), { title: "L1", }, "QmjmsNk_a_Q", "L1 Hisami", ORIGINAL_TRACK, BOSS_THEME],
	["Advance Nothingness (YushiNoki) - Zanmu",											new Set([TITLE.L1]), { title: "L1", }, "NdJ5IaU_JIk", "L1 Zanmu", ORIGINAL_TRACK, BOSS_THEME],

	//L1 FW
	["think of me (mondorium) - Ubame",													new Set([TITLE.L1]), { title: "L1", }, "42ki7KdWMO8", "L1 Ubame", ORIGINAL_TRACK, BOSS_THEME],
	//["Yamanba's Six Attacks (Zyukucho (COOL&CREATE)) - Chimi",						new Set([TITLE.L1]), { title: "L1", }, "t2S6Ox0Ro6Y", "L1 Chimi", ORIGINAL_TRACK, BOSS_THEME],
	//["Red Pair Melody (Zyukucho (COOL&CREATE)) - Nareko",								new Set([TITLE.L1]), { title: "L1", }, "f-uQtRgK2rI", "L1 Nareko", ORIGINAL_TRACK, BOSS_THEME],
	//["Running Jizo (Zyukucho (COOL&CREATE)) - Yuiman",		   							new Set([TITLE.L1]), { title: "L1", }, "W56AwYgFETE", "L1 Yuiman", ORIGINAL_TRACK, BOSS_THEME],
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

	//PFes
	["Again in the Dream (Foxtail-Grass Studio) - L0g Sanae",							new Set([TITLE.PFES]), { title: "PFES", }, "O8CA5riK7_M", "L0g Sanae", ORIGINAL_TRACK, BOSS_THEME],
	["Yasaka Oldest W4 (flap+frog) - L0g Kanako",										new Set([TITLE.PFES]), { title: "PFES", }, "ZxalSdo66Eg", "L0g Kanako", ORIGINAL_TRACK, BOSS_THEME],
	["Shizukana Shizukana Native Faith (Marasy) - L0g Suwako",							new Set([TITLE.PFES]), { title: "PFES", }, "Y_QWXOgpjVY", "L0g Suwako", ORIGINAL_TRACK, BOSS_THEME],
	["Eyes in the Darkness (Hachimitsu-Lemon) - L0o Satori",		   					new Set([TITLE.PFES]), { title: "PFES", }, "0wUAXMYokSE", "L0o Satori", ORIGINAL_TRACK, BOSS_THEME],
	["end of emptiness (Melodic Taste) - L0o Koishi",									new Set([TITLE.PFES]), { title: "PFES", }, "xFTiTtHWDlY", "L0o Koishi", ORIGINAL_TRACK, BOSS_THEME],

	//Masterminds
	["Magic Evolve (DiGiTAL WiNG) - D8 Marisa",											new Set([TITLE.MM]), { title: "MM", }, "qZwAgiZzKn8", "D8 Marisa", ORIGINAL_TRACK, BOSS_THEME],

	//Ultra Yukkuris
	["Magic of Endearing (IOSYS) - Az1 Yukkuri Marisa",									new Set([TITLE.UY]), { title: "UY", }, "7SMM9EQP3vg", "Az1 Yukkuri Marisa", ORIGINAL_TRACK, BOSS_THEME],

	//Aya Pass
	["Fluctuating Boundaries ~ Piano String Quartet (TAMUSIC) - L25ws Yukari",			new Set([TITLE.BP]), { title: "BP", }, "32siQ6rR_tM", "L25ws Yukari", ORIGINAL_TRACK, BOSS_THEME],
	["Love is a Polygon (Cajiva's Gadget Shop) - L50ws Yukari",							new Set([TITLE.BP]), { title: "BP", }, "hBCrstmc-H4", "L50ws Yukari", ORIGINAL_TRACK, BOSS_THEME],
	["Clear Candy (Para-Dot) - B3;6 Eirin",												new Set([TITLE.BP]), { title: "BP", }, "zXRlWYMhqvU", "B3;6 Eirin", ORIGINAL_TRACK, BOSS_THEME],
	["Violet Flavour (AramiTama) - D8.-5 Marisa",		   								new Set([TITLE.BP]), { title: "BP", }, "ZjG1atpCfHI", "D8.-5 Marisa", ORIGINAL_TRACK, BOSS_THEME],
	["Scarlet Sabbath (IRON ATTACK) - D8.-5 Remilia",									new Set([TITLE.BP]), { title: "BP", }, "vWi3EUJ2P6c", "D8.-5 Remilia", ORIGINAL_TRACK, BOSS_THEME],
	["Circus Crisis (Ganeme) - D8.-5 Flandre",											new Set([TITLE.BP]), { title: "BP", }, "iSrRPSm4c6E", "D8.-5 Flandre", ORIGINAL_TRACK, BOSS_THEME],
	["Last Blade Maid (YushiNoki) - E1;4 Sakuya",										new Set([TITLE.BP]), { title: "BP", }, "sLDLu_-X-yg", "E1;4 Sakuya", ORIGINAL_TRACK, BOSS_THEME],
	["Daily Life in the Alcove (Foxtail-Grass Studio) - F1;4 Reimu",					new Set([TITLE.BP]), { title: "BP", }, "JCA2-8CEj3Y", "F1;4 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Agartha Sans Pro Condensed (flap+frog) - F1.-5 Sanae",		   					new Set([TITLE.BP]), { title: "BP", }, "8fNo_eqesG0", "F1.-5 Sanae", ORIGINAL_TRACK, BOSS_THEME],
	["ラブリー♥スターシップ (Hachimitsu Lemon) - F1.-4 Koishi",		   					new Set([TITLE.BP]), { title: "BP", }, "Ecbly_Cd0JU", "F1.-4 Koishi", ORIGINAL_TRACK, BOSS_THEME],
	["fading response (Melodic Taste) - H5;7 Yuuka",									new Set([TITLE.BP]), { title: "BP", }, "-AnEavIjd9U", "H5;7 Yuuka", ORIGINAL_TRACK, BOSS_THEME],
	["Dreamscape -Kasho no Yume nekomix- (nekomimi style) - R2.-5 Yuyuko",				new Set([TITLE.BP]), { title: "BP", }, "W0Eib5SHL2I", "R2.-5 Yuyuko", ORIGINAL_TRACK, BOSS_THEME],
	["Katana of Bravery (O-LIFE JAPAN) - R8.-5 Youmu",									new Set([TITLE.BP]), { title: "BP", }, "Irvjc7eL0l4", "R8.-5 Youmu", ORIGINAL_TRACK, BOSS_THEME],
	["Tispy Pixels (Sound Square) - W1;4 Suika",		   								new Set([TITLE.BP]), { title: "BP", }, "i4Ei50dRa9s", "W1;4 Suika", ORIGINAL_TRACK, BOSS_THEME],
	["Petals on the path (Aftergrow) - W2.-5 Suwako",									new Set([TITLE.BP]), { title: "BP", }, "K1jmS0mfELY", "W2.-5 Suwako", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A6
	["Girl's Sleeping Song ~ Dream Battle (Marasy) - A6 Reimu",							new Set([TITLE.RETRO]), { title: "RETRO", }, "_RWy7EJ5AQk", "A6 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Starlight (flap+frog) - A6 Marisa",												new Set([TITLE.RETRO]), { title: "RETRO", }, "l01BhER_KeQ", "A6 Marisa", ORIGINAL_TRACK, BOSS_THEME],
	["Zakuro Syndrome (Morimori Atsushi) - A6 Rumia",									new Set([TITLE.RETRO]), { title: "RETRO", }, "mvf3oEn4Xlk", "A6 Rumia", ORIGINAL_TRACK, BOSS_THEME],
	["Lunate Elf (Marasy) - A6 Daiyousei",												new Set([TITLE.RETRO]), { title: "RETRO", }, "X4akcv6ZzVQ", "A6 Daiyousei", ORIGINAL_TRACK, BOSS_THEME],
	["Icicle Bomb (DiGiTAL WiNG) - A6 Cirno",											new Set([TITLE.RETRO]), { title: "RETRO", }, "pe_DDJdrwWU", "A6 Cirno", ORIGINAL_TRACK, BOSS_THEME],
	["Chinese Gatekeeper Girl Meiling [Karaoke Ver] - A6 Meiling",						new Set([TITLE.RETRO]), { title: "RETRO", }, "FYrNZsk56Y0", "A6 Meiling", ORIGINAL_TRACK, BOSS_THEME],
	["Journey Medley School ~ Scarlet STAGE 4 (Zyukucho (COOL&CREATE)) - A6 Koakuma",	new Set([TITLE.RETRO]), { title: "RETRO", }, "hB8Cy8SJBWg", "A6 Koakuma", ORIGINAL_TRACK, BOSS_THEME],
	["HEPT-GRAM (Morimori Atsushi & Uma) - A6 Patchouli",								new Set([TITLE.RETRO]), { title: "RETRO", }, "6JkccYZRN_s", "A6 Patchouli", ORIGINAL_TRACK, BOSS_THEME],
	["Illusion (Hachimitsu-Lemon x Aftergrow) - A6 Sakuya",								new Set([TITLE.RETRO]), { title: "RETRO", }, "uL7T2XAUDIU", "A6 Sakuya", ORIGINAL_TRACK, BOSS_THEME],
	["Overwhelm (Melodic Taste) - A6 Remilia",											new Set([TITLE.RETRO]), { title: "RETRO", }, "ehzJdEHHULc", "A6 Remilia", ORIGINAL_TRACK, BOSS_THEME],
	["Unfound (Morimori Atsushi) - A6 Flandre",											new Set([TITLE.RETRO]), { title: "RETRO", }, "BoSYTUWcEAE", "A6 Flandre", ORIGINAL_TRACK, BOSS_THEME],
	["Alice of Alice (Melodic Taste) - A6 Alice",										new Set([TITLE.RETRO]), { title: "RETRO", }, "bKtkAw9UY8E", "A6 Alice", ORIGINAL_TRACK, BOSS_THEME],
	["Gig the Alternative (IOSYS) - A6 Lunasa",											new Set([TITLE.RETRO]), { title: "RETRO", }, "YFSwsy2thnU", "A6 Lunasa", ORIGINAL_TRACK, BOSS_THEME],
	["Phantom Phannk Orchestra (IRON ATTACK) - A6 Merlin",								new Set([TITLE.RETRO]), { title: "RETRO", }, "7h1WoMkETj0", "A6 Merlin", ORIGINAL_TRACK, BOSS_THEME],
	["Playing with the Rainbow Sounds (Tokyo Active NEETs) - A6 Lyrica",				new Set([TITLE.RETRO]), { title: "RETRO", }, "qHL7HsexJ9c", "A6 Lyrica", ORIGINAL_TRACK, BOSS_THEME],
	["Ancient Groove (Amateras Records) - A6 Youmu",									new Set([TITLE.RETRO]), { title: "RETRO", }, "mlyjMFiwhoc", "A6 Youmu", ORIGINAL_TRACK, BOSS_THEME],
	["Party Yuyuko (Morimori Atsushi) - A6 Yuyuko",										new Set([TITLE.RETRO]), { title: "RETRO", }, "tBgve_nVvrY", "A6 Yuyuko", ORIGINAL_TRACK, BOSS_THEME],
	["Dynamite (Amateras Records) - A6 Yukari",											new Set([TITLE.RETRO]), { title: "RETRO", }, "6Bthaswp0BE", "A6 Yukari", ORIGINAL_TRACK, BOSS_THEME],
	["Velvet Night Falls (Butaotome) - A6 Yuuka",										new Set([TITLE.RETRO]), { title: "RETRO", }, "nqRJ4L4NtEI", "A6 Yuuka", ORIGINAL_TRACK, BOSS_THEME],
	["Bhavaagra Incidents (Morimori Atsushi) - A6 Tenshi",								new Set([TITLE.RETRO]), { title: "RETRO", }, "FkuM7hGMxzA", "A6 Tenshi", ORIGINAL_TRACK, BOSS_THEME],
	["Raikou [Instrumental] (Zikee (SOUND HOLIC)) - A6 Sunny",							new Set([TITLE.RETRO]), { title: "RETRO", }, "7nOgdcOB7R4", "A6 Sunny", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A7
	["Tono Yokai Zensen (BeatMaro (COOL&CREATE)) - A7 Chen",							new Set([TITLE.RETRO]), { title: "RETRO", }, "_KLmIVduR8E", "A7 Chen", ORIGINAL_TRACK, BOSS_THEME],
	["Doll Judgement (Marasy) - A7 Alice",												new Set([TITLE.RETRO]), { title: "RETRO", }, "0pHONoCkIFA", "A7 Alice", ORIGINAL_TRACK, BOSS_THEME],
	["Perfect Cherry Blossom 2014 V3 (Morimori Atsushi) - A7 Youmu",					new Set([TITLE.RETRO]), { title: "RETRO", }, "yu49aIapXdU", "A7 Youmu", ORIGINAL_TRACK, BOSS_THEME],
	["Some Things Never Change [2013 Remix] (Morimori Atsushi) - A7 Yuyuko",			new Set([TITLE.RETRO]), { title: "RETRO", }, "YJDTMA4OdVg", "A7 Yuyuko", ORIGINAL_TRACK, BOSS_THEME],
	["Ra-Rui-Ru-Re Ran-Sama [Nine-Tail-Spinner] (Komsoya) - A7 Ran",					new Set([TITLE.RETRO]), { title: "RETRO", }, "ZyqMqd7Fl2c", "A7 Ran", ORIGINAL_TRACK, BOSS_THEME],
	["The Border of Human and Youkai (Tokyo Active NEETs) - A7 Yukari",					new Set([TITLE.RETRO]), { title: "RETRO", }, "d1BJiNYlm1U", "A7 Yukari", ORIGINAL_TRACK, BOSS_THEME],
	["Snow Stream (Francois' Yomogi Farm) - A7 Cirno",									new Set([TITLE.RETRO]), { title: "RETRO", }, "ZJmCKo_2dQk", "A7 Cirno", ORIGINAL_TRACK, BOSS_THEME],
	["Moonlight Fairy Dance (Francois' Yomogi Farm) - A7 Luna",							new Set([TITLE.RETRO]), { title: "RETRO", }, "-kqHfQ0L0X8", "A7 Luna", ORIGINAL_TRACK, BOSS_THEME],
	["Goodnight Serenade (Butaotome) - A7A Reimu",										new Set([TITLE.RETRO]), { title: "RETRO", }, "PvVvdKX9okU", "A7A Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Retai Spark Ex (BeatMario (COOL&CREATE)) - A7A Marisa",							new Set([TITLE.RETRO]), { title: "RETRO", }, "sQN-HEf6gDU", "A7A Marisa", ORIGINAL_TRACK, BOSS_THEME],
	["Party Sakuya (Morimori Atsushi) - A7A Sakuya",									new Set([TITLE.RETRO]), { title: "RETRO", }, "IT8jI2VMo2U", "A7A Sakuya", ORIGINAL_TRACK, BOSS_THEME],
	["A Late Night Capriccio (Butaotome) - A7B Reimu",									new Set([TITLE.RETRO]), { title: "RETRO", }, "3ArNaNDMX_I", "A7B Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["LaserMari is Not Difficult! [Guitar Inst Version] (BeatMario (COOL&CREATE)) - A7B Marisa",	new Set([TITLE.RETRO]), { title: "RETRO", }, "_dUc6_XSEwE", "A7B Marisa", ORIGINAL_TRACK, BOSS_THEME],
	["The Maid and the Pocket Watch of Blood [MRM Remix[ (Morimori Atshshi) - A7B Sakuya",			new Set([TITLE.RETRO]), { title: "RETRO", }, "ZS5GkZKaOR8", "A7B Sakuya", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A8
	["White Flag of Usa Shrine (Marasy) - A8 Tewi",										new Set([TITLE.RETRO]), { title: "RETRO", }, "jIEQR6jU9Qc", "A8 Tewi", ORIGINAL_TRACK, BOSS_THEME],
	["The Twisted Hallway and the Moon Madness (IOSYS) - A8 Reisen",					new Set([TITLE.RETRO]), { title: "RETRO", }, "ybByc-NESoc", "A8 Reisen", ORIGINAL_TRACK, BOSS_THEME],
	["Gensokyo Millennium ~ History of the Moon (Marasy) - A8 Eirin",					new Set([TITLE.RETRO]), { title: "RETRO", }, "pxvUV4nBzkA", "A8 Eirin", ORIGINAL_TRACK, BOSS_THEME],
	["Human History is the Flames of Love (O-LIFE JAPAN) - A8 Mokou",					new Set([TITLE.RETRO]), { title: "RETRO", }, "ad69-66kGG8", "A8 Mokou", ORIGINAL_TRACK, BOSS_THEME],
	["A little voyager (ACCORD ON CODES) - A8 Star",									new Set([TITLE.RETRO]), { title: "RETRO", }, "3pQmbo1slTs", "A8 Star", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A9
	["Whirlwind Saudade (Butaotome) - A9 Aya",											new Set([TITLE.RETRO]), { title: "RETRO", }, "nuoKgPUuhOQ", "A9 Aya", ORIGINAL_TRACK, BOSS_THEME],
	["She will never forget (k-waves LAB) - A9.7 Akyuu",								new Set([TITLE.RETRO]), { title: "RETRO", }, "wrsu0uXfiBM", "A9.7 Akyuu", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A10
	["Kappappa Thinking Time (O-LIFE JAPAN) - A10 Nitori",								new Set([TITLE.RETRO]), { title: "RETRO", }, "ZuC2PFj5n0o", "A10 Nitori", ORIGINAL_TRACK, BOSS_THEME],
	["Lives Lined Up in a Row (IOSYS) - A10 Sanae",										new Set([TITLE.RETRO]), { title: "RETRO", }, "la_Mzr925is", "A10 Sanae", ORIGINAL_TRACK, BOSS_THEME],
	["IS THERE A GOD? (Melodic Taste) - A10 Kanako",									new Set([TITLE.RETRO]), { title: "RETRO", }, "XUlTkgk6c50", "A10 Kanako", ORIGINAL_TRACK, BOSS_THEME],
	["God Storyteller of the Land of the Rising Sun (Foxtail-Grass Studio) - A10 Suwako",			new Set([TITLE.RETRO]), { title: "RETRO", }, "6A8jhyFRhMg", "A10 Suwako", ORIGINAL_TRACK, BOSS_THEME],
	["Still Rabbit Run Fast. (Reset All Controllers) - A10.3 Ringo",					new Set([TITLE.RETRO]), { title: "RETRO", }, "sY6lSSIYzVY", "A10.3 Ringo", ORIGINAL_TRACK, BOSS_THEME],
	["Locked Girl Piano String Quarte (TAMUSIC) - A10.5 Patchouli",						new Set([TITLE.RETRO]), { title: "RETRO", }, "ltl7CYF7KG4", "A10.5 Patchouli", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A11
	["Satori Maiden (Kokyo Active NEETs) - A11 Satori",									new Set([TITLE.RETRO]), { title: "RETRO", }, "Gwec7HxsDfs", "A11 Satori", ORIGINAL_TRACK, BOSS_THEME],
	["Hartmann's Youkai Girl (Tokyo Active NEETs) - A11 Koishi",						new Set([TITLE.RETRO]), { title: "RETRO", }, "3PMLKfnchj0", "A11 Koishi", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A12
	["Obon, New Year, and Guerrilla Downpour (As/Hi ROCK) - A12 Kogasa",				new Set([TITLE.RETRO]), { title: "RETRO", }, "1J2ow-VqDfE", "A12 Kogasa", ORIGINAL_TRACK, BOSS_THEME],
	["Orderly Erosion (Melodic Taste) - A12 Byakuren",									new Set([TITLE.RETRO]), { title: "RETRO", }, "x4r87PRBxPk", "A12 Byakuren", ORIGINAL_TRACK, BOSS_THEME],
	["Unknown X Type C (AbsoЯute Zero) - A12.3 Meiling",								new Set([TITLE.RETRO]), { title: "RETRO", }, "YvVni8mC2T4", "A12.3 Meiling", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A13
	["Mausoleum Custos (IRON ATTACK) - A13 Yoshika",									new Set([TITLE.RETRO]), { title: "RETRO", }, "vbu7Xvtgwh0", "A13 Yoshika", ORIGINAL_TRACK, BOSS_THEME],
	["Distant Paradise (K2E+Cradle) - A13 Seiga",										new Set([TITLE.RETRO]), { title: "RETRO", }, "7xfvk0btpdw", "A13 Seiga", ORIGINAL_TRACK, BOSS_THEME],
	["Eternal Youth (ESQUARIA) - A13 Futo",												new Set([TITLE.RETRO]), { title: "RETRO", }, "RojuPrblu3M", "A13 Futo", ORIGINAL_TRACK, BOSS_THEME],
	["We're Still Not [End Point] There (Morimori Atsushi) - A13 Miko",					new Set([TITLE.RETRO]), { title: "RETRO", }, "-yzPweNtqMM", "A13 Miko", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A13
	["SAKASAMA Traveler (Para-Dot) - A14 Seija",										new Set([TITLE.RETRO]), { title: "RETRO", }, "Jfiky3n6rcA", "A14 Seija", ORIGINAL_TRACK, BOSS_THEME],
	["EINE KLEINE NADEL MUSIK (ZYTOKINE) - A14 Shinmyoumaru",							new Set([TITLE.RETRO]), { title: "RETRO", }, "n9DMH9BVw7s", "A14 Shinmyoumaru", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A16
	["Forbidden Fixer (zi-ku-ka) - A16 Okina",										new Set([TITLE.RETRO]), { title: "RETRO", }, "9wYwGUKgg0A", "A16 Okina", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A18
	["Summit Flowers (The Smothered Mate) - A18 Takane",								new Set([TITLE.RETRO]), { title: "RETRO", }, "PzaZ1YUyljY", "A18 Takane", ORIGINAL_TRACK, BOSS_THEME],
	["New Product PR by Kappa (O-LIFE JAPAN) - A18.5 Nitori",							new Set([TITLE.RETRO]), { title: "RETRO", }, "a5HhA_rKQXA", "A18.5 Nitori", ORIGINAL_TRACK, BOSS_THEME],

	//RETRO A19
	["Necro Domination (XI~ON) - A19 Ran",												new Set([TITLE.RETRO]), { title: "RETRO", }, "PglNZy5ddhU", "A19 Ran", ORIGINAL_TRACK, BOSS_THEME],

	//EXFES
	["I am the boss!! (minimum electric design) - A6& Cirno",							new Set([TITLE.EXFES]), { title: "EXFES", }, "Jaw2KfiLWI0", "A6& Cirno", ORIGINAL_TRACK, BOSS_THEME],
	["Beyond the Darkness (Para-Dot) - A6& Rumia",										new Set([TITLE.EXFES]), { title: "EXFES", }, "1-irwr0VXVg", "A6& Rumia", ORIGINAL_TRACK, BOSS_THEME],
	["KOAKUMA STOMP (Zyukucho (COOL&CREATE)) - A6& Koakuma",							new Set([TITLE.EXFES]), { title: "EXFES", }, "ikJA6-UMoGw", "A6& Koakuma", ORIGINAL_TRACK, BOSS_THEME],
	["LILY WHITE Light Oblique (flap+frog) - A7& Lily",									new Set([TITLE.EXFES]), { title: "EXFES", }, "lMGCojJ2Bdk", "A7& Lily", ORIGINAL_TRACK, BOSS_THEME],
	["Dying Life (Rolling Contact) - A7& Yuyuko",										new Set([TITLE.EXFES]), { title: "EXFES", }, "PbUK1um3QB0", "A7& Yuyuko", ORIGINAL_TRACK, BOSS_THEME],
	["CAGE BREAKER (Xi~ON) - A8& Tewi",													new Set([TITLE.EXFES]), { title: "EXFES", }, "1jz1Vd3fzhw", "A8& Tewi", ORIGINAL_TRACK, BOSS_THEME],
	["Melancholic Liberation War (YushiNoki) - A9& Medicine",							new Set([TITLE.EXFES]), { title: "EXFES", }, "1hEuixDpcxY", "A9& Medicine", ORIGINAL_TRACK, BOSS_THEME],
	["Never Wilt (Jerico's Law) - A9& Yuuka",											new Set([TITLE.EXFES]), { title: "EXFES", }, "JYu1ZYmoMPs", "A9& Yuuka", ORIGINAL_TRACK, BOSS_THEME],
	["Misdirection (KIWAMI SPEED'z) - A9.4& Sakuya",									new Set([TITLE.EXFES]), { title: "EXFES", }, "nl6WmxSi_TE", "A9.4& Sakuya", ORIGINAL_TRACK, BOSS_THEME],
	["KUREHA ~falling for fall~ (XI~ON) - A10& Shizuha",								new Set([TITLE.EXFES]), { title: "EXFES", }, "EZCD-oEwmPc", "A10& Shizuha", ORIGINAL_TRACK, BOSS_THEME],
	["Extreme Festival (Jerico's Law) - A10& Minoriko",									new Set([TITLE.EXFES]), { title: "EXFES", }, "oUhRwXOIioA", "A10& Minoriko", ORIGINAL_TRACK, BOSS_THEME],
	["Memory Detector (YushiNoki) - A12& Nazrin",										new Set([TITLE.EXFES]), { title: "EXFES", }, "CaGt5_jwS0I", "A12& Nazrin", ORIGINAL_TRACK, BOSS_THEME],
	["Progressive Father (As/Hi ROCK) - A12& Ichirin",									new Set([TITLE.EXFES]), { title: "EXFES", }, "_W7xu8zyTtg", "A12& Ichirin", ORIGINAL_TRACK, BOSS_THEME],
	["KONTO no INORI (Galactic Revolver) - A12& Shou",									new Set([TITLE.EXFES]), { title: "EXFES", }, "VpGwv0gKrlg", "A12& Shou", ORIGINAL_TRACK, BOSS_THEME],
	["Captain Murasa ~ You're Gonna Need A Bigger Boat (Demetori) - A12& Murasa",		new Set([TITLE.EXFES]), { title: "EXFES", }, "QIqZMHNYApM", "A12& Murasa", ORIGINAL_TRACK, BOSS_THEME],
	["REIWA NO Alien (AbsoЯute Zero) - A12& Nue",										new Set([TITLE.EXFES]), { title: "EXFES", }, "cVFHKdLVWa8", "A12& Nue", ORIGINAL_TRACK, BOSS_THEME],
	["Mystic Jive (Mahotoa Tofu) - A12.5& Hatate",										new Set([TITLE.EXFES]), { title: "EXFES", }, "Sa5hp33LijY", "A12.5& Hatate", ORIGINAL_TRACK, BOSS_THEME],
	["Feast of Dreams, Secrets Unveiled (Pizuya's Cell) - A7.5& Suika",					new Set([TITLE.EXFES]), { title: "EXFES", }, "69ek49fh9ZU", "A7.5& Suika", ORIGINAL_TRACK, BOSS_THEME],
	["The Realm of the Great Fairy (O-LIFE JAPAN) - A12.8& Daiyousei",					new Set([TITLE.EXFES]), { title: "EXFES", }, "A-EiSlLQuO0", "A12.8& Daiyousei", ORIGINAL_TRACK, BOSS_THEME],
	["xie sheng dai dao (Cajiva's Gadget Shop) - A13& Seiga",							new Set([TITLE.EXFES]), { title: "EXFES", }, "eWD-VNelHRM", "A13& Seiga", ORIGINAL_TRACK, BOSS_THEME],
	["Suicidal Lightning (Tokyo Active NEETs) - A13& Tojiko",							new Set([TITLE.EXFES]), { title: "EXFES", }, "OXN9BtZZIfA", "A13& Tojiko", ORIGINAL_TRACK, BOSS_THEME],
	["Mono Novel (Zyukucho (COOL&CREATE)) - A13& Futo",									new Set([TITLE.EXFES]), { title: "EXFES", }, "6aQKRUGYxNg", "A13& Futo", ORIGINAL_TRACK, BOSS_THEME],
	["TANUKI NOISES (Para-Dot) - A14.5& Mamizou",										new Set([TITLE.EXFES]), { title: "EXFES", }, "uGLnWxq2BD4", "A14.5& Mamizou", ORIGINAL_TRACK, BOSS_THEME],
	["Last Occultism ~ Hazama Ideology... (Demetori) - A14.5& Sumireko",				new Set([TITLE.EXFES]), { title: "EXFES", }, "tUaRu6sTs_Y", "A4.5& Sumireko", ORIGINAL_TRACK, BOSS_THEME],
	["Rabbit impact (AbsoЯute Zero) - A15& Seiran",										new Set([TITLE.EXFES]), { title: "EXFES", }, "EfEY_YfoUiE", "A15& Seiran", ORIGINAL_TRACK, BOSS_THEME],
	["Moonshot (Tokyo Active NEETs) - A15& Clownpiece",									new Set([TITLE.EXFES]), { title: "EXFES", }, "MieXcUP8Jrw", "A15& Clownpiece", ORIGINAL_TRACK, BOSS_THEME],
	["Herznote (ZYTOKINE) - A15A& Sanae",												new Set([TITLE.EXFES]), { title: "EXFES", }, "gfUf6BmQjk4", "A15A& Sanae", ORIGINAL_TRACK, BOSS_THEME],
	["Nightmare All Night (Defiant Groovings) - A15.3& Doremy",							new Set([TITLE.EXFES]), { title: "EXFES", }, "n5dZCjpk4yI", "A15.3& Doremy", ORIGINAL_TRACK, BOSS_THEME],
	["Eternity Larva's Dream (TAMUSIC) - A16& Eternity",								new Set([TITLE.EXFES]), { title: "EXFES", }, "8HTLm2FAbvI", "A16& Eternity", ORIGINAL_TRACK, BOSS_THEME],
	["(Shrine) Dogfight! (KOMSOYA) - A16& Aunn",										new Set([TITLE.EXFES]), { title: "EXFES", }, "o3bLZI--8sY", "A16& Aunn", ORIGINAL_TRACK, BOSS_THEME],
	["Crazy Bamboo Festival (As/Hi ROCK) - A16& Mai",									new Set([TITLE.EXFES]), { title: "EXFES", }, "gReKT6Z3VAQ", "A16& Mai", ORIGINAL_TRACK, BOSS_THEME],
	["cb-db (Siestail) - A16& Satono",													new Set([TITLE.EXFES]), { title: "EXFES", }, "YR95jY6kHgM", "A16& Satono", ORIGINAL_TRACK, BOSS_THEME],
	["Reading on Dream (Reset All Controllers) - A16.3& Kosuzu",						new Set([TITLE.EXFES]), { title: "EXFES", }, "EY9c5B4_sLw", "A16.3& Kosuzu", ORIGINAL_TRACK, BOSS_THEME],
	["Splash Around (Rolling Contact) - A17& Flandre",									new Set([TITLE.EXFES]), { title: "EXFES", }, "mG9zz9CGvQI", "A17& Flandre", ORIGINAL_TRACK, BOSS_THEME],
	["Psychotic Tightrope (Asomosphere) - A17& Eika",									new Set([TITLE.EXFES]), { title: "EXFES", }, "R7KQM0HfJ-g", "A17& Eika", ORIGINAL_TRACK, BOSS_THEME],
	["Seraphim (Chilled Sweet Regret) - A17.5& Kutaka",									new Set([TITLE.EXFES]), { title: "EXFES", }, "r-OjU6hAO0M", "A17.5& Kutaka", ORIGINAL_TRACK, BOSS_THEME],
	["FEED THE BEAT (K2E+Cradle) - A17.5& Yuuma",										new Set([TITLE.EXFES]), { title: "EXFES", }, "4LBMM326oGg", "A17.5& Yuuma", ORIGINAL_TRACK, BOSS_THEME],
	["Arc Relics (Mahotoa Tofu) - A18& Misumaru",										new Set([TITLE.EXFES]), { title: "EXFES", }, "WfHqLrQTwkY", "A18& Misumaru", ORIGINAL_TRACK, BOSS_THEME],
	["Endstation (ZYTOKINE) - A19& Sanae",												new Set([TITLE.EXFES]), { title: "EXFES", }, "m5hAy0qj224", "A19& Sanae", ORIGINAL_TRACK, BOSS_THEME],

	//PH
	["O-N-Y-X (Reset All Controllers) - A6æ Rumia",										new Set([TITLE.PH]), { title: "PH", }, "MzmVNT7ZKXg", "A6æ Rumia", ORIGINAL_TRACK, BOSS_THEME],

	//MV
	["Lost Word Chronicle (Comp (Butaotome))",																	new Set([TITLE.MV]), { title: "MV", }, "2YMWIDdTleA", "LW Theme Song", ORIGINAL_TRACK, BOSS_THEME],
	["The Heat of My Fingertips (Touhou LostWord feat. Shimamiya Eiko x Yuuhei Satellite) - MV Remilia",		new Set([TITLE.MV]), { title: "MV", }, "Ru-xuAZ89ao", "MV Remilia", ORIGINAL_TRACK, BOSS_THEME],
	["Sporadically Margaret (Touhou LostWord feat. konoco x Shinra-Bansho) - MV Alice",							new Set([TITLE.MV]), { title: "MV", }, "2_h2q2wGwSM", "MV Alice", ORIGINAL_TRACK, BOSS_THEME],
	["The Moon and Izayoi (Touhou LostWord feat. nano x KISHIDA KYOUDAN & THE AKEBOSHI ROCKETS) - MV Sakuya",	new Set([TITLE.MV]), { title: "MV", }, "oiNfVngQvwk", "MV Sakuya", ORIGINAL_TRACK, BOSS_THEME],
	["Silver Gale (Touhou LostWord feat. Nanase Aikawa x Butaotome) - MV Mokou",								new Set([TITLE.MV]), { title: "MV", }, "AW9AqRsNDik", "MV Mokou", ORIGINAL_TRACK, BOSS_THEME],
	["NAЯAKA (Touhou LostWord feat. kaguranana x SOUND HOLIC) - MV Satori",										new Set([TITLE.MV]), { title: "MV", }, "-qOSXK1Kj64", "MV Satori", ORIGINAL_TRACK, BOSS_THEME],
	["Blue Goodbyes (Touhou LostWord feat. Toshihiko Tahara x Butaotome) - MV Kanako",							new Set([TITLE.MV]), { title: "MV", }, "1_A5xAjnEKQ", "MV Kanako", ORIGINAL_TRACK, BOSS_THEME],
	["Disillusion (Touhou LostWord feat. Faylan x Alstroemeria Records) - MV Youmu",							new Set([TITLE.MV]), { title: "MV", }, "KEWlBnfdSTg", "MV Youmu", ORIGINAL_TRACK, BOSS_THEME],
	["I'm Alright! (Touhou LostWord feat. KIHOW from MYTH & ROID × A-One) - MV Flandre",						new Set([TITLE.MV]), { title: "MV", }, "J3TNWQUgGK0", "MV Flandre", ORIGINAL_TRACK, BOSS_THEME],
	["Night-Splitting Light (Touhou LostWord feat. Hironobu Kageyama × Butaotome) - MV Marisa",					new Set([TITLE.MV]), { title: "MV", }, "M0FyZ_iJtoc", "MV Marisa", ORIGINAL_TRACK, BOSS_THEME],
	["Moonlit Festival (Touhou LostWord feat. Eimi Naruse+Ringo Coisio × IOSYS) - MV Kaguya & Reisen",			new Set([TITLE.MV]), { title: "MV", }, "8A0w-BbKZjk", "MV Kaguya & Reisen", ORIGINAL_TRACK, BOSS_THEME],
	["Hand in Hand With a Miracle (Touhou LostWord feat. Nagi Nemoto × TUMENECO) - MV Sanae",					new Set([TITLE.MV]), { title: "MV", }, "bSVDkmBiO9c", "MV Sanae", ORIGINAL_TRACK, BOSS_THEME],
	["Karma Speed (Touhou LostWord feat. Mitsuhiro Oikawa x Butaotome) - MV Reimu",								new Set([TITLE.MV]), { title: "MV", }, "QNrQPVXEoMo", "MV Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Boundary of Time (Touhou LostWord feat. Ito Kanako x Tokyo Active NEETs) - MV Yuyuko",					new Set([TITLE.MV]), { title: "MV", }, "TT7FWWTT-oY", "MV Yuyuko", ORIGINAL_TRACK, BOSS_THEME],
	["PHANTOM PAIN (Touhou LostWord feat. KOTOKO × ZYTOKINE) - MV Kasen",										new Set([TITLE.MV]), { title: "MV", }, "QaDmA8GUEFM", "MV Kasen", ORIGINAL_TRACK, BOSS_THEME],
	["Be the change (Touhou LostWord feat. Yuka Otsubo × DiGiTAL WiNG) - MV Meiling",							new Set([TITLE.MV]), { title: "MV", }, "FbhzPqi4YcM", "MV Meiling", ORIGINAL_TRACK, BOSS_THEME],
	["Moon Reverie (Touhou LostWordfeat. Yuko Miyamura × Yuuhei Satellite) - MV Koishi",						new Set([TITLE.MV]), { title: "MV", }, "MHOG0Ba3aoU", "MV Koishi", ORIGINAL_TRACK, BOSS_THEME],
	["TataeLost (Touhou LostWord feat. Kishida Mel × Sekkenya) - MV Suwako",									new Set([TITLE.MV]), { title: "MV", }, "bOoDDNesPoE", "MV Suwako", ORIGINAL_TRACK, BOSS_THEME],
	["Sorrow's Exit (Touhou LostWord feat. Atsuko Enomoto × Honey Pocket) - MV Okina",							new Set([TITLE.MV]), { title: "MV", }, "TuQbQpGdOko", "MV Okina", ORIGINAL_TRACK, BOSS_THEME],
	["(TT) Precious Words (Touhou LostWord feat. Haruko Momoi × IOSYS) - MV Patchouli",							new Set([TITLE.MV]), { title: "MV", }, "1fqmyApS_Ns", "MV Patchouli", ORIGINAL_TRACK, BOSS_THEME],
	["No Name, No Life (Touhou LostWord feat. Fuchigami Mai × Girls Logic Observatory) - MV Junko",				new Set([TITLE.MV]), { title: "MV", }, "MW7WwkB0CLI", "MV Junko", ORIGINAL_TRACK, BOSS_THEME],
	["Holy Again (Touhou LostWord feat. Teresa × Hatsunetsumiko's) - MV Byakuren",								new Set([TITLE.MV]), { title: "MV", }, "PH69IbSMK0o", "MV Byakuren", ORIGINAL_TRACK, BOSS_THEME],
	["Sentimental Signals (Touhou LostWord feat. Yumiri Hanamori × Touhou Jihen) - MV Miko",					new Set([TITLE.MV]), { title: "MV", }, "3BRUo2GlCSs", "MV Miko", ORIGINAL_TRACK, BOSS_THEME],
	["Reminiscence Love (Touhou LostWord feat. Otsuki Kenji × Butaotome) - MV Shion",							new Set([TITLE.MV]), { title: "MV", }, "0YJWfy-Iv6Y", "MV Shion", ORIGINAL_TRACK, BOSS_THEME],
	["The Special-est Girl (Touhou LostWord feat. Tokui Sora × Alstroemeria Records) - MV Nitori",				new Set([TITLE.MV]), { title: "MV", }, "6tHF9WhGSw4", "MV Nitori", ORIGINAL_TRACK, BOSS_THEME],
	["Spread your Wings (Touhou LostWord feat. cluppo × TUMENECO) - MV Kokoro",									new Set([TITLE.MV]), { title: "MV", }, "z5IsbX_uves", "MV Kokoro", ORIGINAL_TRACK, BOSS_THEME],
	["KESSON Ride On (Touhou LostWord feat. Nagi Fujisaki from Saishu Mirai Shoujo × Butaotome) - MV Parsee",	new Set([TITLE.MV]), { title: "MV", }, "B90XXn_pGDA", "MV Parsee", ORIGINAL_TRACK, BOSS_THEME],
	["Love Letter (Touhou LostWord feat. Megumi Nakajima × Reirou no Hydrangea) - MV Aya",						new Set([TITLE.MV]), { title: "MV", }, "OxulNrH54A0", "MV Aya", ORIGINAL_TRACK, BOSS_THEME],
	["Foxindigo (Touhou LostWord feat. 96NEKO × Akatsuki Records) - MV Ran",									new Set([TITLE.MV]), { title: "MV", }, "1I6Qcsm3Otg", "MV Ran", ORIGINAL_TRACK, BOSS_THEME],
	["DOUBLE BIND (Touhou LostWord feat. reche × ZYTOKINE) - MV Yukari",										new Set([TITLE.MV]), { title: "MV", }, "hE7ydSJAKCM", "MV Yukari", ORIGINAL_TRACK, BOSS_THEME],
	["Notice Me ☆ Unknown Girl (Touhou LostWord feat. Maria Noda × Girls Logic Observatory) - MV Nue",			new Set([TITLE.MV]), { title: "MV", }, "hT2F54aqVYc", "MV Nue", ORIGINAL_TRACK, BOSS_THEME],
	["DOKI❄︎WAKU Revolution (Touhou LostWord feat. May’n × Butaotome) - MV Cirno",								new Set([TITLE.MV]), { title: "MV", }, "uvrCrP-qM3c", "MV Cirno", ORIGINAL_TRACK, BOSS_THEME],
	["LEXIPHOBIA (Touhou LostWord feat. Nozomi Kasuga × ZYTOKINE) - MV Koakuma",								new Set([TITLE.MV]), { title: "MV", }, "XZJ9enIlC1I", "MV Koakuma", ORIGINAL_TRACK, BOSS_THEME],
	["Mayoineko Wonderland (Touhou LostWord feat. Saki Fujita × Foxtail-Grass Studio) - MV Chen",				new Set([TITLE.MV]), { title: "MV", }, "unWGVvTNq3s", "MV Chen", ORIGINAL_TRACK, BOSS_THEME],
	["Drunken Oni Afterglow (Touhou LostWord feat. Fairouz Ai × TamaOnSen) - MV Suika",							new Set([TITLE.MV]), { title: "MV", }, "o_covjLNH1w", "MV Suika", ORIGINAL_TRACK, BOSS_THEME],
	["Solitary Flower (Touhou LostWord feat. Hitomi Yaida × Hatsunetsumiko's) - MV Rumia",						new Set([TITLE.MV]), { title: "MV", }, "iw-3XzbRxI8", "MV Rumia", ORIGINAL_TRACK, BOSS_THEME],
	["Dazzling Good Day (Touhou LostWord feat. Kavka Shishido × Butaotome) - MV Joon",							new Set([TITLE.MV]), { title: "MV", }, "QDUmCqh5Gqg", "MV Joon", ORIGINAL_TRACK, BOSS_THEME],
	["Sine Nomine (Touhou LostWord feat. Annabel × Tiao ye tsung / Diao ye zong) - MV Daiyousei",				new Set([TITLE.MV]), { title: "MV", }, "G6KESmBRUhw", "MV Daiyousei", ORIGINAL_TRACK, BOSS_THEME],

	//GENIC
	["Dream of the Demon World (Butaotome) - Renko & Shinki",													new Set([TITLE.GENIC]), { title: "GENIC", }, "AWJLb_j6t8I", "Renko & Shinki", ORIGINAL_TRACK, BOSS_THEME],
	["Tsuki Matoi-Tsuki Madoe (TUMENECO) - Renko & Gengetsu",													new Set([TITLE.GENIC]), { title: "GENIC", }, "eY_iiikdX18", "Renko & Gengetsu", ORIGINAL_TRACK, BOSS_THEME],
	["Unseen Yet (Diao Ye Zong) - Maribel & Mima",																new Set([TITLE.GENIC]), { title: "GENIC", }, "MbHUqkuo-vA", "Maribel & Mima", ORIGINAL_TRACK, BOSS_THEME],
	["Dream Observer (Honey Pocket) - Maribel & Mugetsu",														new Set([TITLE.GENIC]), { title: "GENIC", }, "HlvAl03WrZI", "Maribel & Mugetsu", ORIGINAL_TRACK, BOSS_THEME],

	//UFES
	["Akaku Somarina (Zykucho (COOL&CREATE)) - Lr Flandre",														new Set([TITLE.UFES]), { title: "UFES", }, "mCkO8enssIA", "Lr Flandre", ORIGINAL_TRACK, BOSS_THEME],
	["Flutter (Hachimitsu-Lemon) - Lr Aya",																		new Set([TITLE.UFES]), { title: "UFES", }, "UFDgy_sZMfE", "Lr Aya", ORIGINAL_TRACK, BOSS_THEME],
	["PROPELLER [take2] (flap+frog) - Lr Nitori",																new Set([TITLE.UFES]), { title: "UFES", }, "u5PzahyCWiQ", "Lr Nitori", ORIGINAL_TRACK, BOSS_THEME],
	["But It Goes On (.New Label) - Lr Tenshi",																	new Set([TITLE.UFES]), { title: "UFES", }, "OYtJeOaGtfE", "Lr Tenshi", ORIGINAL_TRACK, BOSS_THEME],
	["Emotional Effusion (Melodic Taste) - Lr Kokoro",															new Set([TITLE.UFES]), { title: "UFES", }, "I5kjyfgRGB0", "Lr Kokoro", ORIGINAL_TRACK, BOSS_THEME],
	["Sacred Fury (Afterglow) - Lr Ibaraki Douji's Arm",														new Set([TITLE.UFES]), { title: "UFES", }, "9tUMKSmHV4E", "Lr Arm", ORIGINAL_TRACK, BOSS_THEME],
	["Gunslinger (Rolling Contact) - B1 Reisen",																new Set([TITLE.UFES]), { title: "UFES", }, "6_iPtQnkM-k", "B1 Reisen", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B2 Junko",												new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B2 Junko", ORIGINAL_TRACK, BOSS_THEME],
	["Special Power of Exposing Moonlit Nights? [Karaoke Ver] (IOSYS) - B3 Reimu",								new Set([TITLE.UFES]), { title: "UFES", }, "Ah8Eg1nTMA8", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",											new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",												new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",											new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",											new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",												new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",											new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",											new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",												new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",											new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Pure Furies [ALR REMIX] (Alstroemeria Record) - B3 Reimu",											new Set([TITLE.UFES]), { title: "UFES", }, "JLBHKsgZ9qk", "B3 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	
	
	

];	
