# Shader Flow — Figma Plugin

[Русская версия мануала](READMERU.md)

A powerful Figma plugin for creating, editing, compositing, and applying GLSL shaders directly to the canvas. Generate textures from scratch, process images with chains of effects, paint vector and procedural masks, apply a global Master Mask, and export the result back to Figma.

---

## Features

| | |
|:---|:---|
| 🎨 **Live Preview** | Real-time shader rendering with instant updates as parameters change |
| 📝 **GLSL Editor** | Code editor with line numbering, instant compilation, error highlighting, and error copying |
| 🎛️ **Smart Uniforms** | Controls are generated automatically from `uniform` variables, with smart ranges inferred from variable names |
| 🎨 **Auto Color Picker** | `vec3` uniforms containing `Color`, `color`, `Col`, or `col` in their names automatically receive a color picker |
| 🥞 **Layers** | Multi-layer stack with generators and effects, drag & drop reordering, blending, and inline renaming |
| 🎭 **Masks** | Per-layer mask stacks with primitives, procedural noise, custom Bezier curves, and GLSL masks |
| 🎭 **Master Mask** | A global mask applied after compositing all layers |
| 📚 **Visual Preset Browser** | Built-in and custom shader presets displayed as preview cards with live WebGL thumbnails |
| 💾 **Shader and Chain Files** | Save and load individual shaders (`.sfshader`) or complete layer chains (`.sfchain`) |
| 📤 **Export** | Export shaders, chains, and rendered results to the Figma canvas |
| ↩️ **Undo / Redo** | Full undo and redo support |
| 🔍 **Ultra-HD Rendering** | Pixel-accurate rendering at resolutions up to **8192×8192** |
| 🎬 **Animation** | FPS counter, frame-rate limiting, and animation controls |
| 🔎 **UI Scale** | Interface scaling from 100% to 250% in 10% increments |
| 🖱️ **Resizable Window** | Resize the plugin from the bottom-right corner, from 480×360 to 2000×1400 |
| 💡 **Tooltips** | Contextual tooltips for buttons, controls, sliders, and parameters |

### What It's Good For

- Procedural textures and noise
- Domain-warped fields and volumetric effects
- Glitch effects and image distortions
- Blurring, sharpening, bloom, and glow
- Color correction and cinematic toning
- Hand-painted and organic stylization
- Local effects controlled by masks
- Vignettes, framed compositions, and final-image cropping
- Animated procedural shaders
- Exporting reusable shader presets and effect chains

---

## Installation

> The **Figma desktop app** is required to install developer plugins.

1. Right-click on the canvas.
2. Select **Plugins → Development → Import plugin from manifest**.
3. In the file browser that opens, navigate to the plugin's source code folder and select the `manifest.json` file.
4. Launch the plugin: it will appear in **Plugins → Development → Shader Flow**. Click it to run.

---

## 🚀 Quick Start

1. Launch **Shader Flow**.
2. Select a **Frame** on the canvas. Skip this step if you are working with a standalone image.
3. Select the **image layer** inside the frame.
4. Open the **Library** tab.
5. Double-click a preset, or right-click it and choose **Add as new layer**.
6. Open the **Shader** tab and adjust the parameters of the added shader.
7. Optionally add a per-layer mask or configure the global **Master Mask**.
8. Apply the result:
   - **Add on top** — creates a new image above the existing fills.
   - **Replace** — replaces the current fill of the selected image layer.

---

## 1. Shader Tab — Editor and Preview

<img width="800" height="580" alt="Снимок экрана 2026-08-18 114855" src="https://github.com/user-attachments/assets/a7b60188-245a-4542-b037-1863bd4500fd" />


> The main workspace. Here you write code, configure parameters, manage layers and masks, and see the result in real time.

### Step by Step

1. **Select a layer in Figma.**  
   If the layer contains an image, the plugin automatically uses it as a texture for the shader.

2. **Parameters** (left panel).  
   The plugin scans the GLSL code and creates controls for all supported `uniform` variables:
   - `float` / `int` — sliders with automatically detected ranges
   - `vec3` with `Color`, `color`, `Col`, or `col` in the name — color picker with HEX input
   - `bool` — toggles
   - `vec2` / other numeric vectors — numeric fields
   - Changes are reflected in the preview instantly.

3. **Shader Layers** (collapsible panel on the left).  
   The layer stack is used to combine generators and effects:
   - Press `+` to open the visual preset browser and add a layer.
   - **Generate** — creates an image from scratch, such as gradients, noise, fire, or plasma.
   - **Effect** — processes the result of the previous layer, such as blur, bloom, or chromatic aberration.
   - Double-click a layer name to rename it inline.
   - Press `Enter` to confirm a new name.
   - Press `Escape` to cancel renaming.
   - Drag and drop layers to change their order.
   - The top layer in the list is rendered last.
   - Each layer has a mask button. Click it to open the **Mask Stack Editor**.

4. **Master Mask** (bottom panel).  
   The Master Mask is a global mask applied after all shader layers have been composited. It affects the final result rather than an individual layer. Use it for:
   - Vignettes
   - Cropping the final result
   - Framed compositions
   - Rounded or irregular final-image boundaries
   - Global fade and edge effects

5. **Code Editor** (center).  
   A GLSL code editor with line numbering. Write your own code or edit a loaded preset.

   Built-in variables available without declaration:

   - `iResolution` — canvas size
   - `iTime` — animation time in seconds
   - `iMouse` — cursor position in the range `0..1`
   - `uTexture` / `uHasTexture` — input texture and texture availability flag

   The divider between the code editor and preview can be dragged horizontally to allocate more space to either panel.

6. **Preview** (right panel).  
   A live WebGL preview with a transparent checkerboard background.

   Preview controls:

   - `⏸` — play or pause animation
   - `↺` — reset animation time to zero
   - `⇅` — flip preview vertically
   - `⇆` — flip preview horizontally

   Preview flipping is for viewing only and does not affect the exported result.

7. **Error Bar**.  
   GLSL compilation errors appear below the editor. Use the **Copy** button to copy the complete error message to the clipboard.

8. **Show / Hide Code Editor**.  
   Click `</> Code` in the bottom panel to hide the code editor. This is useful when you want to work only with parameters and the preview.

9. **Export to Canvas** (bottom panel).
   - **Replace** — replaces the content of the selected layer with the render result.
   - **Add on top** — creates a new image above the selected layer.
   - **Master Mask** — opens the global mask editor.
   - `</> Code` — shows or hides the code editor.

---

### Smart Uniforms

Shader Flow automatically determines slider ranges from uniform names. This makes presets easier to use without requiring additional metadata in the shader code.

| Variable name | Automatically detected range |
|:---|:---|
| `uAngle`, `uRotation` | `0..360` |
| `uCount`, `uTiles` | `1..100` |
| `uSpeed`, `uFrequency` | `0..5` |
| `uOpacity`, `uMix` | `0..1` |
| `uOffset`, `uShift` | `-1..1` |

You can override the automatic range with an inline comment:

```glsl
uniform float uAngle; // @range -45 45
```

### Auto Color Picker

Any `vec3` uniform whose name contains `Color`, `color`, `Col`, or `col` automatically receives a color picker with HEX input and a popup palette.

```glsl
uniform vec3 uGlowColor;
uniform vec3 uAccentCol;
uniform vec3 uColorDeep;
```

---

## 2. Library Tab — Shader Library

<img width="800" height="580" alt="Снимок экрана 2026-08-18 120056" src="https://github.com/user-attachments/assets/2944e489-25ad-4efc-ab09-4ae7d4c6dab5" />

> A visual repository of ready-made shaders. Presets are displayed as cards with live WebGL preview thumbnails.

### What's Here

- **Basic Library** — built-in presets that come with the plugin:
  - 🌊 **Quantum Field** — hydrodynamic domain warping with caustics
  - 🌈 **Gradient Waves** — animated wave lines
  - 🔥 **Fire** — advanced procedural fire with a particle-based spark system
  - 🟣 **Plasma Storm** — volumetric plasma with Voronoi lightning
  - 🌌 **Chromatic Aberration** — color shifts at the edges
  - 💧 **Glass / Ripple** — glass and ripple distortion
  - 🌫 **Gaussian Blur** — Gaussian blur
  - ✨ **Bloom** — glow for bright areas
  - ✏️ **Custom Generate** — a template for creating a generator from scratch
  - ✏️ **Custom Effect** — a template for creating an image-processing effect

- **User Library** — your own shaders and chains.

### File Icons

Files in the library use colored icons according to their type:

| Icon | File type | Description |
|:---:|:---|:---|
| ◆ | `.sfshader` | Single shader with code, parameters, and masks |
| ⛓ | `.sfchain` | Complete layer chain with masks and render settings |
| ≡ | `.txt` | GLSL source file |

### How to Use

1. Browse presets in the two-column visual grid.
2. Hover over a card to preview its interactive state.
3. Double-click a `.txt` or `.sfshader` file to add it as a new layer.
4. Alternatively, right-click a `.txt` or `.sfshader` file and choose **Add as new layer**.
5. Right-click a `.sfchain` file and choose **Load Chain**.
6. If the selected preset is an effect, make sure an image layer or generator exists below it in the chain.
7. Edit the parameters and apply the result to the canvas.

### User Library

To use your own shader library, open **Settings → Shader Library** and choose a folder containing `.txt`, `.sfshader`, or `.sfchain` files.

The plugin automatically builds a file tree based on subfolders. The selected folder path and library contents are cached between sessions using `figma.clientStorage`, so you do not need to choose the folder again every time the plugin starts.

---

## 3. Settings Tab — Settings and Export

<img width="800" height="580" alt="Снимок экрана 2026-08-18 120204" src="https://github.com/user-attachments/assets/c8fc2320-4426-4b09-9d46-1e2950972ea1" />

> Fine-tune rendering, interface behavior, library files, and export options.

### Rendering

| Setting | Description |
|:---|:---|
| **Exact Preview** | Disables CSS smoothing so the preview matches the rendered image that will be placed in Figma as closely as possible. |
| **Show FPS** | Displays a frame counter in the corner of the preview. |
| **FPS Color** | Sets the counter color: Black or White. |
| **Frame Rate** | Limits animation FPS: 60, 30, 120, or Uncapped. |
| **Render Size** | Sets the size of the final exported image. |
| **Preview size** | Uses the current preview dimensions. |
| **512 / 1024 / 2048 / 4096 / 8192** | Exports to a fixed square resolution. |
| **Node size** | Matches the size of the selected Figma layer. |
| **Image Origin** | Uses the original dimensions of the loaded image in Figma, preserving its native resolution. |

### Interface

| Setting | Description |
|:---|:---|
| **UI Scale** | Scales the entire plugin interface from 100% to 250% in 10% increments. The value is saved between sessions. |
| **Window Size** | Resize the plugin from the bottom-right corner. The supported range is 480×360 to 2000×1400. The window size is preserved between sessions. |

### Files and Chains

- **Shader Library** — the **Choose Shader Library...** button opens a folder selection dialog. All supported shader and chain files inside it appear in the **User Library**.
- **Load Shader** — load a single shader from a `.sfshader` file.
- **Save Shader** — save the active shader, including its code, parameters, and masks, as a `.sfshader` JSON file.
- **Load Chain** — load a complete layer chain, including layers, masks, Master Mask, and render settings, from a `.sfchain` JSON file.
- **Save Chain** — save the current layer chain to a `.sfchain` JSON file.
- **Export Shader** — export the source and configuration of the active shader as a `.sfshader` file.

### Export Formats

#### `.sfshader`

A JSON file containing:

- GLSL source code
- Uniform values and parameter settings
- Per-layer masks
- Shader metadata

#### `.sfchain`

A JSON file containing:

- The complete layer stack
- Generator and effect layers
- Per-layer masks
- Master Mask
- Layer order and blending settings
- Render settings

---

## 4. Masks — Mask Stack Editor

<img width="1174" height="850" alt="Снимок экрана 2026-08-18 120807" src="https://github.com/user-attachments/assets/a381c22c-7745-4aa9-8447-170f6d754672" />

> Masks define the area of a layer where an effect is visible. They are useful for applying shaders locally, such as blurring only one corner or adding glow to the center of an image.

### How Masks Work

Each shader layer can have its own mask stack. A mask is a grayscale map:

- White areas show the layer.
- Black areas hide the layer.
- Gray areas partially reveal the layer.

Multiple masks on the same layer combine additively. The final layer result follows this principle:

```text
result = mix(underlying layer, current layer, coverage)
```

The **Master Mask** is applied after all layers have been composited and controls the visibility of the final result.

### How to Open

1. In the **Shader** tab, add a Generate or Effect layer.
2. Click the mask icon to the right of the layer name.
3. The **Mask Stack Editor** modal window opens.
4. To edit the final composite, use the **Master Mask** button in the bottom panel.

### Mask Types

| Type | Description |
|:---|:---|
| **Circle / Ellipse** | A circle or ellipse with an adjustable radius and scale. |
| **Rectangle / Rounded Rect / Square** | A rectangle with optional rounded corners. |
| **Polygon / Star** | A polygon or star with an adjustable number of vertices. |
| **Line** | A line with adjustable thickness. |
| **Procedural Noise** | Procedural noise masks: FBM, Cellular, Ridged, Turbulence, Billow, and Value. |
| **Free Form Bezier** | A vector curve editor with corner anchors, smooth anchors, and Bezier handles. |
| **Fragment Shader** | A fully custom GLSL mask. White alpha values represent visible areas. |

### Free Form Bezier Editor

**Free Form Bezier** is a full vector curve editor modeled after workflows familiar from Illustrator and Figma.

- Yellow squares are **Corner anchors**.
- Orange circles are **Smooth anchors** with symmetrical handles.
- Green and blue lines are Bezier handles that control curve direction and curvature.
- Click a segment to add a new anchor.
- Double-click an anchor to switch between **Smooth** and **Corner**.
- `Alt` + double-click an anchor to delete it.
- `Alt` + drag a handle to make the handles independent.
- `Ctrl/Cmd` + click a handle to reset it.
- Right-click an anchor to delete it.

### Common Parameters

- **Enable** — turn the mask on or off.
- **Invert** — invert the mask.
- **Strength** — overall mask opacity from `0..1`.
- **Feather** — soften the mask edge. `0` is sharp; `1` is the softest transition.
- **Edge Uneven** — adds noise-based roughness to the edge.
  - **Soft** — smooth FBM-based irregularities.
  - **Sharp** — jagged and torn-looking edges.
- **Rotation** — rotate the mask.
- **Position** — move the mask.
- **Scale** — change the mask size.

### Visual Editing

The right side of the **Mask Stack Editor** contains an interactive preview overlaid on the image:

- Hold LMB inside the shape and drag to move it.
- Drag one of the eight white bounding-box handles to scale it.
- Drag the round handle above the top edge to rotate it.
- Double-click a mask name to rename it inline.
- Press `Enter` to confirm the new name.
- Press `Escape` to cancel renaming.

For **Free Form Bezier** masks:

- Click a segment to insert a new anchor.
- Drag an anchor to move it.
- Double-click an anchor to switch its type.
- Use the modifier-key shortcuts to delete anchors or edit handle symmetry.
- Drag Bezier handles to control the curvature of each segment.

### Example Workflow

1. Add a **Gaussian Blur** layer.
2. Open the layer's mask stack and add a **Circle** mask.
3. Set **Feather** to `0.05` for a soft but defined edge.
4. Enable **Edge Uneven** at `0.3` in **Soft** mode.
5. Move the circle to the desired area of the image.
6. Close the editor. The blur is now applied only inside the circle.

To apply a vignette to the entire composition:

1. Click **Master Mask** in the bottom panel.
2. Add an **Ellipse** or custom **Free Form Bezier** mask.
3. Invert the mask or adjust its feathering.
4. Apply the result to the canvas.

---

## 5. Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + Enter` | Force shader compilation |
| `Tab` | Insert two spaces in the code editor |
| `Enter` | Confirm inline renaming |
| `Escape` | Cancel inline renaming |

---

## 💡 Pro Tips

- **Smart parameter ranges:** use descriptive uniform names such as `uAngle`, `uSpeed`, `uOpacity`, or `uOffset` to receive useful slider ranges automatically.
- **Custom ranges:** override an automatic range with an inline comment:

  ```glsl
  uniform float uAngle; // @range -45 45
  ```

- **Color pickers:** name `vec3` uniforms with a `Color`, `color`, `Col`, or `col` suffix:

  ```glsl
  uniform vec3 uGlowColor;
  ```

- **Master Mask:** use it for vignettes, framed layouts, final cropping, or effects that must affect the complete composite.
- **Layer masks:** combine several masks on one layer to create complex coverage shapes.
- **Bezier masks:** use Corner anchors for angular shapes and Smooth anchors for organic curves.
- **Library workflow:** double-click a shader to add it quickly; use the context menu when you need to load a complete `.sfchain`.
- **Preview layout:** drag the divider between the editor and preview to focus on either code or visual output.
- **Performance:** heavy effects such as blur and bloom are usually easier to control and optimize as separate layers instead of one large shader.
- **Exact Preview:** enable it when pixel-level correspondence with the final Figma render is important.
- **Export quality:** choose **Image Origin** to preserve the original resolution of the loaded image, or **8192** for Ultra-HD square output.

---

If you find a bug or want to suggest a feature, please create an Issue in this repository.
