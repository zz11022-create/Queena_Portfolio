(function() {
	//#region prototypes/procrastination-olympics/events.js
	const events = {
		paint: {
			name: "The Color Thief",
			brief: "Paint three parts of a town postcard. Each color disappears after you use it.",
			type: "Drawing"
		},
		shape: {
			name: "Wrong Shape Olympics",
			brief: "Build a cat from three unlikely shapes. Pick its body, head and tail.",
			type: "Drawing"
		},
		critic: {
			name: "The Worst Art Critic",
			brief: "Inspect a mysterious exhibit. Give it an outrageous interpretation and sign your review.",
			type: "Writing"
		}
	};
	const palette = [
		"#ffba66",
		"#e77a7c",
		"#a4bfe7",
		"#a6cd90",
		"#b6a1dd"
	];
	const shapes = [
		"Circle",
		"Triangle",
		"Square"
	];
	function newEntry(kind) {
		return {
			id: crypto.randomUUID(),
			kind,
			picks: [],
			review: "",
			date: (/* @__PURE__ */ new Date()).toISOString()
		};
	}
	function eventArt(entry) {
		const { kind, picks } = entry;
		const ink = "#482e23";
		let art = "";
		if (kind === "paint") {
			const colors = picks.map((i) => palette[i]);
			art = `<rect width="280" height="160" fill="${colors[0] || "#dceafa"}"/><circle cx="220" cy="40" r="20" fill="#ffdf70"/><path d="M0 121Q59 78 129 115T280 95V160H0Z" fill="${colors[1] || "#d9ddc5"}"/><path d="M85 100l45-44 45 44zm11 0h68v42H96z" fill="${colors[2] || "#f8e6d2"}" stroke="${ink}" stroke-width="4"/><path d="M123 142v-24h18v24" fill="#805b49"/>`;
		} else {
			const figure = (i, x, y, r, color) => i === 0 ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>` : i === 1 ? `<path d="M${x} ${y - r}l${r} ${r * 2}h-${2 * r}Z" fill="${color}"/>` : `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" rx="4" fill="${color}"/>`;
			const parts = kind === "critic" ? [
				1,
				0,
				2
			] : picks;
			art = `<rect width="280" height="160" fill="#fff0bd"/><g stroke="${ink}" stroke-width="4">${parts.length > 2 ? figure(parts[2], 184, 99, 20, "#b4a2d1") : ""}${parts.length ? figure(parts[0], 146, 100, 39, "#efb690") : ""}${parts.length > 1 ? figure(parts[1], 105, 69, 27, "#91c9c1") + "<path d=\"m83 51 3-20 15 17m11-1 15-17 1 25\" fill=\"#91c9c1\"/><path d=\"M92 67h4m14 0h4m-17 12q6 7 13-1\" fill=\"none\"/>" : ""}</g>`;
		}
		return `<svg class="event-art" viewBox="0 0 280 160" role="img" aria-label="${events[kind].name} artwork">${art}</svg>`;
	}
	function eventPlay(entry, esc, sceneButton) {
		const { kind, picks } = entry, event = events[kind];
		const choices = kind === "paint" ? [
			"Apricot",
			"Coral",
			"Sky",
			"Sage",
			"Lilac"
		] : shapes;
		const prompt = kind === "paint" ? [
			"Color the sky",
			"Color the hills",
			"Color the cottage"
		] : [
			"Choose a body",
			"Choose a head",
			"Choose a tail"
		];
		const work = kind === "critic" ? `<label class="field">What is this exhibit secretly about?<textarea class="input" id="critic-review" maxlength="240" placeholder="The museum calls it a cat. I suspect…">${esc(entry.review)}</textarea></label>` : picks.length < 3 ? `<h3>${prompt[picks.length]}</h3><div class="photo-options">${choices.map((c, i) => kind === "paint" && picks.includes(i) ? "" : `<button data-pick="${i}">${c}</button>`).join("")}</div>` : "<p>Your exhibit is ready for its ticket.</p>";
		return `<h2 class="ribbon-title">${event.name}</h2><div class="paper-panel"><p>${event.brief}</p>${eventArt(entry)}${work}</div>${kind === "critic" || picks.length === 3 ? sceneButton("Collect My Ticket", "collect-event") : ""}`;
	}
	//#endregion
	//#region prototypes/procrastination-olympics/photography.js
	const photoScenes = [
		{
			name: "The mayor",
			box: [
				660,
				157,
				244,
				184
			],
			ideas: [
				"An election in a box",
				"The mayor takes a nap",
				"A very small town meeting"
			]
		},
		{
			name: "Laundry day",
			box: [
				771,
				69,
				148,
				112
			],
			ideas: [
				"The socks run away",
				"A message on the line",
				"An excellent drying day"
			]
		},
		{
			name: "Sunflower",
			box: [
				1377,
				149,
				82,
				79
			],
			ideas: [
				"Too cool for sunshine",
				"A flower on holiday",
				"Who borrowed my shades?"
			]
		},
		{
			name: "The washing line",
			box: [
				702,
				73,
				204,
				83
			],
			ideas: [
				"Laundry day",
				"The missing sock",
				"A parade of colours"
			]
		},
		{
			name: "Street corner",
			box: [
				698,
				72,
				307,
				278
			],
			ideas: [
				"Just before noon",
				"The whole town waits",
				"A perfectly ordinary Tuesday"
			]
		}
	];
	const filters = {
		Original: "none",
		"B&W": "grayscale(1)",
		Retro: "sepia(.78) saturate(1.35)",
		"High contrast": "contrast(1.6)",
		Dreamy: "saturate(.67) contrast(.85) brightness(1.13)"
	};
	function printPhoto(shot) {
		const subject = photoScenes[shot.subject];
		const [x, y, w, h] = subject.box;
		const zoom = shot.close ? 1.27 : 1;
		const width = w / zoom, height = h / zoom;
		const left = x + (w - width) / 2, top = y + (h - height) / 2;
		return `<div class="film-image" role="img" aria-label="${subject.name}, ${shot.close ? "close" : "wide"} framing, ${shot.filter}" style="aspect-ratio:${w}/${h};background-size:${1536 / width * 100}% ${1024 / height * 100}%;background-position:${left / (1536 - width) * 100}% ${top / (1024 - height) * 100}%;filter:${filters[shot.filter] || "none"}"></div>`;
	}
	function photography({ data, screen, go, render, backRow, nav, sceneButton, esc, persist, toast }) {
		const draft = data.photoDraft;
		const series = data.photoSeries.find((item) => item.id === data.photoId);
		const selected = series?.shots[series.selected];
		const btn = (action, label, pressed) => `<button data-photo-action="${action}" ${pressed === void 0 ? "" : `aria-pressed="${pressed}"`}>${esc(label)}</button>`;
		const choices = (action, items, current) => `<div class="photo-options">${items.map((v, i) => btn(action + "-" + i, v, current === i)).join("")}</div>`;
		const filmstrip = (item) => `<div class="filmstrip">${item.shots.map((s, i) => `<button data-photo-action="shot-${i}" aria-label="Select photo ${i + 1}: ${photoScenes[s.subject].name}" aria-pressed="${item.selected === i}">${printPhoto(s)}<span>Print ${i + 1}</span></button>`).join("")}</div>`;
		const destinations = {
			"photo-intro": data.photoOrigin || "village",
			"photo-camera": "photo-intro",
			"photo-result": "photo-intro",
			"photo-lab": data.photoLabBack || "house",
			"photo-caption": "photo-lab",
			"photo-reflect": "photo-lab",
			"photo-story": "photo-reflect"
		};
		function page() {
			const back = backRow(destinations[screen] || "house", "Photography");
			const title = (t) => `<h2 class="ribbon-title">${t}</h2>`;
			const coach = (line) => `<div class="coach-note"><img src="assets/coach.png" alt="Coach Sloth"><p>${line}</p></div>`;
			let body = "", footer = nav("house");
			if (screen === "photo-intro") {
				body = title("The Accidental Photographer") + printPhoto({
					subject: 4,
					filter: "Original"
				}) + coach("A cat in a box. A suspicious sock. Find three ordinary things worth a second look.") + "<p class=\"scene-copy\">About 30 seconds · Choose a view, try a closer crop, and take three shots at your own pace.</p>" + sceneButton(draft ? "Resume Photo Hunt" : "Start Shooting", "photo-start");
				footer = nav("village");
			} else if (screen === "photo-camera" && draft) {
				body = title("The unusual photo hunt") + `<p class="scene-copy">Shot ${draft.shots.length + 1} of 3 · Choose your framing</p><div class="viewfinder">${printPhoto(draft)}</div>` + choices("view", photoScenes.map((s) => s.name), draft.subject) + choices("zoom", ["Wide shot", "Close-up"], Number(draft.close));
				footer = `<div class="game-actions">${sceneButton("Take Photo", "photo-shutter")}</div>`;
			} else if (series && selected) {
				if (screen === "photo-result") body = title("Three shots captured!") + filmstrip(series) + printPhoto(selected) + coach("Three views of one little street. Let’s see what develops.") + sceneButton("Take Them to the Darkroom", "photo-lab-open");
				else if (screen === "photo-lab") body = title("Coach’s Darkroom") + filmstrip(series) + `<figure class="photo-print">${printPhoto(selected)}<figcaption>${esc(selected.title || photoScenes[selected.subject].name)}</figcaption></figure>` + choices("filter", Object.keys(filters), Object.keys(filters).indexOf(selected.filter)) + sceneButton("Title & Caption", "photo-caption") + sceneButton("Reflect on This Series", "photo-reflect", true) + (series.story ? sceneButton("Continue Photo Story", "photo-story", true) : "");
				else if (screen === "photo-caption") body = title("Give this photo a story") + filmstrip(series) + printPhoto(selected) + `<div class="paper-panel"><label class="field">Photo title<input class="input" data-photo-field="title" maxlength="60" value="${esc(selected.title)}"></label><p>What’s happening here?</p>${choices("idea", photoScenes[selected.subject].ideas, -1)}<label class="field">Caption<textarea data-photo-field="caption" maxlength="160">${esc(selected.caption)}</textarea></label></div>` + sceneButton("Save to My Gallery", "photo-reflect");
				else if (screen === "photo-reflect") {
					const options = [
						"Finding a frame",
						"Trying filters",
						"Imagining a story"
					];
					body = title("What did you enjoy?") + printPhoto(selected) + choices("enjoy", options, options.indexOf(series.reflection)) + sceneButton(series.reflection === options[0] ? "Shoot Another Series" : series.reflection === options[1] ? "Experiment in the Darkroom" : "Explore Writing", "photo-next") + sceneButton("Keep My Series in Passport", "photo-passport", true);
				} else if (screen === "photo-story") body = title("Story Factory") + filmstrip(series) + printPhoto(selected) + `<div class="story-paper"><p class="scene-copy">${esc(selected.caption || selected.title || photoScenes[selected.subject].name)} · What happened after the shutter clicked?</p><label class="field">Your short photo story<textarea data-photo-field="story" maxlength="900">${esc(series.story)}</textarea></label></div>` + sceneButton("Save Story to Passport", "photo-passport");
			}
			return {
				html: back + "<section class=\"photo-page " + screen + "\">" + body + "</section>",
				footer
			};
		}
		function action(key) {
			if (key === "photo-start") {
				data.photoDraft ??= {
					subject: 0,
					close: false,
					filter: "Original",
					shots: []
				};
				persist();
				go("photo-camera");
				return;
			}
			if (key === "photo-shutter" && draft) {
				draft.shots.push({
					subject: draft.subject,
					close: draft.close,
					filter: "Original",
					title: "",
					caption: ""
				});
				if (draft.shots.length === 3) {
					const id = crypto.randomUUID();
					data.photoSeries.push({
						id,
						shots: draft.shots,
						selected: 0,
						reflection: "",
						story: ""
					});
					data.photoId = id;
					data.photoDraft = null;
					persist();
					go("photo-result");
				} else {
					draft.subject = (draft.subject + 1) % photoScenes.length;
					persist();
					render();
					toast("Photo captured. Choose your next frame.");
				}
				return;
			}
			if (key === "photo-next") {
				go(series.reflection === "Finding a frame" ? "photo-intro" : series.reflection === "Trying filters" ? "photo-lab" : "photo-story");
				return;
			}
			if (key === "photo-lab-open") {
				data.photoLabBack = "photo-result";
				go("photo-lab");
				return;
			}
			const [kind, index] = key.split("-");
			const i = Number(index);
			if (kind === "view") draft.subject = i;
			else if (kind === "zoom") draft.close = Boolean(i);
			else if (kind === "shot") series.selected = i;
			else if (kind === "filter") selected.filter = Object.keys(filters)[i];
			else if (kind === "idea") selected.caption = photoScenes[selected.subject].ideas[i];
			else if (kind === "enjoy") series.reflection = [
				"Finding a frame",
				"Trying filters",
				"Imagining a story"
			][i];
			else return;
			persist();
			render();
		}
		return {
			page,
			action
		};
	}
	//#endregion
	//#region prototypes/procrastination-olympics/app.js
	const $ = (s) => document.querySelector(s), app = $("#app");
	const KEY = "sloth-olympics-v1";
	const defaults = () => ({
		onboarded: false,
		interest: "Drawing",
		timer: true,
		sound: false,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		artifacts: [],
		eventEntries: [],
		photoSeries: [],
		notebook: [],
		writingDraft: "",
		photoDraft: null,
		draft: null
	});
	let data = defaults(), storageOK = true;
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) || "null");
		if (raw && Array.isArray(raw.artifacts)) data = {
			...data,
			...raw
		};
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {
		storageOK = false;
	}
	let screen = data.onboarded ? "village" : "welcome", activeId = data.activeId || data.artifacts.at(-1)?.id, category = "Body", game = null, clock = null, paused = false, modalOpen = false, toastTimer, reflection = "", returnScreen = "village";
	const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;"
	})[c]);
	function persist() {
		try {
			localStorage.setItem(KEY, JSON.stringify(data));
			storageOK = true;
			return true;
		} catch {
			storageOK = false;
			return false;
		}
	}
	function toast(t) {
		$("#toast").textContent = t;
		$("#toast").classList.add("visible");
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3e3);
	}
	function sound() {
		if (!data.sound) return;
		try {
			const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain();
			o.connect(g);
			g.connect(c.destination);
			o.frequency.setValueAtTime(380, c.currentTime);
			o.frequency.exponentialRampToValueAtTime(640, c.currentTime + .1);
			g.gain.setValueAtTime(.04, c.currentTime);
			g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .15);
			o.start();
			o.stop(c.currentTime + .16);
			o.onended = () => c.close();
		} catch {}
	}
	const illustratedParts = {
		Eyes: [
			"blue-eye",
			"gold-eye",
			"green-eye",
			"sleepy-eye"
		],
		Hats: [
			"top-hat",
			"cap",
			"sailor",
			"beanie"
		],
		Horns: [
			"horn",
			"antlers",
			"ram",
			"shell"
		],
		Limbs: [
			"shoes",
			"bird",
			"paws",
			"tentacles"
		],
		Tail: [
			"fish",
			"cloud",
			"dragon",
			"worm"
		],
		Bows: [
			"blue-bow",
			"spot-bow",
			"yellow-bow",
			"tie"
		],
		Props: [
			"glasses",
			"propeller",
			"wand",
			"potion",
			"duck"
		]
	};
	function sprite(name, x, y, width, height) {
		return `<image href="assets/parts/${name}.png" x="${x}" y="${y}" width="${width}" height="${height}" />`;
	}
	const blank = () => ({
		body: 0,
		eyes: 0,
		mouth: 0,
		limbs: 0,
		tail: 0,
		accessory: 0,
		horns: 0,
		bow: 0,
		color: "#eeabc0"
	});
	function monster(p = {}, alive = false, part = null) {
		p = {
			...blank(),
			...p
		};
		let body = [
			`<path d="M93 77 Q59 70 55 132 Q43 193 91 204 Q158 229 193 187 Q222 145 190 100 Q160 64 93 77Z"/>`,
			`<path d="M76 88 Q57 67 83 63 Q96 43 116 62 Q138 42 151 62 Q178 51 184 75 Q213 73 205 99 Q232 112 211 130 Q232 151 208 167 Q213 193 186 195 Q176 222 153 210 Q129 231 111 210 Q83 223 76 199 Q47 200 53 174 Q29 153 52 135 Q33 109 59 104 Q50 82 76 88Z"/>`,
			`<path d="M85 69 Q127 38 168 76 L205 165 Q222 204 178 208 L76 207 Q36 205 51 167Z"/>`
		][p.body % 3];
		let eyes = [
			`<ellipse cx="108" cy="119" rx="22" ry="26"/><ellipse cx="155" cy="116" rx="22" ry="26"/><circle cx="113" cy="123" r="8" fill="#30271f"/><circle cx="151" cy="120" r="8" fill="#30271f"/>`,
			`<ellipse cx="132" cy="118" rx="34" ry="32"/><circle cx="138" cy="124" r="14" fill="#30271f"/><circle cx="142" cy="119" r="4" stroke="none"/>`,
			`<ellipse cx="107" cy="115" rx="23" ry="25"/><ellipse cx="156" cy="112" rx="23" ry="25"/><path d="M86 109 L128 119 M136 117 L177 106" fill="none"/><circle cx="109" cy="124" r="5" fill="#30271f"/><circle cx="156" cy="123" r="5" fill="#30271f"/>`,
			`<circle cx="100" cy="111" r="19"/><circle cx="143" cy="102" r="20"/><circle cx="173" cy="130" r="17"/><circle cx="103" cy="113" r="6" fill="#30271f"/><circle cx="141" cy="105" r="6" fill="#30271f"/><circle cx="173" cy="132" r="5" fill="#30271f"/>`,
			`<path d="M87 116 Q105 98 124 117 M139 116 Q156 98 175 117" fill="none"/>`
		][p.eyes % 5];
		let mouths = [
			`<path d="M111 158 Q132 177 157 155" fill="none"/>`,
			`<path d="M104 151 Q132 159 162 148 Q160 189 135 190 Q113 189 104 151Z" fill="#30271f"/><path d="M115 155 L117 167 L129 167 L130 157 M138 156 L139 166 L150 164 L152 153" fill="#fff9e9" stroke-width="2"/><path d="M123 183 Q139 167 153 179 Q143 193 123 183" fill="#eb94a3" stroke="none"/>`,
			`<ellipse cx="135" cy="166" rx="13" ry="19" fill="#30271f"/>`,
			`<path d="M107 164 L120 155 L133 167 L146 155 L159 161" fill="none"/>`
		][p.mouth % 4];
		let limbs = [
			`<path d="M62 137 Q30 126 32 151 M192 139 Q225 130 227 155 M97 202 L94 223 L79 224 M165 202 L170 223 L185 224"/>`,
			`<path d="M65 139 Q25 152 35 110 L26 101 M197 138 Q235 123 220 98 L231 92 M98 202 L87 225 L68 225 M161 203 L176 225 L194 222"/>`,
			`<path d="M62 134 L28 149 L44 165 M195 133 L224 153 L210 168 M92 202 L82 218 L100 226 M158 204 L165 221 L146 230"/>`,
			`<path d="M60 135 Q11 99 33 80 M196 132 Q247 101 224 78 M84 201 Q57 240 95 227 M164 204 Q195 239 204 208"/>`
		][p.limbs % 4];
		let tail = p.tail ? `<path d="M185 172 Q248 207 235 151 Q226 130 218 147" fill="none" stroke="${p.color}" stroke-width="16"/><path d="M185 172 Q248 207 235 151 Q226 130 218 147" fill="none" stroke-width="3"/>` : "";
		let hornArt = [
			"",
			`<path d="M108 70L95 11L132 66Z" fill="#ffdf58"/><path d="M102 33L111 29M106 48L119 44" fill="none"/>`,
			`<path d="M80 83Q31 59 52 33Q62 22 69 35Q50 50 93 65M173 78Q222 53 201 29Q188 20 183 34Q205 45 164 63" fill="#ffc98b"/>`
		][p.horns % 3];
		let bowArt = [
			"",
			`<path d="M127 191Q92 164 101 206Q116 212 127 198Q155 220 161 196Q162 173 136 190Z" fill="#6989de"/><circle cx="131" cy="194" r="7" fill="#a8bbff"/>`,
			`<path d="M127 191Q92 164 101 206Q116 212 127 198Q155 220 161 196Q162 173 136 190Z" fill="#f17c82"/><circle cx="131" cy="194" r="7" fill="#fff4dd"/>`,
			`<path d="M127 191Q92 164 101 206Q116 212 127 198Q155 220 161 196Q162 173 136 190Z" fill="#f5cf55"/><circle cx="131" cy="194" r="7" fill="#fff4dd"/>`
		][p.bow % 4];
		let accessories = [
			"",
			`<path d="M100 76 L109 42 L151 40 L165 74Z" fill="#efb7c8"/><path d="M88 76 Q134 66 178 75" fill="none"/><path d="M108 58 L156 56"/>`,
			`<path d="M95 64 L97 35 L117 50 L133 27 L146 48 L167 32 L164 65Z" fill="#f6cf5c"/>`,
			`<path d="M115 190 L96 179 L96 205 L117 196 L135 205 L136 178Z" fill="#ef684d"/><circle cx="117" cy="192" r="6" fill="#f6cf5c"/>`,
			`<path d="M111 73 Q92 36 122 26 Q149 34 138 72" fill="#b5a0d7"/><circle cx="125" cy="35" r="8" fill="#f6cf5c"/>`
		][p.accessory % 5];
		if (p.body === 1) body = `<path d="M55 108Q43 99 53 90Q56 86 63 89Q58 75 70 72Q74 65 84 72Q81 57 95 58Q101 49 111 58Q120 44 131 54Q140 44 151 54Q164 49 169 61Q184 52 188 66Q201 62 201 78Q215 79 210 92Q225 96 217 109Q230 117 219 128Q230 141 218 149Q228 164 214 171Q220 185 206 188Q208 204 194 202Q183 216 171 208Q163 221 151 213Q137 224 125 215Q111 226 101 215Q84 222 78 209Q62 215 61 201Q48 204 47 190Q31 188 40 175Q24 169 34 157Q23 147 36 137Q22 126 37 119Q33 109 45 104Z"/><g stroke="none" fill="#9e5852" opacity=".48"><circle cx="74" cy="96" r="2"/><circle cx="79" cy="90" r="1.3"/><circle cx="172" cy="78" r="2"/><circle cx="178" cy="81" r="1.4"/><circle cx="193" cy="163" r="1.8"/><circle cx="188" cy="169" r="1.3"/><circle cx="57" cy="166" r="1.3"/></g><path d="M59 84q3-5 9-5m31-14q4-4 8-2m55 2q6-3 10 1" fill="none" stroke="#fff5e8" stroke-width="3" opacity=".8"/>`;
		const selectedSprite = (cat) => illustratedParts[cat]?.[p[map[cat]] - spriteStarts[cat]];
		const equipped = (cat, x, y, w, h) => selectedSprite(cat) ? sprite(selectedSprite(cat), x, y, w, h) : "";
		if (selectedSprite("Eyes")) eyes = equipped("Eyes", 81, 100, 45, 43) + equipped("Eyes", 134, 91, 46, 44);
		if (selectedSprite("Bows")) bowArt = equipped("Bows", 106, 175, 56, 38);
		if (selectedSprite("Tail")) tail = equipped("Tail", 181, 112, 77, 79);
		if (selectedSprite("Horns")) hornArt = equipped("Horns", 56, 17, 72, 75);
		if (selectedSprite("Limbs")) limbs = equipped("Limbs", 79, 195, 108, 46);
		accessories += equipped("Hats", 121, 22, 76, 55) + equipped("Props", 173, 117, 60, 53);
		if (part) {
			const artwork = {
				Body: `<g fill="${p.color}">${body}</g>`,
				Eyes: `<g fill="#fff9e9">${eyes}</g>`,
				Mouth: mouths,
				Limbs: `<g fill="none">${limbs}</g>`,
				Tail: tail,
				Horns: hornArt,
				Bows: bowArt,
				Extras: accessories
			};
			return `<svg class="part-glyph" viewBox="${{
				Body: "22 38 210 198",
				Eyes: "78 78 117 77",
				Mouth: "94 142 76 54",
				Limbs: "6 32 248 211",
				Tail: "172 129 84 86",
				Horns: "25 3 201 91",
				Bows: "90 163 82 58",
				Extras: "54 0 153 105"
			}[part]}" aria-hidden="true"><g stroke="#30271f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${artwork[part]}</g></svg>`;
		}
		return `<svg class="monster ${alive ? "alive" : ""}" viewBox="0 0 265 250" role="img" aria-label="Your custom creature"><g stroke="#30271f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${tail}<g fill="none">${limbs}</g><g class="body" fill="${p.color}">${body}</g>${hornArt}<g fill="#fff9e9">${eyes}</g>${mouths}<ellipse cx="83" cy="146" rx="11" ry="8" fill="#ff927e" stroke="none"/><ellipse cx="182" cy="144" rx="11" ry="6" fill="#eeabc0" stroke="none"/>${accessories}${bowArt}</g></svg>`;
	}
	const btn = (label, action, cls = "primary") => `<button class="${cls}" data-action="${action}"><span>${label}</span><span aria-hidden="true">↗</span></button>`;
	const coach = (text) => `<div class="coach-note"><img src="assets/coach.png" alt="Coach Sloth"><p>${text}</p></div>`;
	function head(title = "", back = "") {
		return `<header class="app-head">${back ? `<button class="icon-btn" data-action="${back}" aria-label="Back">←</button>` : ""}<div class="${title ? "eyebrow" : "brand"}">${title || "procrastination<br><em>olympics.</em>"}</div></header>`;
	}
	function nav(active) {
		return `<nav class="bottom-nav" aria-label="Main navigation">${[
			["village", "Play"],
			["house", "Explore"],
			["passport", "Passport"]
		].map(([key, label]) => `<button class="${active === key ? "active" : ""}" data-action="${key}" ${active === key ? "aria-current=\"page\"" : ""}><span class="nav-icon">${navArt[key]}</span>${label}</button>`).join("")}</nav>`;
	}
	const artifact = () => data.artifacts.find((a) => a.id === activeId) || data.artifacts.at(-1);
	const entryScreens = {
		briefing: "village",
		story: "house"
	};
	function go(s) {
		if (Object.hasOwn(entryScreens, s) && screen !== s && screen !== "settings") entryScreens[s] = screen;
		if (screen === "arena" && s !== "arena" && game) {
			pauseClock();
			data.draft = game;
			persist();
		}
		if ([
			"gallery",
			"story",
			"personality",
			"reflect",
			"detour"
		].includes(s) && artifact()) {
			data.lastRoom = {
				screen: s,
				id: artifact().id
			};
			persist();
		}
		screen = s;
		modalOpen = false;
		render();
	}
	let passportTab = "creations", libraryFilter = "All";
	const crop = (name, x, y, w, h, fullW = 941, alt = "") => `<div class="scene-crop" style="aspect-ratio:${w}/${h}"><img src="assets/screens/${name}.png" alt="${alt}" style="width:${fullW / w * 100}%;left:${-x / w * 100}%;top:${-y / h * 100}%" draggable="false"></div>`;
	const toolsHeader = (back = "", painted = "") => `<div class="scene-tools ${painted ? "painted-tools painted-" + painted : ""}">${back ? `<button data-action="${back}" aria-label="Back">←</button>` : ""}<button class="settings-tool" data-action="settings" aria-label="Settings">⚙</button></div>`;
	const backRow = (target, label) => `<div class="page-controls"><button aria-label="Back" data-action="${target}">←</button><span>${label}</span></div>`;
	const pictureHeader = (name, height = 300, back = "village") => `${back && name !== "briefing" ? backRow(back, back === "passport" ? "Passport" : "Gallery") : ""}<header class="scene-header header-${name}">${crop(name, 0, 0, 941, height, 941, "Procrastination Olympics — " + name)}${name === "briefing" ? `<div class="scene-tools painted-tools"><button data-action="${back}" aria-label="Back">←</button></div>` : !back && ["welcome", "passport"].includes(name) ? toolsHeader() : ""}</header>`;
	const sceneButton = (label, action, secondary = false) => `<button class="scene-button ${secondary ? "secondary-scene" : ""}" data-action="${action}"><span>${label}</span>${secondary ? "" : "<span class=\"play-disc\" aria-hidden=\"true\">▶</span>"}</button>`;
	const navArt = {
		village: `<svg viewBox="0 0 50 42" aria-hidden="true"><path d="M12 7Q25 2 38 7L47 29Q49 38 40 37L32 29H18L10 37Q1 39 3 28Z" fill="#fc756a" stroke="#492a16" stroke-width="3"/><path d="M15 13v13M9 19h13" stroke="#fff9e8" stroke-width="5"/><circle cx="34" cy="15" r="3" fill="#ffe46a" stroke="#492a16" stroke-width="1.5"/><circle cx="40" cy="22" r="3" fill="#bfe2ef" stroke="#492a16" stroke-width="1.5"/></svg>`,
		house: `<svg viewBox="0 0 50 42" aria-hidden="true"><path d="M8 10L14 4H21L23 25H3Z M29 4H36L43 10L47 25H27Z" fill="#b7a4bb" stroke="#492a16" stroke-width="3"/><path d="M21 14H29" stroke="#492a16" stroke-width="5"/><circle cx="13" cy="27" r="12" fill="#96c9f0" stroke="#492a16" stroke-width="3"/><circle cx="37" cy="27" r="12" fill="#96c9f0" stroke="#492a16" stroke-width="3"/><path d="M8 23L15 19M32 23L39 19" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>`,
		passport: `<svg viewBox="0 0 50 42" aria-hidden="true"><path d="M10 3H38L42 7V39H12L8 35V7Z" fill="#c95f64" stroke="#492a16" stroke-width="3"/><path d="M13 7H36V34H13Z" fill="none" stroke="#efb472" stroke-width="2"/><path d="M18 16L21 19L25 13L29 19L32 16L30 25H20Z" fill="#ffe05c"/><path d="M18 29H32" stroke="#ffe05c" stroke-width="2"/></svg>`
	};
	let renderedScreen;
	function storyCue(a) {
		const detail = a.personality || {};
		const prompts = {
			"Stealing 42 pounds of cheese": "Where could anyone hide 42 pounds of cheese?",
			"Attempting to sell the moon": "Who showed up to buy the moon?",
			"Illegally collecting socks": "What happened when the socks found their way home?"
		};
		if (detail.crime) return prompts[detail.crime] || "Who found out, and what happened next?";
		if (detail.ambition) return "What was the first thing your creature tried to make that wish come true?";
		return "One day, your creature opened a door. What was on the other side?";
	}
	function keepStoryDraft() {
		const field = document.querySelector("#story");
		if (field && artifact()) {
			artifact().storyDraft = field.value;
			persist();
		}
	}
	app.addEventListener("input", (event) => {
		if (event.target.id === "room-draft") {
			data.writingDraft = event.target.value;
			persist();
		}
		if (event.target.id === "critic-review" && eventDraft) eventDraft.review = event.target.value;
		if (event.target.id === "story") keepStoryDraft();
		const field = event.target.dataset.photoField;
		if (field) {
			const series = data.photoSeries.find((item) => item.id === data.photoId);
			if (field === "story") series.story = event.target.value;
			else series.shots[series.selected][field] = event.target.value;
			persist();
		}
	});
	function photoTrack() {
		return photography({
			data,
			screen,
			go,
			render,
			backRow,
			nav,
			sceneButton,
			esc,
			persist,
			toast
		});
	}
	function openPhotography(origin, lab = false) {
		data.photoOrigin = origin;
		data.photoLabBack = origin;
		if (!data.photoId) data.photoId = data.photoSeries.at(-1)?.id;
		persist();
		go(lab && data.photoId ? "photo-lab" : "photo-intro");
	}
	let eventDraft = null, recentEntryId = null;
	function passportSpread() {
		const creature = artifact();
		const photo = data.photoSeries.at(-1);
		const exhibit = data.eventEntries.at(-1);
		const portrait = creature ? monster(creature.parts) : photo ? printPhoto(photo.shots[photo.selected]) : exhibit ? eventArt(exhibit) : "<img src=\"assets/coach.png\" alt=\"Coach Sloth\">";
		const name = creature?.name || photo && "Street series" || exhibit && events[exhibit.kind].name || "Explorer in residence";
		const interest = creature?.originalInterest || photo && "Photography" || exhibit && events[exhibit.kind].type || data.interest;
		const record = creature ? "data-record=\"" + esc(creature.id) + "\"" : photo ? "data-photo-id=\"" + esc(photo.id) + "\"" : exhibit ? "data-exhibit=\"" + esc(exhibit.id) + "\"" : "data-action=\"village\"";
		const stops = [[interest, interest === "Photography" ? 414 : interest === "Writing" ? 257 : 75]];
		if (creature?.personality?.crime) stops.push(["Interview", 581]);
		if (creature?.story || !creature && photo?.story) stops.push(["Storytelling", 744]);
		const collected = Boolean(creature || photo || exhibit);
		const awards = [
			[
				collected,
				220,
				"First creation"
			],
			[
				Boolean(creature?.reflection && creature.reflection !== "Nothing in particular" || photo?.reflection),
				456,
				"Creative spark"
			],
			[
				Boolean(creature?.story || photo?.story),
				578,
				"Story explorer"
			]
		];
		return `<section class="folio"><div class="folio-id"><div class="folio-photo">${portrait}</div><div><small>CREATIVE PASSPORT</small><h2>${esc(name)}</h2><p>${esc(interest)} expedition</p><button class="text-button" ${record}>${collected ? "Open record" : "Start exploring"} →</button></div></div>
  <div class="folio-map"><h3>My expedition route</h3><div>${stops.map(([label, x]) => `<span>${crop("passport", x, 975, 100, 65)}${esc(label)}</span>`).join("<b aria-hidden=\"true\">→</b>")}</div></div>
  <div class="folio-post"><h3>Stamp album</h3><div>${awards.map(([earned, x, label]) => `<figure class="${earned ? "earned" : "unearned"}">${crop("passport", x, 1324, 111, 111)}<figcaption>${earned ? "✓ " : ""}${label}</figcaption></figure>`).join("")}</div></div></section>`;
	}
	function render() {
		const sameScreen = renderedScreen === screen;
		const focusKeys = [
			"photoAction",
			"sceneInterest",
			"libraryFilter",
			"passportTab",
			"reflection",
			"category",
			"part",
			"frame",
			"color"
		];
		const oldFocus = document.activeElement;
		const focusKey = sameScreen && focusKeys.find((key) => oldFocus?.dataset[key] !== void 0);
		const scrollTop = sameScreen ? app.querySelector(".screen")?.scrollTop || 0 : 0;
		const tabsLeft = sameScreen ? app.querySelector(".part-tabs")?.scrollLeft || 0 : 0;
		renderedScreen = screen;
		document.body.classList.toggle("large-type", Boolean(data.largeType));
		document.body.classList.toggle("reduced", data.reduced);
		let html = "", n = "", cls = "scene-page";
		if ([
			"welcome",
			"interests",
			"village"
		].includes(screen)) {
			n = nav("village");
			html = pictureHeader("welcome", 755, "") + `${data.draft ? "<button class=\"resume-banner\" data-action=\"resume\">↶ Your creature is waiting. Resume the chaos!</button>" : ""}<h2 class="ribbon-title">What would you like to make?</h2><div class="interest-grid">${[
				[
					"Drawing",
					38,
					968,
					250,
					202
				],
				[
					"Writing",
					350,
					969,
					242,
					196
				],
				[
					"Photography",
					646,
					969,
					253,
					204
				]
			].map(([name, x, y, w, h]) => `<button class="interest-tile ${data.interest === name ? "selected" : ""}" data-scene-interest="${name}" aria-label="${name}: ${name === "Drawing" ? "build a creature" : name === "Writing" ? "tell its story" : "shoot a series"}" aria-pressed="${data.interest === name}"><strong>${name}</strong>${crop("welcome", x, y, w, h)}<small>${name === "Drawing" ? "Build a creature" : name === "Writing" ? "Tell its story" : "Shoot a series"}</small>${data.interest === name ? "<span class=\"selection-mark\" aria-hidden=\"true\">✓</span>" : ""}</button>`).join("")}</div><p class="interest-caption">${data.interest === "Writing" ? artifact() ? "Write a tiny adventure for your creature." : "First make your main character, then write its adventure." : data.interest === "Photography" ? "Take three shots, develop your prints, and tell their story." : "Make a monster, then see what story it sparks."}</p>${sceneButton(data.interest === "Writing" ? artifact() ? "Open Story Factory" : "Make My Main Character" : data.interest === "Photography" ? "Start Photo Hunt" : "Build My Creature", "lets-go")}${sceneButton("⚄ Surprise Me", "surprise", true)}<button class="text-button" style="display:block;margin:auto" data-action="collection">Browse the game collection →</button>`;
		}
		if (events[screen] && eventDraft) {
			html = backRow("collection", "Game Collection") + eventPlay(eventDraft, esc, sceneButton);
			n = nav("village");
		}
		if (screen === "event-ticket" || screen === "event-record") {
			const e = data.eventEntries.find((item) => item.id === recentEntryId);
			html = backRow(screen === "event-ticket" ? "collection" : "passport", screen === "event-ticket" ? "Game Collection" : "Passport") + `<h2 class="ribbon-title">${screen === "event-ticket" ? "Official Discovery Ticket" : "Exhibit Record"}</h2><div class="paper-panel">${eventArt(e)}<h3>${events[e.kind].name}</h3><p>${esc(e.review || "A little experiment in shapes and colors.")}</p></div>` + sceneButton("Open the Gallery", "gallery") + sceneButton("View My Collection", "passport-events", true);
			n = nav(screen === "event-ticket" ? "village" : "passport");
		}
		if (screen === "briefing") html = pictureHeader("briefing", 610, entryScreens.briefing) + `<div class="coach-note"><img src="assets/coach.png" alt="Coach Sloth"><p>Some spare parts. One unreliable factory.<br><b>Build any creature you like!</b></p></div>${crop("briefing", 0, 934, 941, 369, 941, "How to play: tap or drag parts onto your creature, watch for a factory malfunction, then finish your creation.")}<label class="timer-setting"><span>◷ Estimated time: <b>~30 sec</b><small>Turn off the clock to take your time.</small></span><input id="timer-toggle" type="checkbox" ${data.timer ? "checked" : ""}></label>${sceneButton("Start Game", "start")}${sceneButton("⚄ Practice Round", "practice", true)}<p class="tiny-note">Practice at your own pace.</p>`;
		if (screen === "arena") {
			html = arenaHTML();
			cls = "illustrated-game";
			n = game.pendingTwist ? "" : `<div class="game-actions"><button class="icon-btn" data-action="pause" aria-label="Pause round">Ⅱ</button><button class="bench-action" data-action="hint" ${(game.hints || 0) >= 3 ? "disabled" : ""}>Hints (${3 - (game.hints || 0)})</button><button class="bench-action" data-action="shuffle" ${game.shuffled ? "disabled" : ""}>Shuffle (${game.shuffled ? 0 : 1})</button>${sceneButton("Done!", "finish")}</div>`;
		}
		if (screen === "reveal") {
			const creation = artifact();
			html = `<section class="award-scene" aria-label="Game result">
   <img class="award-plate" src="assets/screens/award-scene.jpg" alt="Coach Sloth cheers beside the medal podium. Your discovery ticket admits your creature to Coach’s Questionable Gallery.">
   <div class="winning-creature">${monster(creation.parts, true)}</div>
   <div class="ticket-creature" aria-hidden="true">${monster(creation.parts)}</div>
   <button class="award-link to-gallery" data-action="gallery" aria-label="Take It to the Gallery"></button>
   <button class="award-link to-replay" data-action="briefing" aria-label="Play Again"></button>
 </section>${!storageOK ? "<p class=\"tiny-note\">Kept for this visit only.</p>" : ""}
 ${data.interest === "Writing" ? sceneButton("Write Its Story", "story", true) : ""}`;
		}
		if (screen === "house") {
			n = nav("house");
			html = `<div class="room-map">${crop("rooms", 530, 23, 478, 888, 1536, "Coach’s illustrated house: Gallery, Story Factory, and Darkroom")}<button class="house-back" data-action="village" aria-label="Back to Play"></button><button class="room-hotspot gallery-door" data-action="gallery" aria-label="Enter the Gallery"></button><button class="room-hotspot story-door" data-action="writing-room" aria-label="Enter the Story Factory"></button><button class="room-hotspot photo-door" data-action="photography-info" aria-label="Enter the Photography Darkroom"></button><p class="room-caption">Tap a room. Take a little detour.</p></div>`;
		}
		if (screen === "gallery") {
			n = nav("house");
			const a = artifact();
			html = backRow("house", "Explore") + `<div class="art-gallery">${crop("gallery", 0, 0, 941, 1024)}<button class="live-exhibit ${a ? "" : "empty-art"}" data-mat="${a?.frame || "gold"}" data-action="pet" aria-label="Interact with your creature">${a ? monster(a.parts, true) : "Your next<br>masterpiece<br>goes here."}</button><div class="live-label">${a ? esc(a.name) : "Exhibit A: a blank space"}</div></div><div class="gallery-actions"><button class="gallery-action" data-action="hang"><span>▧</span>Hang It</button><button class="gallery-action" data-action="name-it"><span>✎</span>Name It</button><button class="gallery-action" data-action="life"><span>♡</span>Give It<br>a Life</button><button class="gallery-action" data-action="remix-it"><span>↝</span>Remix It</button></div>${a ? `<div class="art-detail"><div class="frame-picker"><span>Try a frame:</span>${[
				"gold",
				"purple",
				"pink"
			].map((c) => `<button class="${(a.frame || "gold") === c ? "selected" : ""}" style="background:${{
				gold: "var(--yellow)",
				purple: "var(--purple)",
				pink: "#f2bbca"
			}[c]}" aria-pressed="${a.frame === c}" data-frame="${c}">${c}</button>`).join("")}</div>${a.story ? `<div class="paper-panel" style="margin:10px 0"><h3>A very tiny tale</h3><p>${esc(a.story)}</p><button class="text-button" data-action="story">Edit the story →</button></div>` : ""}</div>${sceneButton("What did you discover?", "reflect", true)}${a.detourStatus === "saved" ? door(a) : ""}` : `<div class="paper-panel"><p class="scene-copy">Your gallery is waiting for its first wonderfully questionable exhibit.</p>${sceneButton("Make a Creature", "briefing")}</div>`}`;
		}
		if (screen === "personality") {
			const a = artifact();
			html = pictureHeader("interview", 295, "gallery") + `<div class="interview-stage"><img class="coach-portrait" src="assets/coach.png" alt="Coach Sloth interviewing your creature">${monster(a.parts, true)}</div><h2 class="ribbon-title">${esc(a.name)}</h2><div class="paper-panel"><h3 class="question-heading">What crime did your<br>creature commit?</h3>${[
				["🧀", "Stealing 42 pounds of cheese"],
				["☾", "Attempting to sell the moon"],
				["♧", "Illegally collecting socks"]
			].map(([icon, text]) => `<button class="crime-option" data-crime="${esc(text)}"><span>${icon}</span>${text}</button>`).join("")}<label class="field" for="crime">Or tell your own ridiculous story:</label><textarea id="crime" maxlength="240" placeholder="A very questionable past…">${esc(a.personality?.crime || "")}</textarea><label class="field" for="ambition">Secret ambition (optional)</label><input id="ambition" class="input" maxlength="140" value="${esc(a.personality?.ambition || "")}" placeholder="To become a tiny weather presenter"></div>${sceneButton("Keep the Interview", "save-personality")}${sceneButton("Leave It a Mystery", "gallery", true)}`;
		}
		if (screen === "reflect") {
			const hotspots = [
				[
					"Making the creature",
					"Character Design",
					"design"
				],
				[
					"Giving it a personality",
					"Storytelling",
					"story"
				],
				[
					"Nothing in particular",
					"Not Sure Yet",
					"unsure"
				]
			].map(([value, label, position]) => `
    <button class="discovery-hit hit-${position}" data-reflection="${value}"
      aria-label="${label}" aria-pressed="${reflection === value}"></button>`).join("");
			const next = ["Giving it a personality", "Naming it"].includes(reflection);
			html = backRow("gallery", "Gallery") + `
    <section class="discovery-print" aria-label="What was unexpectedly fun?">
      ${crop("door", 0, 0, 941, 1305, 941, "Coach Sloth at the secret door. What was unexpectedly fun?")}
      ${hotspots}
    </section>
    <div class="discovery-other">${["Choosing its look", "Naming it"].map((value) => `<button data-reflection="${value}" aria-pressed="${reflection === value}">${value}</button>`).join("")}</div>
    ${sceneButton(next ? "Find the Secret Door" : "Keep My Observation", "save-reflection")}
    ${sceneButton("Skip for Now", "gallery", true)}`;
			n = nav("house");
		}
		if (screen === "detour") {
			const a = artifact();
			html = pictureHeader("door", 745, "gallery") + `<div class="paper-panel"><h2 class="question-heading">A new door. A new possibility.</h2><p class="scene-copy">${a.personality?.crime ? "You invented a past for your creature." : "You enjoyed imagining your creature’s personality."} Maybe you’d like to turn that idea into a tiny story.</p><p class="tiny-note">Drawing → character creation → storytelling<br>Your original interest stays right here.</p></div>${sceneButton("Open the Secret Door", "accept-detour")}${sceneButton("Save for Later", "save-detour", true)}<button class="text-button" style="display:block;margin:auto" data-action="reject-detour">Not my thing. Stay in the gallery.</button>`;
			n = nav("house");
		}
		if (screen === "story") {
			const a = artifact();
			html = `<header class="scene-header library-header">${crop("rooms", 14, 23, 478, 433, 1536, "Story Factory")}<button class="library-back" data-action="${entryScreens.story}" aria-label="Back"></button></header><div class="story-paper">${monster(a.parts)}<h3>The Great ${esc(a.name)} Adventure</h3>${a.personality?.crime || a.personality?.ambition ? `<p class="scene-copy">From your interview · ${esc(a.personality.crime || a.personality.ambition)}</p>` : ""}<p class="scene-copy">${esc(storyCue(a))}</p><label class="field" for="story">Your one-sentence masterpiece</label><textarea id="story" maxlength="600" placeholder="Once upon a time, my creature…">${esc(a.storyDraft ?? a.story ?? "")}</textarea></div><div class="story-suggestions"><button data-story-prompt="steal the moon">☾<br>steal the moon</button><button data-story-prompt="run for mayor">♛<br>run for mayor</button><button data-story-prompt="collect everyone’s socks">♧<br>collect socks</button></div>${sceneButton("Finish Story →", "save-story")}${sceneButton("Give Me a Random Idea", "story-idea", true)}`;
			n = nav("house");
		}
		if (screen === "passport") {
			n = nav("passport");
			const discoveries = data.artifacts.filter((a) => a.reflection && a.reflection !== "Nothing in particular"), stories = data.artifacts.filter((a) => a.story);
			html = pictureHeader("passport", 450, "") + `<div class="book-tabs"><button data-action="collection">Collection</button>${[
				["creations", "Monsters"],
				["photos", "Photos"],
				["discoveries", "Discoveries"],
				["journey", "Journey"],
				...data.eventEntries.length ? [["entries", "Exhibits"]] : []
			].map(([key, label]) => `<button data-passport-tab="${key}" aria-pressed="${passportTab === key}" class="${passportTab === key ? "active" : ""}">${label}</button>`).join("")}</div><div class="passport-book illustrated-folio">${passportTab === "creations" ? passportSpread() : ""}${passportTab === "creations" && data.artifacts.length ? `<button class="resume-banner" data-write-id="${artifact().id}">${artifact().storyDraft || artifact().story ? "Continue writing" : "Start a story"} · ${esc(artifact().name)}</button>` : ""}<div class="stats"><div><b>${data.artifacts.length + data.photoSeries.length + data.eventEntries.length + data.notebook.length}</b><span>Creations</span></div><div><b>${discoveries.length + data.photoSeries.filter((p) => p.reflection).length}</b><span>Discoveries</span></div><div><b>${stories.length + data.photoSeries.filter((p) => p.story).length + data.notebook.length}</b><span>Stories</span></div></div>${passportTab === "journey" ? data.eventEntries.map((e) => `<button class="resume-banner" data-exhibit="${e.id}">${events[e.kind].type} → ${events[e.kind].name}</button>`).join("") : ""}${["discoveries", "journey"].includes(passportTab) ? data.photoSeries.filter((p) => passportTab === "journey" || p.reflection).map((p) => `<button class="resume-banner" data-photo-id="${p.id}">${passportTab === "discoveries" ? esc(p.reflection) : "Photography → Darkroom" + (p.story ? " → Storytelling" : "")}</button>`).join("") : ""}${passportTab === "entries" ? data.eventEntries.length ? [...data.eventEntries].reverse().map((e) => `<button class="photo-record" data-exhibit="${e.id}">${eventArt(e)}<strong>${events[e.kind].name}</strong><small>${esc(e.review || "Open exhibit record")}</small></button>`).join("") : sceneButton("Find an Event", "collection") : passportTab === "photos" ? data.photoSeries.length ? [...data.photoSeries].reverse().map((p, i) => `<button class="photo-record" data-photo-id="${p.id}">${printPhoto(p.shots[p.selected])}<strong>${esc(p.shots[p.selected].title || "Street series " + (data.photoSeries.length - i))}</strong><span>3 prints · View record</span></button>`).join("") : sceneButton("Make My First Photo Series", "photo-from-passport") : passportTab === "creations" ? data.artifacts.length ? `<div class="collection">${[...data.artifacts].reverse().map((a) => `<button class="artifact-card" data-record="${a.id}">${monster(a.parts)}<strong>${esc(a.name)}</strong><small>${new Date(a.createdAt).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric"
			})} · ${a.story ? "A story, too!" : "Your own little weirdo"}</small></button>`).join("")}</div>` : `<div class="empty"><h3>Your adventure starts here.</h3><p>Real creations. Real little discoveries.<br>Your first page is waiting.</p>${sceneButton("Make My First Monster", "briefing")}</div>` : passportTab === "discoveries" ? discoveries.length ? discoveries.map((a) => `<div class="paper-panel"><h3>${esc(a.name)}</h3><p>“${esc(a.reflection)}”</p><button class="text-button" data-record="${a.id}">Revisit this discovery →</button></div>`).join("") : data.photoSeries.some((p) => p.reflection) ? "" : "<div class=\"empty\"><h3>Nothing to label. Yet.</h3><p>Open a creature in the gallery and choose “What did you discover?” Only your own observations appear here.</p></div>" : data.artifacts.length ? `<div class="history">${[...data.artifacts].reverse().map((a) => `<p><b>${esc(a.name)}</b><br>${esc(a.originalInterest || "Drawing")} → Monster assembly${a.personality?.crime ? " → Character personality" : ""}${a.story ? " → Storytelling" : ""}<br><button class="text-button" data-record="${a.id}">Open journey →</button></p>`).join("")}</div>` : data.photoSeries.length || data.eventEntries.length ? "" : "<p class=\"scene-copy\">No expeditions yet. All roads are still open.</p>"}<div class="section-line"><h3>Stamps & little detours</h3></div>${data.artifacts.length || data.eventEntries.length || data.photoSeries.length ? "<span class=\"stamp\">✳<br>FIRST<br>ATTEMPT</span>" : "<p class=\"tiny-note\">Your first stamp comes with your first creation.</p>"}${discoveries.length ? "<span class=\"stamp\">✧<br>CREATIVE<br>SPARK</span>" : ""}${stories.length || data.photoSeries.some((p) => p.story) ? "<span class=\"stamp\">↝<br>FIRST<br>DETOUR</span>" : ""}</div>`;
		}
		if (screen === "record") {
			const a = artifact();
			html = pictureHeader("passport", 243, "passport") + `<div class="passport-book"><h2 class="ribbon-title">${esc(a.name)}</h2><div class="reveal-stage">${monster(a.parts, true)}</div><div class="history"><p><b>${esc(a.originalInterest || "Drawing")}</b><br>Your starting curiosity</p><p><b>Monster Assembly Disaster</b><br>${a.placements} part changes · ${a.malfunction || "An unhurried early finish"}</p>${a.personality?.crime ? `<p><b>A character with a past</b><br>${esc(a.personality.crime)}</p>` : ""}${a.reflection ? `<p><b>You noticed</b><br>${esc(a.reflection)}</p>` : ""}${a.story ? `<p><b>Your tiny tale</b><br>${esc(a.story)}</p>` : ""}</div></div>${sceneButton(a.storyDraft || a.story ? "Continue Its Story" : "Write Its Story", "story")}${sceneButton("Visit This Exhibit", "gallery", true)}${sceneButton("Remix in a New Round", "replay", true)}`;
		}
		if (screen === "collection") {
			n = nav("passport");
			html = `<header class="scene-header library-header">${crop("rooms", 1046, 23, 475, 225, 1536, "Game Collection")}<button class="library-back" data-action="passport" aria-label="Back to Passport"></button></header><div class="game-library"><div class="library-tabs">${[
				"All",
				"Drawing",
				"Writing",
				"Photography"
			].map((x) => `<button aria-pressed="${libraryFilter === x}" data-library-filter="${x}" class="${libraryFilter === x ? "active" : ""}">${x}</button>`).join("")}</div>${[
				[
					"The Accidental Photographer",
					"Photography",
					"Frame three shots and develop your own prints.",
					0,
					0,
					0,
					0,
					"photo-event",
					true
				],
				[
					"Monster Assembly Disaster",
					"Drawing",
					"Build a creature before the factory goes wild!",
					1035,
					350,
					174,
					152,
					"briefing",
					true
				],
				[
					"The Color Thief",
					"Drawing",
					"Paint fast before Coach steals your colors.",
					1035,
					530,
					174,
					145,
					"paint",
					true
				],
				[
					"Wrong Shape Olympics",
					"Drawing",
					"Make something almost recognizable.",
					1035,
					701,
					174,
					148,
					"shape",
					true
				],
				[
					"A Very Tiny Tale",
					"Writing",
					"Give your own creature a one-sentence story.",
					5,
					465,
					180,
					220,
					"enter-story-room",
					true
				],
				[
					"The Worst Art Critic",
					"Writing",
					"Give a mysterious artwork an outrageous review.",
					0,
					0,
					0,
					0,
					"critic",
					true
				]
			].filter((x) => libraryFilter === "All" || x[1] === libraryFilter).map(([title, type, desc, x, y, w, h, act, ready]) => `<button class="event-row ${ready ? "" : "coming"}" data-action="${act}"><div class="event-thumb">${act === "critic" ? eventArt({
				kind: act,
				picks: [
					1,
					0,
					2
				]
			}) : act === "photo-event" ? printPhoto({
				subject: 0,
				filter: "Original"
			}) : crop("rooms", x, y, w, h, 1536)}</div><div><h3>${title}</h3><p>${desc}</p><span class="badge">${type}${ready ? "" : " · Coming later"}</span></div><span class="event-play">${ready ? "▶" : "⌛"}</span></button>`).join("")}</div>`;
		}
		if (screen === "settings") html = head("CLUB HOUSEKEEPING", "back-settings") + `<h2 class="section-title">Your pace.<br>Your playground.</h2><label class="toggle-row"><span>Sound effects<small>A tiny celebratory bloop.</small></span><input type="checkbox" data-pref="sound" ${data.sound ? "checked" : ""}></label><label class="toggle-row"><span>Larger text<small>Enlarge instructions and controls.</small></span><input type="checkbox" data-pref="largeType" ${data.largeType ? "checked" : ""}></label><label class="toggle-row"><span>Reduced motion<small>A quieter sort of chaos.</small></span><input type="checkbox" data-pref="reduced" ${data.reduced ? "checked" : ""}></label><label class="toggle-row"><span>30-second rounds<small>Switch off to play without a countdown.</small></span><input type="checkbox" data-pref="timer" ${data.timer ? "checked" : ""}></label><button class="list-action" data-action="change-interest"><span class="symbol">✎</span><span><strong>Starting interest</strong><small>${esc(data.interest)} · change anytime</small></span><span class="chev">→</span></button><div class="spaced"><span class="eyebrow">YOUR DATA, YOUR LITTLE WEIRDOS</span><p class="sub spaced">Progress lives in this browser. No account required. Export a backup before clearing browser data or switching devices.</p><button class="secondary spaced" data-action="export"><span>Export my passport</span><span>↓</span></button><button class="text-button danger" data-action="clear">Clear all local progress</button></div>${coach("No notifications. No guilt. I can barely remember where I put my whistle.")}`;
		if (screen.startsWith("photo-")) {
			const page = photoTrack().page();
			html = page.html;
			n = page.footer;
		}
		if (screen === "gallery" && data.eventEntries.length) html += "<section class=\"paper-panel\"><h3>Guest exhibits</h3>" + data.eventEntries.slice().reverse().map((e) => `<article>${eventArt(e)}<b>${events[e.kind].name}</b><p>${esc(e.review)}</p></article>`).join("") + "</section>";
		if (screen === "album") {
			const series = data.photoSeries.find((p) => p.id === data.photoId);
			html = backRow("passport", "Passport") + "<h2 class=\"ribbon-title\">Photo Series Record</h2>" + series.shots.map((shot, i) => `<figure class="photo-print">${printPhoto(shot)}<figcaption><strong>${esc(shot.title || "Print " + (i + 1))}</strong><br>${esc(shot.caption)}</figcaption></figure>`).join("") + `<div class="paper-panel"><h3>My journey</h3><p>Photography → Darkroom${series.story ? " → Storytelling" : ""}</p>${series.reflection ? "<p>Liked · " + esc(series.reflection) + "</p>" : ""}${series.story ? "<p>" + esc(series.story) + "</p>" : ""}</div>` + sceneButton("Return to the Darkroom", "album-edit");
			n = nav("passport");
		}
		if (screen === "settings") html = "<div class=\"settings-content\">" + html + "</div>";
		if ([
			"welcome",
			"interests",
			"village"
		].includes(screen) && data.onboarded) {
			const last = data.lastRoom, item = data.artifacts.find((a) => a.id === last?.id);
			if (item) html += sceneButton("Continue My Exploration · " + esc(item.name), "return-room", true);
		}
		if (screen === "writing-room") {
			n = nav("house");
			html = `<header class="scene-header">${crop("rooms", 14, 23, 478, 433, 1536, "Story Factory")}<button class="writing-back" aria-label="Back to Explore" data-action="house">←</button></header><div class="writing-machine"><label class="field" for="room-draft">Once upon a time…</label><textarea id="room-draft" maxlength="1800" placeholder="The day the moon went missing…">${esc(data.writingDraft)}</textarea><img class="typewriter-keys" src="assets/typewriter-keys.png" alt=""></div>` + sceneButton("Give me a random idea", "room-idea", true) + sceneButton("Make it more ridiculous", "room-twist", true) + sceneButton("I’m inspired, let me write", "room-write", true) + sceneButton("Save to My Story", "room-save");
			if (artifact()) html += sceneButton("Write about " + esc(artifact().name), "story", true);
		}
		if (screen === "passport" && data.notebook.length && ["creations", "journey"].includes(passportTab)) html += "<section class=\"paper-panel\"><h3>My Writing Notebook</h3>" + data.notebook.slice().reverse().map((note) => `<details><summary>${esc(note.text.slice(0, 45))}</summary><p style="white-space:pre-wrap">${esc(note.text)}</p></details>`).join("") + "</section>";
		if (screen === "story") html += sceneButton("Remix a One-Line Biography", "bio-remix", true);
		if (screen === "record" && artifact().detourStatus) html += `<p class="paper-panel">Story Factory · ${{
			accepted: "You opened the secret door.",
			saved: "You saved this door for later.",
			rejected: "You chose to stay in the gallery."
		}[artifact().detourStatus] || "An optional detour."}</p>`;
		app.innerHTML = `${storageOK ? "" : "<div class=\"storage-banner\" role=\"status\">Storage is unavailable. Progress lasts for this visit. Export a backup in Settings.</div>"}<main class="screen ${cls}" tabindex="-1">${html}</main>${n}`;
		const viewport = app.querySelector(".screen");
		const toolbar = viewport.querySelector(".page-controls, .app-head");
		if (toolbar) viewport.before(toolbar);
		else {
			const corner = viewport.querySelector(".scene-tools button, .library-back, .house-back");
			if (corner) {
				const dock = document.createElement("div");
				dock.className = "corner-dock";
				if (!corner.classList.contains("settings-tool")) {
					corner.parentElement.closest(".scene-header, .room-map").classList.add("painted-back-source");
					corner.textContent = "←";
				}
				corner.className = corner.classList.contains("settings-tool") ? "dock-settings" : "dock-back";
				dock.append(corner);
				viewport.before(dock);
			}
		}
		app.querySelector(".screen").scrollTop = scrollTop;
		const partTabs = app.querySelector(".part-tabs");
		if (partTabs) partTabs.scrollLeft = tabsLeft;
		if (focusKey) [...viewport.querySelectorAll("button")].find((button) => button.dataset[focusKey] === oldFocus.dataset[focusKey] && (!oldFocus.dataset.bin || oldFocus.dataset.bin === button.dataset.bin))?.focus({ preventScroll: true });
	}
	function door(a) {
		return `<div class="door-card"><span class="eyebrow">A DOOR YOU SAVED</span><h3>A story is waiting.</h3><p>${esc(a.name)} has unfinished business at the Nonsense Publishing House.</p>${btn("Revisit this detour", "detour")}</div>`;
	}
	const options = {
		Body: [
			["●", "Blob"],
			["✦", "Fluffy"],
			["▲", "Pear"]
		],
		Eyes: [
			["◉◉", "Googly"],
			["◉", "Cyclops"],
			["◡◡", "Sleepy"],
			["∴", "Three!"],
			["⌒⌒", "Happy"]
		],
		Mouth: [
			["⌣", "Smile"],
			["▱", "Chomp"],
			["○", "Gasp"],
			["ϟ", "Zigzag"]
		],
		Limbs: [
			["⌁", "Noodles"],
			["↗", "Waving"],
			["⌇", "Zigzag"],
			["♧", "Wild"]
		],
		Tail: [["—", "None"], ["〰", "Curly"]],
		Horns: [
			["×", "None"],
			["▲", "Unicorn"],
			["♈", "Ram"]
		],
		Bows: [
			["×", "None"],
			["⋈", "Blue"],
			["⋈", "Red"],
			["⋈", "Yellow"]
		],
		Extras: [
			["×", "None"],
			["♧", "Top hat"],
			["♛", "Crown"],
			["⋈", "Bow tie"],
			["♩", "Antenna"]
		]
	};
	const map = {
		Body: "body",
		Eyes: "eyes",
		Mouth: "mouth",
		Limbs: "limbs",
		Tail: "tail",
		Horns: "horns",
		Bows: "bow",
		Extras: "accessory"
	};
	const spriteStarts = {};
	for (const [cat, names] of Object.entries(illustratedParts)) {
		if (!options[cat]) {
			options[cat] = [["×", "None"]];
			map[cat] = cat.toLowerCase();
		}
		spriteStarts[cat] = options[cat].length;
		for (const name of names) options[cat].push(["", name.replaceAll("-", " ")]);
	}
	function tray(cat) {
		const names = illustratedParts[cat];
		const indices = names ? names.map((_, i) => spriteStarts[cat] + i) : options[cat].map((_, i) => i);
		const label = {
			Bows: "Bow ties",
			Limbs: "Legs",
			Tail: "Tails",
			Props: "Accessories",
			Extras: "Classic extras"
		}[cat] || cat;
		return `<fieldset class="bench-tray"><legend>${label}</legend><div>${indices.map((i) => {
			return `<button type="button" draggable="true" data-bin="${cat}" data-part="${i}" aria-label="${label}: ${options[cat][i][1]}" aria-pressed="${game.parts[map[cat]] === i}">${partPreview(cat, i)}</button>`;
		}).join("")}</div></fieldset>`;
	}
	function partPreview(cat, index) {
		const spriteName = illustratedParts[cat]?.[index - spriteStarts[cat]];
		if (spriteName) return `<img class="part-paint" draggable="false" src="assets/parts/${spriteName}.png" alt="">`;
		if (index === 0 && [
			"Tail",
			"Horns",
			"Bows",
			"Extras"
		].includes(cat)) return "<span class=\"no-part\">×</span>";
		return monster({
			...blank(),
			[map[cat]]: index
		}, false, cat);
	}
	function arenaHTML() {
		return `${backRow("exit-game", "Monster Assembly")}<header class="scene-header game-header">${crop("factory", 0, 0, 941, 390)}</header><div class="factory-status"><span class="game-caption">SCORE<br><b>${game.placements * 100}</b></span><span class="timer" id="timer">${game.timed ? "00:" + String(game.remaining).padStart(2, "0") : "∞"}</span><span class="game-caption">COMBO<br><b>×${game.combo || 1}</b></span></div><div class="factory-stage"><img class="factory-background" src="assets/screens/factory-clean.png" alt="Hand-drawn monster factory with an empty assembly platform"><div class="assembly-backplate" id="creature">${monster(game.parts)}</div>${game.pendingTwist ? twistHTML() : ""}</div><div class="parts-workbench"><div class="bench-trays">${[
			"Eyes",
			"Hats",
			"Horns",
			"Limbs",
			"Tail",
			"Bows",
			"Props"
		].map(tray).join("")}</div><details><summary>Body, expression & classic parts</summary><div class="bench-trays">${Object.keys(options).map((cat) => {
			const limit = spriteStarts[cat] ?? options[cat].length;
			return `<fieldset class="bench-tray"><legend>${cat}</legend><div>${options[cat].slice(0, limit).map(([, name], i) => `<button type="button" draggable="true" data-bin="${cat}" data-part="${i}" aria-label="${cat}: ${name}">${["Hats", "Props"].includes(cat) ? "×" : partPreview(cat, i)}</button>`).join("")}</div></fieldset>`;
		}).join("")}</div></details><div></div><div class="colors"><span>Paint:</span>${[
			"#b6bf81",
			"#b5a0d7",
			"#eeabc0",
			"#f6cf5c",
			"#80b5b4"
		].map((c, i) => `<button class="swatch ${game.parts.color === c ? "selected" : ""}" style="background:${c}" data-color="${c}" aria-label="${[
			"Green",
			"Lavender",
			"Pink",
			"Yellow",
			"Teal"
		][i]} paint" aria-pressed="${game.parts.color === c}"></button>`).join("")}</div><p class="game-talk" id="game-talk">${game.placements ? [
			"“The museum has been notified!”",
			"“ONE PART! An engineering breakthrough!”",
			"“Perfectly peculiar. Carry on!”"
		][game.placements % 3] : "“Drag or tap a part. Build a wonderfully weird monster!”"}</p></div>`;
	}
	function twistHTML() {
		return `<div class="malfunction" role="alert"><span class="eyebrow">⚠ A PERFECTLY NORMAL DISASTER ⚠</span><h3>${game.malfunction === "Extra Eyes" ? "EXTRA EYES!" : "FORMAL DRESS CODE!"}</h3><p>${game.malfunction === "Extra Eyes" ? "The factory fitted a third eye. Keep it or pick a new pair." : "The factory demands a hat. Emergency accessories are on the belt."}</p><button class="outline" style="background:var(--yellow)" data-action="continue-twist">How very professional. →</button></div>`;
	}
	function start(seed, timed = data.timer) {
		pauseClock();
		game = {
			parts: seed ? { ...seed } : {
				...blank(),
				body: 1,
				color: "#ffb7b3",
				eyes: spriteStarts.Eyes,
				mouth: 1,
				limbs: spriteStarts.Limbs,
				tail: spriteStarts.Tail,
				bow: spriteStarts.Bows,
				horns: spriteStarts.Horns,
				hats: spriteStarts.Hats
			},
			remaining: 30,
			elapsed: 0,
			placements: 0,
			timed,
			malfunction: null,
			pendingTwist: false,
			startedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		data.draft = game;
		category = "Body";
		paused = false;
		screen = "arena";
		persist();
		render();
		startClock();
	}
	function startClock() {
		pauseClock();
		paused = false;
		if (game.pendingTwist) return;
		clock = setInterval(() => {
			if (screen !== "arena" || paused || modalOpen || document.hidden) return;
			game.elapsed++;
			if (game.timed) game.remaining--;
			if (game.elapsed === 15 && !game.malfunction) {
				triggerTwist();
				return;
			}
			if (game.timed && game.remaining <= 0) {
				finish();
				return;
			}
			const t = $("#timer");
			if (t) t.textContent = game.timed ? "00:" + String(game.remaining).padStart(2, "0") : "∞";
			data.draft = game;
			persist();
		}, 1e3);
	}
	function pauseClock() {
		clearInterval(clock);
		clock = null;
	}
	function triggerTwist() {
		game.malfunction = Math.random() < .5 ? "Extra Eyes" : "Formal Dress Code";
		game.pendingTwist = true;
		if (game.malfunction === "Extra Eyes") {
			game.parts.eyes = 3;
			category = "Eyes";
		} else {
			game.parts.accessory = 1;
			category = "Extras";
		}
		data.draft = game;
		persist();
		pauseClock();
		render();
		app.querySelector("[data-action=\"continue-twist\"]")?.focus();
		sound();
	}
	function finish() {
		if (!game) return;
		pauseClock();
		const id = crypto.randomUUID();
		data.artifacts.push({
			id,
			name: "Untitled little weirdo",
			parts: { ...game.parts },
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			originalInterest: data.interest,
			placements: game.placements,
			malfunction: game.malfunction,
			frame: "gold",
			personality: {},
			reflection: null,
			story: "",
			detourStatus: null
		});
		activeId = id;
		data.activeId = id;
		data.draft = null;
		game = null;
		persist();
		sound();
		go("reveal");
	}
	let previousFocus;
	function modal(html) {
		previousFocus = document.activeElement;
		modalOpen = true;
		const div = document.createElement("div");
		div.className = "modal-backdrop";
		div.innerHTML = `<section class="modal" role="dialog" aria-modal="true" aria-label="Coach Sloth message"><button class="modal-close" data-action="close" aria-label="Close dialog">×</button>${html}</section>`;
		for (const layer of app.children) layer.inert = true;
		app.append(div);
		div.querySelector("button")?.focus();
	}
	function closeModal() {
		if (screen === "arena") paused = false;
		app.querySelector(".modal-backdrop")?.remove();
		modalOpen = false;
		for (const layer of app.children) layer.inert = false;
		previousFocus?.focus({ preventScroll: true });
	}
	function saveArtifact() {
		persist();
		toast(storageOK ? "Added to your museum record." : "Kept for this visit. Export a backup in Settings.");
	}
	app.addEventListener("click", (e) => {
		const t = e.target.closest("button");
		if (!t || t.disabled) return;
		sound();
		if (t.dataset.exhibit) {
			recentEntryId = t.dataset.exhibit;
			go("event-record");
			return;
		}
		if (t.dataset.pick !== void 0 && eventDraft && screen === eventDraft.kind && eventDraft.picks.length < 3) {
			eventDraft.picks.push(Number(t.dataset.pick));
			render();
			return;
		}
		if (t.dataset.photoId) {
			data.photoId = t.dataset.photoId;
			persist();
			go("album");
			return;
		}
		if (t.dataset.photoAction) {
			photoTrack().action(t.dataset.photoAction);
			return;
		}
		if (t.dataset.writeId) {
			activeId = t.dataset.writeId;
			data.activeId = activeId;
			persist();
			go("story");
			return;
		}
		if (t.dataset.sceneInterest) {
			data.interest = t.dataset.sceneInterest;
			persist();
			render();
			return;
		}
		if (t.dataset.passportTab) {
			passportTab = t.dataset.passportTab;
			render();
			return;
		}
		if (t.dataset.libraryFilter) {
			libraryFilter = t.dataset.libraryFilter;
			render();
			return;
		}
		if (t.dataset.crime) {
			$("#crime").value = t.dataset.crime;
			document.querySelectorAll("[data-crime]").forEach((b) => b.classList.toggle("selected", b === t));
			toast("A very suspicious choice. Save the interview when ready.");
			return;
		}
		if (t.dataset.storyPrompt) {
			$("#story").value = artifact().name + " decided to " + t.dataset.storyPrompt + ".";
			keepStoryDraft();
			return;
		}
		if (t.dataset.category) {
			category = t.dataset.category;
			render();
			return;
		}
		if (t.dataset.part !== void 0) {
			category = t.dataset.bin || category;
			game.parts[map[category]] = Number(t.dataset.part);
			game.combo = game.lastCategory === category ? 1 : (game.combo || 0) + 1;
			game.lastCategory = category;
			game.placements++;
			data.draft = game;
			persist();
			render();
			$("#creature").classList.add("wiggle");
			if (!game.timed && game.placements === 5 && !game.malfunction) triggerTwist();
			return;
		}
		if (t.dataset.color) {
			game.parts.color = t.dataset.color;
			game.placements++;
			data.draft = game;
			persist();
			render();
			if (!game.timed && game.placements >= 5 && !game.malfunction) triggerTwist();
			return;
		}
		if (t.dataset.interest) {
			data.interest = t.dataset.interest;
			persist();
			render();
			return;
		}
		if (t.dataset.frame) {
			artifact().frame = t.dataset.frame;
			saveArtifact();
			render();
			return;
		}
		if (t.dataset.reflection) {
			reflection = t.dataset.reflection;
			render();
			return;
		}
		if (t.dataset.record) {
			activeId = t.dataset.record;
			go("record");
			return;
		}
		const a = t.dataset.action;
		if (!a) return;
		if (events[a]) {
			eventDraft = newEntry(a);
			go(a);
			return;
		}
		switch (a) {
			case "return-room": {
				const last = data.lastRoom;
				if (last && [
					"gallery",
					"story",
					"personality",
					"reflect",
					"detour"
				].includes(last.screen) && data.artifacts.some((x) => x.id === last.id)) {
					activeId = data.activeId = last.id;
					go(last.screen);
				}
				return;
			}
			case "bio-remix":
				modal("<h2>The Nonsense Publishing House</h2><p>" + esc(artifact().name) + " was once a…</p><label class=\"field\" for=\"bio-role\">Former occupation</label><input class=\"input\" id=\"bio-role\" maxlength=\"65\" value=\"cloud inspector\"><label class=\"field\" for=\"bio-dream\">Who dreamed of…</label><input class=\"input\" id=\"bio-dream\" maxlength=\"100\" value=\"opening a museum on the moon\">" + sceneButton("Shuffle the Words", "bio-shuffle", true) + sceneButton("Add to My Draft", "bio-add"));
				return;
			case "bio-shuffle":
				$("#bio-role").value = [
					"sock detective",
					"retired thundercloud",
					"part-time moon"
				][Math.floor(Math.random() * 3)];
				$("#bio-dream").value = [
					"winning a slow race",
					"teaching pancakes to fly",
					"interviewing a shadow"
				][Math.floor(Math.random() * 3)];
				return;
			case "bio-add": {
				const role = $("#bio-role").value.trim(), dream = $("#bio-dream").value.trim();
				if (!role || !dream) {
					toast("Both blanks need a word.");
					return;
				}
				const field = $("#story"), line = artifact().name + " was once a " + role + " who dreamed of " + dream + ".";
				if (field.value.length + line.length + 1 > 600) {
					toast("Your draft is full. Make room before adding a line.");
					return;
				}
				field.value = [field.value.trim(), line].filter(Boolean).join(" ");
				keepStoryDraft();
				closeModal();
				field.focus();
				return;
			}
			case "writing-room":
				go("writing-room");
				return;
			case "room-write":
				$("#room-draft").focus();
				return;
			case "room-idea":
			case "room-twist": {
				const lines = a === "room-idea" ? [
					"A lost suitcase knocked on the door.",
					"The moon applied for a library card.",
					"Someone had stolen Tuesday."
				] : [
					"Then the witness turned out to be a sandwich.",
					"Unfortunately, the town voted the suitcase mayor.",
					"A tiny orchestra began playing inside the teapot."
				];
				const field = $("#room-draft");
				const line = lines.filter((line) => !field.value.includes(line));
				if (!line.length) {
					toast("All three prompts are on your page. What happens next?");
					return;
				}
				const next = [field.value.trim(), line[Math.floor(Math.random() * line.length)]].filter(Boolean).join(" ");
				if (next.length > field.maxLength) {
					toast("Make a little room on the page first.");
					return;
				}
				field.value = data.writingDraft = next;
				persist();
				field.focus();
				return;
			}
			case "room-save": {
				const text = data.writingDraft.trim();
				if (!text) {
					toast("Write a line first.");
					$("#room-draft").focus();
					return;
				}
				data.notebook.push({
					id: crypto.randomUUID(),
					text
				});
				data.writingDraft = "";
				persist();
				passportTab = "creations";
				go("passport");
				toast("Story tucked into My Writing Notebook.");
				return;
			}
			case "collect-event":
				if (!eventDraft) return;
				if (eventDraft.kind === "critic") {
					eventDraft.review = $("#critic-review").value.trim();
					if (!eventDraft.review) {
						toast("Give the exhibit a verdict first.");
						$("#critic-review").focus();
						return;
					}
				}
				data.eventEntries.push(eventDraft);
				recentEntryId = eventDraft.id;
				eventDraft = null;
				persist();
				go("event-ticket");
				return;
			case "album-edit":
				openPhotography("album", true);
				return;
			case "passport-events":
				passportTab = "entries";
				go("passport");
				return;
			case "hint":
				toast([
					"Try a new pair of eyes.",
					"Pick a bow to match your creature.",
					"A horn makes an excellent conversation starter."
				][game.hints || 0]);
				game.hints = (game.hints || 0) + 1;
				data.draft = game;
				persist();
				render();
				return;
			case "sillier": {
				const field = $("#story");
				field.value = (field.value.trim() || artifact().name + " had a plan") + " Then the moon asked for a receipt.";
				field.value = field.value.slice(0, 600);
				keepStoryDraft();
				return;
			}
			case "write-myself":
				$("#story").focus();
				return;
			case "photo-start":
			case "photo-shutter":
			case "photo-lab-open":
			case "photo-next":
				photoTrack().action(a);
				return;
			case "photo-from-passport":
				openPhotography("passport");
				return;
			case "photo-passport":
				passportTab = "photos";
				go("passport");
				return;
			case "lets-go":
				data.onboarded = true;
				persist();
				if (data.interest === "Photography") {
					openPhotography("village");
					break;
				}
				go(data.interest === "Writing" && artifact() ? "story" : "briefing");
				break;
			case "surprise":
				data.onboarded = true;
				data.interest = "Drawing";
				persist();
				go("briefing");
				toast("Coach picked Monster Assembly Disaster!");
				break;
			case "practice":
				start(void 0, false);
				break;
			case "locked-lab":
				modal("<h2>The lab is still being built.</h2><p>Explore the Gallery, Story Factory or Photo Darkroom today.</p>" + sceneButton("Back to the House", "close"));
				return;
			case "photography-info":
				openPhotography("house", true);
				break;
			case "photo-event":
				openPhotography("collection");
				break;
			case "future-game":
				modal("<h2>Under very slow construction.</h2><p>Coach is still setting up this room. Monster Assembly and your creature’s story are ready now.</p>" + sceneButton("Back to Exploring", "close"));
				break;
			case "enter-story-room":
				if (artifact()) go("story");
				else modal("<h2>Every story needs a weirdo.</h2><p>Make a creature first. Then bring it here to write its one-sentence adventure.</p>" + sceneButton("Make My Main Character", "briefing") + sceneButton("Stay Here", "close", true));
				break;
			case "hang":
				if (!artifact()) {
					go("briefing");
					break;
				}
				modal("<h2>Hang a little masterpiece.</h2><label class=\"field\" for=\"hang-select\">Pick an exhibit</label><select id=\"hang-select\" class=\"artifact-switch\">" + data.artifacts.map((x) => "<option value=\"" + x.id + "\" " + (x.id === artifact().id ? "selected" : "") + ">" + esc(x.name) + "</option>").join("") + "</select>" + sceneButton("Hang It!", "confirm-hang"));
				break;
			case "confirm-hang":
				activeId = $("#hang-select").value;
				data.activeId = activeId;
				persist();
				closeModal();
				go("gallery");
				toast("An excellent curatorial decision.");
				break;
			case "name-it":
				if (!artifact()) {
					go("briefing");
					break;
				}
				modal("<div class=\"name-modal\"><h2>What’s in a name?</h2><label class=\"field\" for=\"name\">Your creature’s name</label><input id=\"name\" class=\"input\" maxlength=\"48\" value=\"" + esc(artifact().name) + "\"><button class=\"text-button\" data-action=\"suggest-name\">Borrow a ridiculous name ↝</button>" + sceneButton("Save Name", "rename") + "</div>");
				break;
			case "life":
				if (artifact()) go("personality");
				else go("briefing");
				break;
			case "remix-it":
				if (artifact()) start(artifact().parts);
				else go("briefing");
				break;
			case "story-idea":
				$("#story").value = artifact().name + " " + [
					"opened a very exclusive restaurant for invisible guests.",
					"ran for mayor on a promise of free socks for everyone.",
					"accidentally became the moon’s least qualified tour guide."
				][Math.floor(Math.random() * 3)];
				keepStoryDraft();
				break;
			case "shuffle":
				game.shuffled = true;
				for (const [cat, part] of Object.entries(map)) game.parts[part] = Math.floor(Math.random() * options[cat].length);
				game.placements++;
				data.draft = game;
				persist();
				render();
				toast("An entirely questionable rearrangement!");
				break;
			case "how":
				modal(`<img class="coach-small" src="assets/coach.png" alt="Coach Sloth"><h2>A tiny experiment.<br>A happy accident.</h2><p><b>01 Play.</b> Make a strange creature in a tiny creative challenge.</p><p><b>02 Explore.</b> Hang it in Coach’s house. Give it a name, a personality, maybe a criminal record.</p><p><b>03 Discover.</b> Notice what you enjoyed. Follow a new idea, or just keep your creation.</p>${btn("Sounds delightfully pointless.", "close")}`);
				break;
			case "close":
				closeModal();
				break;
			case "onboard":
				data.onboarded = true;
				persist();
				go("village");
				if (data.interest === "Writing") toast("Start with a creature, then bring it into a story.");
				break;
			case "start":
				start();
				break;
			case "replay":
				start(artifact().parts);
				break;
			case "resume":
				game = data.draft;
				screen = "arena";
				render();
				startClock();
				break;
			case "finish":
				finish();
				break;
			case "continue-twist":
				game.pendingTwist = false;
				persist();
				render();
				startClock();
				break;
			case "pause":
			case "exit-game":
				paused = true;
				modal(`<h2>Take a breather.</h2><p>Your creature isn’t going anywhere. Neither am I, frankly.</p>${btn("Back to the beautiful chaos", "unpause")}<button class="secondary spaced" data-action="save-exit"><span>Save & leave the factory</span><span>↗</span></button>`);
				break;
			case "unpause":
				closeModal();
				paused = false;
				break;
			case "save-exit":
				data.draft = game;
				persist();
				closeModal();
				go("village");
				break;
			case "settings":
				returnScreen = screen;
				go("settings");
				break;
			case "back-settings":
				go(returnScreen === "arena" ? "village" : returnScreen);
				break;
			case "change-interest":
				go("interests");
				break;
			case "pet":
				if (artifact()) {
					document.querySelector(".live-exhibit").classList.add("wiggle");
					setTimeout(() => document.querySelector(".live-exhibit")?.classList.remove("wiggle"), 450);
					toast([
						"Your creature requests a snack.",
						"“I belong in the Louvre. Probably.”",
						"The curator is extremely impressed."
					][Math.floor(Math.random() * 3)]);
				} else toast("The empty frame is feeling optimistic.");
				break;
			case "rename": {
				const value = $("#name").value.trim();
				if (!value) {
					toast("Give your little weirdo a name first.");
					$("#name").focus();
					return;
				}
				artifact().name = value;
				saveArtifact();
				closeModal();
				render();
				break;
			}
			case "suggest-name":
				$("#name").value = [
					"Professor Noodle",
					"Sir Wobbleton III",
					"Mildly Suspicious Bean",
					"Lady Leftsock",
					"Baron von Biscuit"
				][Math.floor(Math.random() * 5)];
				break;
			case "save-personality": {
				const crime = $("#crime").value.trim(), ambition = $("#ambition").value.trim();
				if (!crime && !ambition) {
					toast("Add a tiny detail, or leave the mystery unsolved.");
					return;
				}
				artifact().personality = {
					crime,
					ambition
				};
				saveArtifact();
				go(artifact().detourStatus === "rejected" ? "gallery" : "detour");
				break;
			}
			case "reflect":
				reflection = artifact().reflection || "";
				go("reflect");
				break;
			case "save-reflection":
				if (!reflection) {
					toast("Choose an observation, or skip for now.");
					return;
				}
				artifact().reflection = reflection;
				saveArtifact();
				if (["Giving it a personality", "Naming it"].includes(reflection) && artifact().detourStatus !== "rejected") go("detour");
				else {
					go("gallery");
					toast(reflection === "Nothing in particular" ? "No discovery required. Your creature is still a keeper." : "Your observation is in your passport.");
				}
				break;
			case "accept-detour":
				artifact().detourStatus = "accepted";
				persist();
				go("story");
				break;
			case "save-detour":
				artifact().detourStatus = "saved";
				persist();
				go("gallery");
				toast("The door will be here when you’re curious.");
				break;
			case "reject-detour":
				artifact().detourStatus = "rejected";
				persist();
				go("gallery");
				toast("Back to drawing. No detour required.");
				break;
			case "save-story": {
				const story = $("#story").value.trim();
				if (!story) {
					toast("A word, a sentence, a tiny tale — write something first.");
					$("#story").focus();
					return;
				}
				artifact().story = story;
				delete artifact().storyDraft;
				artifact().detourStatus = "accepted";
				saveArtifact();
				go("record");
				toast(storageOK ? "Published! A very small book. A very good detour." : "Your story is kept for this visit.");
				break;
			}
			case "export": {
				const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
				a.href = url;
				a.download = "my-procrastination-passport.json";
				a.click();
				setTimeout(() => URL.revokeObjectURL(url), 1e3);
				toast("Your passport backup is ready.");
				break;
			}
			case "clear":
				modal(`<h2>A fresh start?</h2><p>This removes all creatures, stories, discoveries, and settings saved in this browser. Export your passport first if you want to keep a copy.</p>${btn("Keep my little weirdos", "close")}<button class="text-button danger" data-action="confirm-clear">Yes, clear all local progress</button>`);
				break;
			case "confirm-clear":
				pauseClock();
				data = defaults();
				game = null;
				activeId = null;
				persist();
				go("welcome");
				toast("A fresh page. No hurry.");
				break;
			default: go(a);
		}
	});
	app.addEventListener("change", (e) => {
		if (e.target.id === "timer-toggle") {
			data.timer = e.target.checked;
			persist();
		}
		if (e.target.dataset.pref) {
			data[e.target.dataset.pref] = e.target.checked;
			persist();
			document.body.classList.toggle("large-type", Boolean(data.largeType));
			document.body.classList.toggle("reduced", data.reduced);
		}
		if (e.target.id === "artifact-select") {
			activeId = e.target.value;
			render();
		}
	});
	app.addEventListener("keydown", (event) => {
		const current = event.target.closest("[data-category]");
		if (!current) return;
		const tabs = [...current.parentElement.querySelectorAll("[role=\"tab\"]")];
		const index = tabs.indexOf(current);
		const positions = {
			ArrowRight: (index + 1) % tabs.length,
			ArrowLeft: (index + tabs.length - 1) % tabs.length,
			Home: 0,
			End: tabs.length - 1
		};
		if (!Object.hasOwn(positions, event.key)) return;
		event.preventDefault();
		const next = tabs[positions[event.key]];
		next.focus();
		next.click();
	});
	app.addEventListener("keydown", (e) => {
		if (!modalOpen) return;
		const buttons = [...app.querySelectorAll(".modal button,.modal input,.modal textarea,.modal select")];
		if (e.key === "Tab" && buttons.length) {
			if (e.shiftKey && document.activeElement === buttons[0]) {
				e.preventDefault();
				buttons.at(-1).focus();
			} else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {
				e.preventDefault();
				buttons[0].focus();
			}
		}
		if (e.key === "Escape") {
			closeModal();
			if (screen === "arena") paused = false;
		}
	});
	document.addEventListener("visibilitychange", () => {
		if (document.hidden && game) {
			data.draft = game;
			persist();
		}
	});
	window.addEventListener("pagehide", () => {
		if (game) data.draft = game;
		persist();
	});
	render();
	app.addEventListener("dragstart", (event) => {
		const part = event.target.closest("[data-part]");
		if (part) event.dataTransfer.setData("application/x-club-part", part.dataset.bin + ":" + part.dataset.part);
	});
	app.addEventListener("dragover", (event) => {
		if (event.target.closest(".factory-stage") && event.dataTransfer.types.includes("application/x-club-part")) event.preventDefault();
	});
	app.addEventListener("drop", (event) => {
		if (!event.target.closest(".factory-stage")) return;
		const [bin, i] = event.dataTransfer.getData("application/x-club-part").split(":");
		if (!Object.hasOwn(options, bin) || !/^\d+$/.test(i)) return;
		event.preventDefault();
		app.querySelector("[data-bin=\"" + bin + "\"][data-part=\"" + i + "\"]")?.click();
	});
	//#endregion
})();
