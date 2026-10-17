// Flowly — App Promo
// Author: Victoria · After Effects build script
// HOW TO RUN: After Effects → File → Scripts → Run Script File… → choose this file.
// The script builds the full project (comps, precomps, keyframes, render queue)
// and saves it as .aep into the 01_Project folder next to this one.

// ============================================================
//  Shared helpers for After Effects build scripts (ExtendScript)
//  Inlined into every build_project.jsx so each script is standalone.
// ============================================================

function hex(h) {
    h = h.replace('#', '');
    return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
}

// Project folder = parent of the 02_Scripts folder this script lives in
function projectRoot() {
    return File($.fileName).parent.parent;
}

function ensureFolder(path) {
    var f = new Folder(path);
    if (!f.exists) f.create();
    return f;
}

function binFolder(name) {
    var items = app.project.items;
    for (var i = 1; i <= items.length; i++) {
        if (items[i] instanceof FolderItem && items[i].name === name) return items[i];
    }
    return items.addFolder(name);
}

function newComp(name, w, h, dur, fps, bg, folder) {
    var c = app.project.items.addComp(name, w, h, 1, dur, fps);
    c.bgColor = bg || [0, 0, 0];
    c.motionBlur = true;
    if (folder) c.parentFolder = folder;
    return c;
}

// Number of dimensions to pass into setTemporalEaseAtKey
function easeDims(prop) {
    var t = prop.propertyValueType;
    if (t === PropertyValueType.TwoD_SPATIAL || t === PropertyValueType.ThreeD_SPATIAL) return 1;
    if (t === PropertyValueType.TwoD) return 2;
    if (t === PropertyValueType.ThreeD) return 3;
    return 1;
}

// Keyframes with an "expo out" feel: fast start, long soft landing.
// keys: [[time, value], ...]   inf: [outInfluence, inInfluence]
function animate(prop, keys, inf) {
    inf = inf || [20, 85];
    for (var i = 0; i < keys.length; i++) prop.setValueAtTime(keys[i][0], keys[i][1]);
    var dims = easeDims(prop);
    for (var k = 1; k <= prop.numKeys; k++) {
        var easeIn = [], easeOut = [];
        for (var d = 0; d < dims; d++) {
            easeIn.push(new KeyframeEase(0, inf[1]));
            easeOut.push(new KeyframeEase(0, inf[0] < 0.1 ? 0.1 : inf[0]));
        }
        prop.setInterpolationTypeAtKey(k, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
        prop.setTemporalEaseAtKey(k, easeIn, easeOut);
    }
    return prop;
}

function tr(layer, name) {
    var map = { pos: 'ADBE Position', scale: 'ADBE Scale', rot: 'ADBE Rotate Z', opacity: 'ADBE Opacity', anchor: 'ADBE Anchor Point' };
    return layer.property('ADBE Transform Group').property(map[name]);
}

// ---------- Shapes ----------
function shapeLayer(comp, name) {
    var l = comp.layers.addShape();
    l.name = name;
    return l;
}

function addGroup(layer, name) {
    var g = layer.property('ADBE Root Vectors Group').addProperty('ADBE Vector Group');
    g.name = name;
    return g;
}

function groupContents(g) { return g.property('ADBE Vectors Group'); }

function addRect(g, size, roundness) {
    var r = groupContents(g).addProperty('ADBE Vector Shape - Rect');
    r.property('ADBE Vector Rect Size').setValue(size);
    r.property('ADBE Vector Rect Roundness').setValue(roundness || 0);
    return r;
}

function addEllipse(g, size) {
    var e = groupContents(g).addProperty('ADBE Vector Shape - Ellipse');
    e.property('ADBE Vector Ellipse Size').setValue(size);
    return e;
}

function addPath(g, vertices, closed) {
    var p = groupContents(g).addProperty('ADBE Vector Shape - Group');
    var s = new Shape();
    s.vertices = vertices;
    s.closed = !!closed;
    p.property('ADBE Vector Shape').setValue(s);
    return p;
}

function addFill(g, color) {
    var f = groupContents(g).addProperty('ADBE Vector Graphic - Fill');
    f.property('ADBE Vector Fill Color').setValue(color);
    return f;
}

function addStroke(g, color, width) {
    var s = groupContents(g).addProperty('ADBE Vector Graphic - Stroke');
    s.property('ADBE Vector Stroke Color').setValue(color);
    s.property('ADBE Vector Stroke Width').setValue(width);
    try { s.property('ADBE Vector Stroke Line Cap').setValue(2); } catch (e) {} // round cap
    return s;
}

function addTrim(g) { return groupContents(g).addProperty('ADBE Vector Filter - Trim'); }

function groupTr(g, name) {
    var map = { pos: 'ADBE Vector Position', scale: 'ADBE Vector Scale', rot: 'ADBE Vector Rotation', opacity: 'ADBE Vector Group Opacity', anchor: 'ADBE Vector Anchor' };
    return g.property('ADBE Vector Transform Group').property(map[name]);
}

// Rounded rectangle on its own layer, positioned in comp space
function box(comp, name, w, h, x, y, color, radius) {
    var l = shapeLayer(comp, name);
    var g = addGroup(l, 'Box');
    addRect(g, [w, h], radius || 0);
    addFill(g, color);
    tr(l, 'pos').setValue([x, y]);
    return l;
}

// ---------- Text ----------
function text(comp, str, opts) {
    opts = opts || {};
    var l = comp.layers.addText(str);
    var prop = l.property('ADBE Text Properties').property('ADBE Text Document');
    var td = prop.value;
    td.resetCharStyle();
    td.fontSize = opts.size || 80;
    td.fillColor = opts.color || [1, 1, 1];
    td.applyFill = true;
    td.applyStroke = false;
    td.tracking = opts.tracking || 0;
    try { td.font = opts.font || 'Montserrat-Bold'; } catch (e) {}
    td.justification = opts.justify === 'left' ? ParagraphJustification.LEFT_JUSTIFY : ParagraphJustification.CENTER_JUSTIFY;
    if (opts.leading) { td.autoLeading = false; td.leading = opts.leading; }
    try {
        prop.setValue(td);
    } catch (err) {
        // font not installed: keep AE's default font, apply everything else
        td = prop.value;
        td.fontSize = opts.size || 80;
        td.fillColor = opts.color || [1, 1, 1];
        td.applyFill = true;
        td.justification = opts.justify === 'left' ? ParagraphJustification.LEFT_JUSTIFY : ParagraphJustification.CENTER_JUSTIFY;
        prop.setValue(td);
    }
    if (opts.pos) tr(l, 'pos').setValue(opts.pos);
    if (opts.name) l.name = opts.name;
    return l;
}

// Per-character reveal: opacity 0 + offset Y, animated by Range Selector offset
function charReveal(layer, start, dur, offsetY, by) {
    var animators = layer.property('ADBE Text Properties').property('ADBE Text Animators');
    var a = animators.addProperty('ADBE Text Animator');
    a.name = 'Reveal';
    var props = a.property('ADBE Text Animator Properties');
    props.addProperty('ADBE Text Opacity').setValue(0);
    props.addProperty('ADBE Text Position 3D').setValue([0, offsetY || 60, 0]);
    var sel = a.property('ADBE Text Selectors').addProperty('ADBE Text Selector');
    if (by === 'words') {
        try { sel.property('ADBE Text Range Advanced').property('ADBE Text Range Type2').setValue(3); } catch (e) {} // Based On: Words
    }
    animate(sel.property('ADBE Text Percent Offset'), [[start, 0], [start + dur, 100]], [10, 70]);
    return a;
}

// ---------- Effects ----------
function fx(layer, matchName) {
    try { return layer.property('ADBE Effect Parade').addProperty(matchName); } catch (e) { return null; }
}

function dropShadow(layer, opacity, softness, distance) {
    var d = fx(layer, 'ADBE Drop Shadow');
    if (!d) return;
    d.property('ADBE Drop Shadow-0002').setValue(opacity * 2.55); // opacity 0..255
    d.property('ADBE Drop Shadow-0004').setValue(distance || 20);
    d.property('ADBE Drop Shadow-0005').setValue(softness || 60);
}

function setMatte(layer, matteLayer, type) {
    // AE 2023+: setTrackMatte; older versions: trackMatteType on the layer below the matte
    try { layer.setTrackMatte(matteLayer, type || TrackMatteType.ALPHA); return; } catch (e) {}
    try { matteLayer.moveBefore(layer); layer.trackMatteType = type || TrackMatteType.ALPHA; } catch (e2) {}
}

// ---------- Project ----------
function addToRenderQueue(comp, fileName) {
    var root = projectRoot();
    ensureFolder(root.fsName + '/06_Renders');
    var item = app.project.renderQueue.items.add(comp);
    var om = item.outputModule(1);
    var templates = om.templates;
    for (var i = 0; i < templates.length; i++) {
        if (/H\.264/i.test(templates[i])) { om.applyTemplate(templates[i]); break; }
    }
    om.file = new File(root.fsName + '/06_Renders/' + fileName);
    return item;
}

function saveProject(fileName) {
    var root = projectRoot();
    ensureFolder(root.fsName + '/01_Project');
    var f = new File(root.fsName + '/01_Project/' + fileName);
    app.project.save(f);
    return f;
}

function startProject() {
    if (!app.project) app.newProject();
    if (app.project.numItems > 0) {
        if (!confirm('This script will create a NEW project. Unsaved changes in the current project may be lost. Continue?')) return false;
        app.newProject();
    }
    return true;
}

// ============================================================
//  BUILD: Flowly — App Promo (1920x1080, 20 s, 30 fps)
//  Problem → product UI → features → end card
// ============================================================
(function build() {
    if (!startProject()) return;
    app.beginUndoGroup('Build Flowly App Promo');

    var C = {
        bg: hex('#F6F5F2'), ink: hex('#121117'), card: hex('#1E1C26'), muted: hex('#6B6A75'),
        line: hex('#E4E2DC'), violet: hex('#5B3DF5'), violetSoft: hex('#ECE8FF'),
        lime: hex('#D4F86B'), rose: hex('#F2715E'), green: hex('#1F9D77'), white: hex('#FFFFFF')
    };
    var FPS = 30, DUR = 20;
    var BOLD = 'Manrope-ExtraBold', SEMI = 'Manrope-SemiBold', MED = 'Manrope-Medium';

    var fComps = binFolder('01_Comps');
    var fPre = binFolder('02_Precomps');
    binFolder('03_Assets');
    binFolder('04_Audio');

    function scene(name, dur, color) {
        var c = newComp(name, 1920, 1080, dur, FPS, color, fPre);
        var bg = c.layers.addSolid(color, 'BG', 1920, 1080, 1);
        bg.locked = true;
        return c;
    }

    function pop(layer, t, to) {
        to = to || 100;
        animate(tr(layer, 'scale'), [[t, [0, 0]], [t + 0.35, [to * 1.08, to * 1.08]], [t + 0.6, [to, to]]], [15, 75]);
    }

    // ---------- SC01: the problem (4.5 s) ----------
    var s1 = scene('SC01_Problem', 4.5, C.bg);
    var h1 = text(s1, 'Requests get lost.', { size: 110, color: C.ink, font: BOLD, tracking: -30, pos: [960, 230], name: 'Headline' });
    charReveal(h1, 0.1, 0.6, 60);
    var msgs = [
        ['Can you redo the deck?', 430, 420, -4], ['Who owns this bug?', 1400, 400, 3],
        ['Any update??', 760, 600, 2], ['Pls send the report', 1250, 640, -3],
        ['Did we reply to ACME?', 520, 820, 3], ['Deadline is today!', 1480, 860, -2]
    ];
    for (var i = 0; i < msgs.length; i++) {
        var m = msgs[i];
        var w = m[0].length * 21 + 90;
        var bubble = box(s1, 'Bubble_' + (i + 1), w, 96, m[1], m[2], C.white, 30);
        dropShadow(bubble, 18, 50, 18);
        var bt = text(s1, m[0], { size: 36, color: C.ink, font: SEMI, pos: [m[1], m[2] + 13], name: 'Bubble_' + (i + 1) + '_Text' });
        bt.parent = bubble;
        tr(bubble, 'rot').setValue(m[3]);
        pop(bubble, 0.6 + i * 0.13);
        // nervous shake, then everything falls away
        tr(bubble, 'pos').expression = 'if (time > 2.0 && time < 3.4) value + [wiggle(9, 6)[0] - value[0], 0]; else value;';
        animate(tr(bubble, 'opacity'), [[3.4, 100], [4.1, 0]], [33, 33]);
        animate(tr(bt, 'opacity'), [[3.4, 100], [4.1, 0]], [33, 33]); // opacity isn't inherited
        tr(bubble, 'pos').setValueAtTime(3.4, [m[1], m[2]]);
        tr(bubble, 'pos').setValueAtTime(4.2, [m[1] + (i % 2 ? 120 : -120), m[2] + 700]);
        tr(bubble, 'rot').setValueAtTime(3.4, m[3]);
        tr(bubble, 'rot').setValueAtTime(4.2, m[3] + (i % 2 ? 25 : -25));
    }
    animate(tr(h1, 'opacity'), [[3.6, 100], [4.2, 0]], [33, 33]);

    // ---------- PRE: dashboard UI (1200x700) ----------
    var ui = newComp('PRE_Dashboard_UI', 1200, 700, 6, FPS, C.bg, fPre);
    box(ui, 'Sidebar', 160, 700, 80, 350, C.ink, 32);
    box(ui, 'Content', 1090, 700, 655, 350, C.white, 32);
    box(ui, 'Side_Logo', 44, 44, 55, 70, C.violet, 12);
    for (var n = 0; n < 4; n++) box(ui, 'Side_Nav_' + (n + 1), 44, 8, 55, 150 + n * 40, n === 0 ? C.lime : hex('#4A4952'), 4);

    text(ui, 'This week', { size: 24, color: C.muted, font: MED, justify: 'left', pos: [170, 92], name: 'Label' });
    var counter = text(ui, '128 tasks', { size: 56, color: C.ink, font: BOLD, tracking: -20, justify: 'left', pos: [170, 155], name: 'Counter' });
    counter.property('ADBE Text Properties').property('ADBE Text Document').expression =
        'Math.round(linear(time, 0.6, 2.2, 0, 128)) + " tasks"';
    var badge = box(ui, 'Badge', 120, 44, 1110, 90, hex('#DDF2EA'), 22);
    var bTxt = text(ui, '+24%', { size: 24, color: C.green, font: BOLD, pos: [1110, 99], name: 'Badge_Text' });
    bTxt.parent = badge;
    pop(badge, 2.2);

    var heights = [90, 140, 110, 180, 125, 210, 160];
    for (var b = 0; b < heights.length; b++) {
        var bar = shapeLayer(ui, 'Chart_Bar_' + (b + 1));
        var bg2 = addGroup(bar, 'Bar');
        addRect(bg2, [90, heights[b]], 12);
        addFill(bg2, b === 5 ? C.violet : C.violetSoft);
        groupTr(bg2, 'pos').setValue([0, -heights[b] / 2]);
        tr(bar, 'pos').setValue([225 + b * 140, 390]);
        animate(tr(bar, 'scale'), [[0.6 + b * 0.08, [100, 0]], [1.3 + b * 0.08, [100, 100]]], [15, 85]);
    }

    var tasks = [['Update onboarding flow', 'Design', true], ['Q4 report for investors', 'Finance', true], ['Fix checkout bug on iOS', 'Dev', false]];
    for (var t = 0; t < tasks.length; t++) {
        var y = 460 + t * 76;
        var t0 = 1.6 + t * 0.2;
        var row = shapeLayer(ui, 'Task_' + (t + 1));
        var rgp = addGroup(row, 'Row');
        addRect(rgp, [960, 62], 14);
        addFill(rgp, C.white);
        addStroke(rgp, C.line, 2);
        tr(row, 'pos').setValue([655, y]);
        var chk = box(ui, 'Task_' + (t + 1) + '_Check', 26, 26, 210, y, tasks[t][2] ? C.violet : C.line, 7);
        var label = text(ui, tasks[t][0], { size: 26, color: C.ink, font: SEMI, justify: 'left', pos: [244, y + 9], name: 'Task_' + (t + 1) + '_Label' });
        var tagC = [C.violetSoft, hex('#EEF9C9'), hex('#FDE3DE')][t];
        var tag = box(ui, 'Task_' + (t + 1) + '_Tag', 110, 34, 1060, y, tagC, 17);
        var tagT = text(ui, tasks[t][1], { size: 18, color: C.ink, font: BOLD, pos: [1060, y + 6], name: 'Task_' + (t + 1) + '_TagText' });
        chk.parent = row; label.parent = row; tag.parent = row; tagT.parent = row;
        animate(tr(row, 'pos'), [[t0, [855, y]], [t0 + 0.6, [655, y]]], [20, 88]);
        animate(tr(row, 'opacity'), [[t0, 0], [t0 + 0.3, 100]], [33, 33]);
        // opacity is not inherited through parenting, so fade the children too
        var kids = [chk, label, tag, tagT];
        for (var k = 0; k < kids.length; k++) animate(tr(kids[k], 'opacity'), [[t0, 0], [t0 + 0.3, 100]], [33, 33]);

        if (tasks[t][2]) {
            var tick = shapeLayer(ui, 'Task_' + (t + 1) + '_Tick');
            var tg = addGroup(tick, 'Tick');
            addPath(tg, [[-6, 0], [-1, 5], [7, -5]], false);
            addStroke(tg, C.white, 3.5);
            var trm = addTrim(tg);
            tr(tick, 'pos').setValue([210, y]);
            tick.parent = chk;
            animate(trm.property('ADBE Vector Trim End'), [[2.8 + t * 0.35, 0], [3.1 + t * 0.35, 100]], [20, 80]);
        }
    }

    // ---------- SC02: product (6 s) ----------
    var s2 = scene('SC02_Product', 6, C.violetSoft);
    var cap = text(s2, 'Flowly turns them into tasks.', { size: 64, color: C.ink, font: BOLD, tracking: -20, pos: [960, 140], name: 'Caption' });
    charReveal(cap, 0.1, 0.6, 40, 'words');
    var uiL = s2.layers.add(ui);
    uiL.name = 'Dashboard_UI';
    tr(uiL, 'pos').setValue([960, 600]);
    dropShadow(uiL, 22, 120, 40);
    animate(tr(uiL, 'scale'), [[0, [86, 86]], [1.0, [100, 100]], [6, [104, 104]]], [20, 80]);
    animate(tr(uiL, 'opacity'), [[0, 0], [0.4, 100]], [33, 33]);

    var callout = box(s2, 'Callout_AI', 420, 110, 1560, 330, C.white, 24);
    dropShadow(callout, 20, 60, 20);
    var icon = box(s2, 'Callout_Icon', 56, 56, 1400, 330, C.lime, 16);
    var cT = text(s2, 'AI created 5 tasks', { size: 28, color: C.ink, font: BOLD, justify: 'left', pos: [1446, 322], name: 'Callout_Title' });
    var cS = text(s2, 'from "Monday sync" call', { size: 20, color: C.muted, font: MED, justify: 'left', pos: [1446, 352], name: 'Callout_Sub' });
    icon.parent = callout; cT.parent = callout; cS.parent = callout;
    pop(callout, 3.4);
    tr(callout, 'pos').expression = 'value + [0, Math.sin(time * 2) * 6];';

    // ---------- SC03: features (5 s) ----------
    var s3 = scene('SC03_Features', 5, C.ink);
    var fh = text(s3, 'Flowly does the admin.', { size: 86, color: C.white, font: BOLD, tracking: -30, pos: [960, 230], name: 'Headline' });
    charReveal(fh, 0.1, 0.6, 50);
    var feats = [['AI creates tasks', C.violet], ['Auto-assigns owners', C.lime], ['Writes weekly digests', C.rose]];
    for (var f = 0; f < feats.length; f++) {
        var x = 480 + f * 480;
        var ft0 = 0.5 + f * 0.18;
        var card = box(s3, 'Card_' + (f + 1), 420, 400, x, 620, C.card, 32);
        var dot = shapeLayer(s3, 'Card_' + (f + 1) + '_Icon');
        var dg = addGroup(dot, 'Icon');
        addEllipse(dg, [96, 96]);
        addFill(dg, feats[f][1]);
        tr(dot, 'pos').setValue([x, 540]);
        var num = text(s3, '0' + (f + 1), { size: 40, color: C.ink, font: BOLD, pos: [x, 554], name: 'Card_' + (f + 1) + '_Num' });
        var ftxt = text(s3, feats[f][0], { size: 38, color: C.white, font: BOLD, pos: [x, 700], name: 'Card_' + (f + 1) + '_Title' });
        dot.parent = card; num.parent = card; ftxt.parent = card;
        animate(tr(card, 'pos'), [[ft0, [x, 900]], [ft0 + 0.8, [x, 620]]], [20, 88]);
        var fk = [card, dot, num, ftxt];
        for (var q = 0; q < fk.length; q++) animate(tr(fk[q], 'opacity'), [[ft0, 0], [ft0 + 0.35, 100]], [33, 33]);
        animate(tr(dot, 'scale'), [[ft0 + 0.5, [0, 0]], [ft0 + 0.9, [110, 110]], [ft0 + 1.1, [100, 100]]], [15, 75]);
    }

    // ---------- SC04: end card (5.5 s) ----------
    var s4 = scene('SC04_Endcard', 5.5, C.violet);
    var bh = [70, 160, 110];
    for (var e = 0; e < 3; e++) {
        var eb = shapeLayer(s4, 'Logo_Bar_' + (e + 1));
        var eg = addGroup(eb, 'Bar');
        addRect(eg, [34, bh[e]], 17);
        addFill(eg, e === 2 ? C.lime : C.white);
        groupTr(eg, 'pos').setValue([0, -bh[e] / 2]);
        tr(eb, 'pos').setValue([672 + e * 48, 560]);
        animate(tr(eb, 'scale'), [[0.2 + e * 0.12, [100, 0]], [0.65 + e * 0.12, [100, 115]], [0.95 + e * 0.12, [100, 100]]], [15, 75]);
    }
    var ew = text(s4, 'Flowly', { size: 150, color: C.white, font: BOLD, tracking: -30, justify: 'left', pos: [800, 535], name: 'Wordmark' });
    charReveal(ew, 0.5, 0.6, 60);
    var cta = box(s4, 'CTA_Button', 520, 110, 960, 760, C.lime, 55);
    var ctaT = text(s4, 'Start your free trial', { size: 40, color: C.ink, font: BOLD, pos: [960, 774], name: 'CTA_Text' });
    ctaT.parent = cta;
    pop(cta, 1.3);
    tr(cta, 'scale').expression = 'if (time > 2.2) { s = 100 + Math.sin((time - 2.2) * 6) * 2.5; [s, s]; } else value;';

    // ========== MAIN COMP ==========
    var main = newComp('Flowly_AppPromo_1920x1080', 1920, 1080, DUR, FPS, C.bg, fComps);
    var seq = [[s1, 0], [s2, 4.2], [s3, 9.8], [s4, 14.5]];
    for (var s = 0; s < seq.length; s++) {
        var L = main.layers.add(seq[s][0]);
        L.startTime = seq[s][1];
        L.name = seq[s][0].name;
        if (s > 0) { // incoming scene: quick push-in crossfade
            var st = seq[s][1];
            animate(tr(L, 'opacity'), [[st, 0], [st + 0.35, 100]], [33, 33]);
            animate(tr(L, 'scale'), [[st, [108, 108]], [st + 0.7, [100, 100]]], [15, 85]);
        }
    }
    for (var mk = 0; mk < seq.length; mk++) main.markerProperty.setValueAtTime(seq[mk][1], new MarkerValue(seq[mk][0].name));

    main.openInViewer();
    addToRenderQueue(main, 'Flowly_AppPromo_1920x1080.mp4');
    var saved = saveProject('Flowly_AppPromo.aep');

    app.endUndoGroup();
    alert('Done! Project saved to:\n' + saved.fsName);
})();
