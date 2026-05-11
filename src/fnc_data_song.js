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
	Retro: { name: "Retro Festival", image: "XHi6YmD.jpg", shortName: "Retro Festival", abbrev: "Retro", },
	UFes: { name: "Ultra Festival", image: "Imp5ltX.jpg", shortName: "Ultra Festival", abbrev: "UFes", },
	MV: { name: "Relics and Music Videos", image: "9Bgvih5.jpg", shortName: "Relic/MV", abbrev: "Relic/MV", },
	EXFes: { name: "EX Festival", image: "8YV2A7P.jpg", shortName: "EX Festial", abbrev: "EXFes", },
	Epic: { name: "Epic", image: "eyprldJ.jpg", shortName: "Epic", abbrev: "Epic", },
	PFes: { name: "Pure Festival", image: "60c5lGk.jpg", shortName: "Pure Festival", abbrev: "PFes", },
	MM: { name: "Mastermind", image: "LohRYHX.jpg", shortName: "Mastermind", abbrev: "MM", },
	BP: { name: "Aya Pass", image: "n1inkfk.jpg", shortName: "Aya Pass", abbrev: "BP", },
	UY: { name: "Ultra Yukkuri", image: "aZAL5nF.jpg", shortName: "Ultra Yukkuri", abbrev: "UY", },
	Story: { name: "Story Theme", image: "X0DDCGf.jpg", shortName: "Story Theme", abbrev: "Story", },
	Stage: { name: "Stage Theme", image: "c3yK3I6.jpg", shortName: "Stage Theme", abbrev: "Stage", },
	Others: { name: "Others", image: "9mxFAor.jpg", shortName: "Others", abbrev: "Others", },

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
	Multiverses: { name: "Other Multiverses", titles: ["Retro", "UFes", "MV", "EXFes", "Epic", "MV", "PFes", "MM", "BP", "UY"], height: "120px", },
	Others: { name: "Others", titles: ["Story", "Stage", "Others"], height: "120px", },
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
	//unused
	["Shrine of the Wind",												new Set([TITLE.L1]), { title: "L1", }, "xv3Ed92lZ3I", "Unused track", ORIGINAL_TRACK, OTHER_THEME],
	
	//Akyuu's Untouched Score vol. 5
	["A Sacred Lot",					new Set([TITLE.L1]), { title: "L1", }, "IWcJtankEr4", "Track 1", ARRANGED_TRACK, OTHER_THEME],
	["Eternal Shrine Maiden",			new Set([TITLE.L1]), { title: "L1", }, "LmN9btd7Ttg", "Track 2", ARRANGED_TRACK, STAGE_THEME],
	["The Positive and Negative",		new Set([TITLE.L1]), { title: "L1", }, "QJYAF2SZWTk", "Track 3", ARRANGED_TRACK, BOSS_THEME],
	["Highly Responsive to Prayers",	new Set([TITLE.L1]), { title: "L1", }, "kFBldCY1PoQ", "Track 4", ARRANGED_TRACK, STAGE_THEME],
	["Eastern Tale of Fancy",			new Set([TITLE.L1]), { title: "L1", }, "-CeLvtwCMTs", "Track 5", ARRANGED_TRACK, STAGE_THEME],
	["Angel's Legend",					new Set([TITLE.L1]), { title: "L1", }, "XcvTjFo2T8I", "Track 6", ARRANGED_TRACK, BOSS_THEME],
	["Oriental Magician",				new Set([TITLE.L1]), { title: "L1", }, "HXZFV1aF3Dg", "Track 7", ARRANGED_TRACK, STAGE_THEME],
	["Small Evil-Crushing Blade",		new Set([TITLE.L1]), { title: "L1", }, "N4tgb2jUkvs", "Track 8", ARRANGED_TRACK, STAGE_THEME],
	["Magic Mirror",					new Set([TITLE.L1]), { title: "L1", }, "DGwLf4vyJU4", "Track 9", ARRANGED_TRACK, BOSS_THEME],
	["the Legend of KAGE",				new Set([TITLE.L1]), { title: "L1", }, "ORqbz5-dzNY", "Track 10", ARRANGED_TRACK, STAGE_THEME],
	["Now, Until the Moment You Die",	new Set([TITLE.L1]), { title: "L1", }, "YiN9rqnxw20", "Track 11", ARRANGED_TRACK, BOSS_THEME],
	["Civilization of Magic",			new Set([TITLE.L1]), { title: "L1", }, "7Vtd_uyO1uY", "Track 12", ARRANGED_TRACK, BOSS_THEME],
	["Angel of a Distant Star",			new Set([TITLE.L1]), { title: "L1", }, "2g91HjLQ4Q4", "Track 13", ARRANGED_TRACK, BOSS_THEME],
	["Iris",							new Set([TITLE.L1]), { title: "L1", }, "_P8674GXz6g", "Track 14", ARRANGED_TRACK, OTHER_THEME],
	["Theme of Eastern Story",			new Set([TITLE.L1]), { title: "L1", }, "qGwASZn0ZKA", "Track 15", ORIGINAL_TRACK, OTHER_THEME],
	
	//Story of Eastern Wonderland / Akyuu's Untouched Score vol. 3
	["Eastern Demon-Sealing Record ~ Pure Land Mandala",		new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "fHOF0qPwEzs", "Title Screen", ORIGINAL_TRACK, OTHER_THEME],
	["Hakurei ~ Eastern Wind",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "ytSxZnZ_A_8", "Stage 1", ORIGINAL_TRACK, STAGE_THEME],
	["She's in a temper!!",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "jsKdEV8BHn8", "Rika's theme", ORIGINAL_TRACK, BOSS_THEME],
	["End of Daylight",											new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "c8di6az9BBQ", "Stage 2", ORIGINAL_TRACK, STAGE_THEME],
	["Power of Darkness",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "h8N3XswjEuI", "Meira's theme", ORIGINAL_TRACK, BOSS_THEME],
	["World of Fantasies",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "oluGWBK8Bk8", "Stage 3", ORIGINAL_TRACK, STAGE_THEME],
	["Bet on Death",											new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "BuuUNhHRsrk", "The Five Magic Stones's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Himorogi, Burn in Violet",								new Set([TITLE.L1]), { title: "L1", }, "WNNQGCfdx4s", "Stage 4", ORIGINAL_TRACK, STAGE_THEME],
	["Himorogi, Burn in Violet",								new Set([TITLE.L1]), { title: "L1", }, "fmZOtXxJfSY", "Track 8", ARRANGED_TRACK, STAGE_THEME],
	["Love-Colored Magic",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "1cgiEa74RPs", "Marisa Kirisame's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Eastern Demon-Sealing Record ~ Spectral Boisterous Dance",new Set([TITLE.L1]), { title: "L1", }, "1AtBVx6JIb0", "Final Stage", ORIGINAL_TRACK, STAGE_THEME],
	["Eastern Demon-Sealing Record ~ Spectral Boisterous Dance",new Set([TITLE.L1]), { title: "L1", }, "iuvxZKfIMqE", "Track 10", ARRANGED_TRACK, STAGE_THEME],
	["Complete Darkness",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "glGtklFzZ2k", "Mima's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Extra Love",												new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "C5j6uIIybXA", "Extra Stage", ORIGINAL_TRACK, STAGE_THEME],
	["The Tank Girl's Dream",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "TfFd1xLMbEA", "Rika's 2nd theme", ORIGINAL_TRACK, BOSS_THEME],
	["Forest of Tono",											new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "aru3MYabfEM", "Ending", ORIGINAL_TRACK, OTHER_THEME],
	["Legendary Wonderland",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "oY64WT6ZBRo", "Staff Roll", ORIGINAL_TRACK, OTHER_THEME],
	["Hakurei Shrine Grounds",									new Set([TITLE.L1]), { title: "L1", }, "aPTxjd1l9Gk", "Track 16 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Sunfall",													new Set([TITLE.L1]), { title: "L1", }, "4vvazD9j2G8", "Track 17 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Demon-Sealing Finale",									new Set([TITLE.L1]), { title: "L1", }, "E-iw2aR-R1Y", "Track 18 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	
	//Phantasmagoria of Dim.Dream / Akyuu's Untouched Score vol. 4
	["A Dream Transcending Space-Time",			new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "OQ9Q5Kb_T1Y", "Title Screen", ORIGINAL_TRACK, OTHER_THEME],
	["Selection",								new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "_9bzLaz55tM", "Character Selection", ORIGINAL_TRACK, OTHER_THEME],
	["Eastern Mystical Love Consultation",		new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "cwPUjQmTVRY", "Reimu Hakurei's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Reincarnation",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "J8p2HGRZfII", "Mima's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Dim. Dream",								new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "BBtSp1EZdI8", "Marisa Kirisame's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Tabula rasa ~ The Empty Girl",			new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "SxpZFNYSrGI", "Ellen's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Maniacal Princess",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "3ZyjaO9p0wQ", "Kotohime's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Vanishing Dream ~ Lost Dream",			new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "vm4PvG7RGwU", "Kana Anaberal's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Visionary Game ~ Dream War",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "M8XGQF34-9A", "Rikako Asakura's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Decisive Magic Battle! ~ Fight it out!",	new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Fj-hhCHC8hM", "Round 7 CPU Battle theme", ORIGINAL_TRACK, BOSS_THEME],
	["Disunified Field Theory of Magic",		new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "mEQgIZ-enoA", "Midboss Demo theme", ORIGINAL_TRACK, BOSS_THEME],
	["Sailor of Time",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "ygB_MKgqXdg", "Chiyuri Kitashirakawa's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Love of Magical Chimes",					new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "nS_RPPbBRpk", "Yumemi Demo theme", ORIGINAL_TRACK, BOSS_THEME],
	["Strawberry Crisis!!",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "UTLqnME57vo", "Yumemi Okazaki's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Dream of Eternity",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "zbFV-h0ba_I", "Common Ending", ORIGINAL_TRACK, OTHER_THEME],
	["Eastern Blue Sky",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Cjfi0Y_grlo", "Daytime Ending", ORIGINAL_TRACK, OTHER_THEME],
	["Eternal Full Moon",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "s2DEdCtb8jo", "Nighttime Ending", ORIGINAL_TRACK, OTHER_THEME],
	["Maple Dream...",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "yBb4sr2Wrmc", "Staff Roll", ORIGINAL_TRACK, OTHER_THEME],
	["Ghostly Person's Holiday",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "jBt_eVHkoAk", "Name Registration", ORIGINAL_TRACK, OTHER_THEME],
	["Winds of Time",							new Set([TITLE.L1]), { title: "L1", }, "lEbHy9Be0Qo", "Track 22 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Starbow Dream",							new Set([TITLE.L1]), { title: "L1", }, "vtjrcQMLgC4", "Track 23 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Phantasmagoria",							new Set([TITLE.L1]), { title: "L1", }, "WPh5xHYzm40", "Track 24 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	
	//Lotus Land Story / Akyuu's Untouched Score vol. 1
	["Gensokyo ~ Lotus Land Story",						new Set([TITLE.L1]), { title: "L1", }, "udM9rb_Dc6g", "Title Screen", ORIGINAL_TRACK, OTHER_THEME],
	["Gensokyo ~ Lotus Land Story",						new Set([TITLE.L1]), { title: "L1", }, "ZI6ctU6xOlI", "Track 1", ARRANGED_TRACK, OTHER_THEME],
	["Witching Dream",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "2iVplhDGeNs", "Reimu's Stage 1", ORIGINAL_TRACK, STAGE_THEME],
	["Selene's light",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "MrjQ_l_KGiI", "Marisa's Stage 1", ORIGINAL_TRACK, STAGE_THEME],
	["Decoration Battle ~ Decoration Battle",			new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "ABiZU-VYCKo", "Orange's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Break the Sabbath",								new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "ACpj8Ggoyss", "Stage 2", ORIGINAL_TRACK, STAGE_THEME],
	["Scarlet Symphony ~ Scarlet Phoneme",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "kQqp-WqVHyA", "Kurumi's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Bad Apple!!",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "3kXx6f7qaa8", "Stage 3", ORIGINAL_TRACK, STAGE_THEME],
	["Spirit Battle ~ Perdition crisis",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "0MrCXNJDfGw", "Elly's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Alice Maestra",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "rS6JkYfgeQs", "Stage 4", ORIGINAL_TRACK, STAGE_THEME],
	["Maiden's Capriccio' ~ Capriccio",					new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "IdAyCWh0238", "Reimu's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Vessel of Stars ~ Casket of Star",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "zLzTvn4U014", "Marisa's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Lotus Love",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "7FZUFe80v7Q", "Stage 5", ORIGINAL_TRACK, STAGE_THEME],
	["Sleeping Terror ~ Sleeping Terror",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "llO4PINy2e8", "Yuuka's 1st theme", ORIGINAL_TRACK, BOSS_THEME],
	["Dream Land",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "4_vq5KOjgdw", "Final Stage", ORIGINAL_TRACK, STAGE_THEME],
	["Faint Dream ~ Inanimate Dream",					new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "C4gaWY5THh4", "Yuuka's 2nd theme", ORIGINAL_TRACK, BOSS_THEME],
	["The Inevitably Forbidden Game",					new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "LDgUA5kh8H0", "Extra Stage", ORIGINAL_TRACK, STAGE_THEME],
	["Illusion of a Maid ~ Icemilk Magic",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Fluu5GOfy68", "Mugetsu's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Cute Devil ~ Innocence",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "yaGqzG2Ydro", "Gengetsu's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Days",											new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "OFlOGKYCaUQ", "Bad Ending", ORIGINAL_TRACK, OTHER_THEME],
	["Peaceful",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "ukvQjvb2_fE", "Good Ending", ORIGINAL_TRACK, OTHER_THEME],
	["Arcadian Dream",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Eoo-W-wWHUQ", "Staff Roll", ORIGINAL_TRACK, OTHER_THEME],
	["Those Who Live in Illusions",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Cq3B3M5PoZk", "Name Registration", ORIGINAL_TRACK, OTHER_THEME],
	["Lotus Road",										new Set([TITLE.L1]), { title: "L1", }, "mQAYk7ubjdY", "Track 23 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Dreamy pilot",									new Set([TITLE.L1]), { title: "L1", }, "DFk-OMchOgg", "Track 24 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Incomplete Plot",									new Set([TITLE.L1]), { title: "L1", }, "-69Dm1GKbqo", "Track 25 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Border Land",										new Set([TITLE.L1]), { title: "L1", }, "c4n9pYstX8s", "Track 26 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Magic Shop of Raspberry",							new Set([TITLE.L1]), { title: "L1", }, "h8KP9sbei8A", "Track 27 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Crescent Dream",									new Set([TITLE.L1]), { title: "L1", }, "PpLE1aI5PYs", "Track 28 (Unused theme)", ORIGINAL_TRACK, OTHER_THEME],
	["Decoration Battle ~ Decoration Battle (Unused Version)",new Set([TITLE.L1]), { title: "L1", }, "sj3hjPeUupk", "Track 29 (Orange's theme - Unused)", ORIGINAL_TRACK, OTHER_THEME],
	["Faint Dream ~ Inanimate Dream (Unused Version)",	new Set([TITLE.L1]), { title: "L1", }, "iTOhEWM2kz8", "Track 30 (Yuuka's 2nd theme - Unused)", ORIGINAL_TRACK, OTHER_THEME],
	
	//Mystic Square / Akyuu's Untouched Score vol. 2
	["Bizarre Romantic Story ~ Mystic Square",		new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Szhq0dV-szY", "Title Screen", ORIGINAL_TRACK, OTHER_THEME],
	["Dream Express",								new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "6gYaX4HgV4g", "Stage 1", ORIGINAL_TRACK, STAGE_THEME],
	["Magic Square ~ Magic Square",					new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "uTjyoODonBE", "Sara's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Dimension of Reverie",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "wTrsAHqumyA", "Stage 2", ORIGINAL_TRACK, STAGE_THEME],
	["Spiritual Heaven ~ Spiritual Heaven",			new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "c1i4HRrgwvY", "Louise's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Romantic Children",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "8UZJbdvHKSI", "Stage 3", ORIGINAL_TRACK, STAGE_THEME],
	["Plastic Mind",								new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Xd0bJ0rrgaU", "Alice's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Maple Wise",									new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "zsNL17_LEBo", "Stage 4", ORIGINAL_TRACK, STAGE_THEME],
	["Forbidden Magic ~ Forbidden Magic",			new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "odqsxhOZlH0", "Yuki and Mai's theme", ORIGINAL_TRACK, BOSS_THEME],
	["CriL1on Maiden ~ CriL1on Dead!!",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "VPP99ERu5L1", "Yuki's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Treacherous Maiden ~ Judas Kiss",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "9--OkYd3fn0", "Mai's theme", ORIGINAL_TRACK, BOSS_THEME],
	["the Last Judgement",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "Y_2mj4M-Rmc", "Stage 5", ORIGINAL_TRACK, STAGE_THEME],
	["Doll of Misery ~ Doll of Misery",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "OHEBWZR7U4Y", "Yumeko's theme", ORIGINAL_TRACK, BOSS_THEME],
	["End of the World ~ World's End",				new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "o0nd8Q4vCB8", "Final Stage", ORIGINAL_TRACK, STAGE_THEME],
	["Legendary Illusion ~ Infinite Being",			new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "PFqakHJ7-jI", "Shinki's theme", ORIGINAL_TRACK, BOSS_THEME],
	["Alice in Wonderland",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "_ZwOGMEAbQo", "Extra Stage", ORIGINAL_TRACK, STAGE_THEME],
	["the Grimoire of Alice",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "sMlFCwOjIMQ", "Alice's 2nd theme", ORIGINAL_TRACK, BOSS_THEME],
	["Shinto Shrine",								new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "-TIdpSdWMlA", "Bad Ending", ORIGINAL_TRACK, OTHER_THEME],
	["Endless",										new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "CmXMWk8eZBo", "Good Ending 1", ORIGINAL_TRACK, OTHER_THEME],
	["Eternal Paradise",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "0SWDhjnEPu8", "Good Ending 2", ORIGINAL_TRACK, OTHER_THEME],
	["Mystic Dream",								new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "sLeMEpDDGiA", "Staff Roll", ORIGINAL_TRACK, OTHER_THEME],
	["Soul's Resting Place",						new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "N5L5XE-N3fU", "Name Registration", ORIGINAL_TRACK, OTHER_THEME],
	["Peaceful Romancer",							new Set([TITLE.L1, TITLE.L1]), { title: "L1", }, "-BZUMv5gAkk", "Extra Ending", ORIGINAL_TRACK, OTHER_THEME],
];
