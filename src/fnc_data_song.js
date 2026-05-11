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
	L1: { name: "All L1 Characters", image: "fZ2BDUV.jpg", shortName: "All L1 Characters", abbrev: "L1", },
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
	L1: { name: "Base Universe", titles: ["L1"], height: "340px", },
	MULTIVERSE: { name: "Other Multiverses", titles: ["RETRO", "UFES", "MV", "EXFES", "EPIC", "MV", "PFES", "MM", "BP", "UY"], height: "120px", },
	OTHERS: { name: "Others", titles: ["STORY", "STAGE", "OTHERS"], height: "120px", },
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
	//The Highly Responsive to Prayers
	["Fantasy Telegnosis",												new Set([TITLE.L1]), { title: "L1", }, "2YMWIDdTleA", "L1 Reimu", ORIGINAL_TRACK, OTHER_THEME],
	["Love-Colored Master Spark (Tokyo Active NEETs)",					new Set([TITLE.L1]), { title: "L1", }, "HcqPZr_prUE", "L1 Marisa", ORIGINAL_TRACK, STAGE_THEME],
	["Yin-Yang ~ The Positive and Negative",							new Set([TITLE.L1]), { title: "L1", }, "m1YijI8r4Co", "SinGyoku's theme", ORIGINAL_TRACK, BOSS_THEME],
	["A Soul Devoted to the Gods ~ Highly Responsive to Prayers",		new Set([TITLE.L1]), { title: "L1", }, "g0cYXgHbgDs", "Makai Route 6-9", ORIGINAL_TRACK, STAGE_THEME],
	["Eastern Tale of Fancy",											new Set([TITLE.L1]), { title: "L1", }, "r8rKghqP6nI", "Jigoku Route 6-9", ORIGINAL_TRACK, STAGE_THEME],
	["Angel's Legend",													new Set([TITLE.L1]), { title: "L1", }, "C1JN3_Db_UA", "YuugenMagan and Mima's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Oriental Magician",												new Set([TITLE.L1]), { title: "L1", }, "K9QNaB5tzKw", "Makai Route 11-14", ORIGINAL_TRACK, STAGE_THEME],
	["Magic Mirror (Makai ver.)",										new Set([TITLE.L1]), { title: "L1", }, "XGN6LIvvbOs", "Elis's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Small Evil-Crushing Blade",										new Set([TITLE.L1]), { title: "L1", }, "gDhx3VdG0vE", "Jigoku Route 11-14", ORIGINAL_TRACK, STAGE_THEME],
	["Magic Mirror (Jigoku ver.)",										new Set([TITLE.L1]), { title: "L1", }, "kMIQAcvue3w", "Kikuri's theme", ORIGINAL_TRACK, BOSS_THEME],
	["the Legend of KAGE",												new Set([TITLE.L1]), { title: "L1", }, "IC1BX1JGpYs", "Makai Route 16-19", ORIGINAL_TRACK, STAGE_THEME],
	["Now, Until the Moment You Die",									new Set([TITLE.L1]), { title: "L1", }, "nrQyDGtn4J4", "Sariel's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Theme of Turning to Hell",										new Set([TITLE.L1]), { title: "L1", }, "Aity5B07Lzk", "Sariel's 2nd theme", ORIGINAL_TRACK, BOSS_THEME],
	["Angel of a Distant Star ~ The \"★Alice-in-Wonderland\" Angel",	new Set([TITLE.L1]), { title: "L1", }, "kvplZDb3KWY", "Konngara's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Iris",															new Set([TITLE.L1]), { title: "L1", }, "bukPDXuwzCA", "Ending", ORIGINAL_TRACK, OTHER_THEME],
];
