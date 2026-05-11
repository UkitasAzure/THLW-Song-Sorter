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
	L1: { name: "L1 Characters", image: "fZ2BDUV.jpg", shortName: "L1 Characters", abbrev: "L1", },
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
	L1: { name: "L1 Universe", titles: ["L1"], height: "340px", },
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
	["Fantasy Telegnosis (Hachimitsu-Lemon) - Reimu",							new Set([TITLE.L1]), { title: "L1", }, "2YMWIDdTleA", "L1 Reimu", ORIGINAL_TRACK, OTHER_THEME],
	["Love-Colored Master Spark (Tokyo Active NEETs) - Marisa",					new Set([TITLE.L1]), { title: "L1", }, "HcqPZr_prUE", "L1 Marisa", ORIGINAL_TRACK, STAGE_THEME],
	["Bouquet to the Ashen Duomo (Tokyo Active NEETs) - Rumia",					new Set([TITLE.L1]), { title: "L1", }, "akhUOgt-73o", "L1 Rumia", ORIGINAL_TRACK, BOSS_THEME],
	["Lunate Elf (Kokyo Active NEETs) - Daiyousei",		   							new Set([TITLE.L1]), { title: "L1", }, "QcfRX1rQRUM", "L1 Daiyousei", ORIGINAL_TRACK, STAGE_THEME],
	["Kohan Natsukaze Tai (Tokyo Active NEETs) - Cirno",						new Set([TITLE.L1]), { title: "L1", }, "7ZNvLwWzatk", "L1 Cirno", ORIGINAL_TRACK, STAGE_THEME],
	["Sunset of Meiji 17 (Zyukucho (COOL&CREATE)) - Meiling",						new Set([TITLE.L1]), { title: "L1", }, "Z6nyZQeMCF8", "L1 Meiling", ORIGINAL_TRACK, BOSS_THEME],
	["StepIllumination [Garage Refix by Musicarus] (flap+frog) - Koakuma",		new Set([TITLE.L1]), { title: "L1", }, "mtL4iFh_UG8", "L1 Koakuma", ORIGINAL_TRACK, STAGE_THEME],
	["Extratrack [Musicarus Jackin' Remix] (flap+frog) - Patchouli",				new Set([TITLE.L1]), { title: "L1", }, "PzbmmORoBPQ", "L1 Patchouli", ORIGINAL_TRACK, BOSS_THEME],
	["Night of Nights (BeatMario (COOL&CREATE)) - Sakuya",						new Set([TITLE.L1]), { title: "L1", }, "VHj4LRjxHj0", "L1 Sakuya", ORIGINAL_TRACK, STAGE_THEME],
	["Heavenly Red (Hachimitsu-Lemon) - Remilia",									new Set([TITLE.L1]), { title: "L1", }, "Q8C3NrW7Qno", "L1 Remilia", ORIGINAL_TRACK, BOSS_THEME],
	["Saishuu Kichiki Imouto Flandre-S (BeatMario (COOL&CREATE)) - Flandre",		new Set([TITLE.L1]), { title: "L1", }, "JKBVhEMlTW8", "L1 Flandre", ORIGINAL_TRACK, STAGE_THEME],

	//L1 PCB
	["WHITE WIREPULLER (BeatMario (COOL&CREATE) - Letty",							new Set([TITLE.L1]), { title: "L1", }, "PX9nLxTyKSs", "L1 Letty", ORIGINAL_TRACK, OTHER_THEME],
	["The Troublesome Black Cat's Travelogue (ShibayanRecords, O-LIFE JAPAN) - Chen",					new Set([TITLE.L1]), { title: "L1", }, "ZdO5p9LaVn0", "L1 Chen", ORIGINAL_TRACK, STAGE_THEME],
	["Iris (Foxtail-Grass Studio) - Alice",					new Set([TITLE.L1]), { title: "L1", }, "tzDdQaT8xQE", "L1 Alice", ORIGINAL_TRACK, BOSS_THEME],
	["Path by the Murmuring Stream (Foxtail-Grass Studio) - Lily White",		   							new Set([TITLE.L1]), { title: "L1", }, "Fp3AgbW6C7w", "L1 Lily White", ORIGINAL_TRACK, STAGE_THEME],
	["Ghostly Band ~ Phantom Ensemble (Kokyo Active NEETs) - Prismriver Sister",						new Set([TITLE.L1]), { title: "L1", }, "pzjW24W_o_E", "L1 Prismriver Sisters", ORIGINAL_TRACK, STAGE_THEME],
	["Unpaid Gardener (O-LIFE JAPAN) - Youmu",						new Set([TITLE.L1]), { title: "L1", }, "aW6-FgwqMi0", "L1 Youmu", ORIGINAL_TRACK, BOSS_THEME],
	["BORDER OF STRIKE (BeatMario (COOL&CREATE)) - Yuyuko",		new Set([TITLE.L1]), { title: "L1", }, "pdxGMoyETgY", "L1 Yuyuko", ORIGINAL_TRACK, STAGE_THEME],
	["Indigo Dance (Melodic Taste) - Ran",				new Set([TITLE.L1]), { title: "L1", }, "pdxGMoyETgY", "L1 Ran", ORIGINAL_TRACK, BOSS_THEME],
	["Danmaku Breakdown (BeatMario (COOL&CREATE)) - Yukari",						new Set([TITLE.L1]), { title: "L1", }, "glCWsdU0okc", "L1 Yukari", ORIGINAL_TRACK, STAGE_THEME],

];
