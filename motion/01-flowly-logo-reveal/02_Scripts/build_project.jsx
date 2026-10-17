// Flowly — Logo Reveal
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
//  BUILD: Flowly — Logo Reveal (1920x1080, 6 s, 30 fps)
// ============================================================
(function build() {
    if (!startProject()) return;
    app.beginUndoGroup('Build Flowly Logo Reveal');

    var C = {
        ink: hex('#121117'), ink2: hex('#2A1F6E'), violet: hex('#5B3DF5'),
        lime: hex('#D4F86B'), white: hex('#FFFFFF'), muted: hex('#A9A7B0')
    };
    var FPS = 30, DUR = 6;

    // ---- Project panel structure ----
    var fComps = binFolder('01_Comps');
    var fPre = binFolder('02_Precomps');
    binFolder('03_Assets');
    binFolder('04_Audio');

    // ========== PRECOMP: logo mark (3 bars + ring) ==========
    var mark = newComp('PRE_Logo_Mark', 400, 400, DUR, FPS, C.ink, fPre);
    var bars = [
        { name: 'Bar_1', h: 70,  x: 152, color: C.violet, t: 0.25 },
        { name: 'Bar_2', h: 160, x: 200, color: C.violet, t: 0.40 },
        { name: 'Bar_3', h: 110, x: 248, color: C.lime,   t: 0.55 }
    ];
    var BASE_Y = 280;

    // ring burst (bottom of stack)
    var ring = shapeLayer(mark, 'Ring_Burst');
    var rg = addGroup(ring, 'Ring');
    addEllipse(rg, [220, 220]);
    addStroke(rg, C.lime, 4);
    tr(ring, 'pos').setValue([200, 210]);
    animate(tr(ring, 'scale'), [[0.85, [40, 40]], [1.6, [140, 140]]], [5, 80]);
    animate(tr(ring, 'opacity'), [[0.85, 100], [1.6, 0]], [30, 60]);
    ring.inPoint = 0.85; ring.outPoint = 1.7;

    for (var i = 0; i < bars.length; i++) {
        var b = bars[i];
        var l = shapeLayer(mark, b.name);
        var g = addGroup(l, 'Bar');
        addRect(g, [34, b.h], 17);
        addFill(g, b.color);
        groupTr(g, 'pos').setValue([0, -b.h / 2]); // pivot at the bottom of the bar
        tr(l, 'pos').setValue([b.x, BASE_Y]);
        l.motionBlur = true;
        // grow with overshoot
        animate(tr(l, 'scale'), [[b.t, [100, 0]], [b.t + 0.45, [100, 116]], [b.t + 0.8, [100, 100]]], [15, 75]);
        // subtle "breathing" after the reveal
        tr(l, 'scale').expression =
            't0 = ' + (b.t + 1.2).toFixed(2) + ';\n' +
            'if (time > t0) { s = Math.sin((time - t0) * 2 + ' + i + ') * 3; value + [0, s]; } else value;';
    }

    // ========== MAIN COMP ==========
    var main = newComp('Flowly_LogoReveal_1920x1080', 1920, 1080, DUR, FPS, C.ink, fComps);

    // background with soft radial glow
    var bg = main.layers.addSolid(C.ink, 'BG_Gradient', 1920, 1080, 1);
    var ramp = fx(bg, 'ADBE Ramp');
    if (ramp) {
        ramp.property('ADBE Ramp-0001').setValue([960, 400]);
        ramp.property('ADBE Ramp-0002').setValue(C.ink2);
        ramp.property('ADBE Ramp-0003').setValue([960, 1300]);
        ramp.property('ADBE Ramp-0004').setValue(C.ink);
        ramp.property('ADBE Ramp-0005').setValue(2); // radial
    }
    bg.locked = true;

    // logo mark: centered, then slides left to make room for the wordmark
    var markL = main.layers.add(mark);
    markL.name = 'Logo_Mark';
    markL.motionBlur = true;
    animate(tr(markL, 'pos'), [[1.5, [960, 540]], [2.25, [720, 540]]], [30, 90]);

    // wordmark revealed through a matte
    var word = text(main, 'Flowly', { size: 150, color: C.white, font: 'Manrope-ExtraBold', tracking: -30, justify: 'left', pos: [820, 594], name: 'Wordmark' });
    word.motionBlur = true;
    animate(tr(word, 'pos'), [[1.65, [700, 594]], [2.4, [820, 594]]], [25, 90]);
    animate(tr(word, 'opacity'), [[1.65, 0], [1.9, 100]], [33, 33]);

    var matte = box(main, 'MATTE_Wordmark', 760, 320, 1180, 540, C.white, 0);
    setMatte(word, matte, TrackMatteType.ALPHA);

    // tagline
    var tag = text(main, "Your team's routine, on autopilot", { size: 38, color: C.muted, font: 'Manrope-Medium', tracking: 20, pos: [960, 800], name: 'Tagline' });
    charReveal(tag, 2.5, 0.9, 30, 'words');

    // lime underline that draws in
    var line = shapeLayer(main, 'Accent_Line');
    var lg = addGroup(line, 'Line');
    addPath(lg, [[-120, 0], [120, 0]], false);
    addStroke(lg, C.lime, 5);
    var trim = addTrim(lg);
    tr(line, 'pos').setValue([960, 850]);
    animate(trim.property('ADBE Vector Trim End'), [[3.1, 0], [3.8, 100]], [20, 85]);

    // gentle camera push on everything
    var cam = main.layers.addNull(DUR);
    cam.name = 'CTRL_Camera_Push';
    tr(cam, 'pos').setValue([960, 540]);
    var kids = [markL, word, matte, tag, line];
    for (var k = 0; k < kids.length; k++) kids[k].parent = cam;
    animate(tr(cam, 'scale'), [[0, [100, 100, 100]], [DUR, [106, 106, 100]]], [33, 33]);

    // markers for the client / editor
    main.markerProperty.setValueAtTime(0.25, new MarkerValue('Bars grow'));
    main.markerProperty.setValueAtTime(1.5, new MarkerValue('Mark slides, wordmark in'));
    main.markerProperty.setValueAtTime(2.5, new MarkerValue('Tagline'));
    main.markerProperty.setValueAtTime(4.2, new MarkerValue('Hold / end card'));

    main.openInViewer();
    addToRenderQueue(main, 'Flowly_LogoReveal_1920x1080.mp4');
    var saved = saveProject('Flowly_LogoReveal.aep');

    app.endUndoGroup();
    alert('Done! Project saved to:\n' + saved.fsName + '\n\nRender: Composition > Add to Render Queue is already set up (06_Renders).');
})();
