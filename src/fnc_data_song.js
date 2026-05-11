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
	EOSD: { name: "EOSD Characters", image: "fZ2BDUV.jpg", shortName: "EOSD Characters", abbrev: "EOSD", },
	PCB: { name: "PCB Characters", image: "fZ2BDUV.jpg", shortName: "PCB Characters", abbrev: "PCB", },
	IN: { name: "IN Characters", image: "fZ2BDUV.jpg", shortName: "IN Characters", abbrev: "IN", },
	POFV: { name: "POFV Characters", image: "fZ2BDUV.jpg", shortName: "POFV Characters", abbrev: "POFV", },
	MOF: { name: "MOF Characters", image: "fZ2BDUV.jpg", shortName: "MOF Characters", abbrev: "MOF", },
	SA: { name: "SA Characters", image: "fZ2BDUV.jpg", shortName: "SA Characters", abbrev: "SA", },
	UFO: { name: "UFO Characters", image: "fZ2BDUV.jpg", shortName: "UFO Characters", abbrev: "UFO", },
	TD: { name: "TD Characters", image: "fZ2BDUV.jpg", shortName: "TD Characters", abbrev: "TD", },
	DDC: { name: "DDC Characters", image: "fZ2BDUV.jpg", shortName: "DDC Characters", abbrev: "DDC", },
	LOLK: { name: "LOLK Characters", image: "fZ2BDUV.jpg", shortName: "LOLK Characters", abbrev: "LOLK", },
	HSIFS: { name: "HSIFS Characters", image: "fZ2BDUV.jpg", shortName: "HSIFS Characters", abbrev: "HSIFS", },
	WBAWC: { name: "WBAWC Characters", image: "fZ2BDUV.jpg", shortName: "WBAWC Characters", abbrev: "WBAWC", },
	UM: { name: "UM Characters", image: "fZ2BDUV.jpg", shortName: "UM Characters", abbrev: "UM", },
	UDOALG: { name: "UDOALG Characters", image: "fZ2BDUV.jpg", shortName: "UDOALG Characters", abbrev: "UDOALG", },
	FW: { name: "FW Characters", image: "fZ2BDUV.jpg", shortName: "FW Characters", abbrev: "FW", },
	SPINOFFS: { name: "Spinoffs Characters", image: "fZ2BDUV.jpg", shortName: "Spinoffs Characters", abbrev: "SPINOFFS", },
	PRINTS: { name: "Print Works Characters", image: "fZ2BDUV.jpg", shortName: "Print Works Characters", abbrev: "PRINTS", },
	RETRO: { name: "Retro Festival", image: "XHi6YmD.jpg", shortName: "Retro Festival", abbrev: "Retro", },
	UFES: { name: "Ultra Festival", image: "Imp5ltX.jpg", shortName: "Ultra Festival", abbrev: "UFes", },
	MV: { name: "Relics and Music Videos", image: "9Bgvih5.jpg", shortName: "Relic/MV", abbrev: "Relic/MV", },
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
	L1: { name: "L1 Universe", titles: ["EOSD", "PCB", "IN", "POFV", "MOF", "SA", "UFO", "TD", "DDC", "LOLK", "HSIFS", "WBAWC", "UM", "UDOALG", "FW", "SPINOFFS", "PRINTS"], height: "340px", },
	Multiverses: { name: "Other Multiverses", titles: ["RETRO", "UFES", "MV", "EXFES", "EPIC", "MV", "PFES", "MM", "BP", "UY"], height: "120px", },
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
	["Fantasy Telegnosis (Hachimitsu-Lemon) - L1 Reimu",								new Set([TITLE.EOSD]), { title: "EOSD", }, "2YMWIDdTleA", "L1 Reimu", ORIGINAL_TRACK, BOSS_THEME],
	["Love-Colored Master Spark (Tokyo Active NEETs) - L1 Marisa",						new Set([TITLE.EOSD]), { title: "EOSD", }, "HcqPZr_prUE", "L1 Marisa", ORIGINAL_TRACK, BOSS_THEME],
	["Bouquet to the Ashen Duomo (Tokyo Active NEETs) - L1 Rumia",						new Set([TITLE.EOSD]), { title: "EOSD", }, "akhUOgt-73o", "L1 Rumia", ORIGINAL_TRACK, BOSS_THEME],
	["Lunate Elf (Kokyo Active NEETs) - L1 Daiyousei",		   							new Set([TITLE.EOSD]), { title: "EOSD", }, "QcfRX1rQRUM", "L1 Daiyousei", ORIGINAL_TRACK, BOSS_THEME],
	["Kohan Natsukaze Tai (Tokyo Active NEETs) - L1 Cirno",								new Set([TITLE.EOSD]), { title: "EOSD", }, "7ZNvLwWzatk", "L1 Cirno", ORIGINAL_TRACK, BOSS_THEME],
	["Sunset of Meiji 17 (Zyukucho (COOL&CREATE)) - L1 Meiling",						new Set([TITLE.EOSD]), { title: "EOSD", }, "Z6nyZQeMCF8", "L1 Meiling", ORIGINAL_TRACK, BOSS_THEME],
	["StepIllumination [Garage Refix by Musicarus] (flap+frog) - L1 Koakuma",			new Set([TITLE.EOSD]), { title: "EOSD", }, "mtL4iFh_UG8", "L1 Koakuma", ORIGINAL_TRACK, BOSS_THEME],
	["Extratrack [Musicarus Jackin' Remix] (flap+frog) - L1 Patchouli",					new Set([TITLE.EOSD]), { title: "EOSD", }, "PzbmmORoBPQ", "L1 Patchouli", ORIGINAL_TRACK, BOSS_THEME],
	["Night of Nights (BeatMario (COOL&CREATE)) - L1 Sakuya",							new Set([TITLE.EOSD]), { title: "EOSD", }, "VHj4LRjxHj0", "L1 Sakuya", ORIGINAL_TRACK, BOSS_THEME],
	["Heavenly Red (Hachimitsu-Lemon) - L1 Remilia",									new Set([TITLE.EOSD]), { title: "EOSD", }, "Q8C3NrW7Qno", "L1 Remilia", ORIGINAL_TRACK, BOSS_THEME],
	["Saishuu Kichiki Imouto Flandre-S (BeatMario (COOL&CREATE)) - L1 Flandre",			new Set([TITLE.EOSD]), { title: "EOSD", }, "JKBVhEMlTW8", "L1 Flandre", ORIGINAL_TRACK, BOSS_THEME],

	//L1 PCB
	["WHITE WIREPULLER (BeatMario (COOL&CREATE) - L1 Letty",								new Set([TITLE.PCB]), { title: "PCB", }, "PX9nLxTyKSs", "L1 Letty", ORIGINAL_TRACK, BOSS_THEME],
	["The Troublesome Black Cat's Travelogue (ShibayanRecords, O-LIFE JAPAN) - L1 Chen",	new Set([TITLE.PCB]), { title: "PCB", }, "ZdO5p9LaVn0", "L1 Chen", ORIGINAL_TRACK, BOSS_THEME],
	["Iris (Foxtail-Grass Studio) - L1 Alice",												new Set([TITLE.PCB]), { title: "PCB", }, "tzDdQaT8xQE", "L1 Alice", ORIGINAL_TRACK, BOSS_THEME],
	["Path by the Murmuring Stream (Foxtail-Grass Studio) - L1 Lily White",		   			new Set([TITLE.PCB]), { title: "PCB", }, "Fp3AgbW6C7w", "L1 Lily White", ORIGINAL_TRACK, BOSS_THEME],
	["Ghostly Band ~ Phantom Ensemble (Kokyo Active NEETs) - L1 Prismriver Sister",			new Set([TITLE.PCB]), { title: "PCB", }, "pzjW24W_o_E", "L1 Prismriver Sisters", ORIGINAL_TRACK, BOSS_THEME],
	["Unpaid Gardener (O-LIFE JAPAN) - L1 Youmu",											new Set([TITLE.PCB]), { title: "PCB", }, "aW6-FgwqMi0", "L1 Youmu", ORIGINAL_TRACK, BOSS_THEME],
	["BORDER OF STRIKE (BeatMario (COOL&CREATE)) - L1 Yuyuko",								new Set([TITLE.PCB]), { title: "PCB", }, "pdxGMoyETgY", "L1 Yuyuko", ORIGINAL_TRACK, BOSS_THEME],
	["Indigo Dance (Melodic Taste) - L1 Ran",												new Set([TITLE.PCB]), { title: "PCB", }, "pdxGMoyETgY", "L1 Ran", ORIGINAL_TRACK, BOSS_THEME],
	["Danmaku Breakdown (BeatMario (COOL&CREATE)) - L1 Yukari",								new Set([TITLE.PCB]), { title: "PCB", }, "glCWsdU0okc", "L1 Yukari", ORIGINAL_TRACK, BOSS_THEME],

	//L1 IN
	["Running Through The Firefly Wind (Foxtail-Grass Studio) - L1 Wriggle",			new Set([TITLE.IN]), { title: "IN", }, "K7H1g1jJxFU", "L1 Wriggle", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Deaf to All but the Song (O-LIFE JAPAN) - L1 Mystia",					new Set([TITLE.IN]), { title: "IN", }, "z2Ekcg-8-jQ", "L1 Mystia", ORIGINAL_TRACK, BOSS_THEME],
	["Crazy Keine (BeatMario (COOL&CREATE)) - L1 Keine",								new Set([TITLE.IN]), { title: "IN", }, "w-2qjqRPgeE", "L1 Keine", ORIGINAL_TRACK, BOSS_THEME],
	["Sunset Circus (Butaotome) - L1 Tewi",		   										new Set([TITLE.IN]), { title: "IN", }, "7urtQ8fSXRs", "L1 Tewi", ORIGINAL_TRACK, BOSS_THEME],
	["Metal-esque Lunatic Eyes (O-LIFE JAPAN) - L1 Reisen",								new Set([TITLE.IN]), { title: "IN", }, "9pvmDp6JGko", "L1 Reisen", ORIGINAL_TRACK, BOSS_THEME],
	["Galaxy in a Pot (Butaotome) - L1 Eirin",											new Set([TITLE.IN]), { title: "IN", }, "MXv8ofCK6AI", "L1 Eirin", ORIGINAL_TRACK, BOSS_THEME],
	["HELP ME ERINNNNNN!! (BeatMario (COOL&CREATE)) - L1 Kaguya",						new Set([TITLE.IN]), { title: "IN", }, "Mj4TwUQfMWQ", "L1 Kaguya", ORIGINAL_TRACK, BOSS_THEME],
	["Monpe Guardian (O-LIFE JAPAN) - L1 Mokou",										new Set([TITLE.IN]), { title: "IN", }, "mQl0nErhmzw", "L1 Mokou", ORIGINAL_TRACK, BOSS_THEME],

	//L1 POFV
	["Life of a Tengu (Tokyo Active NEETs) - L1 Aya",									new Set([TITLE.POFV]), { title: "POFV", }, "EDlLC4G5Jz4", "L1 Aya", ORIGINAL_TRACK, BOSS_THEME],
	["One More Doll (Butaotome) - L1 Medicine",											new Set([TITLE.POFV]), { title: "POFV", }, "gyMsrBIpehQ", "L1 Medicine", ORIGINAL_TRACK, BOSS_THEME],
	["Gensokyo, Past and Present (Tokyo Active NEETs) - L1 Yuuka",						new Set([TITLE.POFV]), { title: "POFV", }, "AN6SjDkfQmM", "L1 Yuuka", ORIGINAL_TRACK, BOSS_THEME],
	["Raging Sanzu River (BeatMario (COOL&CREATE)) - L1 Komachi",		   				new Set([TITLE.POFV]), { title: "POFV", }, "S_g_0XZty-g", "L1 Komachi", ORIGINAL_TRACK, BOSS_THEME],
	["Judgement Days (BeatMario (COOL&CREATE)) - L1 Eiki",								new Set([TITLE.POFV]), { title: "POFV", }, "kUcfl16ArKE", "L1 Eiki", ORIGINAL_TRACK, BOSS_THEME],
];
