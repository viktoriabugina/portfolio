// Glow Studio — Beauty Reel 9:16
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
//  BUILD: Glow Studio — beauty Reel (1080x1920, 15 s, 30 fps)
//  Kinetic typography promo for Instagram Reels / TikTok
// ============================================================
(function build() {
    if (!startProject()) return;
    app.beginUndoGroup('Build Glow Studio Reel');

    var C = {
        blush: hex('#F6D6C8'), rose: hex('#C98E7A'), cocoa: hex('#3A2620'),
        cream: hex('#FFF6F0'), gold: hex('#D9A86C')
    };
    var W = 1080, H = 1920, FPS = 30, DUR = 15;
    var SANS = 'Montserrat-ExtraBold', SANS_M = 'Montserrat-Medium', SERIF = 'PlayfairDisplay-Italic';

    var fComps = binFolder('01_Comps');
    var fPre = binFolder('02_Precomps');
    binFolder('03_Assets');
    binFolder('04_Audio');

    function scene(name, dur, color) {
        var c = newComp(name, W, H, dur, FPS, color, fPre);
        var bg = c.layers.addSolid(color, 'BG', W, H, 1);
        bg.locked = true;
        return c;
    }

    // ---------- SCENE 1: GLOW studio (3 s) ----------
    var s1 = scene('SC01_Intro', 3, C.blush);
    var glow = text(s1, 'GLOW', { size: 300, color: C.cocoa, font: SANS, tracking: -20, pos: [540, 960], name: 'Glow' });
    charReveal(glow, 0.15, 0.6, 140);
    animate(tr(glow, 'scale'), [[0.15, [118, 118]], [1.4, [100, 100]]], [10, 80]);
    var studio = text(s1, 'studio', { size: 170, color: C.rose, font: SERIF, pos: [540, 1150], name: 'Studio' });
    charReveal(studio, 0.6, 0.6, 80);
    animate(tr(studio, 'rot'), [[0.6, -8], [1.5, -4]], [10, 80]);
    var sub1 = text(s1, 'BEAUTY BAR · KYIV', { size: 42, color: C.cocoa, font: SANS_M, tracking: 300, pos: [540, 1400], name: 'Sub' });
    animate(tr(sub1, 'opacity'), [[1.0, 0], [1.5, 100]], [33, 60]);

    // ---------- SCENE 2: services list (3.5 s) ----------
    var s2 = scene('SC02_Services', 3.5, C.cocoa);
    var pill = box(s2, 'Highlight_Pill', 760, 210, 540, 960, C.rose, 105);
    animate(tr(pill, 'scale'), [[1.1, [0, 100]], [1.6, [100, 100]]], [15, 85]);
    var words = ['Brows', 'Lashes', 'Skin'];
    for (var i = 0; i < words.length; i++) {
        var w = text(s2, words[i], { size: 190, color: C.cream, font: SANS, tracking: -10, pos: [540, 740 + i * 280], name: 'Word_' + words[i] });
        charReveal(w, 0.15 + i * 0.3, 0.5, 120);
    }
    var s2top = text(s2, 'we do', { size: 90, color: C.gold, font: SERIF, pos: [540, 520], name: 'We_do' });
    animate(tr(s2top, 'opacity'), [[0, 0], [0.4, 100]], [33, 60]);

    // ---------- SCENE 3: offer (3.5 s) ----------
    var s3 = scene('SC03_Offer', 3.5, C.cream);
    var ring = shapeLayer(s3, 'Circle_Draw');
    var rg = addGroup(ring, 'Circle');
    addEllipse(rg, [860, 620]);
    addStroke(rg, C.rose, 10);
    var trim = addTrim(rg);
    tr(ring, 'pos').setValue([540, 900]);
    tr(ring, 'rot').setValue(-8);
    animate(trim.property('ADBE Vector Trim End'), [[0.4, 0], [1.3, 100]], [15, 85]);
    var pct = text(s3, '-20%', { size: 330, color: C.cocoa, font: SANS, tracking: -30, pos: [540, 1010], name: 'Discount' });
    animate(tr(pct, 'scale'), [[0.1, [0, 0]], [0.55, [112, 112]], [0.9, [100, 100]]], [15, 75]);
    var first = text(s3, 'on your first visit', { size: 74, color: C.rose, font: SERIF, pos: [540, 1340], name: 'First_visit' });
    charReveal(first, 0.9, 0.7, 40, 'words');

    // ---------- SCENE 4: price list (3 s) ----------
    var s4 = scene('SC04_Prices', 3, C.blush);
    var title = text(s4, 'Price list', { size: 110, color: C.cocoa, font: SERIF, pos: [540, 560], name: 'Title' });
    charReveal(title, 0.05, 0.5, 60);
    var rows = [['Brow shaping', '$25'], ['Lash lift', '$40'], ['Glow facial', '$55']];
    for (var r = 0; r < rows.length; r++) {
        var y = 800 + r * 230;
        var t0 = 0.3 + r * 0.15;
        var row = box(s4, 'Row_' + (r + 1), 900, 180, 540, y, C.cream, 40);
        var name = text(s4, rows[r][0], { size: 58, color: C.cocoa, font: SANS_M, justify: 'left', pos: [150, y + 20], name: 'Row_' + (r + 1) + '_Name' });
        var price = text(s4, rows[r][1], { size: 64, color: C.rose, font: SANS, pos: [880, y + 22], name: 'Row_' + (r + 1) + '_Price' });
        name.parent = row;
        price.parent = row;
        animate(tr(row, 'pos'), [[t0, [1700, y]], [t0 + 0.7, [540, y]]], [20, 88]);
        row.motionBlur = true;
    }

    // ---------- SCENE 5: end card (2 s) ----------
    var s5 = scene('SC05_Endcard', 2, C.cocoa);
    var logo = text(s5, 'GLOW', { size: 160, color: C.cream, font: SANS, tracking: -20, pos: [540, 760], name: 'Logo_Glow' });
    var logo2 = text(s5, 'studio', { size: 100, color: C.gold, font: SERIF, pos: [540, 870], name: 'Logo_Studio' });
    animate(tr(logo, 'opacity'), [[0, 0], [0.3, 100]], [33, 60]);
    animate(tr(logo2, 'opacity'), [[0.1, 0], [0.4, 100]], [33, 60]);
    var btn = box(s5, 'Button_Book', 560, 150, 540, 1120, C.gold, 75);
    var btnTxt = text(s5, 'Book now', { size: 60, color: C.cocoa, font: SANS, pos: [540, 1142], name: 'Button_Text' });
    btnTxt.parent = btn;
    animate(tr(btn, 'scale'), [[0.2, [0, 0]], [0.6, [108, 108]], [0.85, [100, 100]]], [15, 75]);
    tr(btn, 'scale').expression = 'if (time > 0.9) { s = 100 + Math.sin((time - 0.9) * 8) * 3; [s, s]; } else value;';
    var handle = text(s5, '@glowstudio', { size: 48, color: C.blush, font: SANS_M, tracking: 60, pos: [540, 1340], name: 'Handle' });
    animate(tr(handle, 'opacity'), [[0.5, 0], [0.9, 100]], [33, 60]);

    // ========== MAIN COMP: sequence scenes + wipes ==========
    var main = newComp('GlowStudio_Reel_1080x1920', W, H, DUR, FPS, C.cocoa, fComps);
    var scenes = [[s1, 0], [s2, 3], [s3, 6.5], [s4, 10], [s5, 13]];
    for (var s = 0; s < scenes.length; s++) {
        var L = main.layers.add(scenes[s][0]);
        L.startTime = scenes[s][1];
        L.name = scenes[s][0].name;
    }

    // wipe transitions at every cut (a rose panel sweeping up)
    var cuts = [3, 6.5, 10, 13];
    for (var c = 0; c < cuts.length; c++) {
        var wipe = box(main, 'TR_Wipe_' + (c + 1), W + 40, H + 600, 540, 960, c % 2 ? C.gold : C.rose, 0);
        wipe.inPoint = cuts[c] - 0.35;
        wipe.outPoint = cuts[c] + 0.4;
        animate(tr(wipe, 'pos'), [[cuts[c] - 0.35, [540, 960 + H + 300]], [cuts[c], [540, 960]], [cuts[c] + 0.4, [540, 960 - H - 300]]], [40, 70]);
        wipe.motionBlur = true;
    }

    // Reels safe zones — guide layer, never rendered
    var guide = shapeLayer(main, 'GUIDE_Reels_Safe_Zones');
    var gTop = addGroup(guide, 'Top_UI');
    addRect(gTop, [W, 220], 0); addFill(gTop, [1, 0, 0]);
    groupTr(gTop, 'pos').setValue([0, -H / 2 + 110]);
    var gBot = addGroup(guide, 'Bottom_UI');
    addRect(gBot, [W, 420], 0); addFill(gBot, [1, 0, 0]);
    groupTr(gBot, 'pos').setValue([0, H / 2 - 210]);
    tr(guide, 'pos').setValue([540, 960]);
    tr(guide, 'opacity').setValue(25);
    guide.guideLayer = true;
    guide.locked = true;

    for (var m = 0; m < scenes.length; m++) main.markerProperty.setValueAtTime(scenes[m][1], new MarkerValue(scenes[m][0].name));

    main.openInViewer();
    addToRenderQueue(main, 'GlowStudio_Reel_1080x1920.mp4');
    var saved = saveProject('GlowStudio_Reel.aep');

    app.endUndoGroup();
    alert('Done! Project saved to:\n' + saved.fsName + '\n\nAdd music to 05_Audio and import it into the 04_Audio bin.');
})();
