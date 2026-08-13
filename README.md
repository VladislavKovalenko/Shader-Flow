# Shader Flow — Figma Plugin
[Русская версия мануала](READMERU.md)

A plugin for creating and applying GLSL shaders directly in Figma. Generate textures from scratch, process images with a chain of effects, paint masks, and export the result back to the canvas.

---

## Features

| | |
|:---|:---|
| 🎨 **Live Preview** | Real-time shader rendering with instant updates as parameters change |
| 📝 **GLSL Editor** | Code editor with line numbering, instant compilation, and error highlighting |
| 🎛 **Parameters** | Sliders, color pickers, and toggles automatically generated from `uniform` variables |
| 🥞 **Layers** | Multi-layer stack: generators + effects, drag & drop, blending |
| 🎭 **Masks** | Visual mask editor: primitives, custom curves, procedural noise, custom GLSL |
| 📚 **Library** | Built-in presets + import your own custom library from a folder |
| 💾 **Chains** | Save and load layer chains (`.sfchain`) |
| 📤 **Export** | Export GLSL source code (`.txt`) and render to the canvas |
| ↩️ **Undo / Redo** | Full undo and redo support |
| 🔍 **Precise Rendering** | Pixel-perfect preview at resolutions up to **4096×4096** |
| 🎬 **Animation** | FPS counter and frame rate limiting |
| 🔎 **UI Scale** | Interface scaling from 100% to 250% |

### What It's Good For

- Procedural textures and noise
- Glitch effects and distortions
- Blurring and sharpening
- Color correction and toning
- Hand-painted style stylization
- Animated procedural shaders

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
2. Select a **Frame** on the canvas (skip this if you're working with a standalone image).
3. Select the **image layer** inside the frame.
4. Go to the **Library** tab.
5. Right-click an effect (e.g., **Chromatic Aberration**) → **Add as new layer**.
6. Go to the **Shader** tab and adjust the parameters of the added shader.
7. Apply the result:
   - **Add on top** — adds a new image on top of the existing fills.
   - **Replace** — replaces the current fill of the selected image layer.

---

## 1. Shader Tab — Editor and Preview

<img width="800" height="580" alt="Shader" src="https://github.com/user-attachments/assets/8b28cd98-a04f-4be1-84f1-1b68ea42d202" />

> The main workspace. Here you write code, configure parameters, and see the result in real time.

### Step by Step:

1. **Select a layer** in Figma.  
   If the layer contains an image, the plugin will automatically pick it up as a texture for the shader.

2. **Parameters** (left panel).  
   The plugin automatically finds all `uniform` variables in your GLSL code and creates convenient controls for them:
   - `float` / `int` — sliders with an adjustable range
   - `vec3` — color palettes with HEX input and a popup picker
   - `bool` — toggles
   - `vec2` / `vec3` — numeric fields
   - Change the values — the preview updates instantly.

3. **Shader Layers** (collapsible panel on the left).  
   A layer stack system for chaining effects:
   - Press `+` to add a layer.
   - **Generate** — layers that create an image from scratch (gradients, noise, fire).
   - **Effect** — layers that process the result of the previous layer (blur, chromatic aberration, bloom).
   - Reorder layers via drag & drop.
   - Each layer has a mask icon — click it to open the **Mask Stack Editor**.

4. **Code Editor** (center).  
   A GLSL code editor with line numbering. Write your own code or edit a loaded preset.  
   Built-in variables (available without declaration):
   - `iResolution` — canvas size
   - `iTime` — animation time in seconds
   - `iMouse` — cursor position (0..1)
   - `uTexture` / `uHasTexture` — input texture (for effects)

5. **Preview** (right panel).  
   A live WebGL preview with a transparent background (checkerboard). Control buttons:
   - `⏸` — Play / Pause animation
   - `↺` — reset time to zero
   - `⇅` / `⇆` — flip preview vertically / horizontally (preview only, does not affect export)

6. **Mask Stack Editor** (modal window).  
   Each layer can be cropped with a mask:
   - **Primitives**: Circle, Ellipse, Rectangle, Rounded Rect, Square, Polygon, Star, Line
   - **Procedural**: Noise (FBM, Cellular, Ridged, Turbulence, Billow, Value)
   - **Custom**: Free Form Curve — draw arbitrary shapes with points, smooth curves (Catmull-Rom), adjust segment curvature via right-click drag
   - **Code**: your own fragment shader for the mask
   - Settings: Invert, Strength, Feather, Edge Uneven (edge roughness), Rotation, Position, Scale

7. **Export to Canvas** (bottom panel).  
   - **Replace** — replaces the content of the selected layer with the render result.
   - **Add on top** — creates a new image on top of the selected layer.
   - **Code** — show / hide the code editor (useful if you only need the preview and parameters).

---

## 2. Library Tab — Shader Library

<img width="800" height="580" alt="Library" src="https://github.com/user-attachments/assets/4372329c-342b-46ca-8909-91d916500754" />

> A repository of ready-made shaders. Quickly load presets into the editor.

### What's Here:

- **Basic Library** — built-in presets that come with the plugin:
  - 🌊 **Noise Field** — procedural noise with customizable colors
  - 🌈 **Gradient Waves** — animated wave lines
  - 🔥 **Fire** — procedural fire via FBM noise
  - 🟣 **Plasma** — classic plasma effect
  - 🌌 **Chromatic Aberration** — color shifts at the edges
  - 💧 **Glass / Ripple** — glass / ripple effect
  - 🌫 **Gaussian Blur** — Gaussian blur
  - ✨ **Bloom** — glow for bright areas
  - ✏️ **Custom Generate** — a template for creating your own generator from scratch
  - ✏️ **Custom Effect** — a template for creating your own processing effect

- **User Library** — your own shaders.  
  To have them appear here, choose a folder containing `.txt` files in the **Settings** tab → *Shader Library*.  
  The plugin will automatically build a file tree based on subfolders.

### How to Use:

1. Click a preset in the library — it will load into the editor.
2. If it's an effect, make sure you have an image layer selected (or a generator already lower in the chain).
3. Edit the parameters and apply the result to the canvas.

---

## 3. Settings Tab — Settings and Export

<img width="800" height="580" alt="Settings" src="https://github.com/user-attachments/assets/50b401a5-77ad-41a5-9b15-4b06a8227c81" />

> Fine-tuning for rendering, interface, and file handling.

### Parameters:

| Setting | Description |
|-----------|----------|
| **Exact Preview** | When enabled, the preview matches the final image that will land in Figma as closely as possible. |
| **Show FPS** | Displays a frame counter in the corner of the preview. |
| **FPS Color** | Color of the counter: Black or White. |
| **Frame Rate** | Limits the animation FPS: 60 / 30 / 120 / Uncapped (no limit). |
| **UI Scale** | Scales the entire plugin interface from 100% to 250%. The value is preserved between sessions. |
| **Render Size** | Size of the final image on export:<br>• *Preview size* — same as the preview window<br>• *512/1024/2048/4096* — fixed square<br>• *Node size* — matches the size of the selected layer in Figma |

### Files and Chains:

- **Shader Library** — the *Choose Shader Library...* button opens a folder selection dialog. All `.txt` files in it will appear in the **User Library** (Library tab).
- **Load Chain** — load a previously saved layer chain (all effects, masks, and parameters) from a file.
- **Save Chain** — save the current layer chain to a file (convenient for transferring between projects).
- **Export Shader** — copy the GLSL source code of the currently active shader.

---

## 4. Masks — Mask Stack Editor

<img width="800" height="580" alt="Mask" src="https://github.com/user-attachments/assets/d2ba9a83-4b82-412c-a6a0-37807813c70d" />

> Masks define the area of a layer where an effect will be visible. This is a powerful tool for applying shaders locally — for example, blurring only a corner or adding a glow only in the center.

### How Masks Work

Each layer in the stack can have its own **mask stack**. A mask is a grayscale map: white areas show the layer, black areas hide it. Multiple masks on the same layer combine additively — the more masks, the wider the layer's area of effect.

Final formula:  
`result = mix(underlying layer, current layer, coverage)`

### How to Open

1. In the **Shader** tab, add any layer (Generate or Effect).
2. In the layer list, click the **mask** icon (button to the right of the layer name).
3. The **Mask Stack Editor** modal window will open.

### Mask Types

| Type | Description |
|-----|----------|
| **Circle / Ellipse** | A circle or ellipse with an adjustable radius |
| **Rectangle / Rounded Rect / Square** | A rectangle with rounded corners |
| **Polygon / Star** | A polygon or star with an adjustable number of vertices |
| **Line** | A line of a given thickness |
| **Procedural Noise** | Procedural noise (FBM, Cellular, Ridged, Turbulence, Billow, Value) as a mask — ideal for organic edges |
| **Free Form Curve** | An arbitrary closed shape. Click on the preview to add points, drag the yellow nodes, double-click to remove a point. Right-click drag on a segment changes its curvature (Catmull-Rom). Enable **Smooth (Curves)** to make all segments curved. |
| **Fragment Shader** | A fully custom GLSL mask. Write your own code, where white in the alpha channel = visible area. |

### Common Parameters

- **Enable** — turn the mask on / off.
- **Invert** — invert the mask (black ↔ white).
- **Strength** — overall opacity of the mask (0..1). Allows for partial fading.
- **Feather** — blur the mask edge. 0 = sharp edge, 1 = maximally soft transition.
- **Edge Uneven** — adds "roughness" to the shape's edge (noise). Useful for imitating torn paper, paint, or organic edges.
  - *Soft* — smooth irregularities via FBM noise.
  - *Sharp* — sharp, jagged edges.

### Visual Editing

On the right side of the **Mask Stack Editor** there is an interactive preview overlaying your image:

- **Moving** — hold LMB inside the shape and drag.
- **Scaling** — drag one of the 8 white handles on the bounding box.
- **Rotation** — drag the round handle above the top edge.
- **Free Form**:
  - LMB on empty space near a segment — inserts a new point between the nearest ones.
  - Dragging a yellow point — moves the vertex.
  - Double-click on a point — removes it.
  - RMB + drag up/down on a segment — changes curvature (tension).

### Example Workflow

1. Add a **Gaussian Blur** layer.
2. Open the **Mask Stack** and add a **Circle** mask.
3. Lower **Feather** to `0.05` so the edge is soft but not overly blurred.
4. Enable **Edge Uneven** at `0.3` (Soft) — the circle's edge becomes slightly "torn," like watercolor.
5. Drag the circle in the preview to the desired area of the image.
6. Close the editor. Now the blur is applied only inside the circle.

---

## 💡 Tips

- **Parameters from code**: just write `uniform float uMyValue;` in the shader — a slider will automatically appear in the Parameters panel.
- **Colors**: to get a color picker, name a `vec3` variable with a `Color` / `Col` / `color` / `col` suffix, for example: `uniform vec3 uGlowColor;`
- **Masks**: you can combine multiple masks on a single layer. They combine additively.
- **Performance**: heavy effects (blur, bloom) are better implemented as separate layers rather than as one giant shader.

---

*If you find a bug or want to suggest a feature, please create an Issue in this repository.*
