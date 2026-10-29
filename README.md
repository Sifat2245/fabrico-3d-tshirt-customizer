# Fabrico

**Your ideas. Your T-shirt.**

Fabrico is a web-based T-shirt design studio built with Next.js, React, and Three.js. Visitors can explore an animated 3D landing page, choose a design starting point, customize a garment, and add their design to a browser-persisted shopping bag.

The experience centers on creating apparel: a live garment preview, tools for colors and artwork, and a workspace that adapts to desktop and mobile screens. The public pages and editor share a cool neutral palette, electric-blue accents, and locally hosted typography.

**Current status:** the design studio and local bag flow are implemented. Authentication screens, product reviews, and checkout are frontend interfaces or simulations; there is no connected authentication service, order backend, or payment processing.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Commands](#commands)
- [Routes](#routes)
- [Project structure](#project-structure)
- [Application architecture](#application-architecture)
- [Templates and studio links](#templates-and-studio-links)
- [Browser storage](#browser-storage)
- [3D models and assets](#3d-models-and-assets)
- [Theme and animation](#theme-and-animation)
- [Bag and pricing](#bag-and-pricing)
- [Validation](#validation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Current limitations](#current-limitations)
- [Development conventions](#development-conventions)

## Features

### Public experience

- Interactive 3D T-shirt hero with live color selection, an artwork toggle, drag-to-rotate controls, and a button to view the other side.
- GSAP entrance animations, scroll-triggered reveals, and scroll-driven garment rotation in the customization walkthrough.
- A collection of editable starting points with category filters.
- Studio introduction, frequently asked questions, shared navigation, and footer.
- Links that carry the selected template and color directly into the editor.
- Responsive navigation and layouts, keyboard focus styles, and reduced-motion handling for the landing animations and automatic model rotation.

### Design studio

- Live front and back garment textures rendered on the supplied 3D model.
- Unified or separate front/back body colors, design colors, and geometric design patterns.
- Built-in fabric patterns and uploaded pattern images.
- Text layers with font selection, color, positioning, size, rotation, spacing, curved text, outlines, and shadows.
- PNG, JPEG, SVG, and WebP image/logo uploads, with placement, scaling, rotation, opacity, and layer controls.
- A shared layer order used when composing artwork into garment textures.
- Browser-local design persistence and restoration of image and pattern caches.
- A desktop settings panel, mobile tool drawers, an order summary, size selection, and quantity controls.
- Model loading feedback and preview error boundaries.

### Shopping bag

- Add a customized T-shirt with its selected size, quantity, and calculated price.
- Capture the current 3D viewport as the bag thumbnail, with a garment poster as a fallback.
- Update quantities, remove items, and clear the bag.
- Persist bag contents in the current browser.

## Technology stack

Dependency ranges below reflect [package.json](package.json); [package-lock.json](package-lock.json) records the resolved installation.

| Technology | Version/range | Role |
| --- | --- | --- |
| Next.js | `16.2.10` | App Router, layouts, metadata, image optimization, and production builds |
| React / React DOM | `19.2.4` | Components, hooks, and application state |
| TypeScript | `^5` | Strict type checking |
| Tailwind CSS | `^4` | Utility styling, alongside route-specific CSS |
| GSAP | `^3.15.0` | Landing-page animation and ScrollTrigger choreography |
| Framer Motion | `^12.42.2` | Panel transitions and existing UI interactions |
| Three.js | `^0.185.1` | Garment geometry, materials, and canvas textures |
| React Three Fiber | `^9.6.1` | React integration for the 3D scene |
| Drei | `^10.7.7` | GLB loading, orbit controls, model centering, and contact shadows |
| Fabric.js | `^7.4.0` | Supporting 2D print-area editor component |
| Lucide React | `^1.23.0` | Interface icons |
| React Hook Form / Zod | `^7.80.0` / `^4.4.3` | Installed form and validation tooling; current auth screens use local component state |

The main garment texture compositor uses the browser's Canvas 2D API. Fabric.js is used by the supporting `PrintAreaEditor` component; it does not power every canvas in the application.

## Getting started

### Requirements

- Node.js **20.9.0 or newer**, as required by the installed Next.js package.
- npm, using the committed `package-lock.json` for reproducible installation.
- A browser with WebGL 2 support. Hardware acceleration is recommended for responsive 3D previews.
- Python 3 only if you need to regenerate the lightweight garment model. The asset script uses the Python standard library.

### Install and run

From the repository root:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is occupied, use the local address printed by Next.js, or specify a port:

```bash
npm run dev -- --port 3001
```

The full garment model, lightweight preview, collection images, fonts, and patterns are already included in `public/`. Regenerating assets is not required for normal setup.

### Environment configuration

The current frontend does not require environment variables, API keys, database credentials, or a running backend. There is no `.env.example` or API configuration to fill in for the implemented flows.

When adding backend integrations, document their environment variables and provide a safe example configuration. Environment files are currently excluded by `.gitignore`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create the optimized production build and run Next.js TypeScript checks |
| `npm run start` | Serve an existing production build |
| `npm run lint` | Run the repository's ESLint configuration |
| `npx tsc --noEmit` | Run a standalone TypeScript check |
| `python3 scripts/prepare-preview-model.py` | Regenerate the lightweight landing-page GLB |

To preview a production build locally:

```bash
npm run build
npm run start
```

`npm run start` requires a successful build first. The repository does not currently define an `npm test` script or include a committed automated browser-test suite.

## Routes

The `(shop)` directory is a Next.js route group and does not appear in URLs.

| URL | Purpose |
| --- | --- |
| `/` | Animated landing page with an interactive 3D hero, walkthrough, collection preview, FAQ, and studio invitation |
| `/#how-it-works` | Landing-page customization walkthrough |
| `/#questions` | Landing-page FAQ |
| `/templates` | Filterable collection of design starting points |
| `/about` | Studio introduction and design philosophy |
| `/customizer` | Full-screen design studio; restores the current browser's saved design when available |
| `/customizer?template=original` | Initialize the studio from a named starting point |
| `/cart` | Shopping bag, quantities, pricing, and shipping summary |
| `/shop` | Redirect to `/templates` |
| `/product/[id]` | Existing product-detail routes backed by local catalog data; unknown product IDs return not found |
| `/auth/login` | Sign-in interface with a simulated submission |
| `/auth/signup` | Account-creation interface with a simulated submission |
| `/auth/forgot-password` | Password-recovery interface with a simulated submission |
| `/auth/reset-password` | Password-reset interface with a simulated submission |

Custom bag items link back to `/customizer`; they do not have individual product-detail routes.

## Project structure

```text
Fabrico/
├── app/
│   ├── layout.tsx                    # Root metadata, local fonts, and cart provider
│   ├── globals.css                   # Shared tokens, base styles, and font faces
│   ├── (shop)/
│   │   ├── layout.tsx                # Public navbar, footer, and bag drawer
│   │   ├── page.tsx                  # Studio-focused landing page
│   │   ├── studio.css                # Public-page theme and responsive layouts
│   │   ├── components/              # Landing sections and GSAP orchestration
│   │   ├── templates/               # Collection route and its filter component
│   │   ├── about/                   # Studio introduction
│   │   ├── shop/                    # Collection redirect
│   │   ├── cart/                    # Shopping bag
│   │   ├── product/[id]/            # Existing product-detail pages
│   │   └── auth/                    # Authentication interfaces
│   └── customizer/
│       ├── page.tsx                  # Workspace state and panel coordination
│       ├── studio.css                # Editor theme and mobile layouts
│       └── components/              # Tools, settings, model viewer, and summary
├── components/                       # Shared UI and garment-preview components
│   └── garment/                      # Lightweight public 3D scene
├── data/                             # Studio templates, colors, and catalog data
├── hooks/                            # Customizer state and texture composition
├── lib/                              # Preset helpers, font setup, and cart context
├── types/                            # Shared product and category interfaces
├── public/
│   ├── models/                       # Full garment and lightweight preview GLBs
│   ├── images/studio/                # Rendered collection posters
│   ├── patterns/                     # Built-in fabric patterns
│   ├── fonts/                        # Local interface and design-tool fonts
│   └── 2d-model/                     # Supporting 2D garment asset
├── scripts/
│   └── prepare-preview-model.py      # Model-specific preview generation
├── AGENTS.md                         # Project development conventions
├── next.config.ts                    # Next.js configuration
└── package.json
```

The `@/` import alias points to the repository root. The current checkout uses a root-level `components/` directory; it does not have a `src/` directory.

Older storefront landing components remain in `app/(shop)/components/`. The active homepage imports the `Studio*` sections and `LandingMotion`, rather than the older hero slider and featured-product sections.

## Application architecture

### Public pages

The homepage assembles focused sections in [app/(shop)/page.tsx](<app/(shop)/page.tsx>):

1. `StudioHero` demonstrates garment colors and artwork before opening the editor.
2. `StudioStory` explains the creation process with a sticky preview and scroll-driven model rotation.
3. `StudioCollection` displays editable starting points.
4. `StudioQuestions` answers common questions with native disclosure elements.
5. `StudioInvitation` provides the final studio entry point.

`LandingMotion` scopes GSAP animation to its component tree and cleans up animation contexts and media-query handlers on unmount. `StudioPreview` waits until its container approaches the viewport before loading the public 3D scene on the client.

### Editor state

[hooks/useCustomizerState.ts](hooks/useCustomizerState.ts) owns the current design and exposes operations for updating colors, patterns, text layers, image layers, and layer order. The state shape and defaults live in [app/customizer/components/types.ts](app/customizer/components/types.ts).

The workspace is divided into:

- `SettingsIconSidebar`: design-tool navigation.
- `StudioSettings`: the active tool panel.
- `StudioViewport`: live preview and viewport controls.
- `ModelViewer3D`: full garment loading, materials, lighting, and camera interaction.
- `CheckoutSummaryPanel`: size, quantity, price calculation, and add-to-bag behavior.

On smaller screens, settings and order review open as drawers so the garment keeps a usable canvas area.

### Texture composition

[hooks/useJerseyTextures.ts](hooks/useJerseyTextures.ts) creates four **1024 × 1024** canvas textures: front, back, front trim, and back trim. It draws body color, fabric patterns, design patterns, and artwork layers in order, then supplies the textures to the Three.js materials.

The compositor waits for selected text fonts to load and rebuilds the textures when needed. Runtime image caches are reconstructed when a saved design is restored. Textures, cloned geometry, and materials have cleanup paths to release their resources.

The supplied garment has per-piece UV coordinates outside the usual `[0, 1]` range. Both viewers normalize those coordinates before applying design textures. Mesh naming also determines which pieces receive front, back, or trim textures.

## Templates and studio links

[data/studio.ts](data/studio.ts) defines the landing color palette and collection templates:

| ID | Name | Category | Starting design |
| --- | --- | --- | --- |
| `original` | The original | Typography | Studio-blue garment with “MAKE IT YOURS.” text |
| `club` | Off-duty club | Everyday | Chalk garment with green club typography |
| `motion` | In motion | Sport | Dark garment with a diagonal design and contrasting text |
| `blank` | A blank canvas | Essentials | Sage garment without artwork |

[lib/studio-presets.ts](lib/studio-presets.ts) converts these definitions into editor state. Use its helpers when building links or initializing preview scenes:

```ts
import { createStudioPreset, studioHref } from "@/lib/studio-presets";

const design = createStudioPreset("club");
const link = studioHref("original", "#929e83");
// /customizer?template=original&color=%23929e83
```

The optional color must be a six-digit hex value. Use `studioHref` to encode it correctly; an unescaped `#` in a URL starts a fragment instead of a query value.

Opening a recognized template initializes and saves that starting point, replacing the browser's current design. The template and color query parameters are then removed from the address so refreshing the editor restores subsequent changes. Opening `/customizer` without a template restores the saved design or uses the default white garment.

These URLs select initial presets. They do not serialize or share a fully edited design.

To add a starting point, update `STUDIO_TEMPLATES`, provide a matching poster in `public/images/studio/`, and review the preset conversion and collection filter categories. The current preset converter creates a single front text layer when the template contains text.

## Browser storage

Persistence uses `localStorage` and is scoped to the browser and origin.

| Key | Contents |
| --- | --- |
| `fabrico_customizer_v2` | Current design, text/image layers, settings, and layer order |
| `fabrico-cart` | Bag items, prices, quantities, selected sizes/colors, and preview images |
| `fabrico_uploaded_images` | Uploaded image library used by the upload tool |
| `fabrico_uploaded_patterns` | Uploaded fabric-pattern library |

`loadedLogoImages` and `loadedPatterns` hold runtime `HTMLImageElement` caches and are excluded from the persisted design. Uploaded files and captured previews are represented as data URLs where needed.

There is one current editor design per browser origin. Data is not synchronized across devices or accounts, and clearing site storage removes it. A different protocol, hostname, or port has separate storage. Large uploads and preview images can exhaust browser storage; current save paths catch storage errors without providing a quota-management interface.

## 3D models and assets

### Garment models

| Asset | Approximate size | Usage |
| --- | --- | --- |
| `public/models/tshirt2.glb` | 33.1 MB | Full editor garment, including detailed stitching |
| `public/models/tshirt-preview.glb` | 3.9 MB | Public landing, walkthrough, and studio-introduction previews |

The lightweight preview retains selected garment surfaces and the transform hierarchy while omitting dense stitching and duplicate surfaces. The full-resolution editor asset remains available separately.

To regenerate the preview from the current source model:

```bash
python3 scripts/prepare-preview-model.py
```

The script resolves paths relative to its own location, writes `public/models/tshirt-preview.glb`, and reports the source and output byte sizes. It does not modify `tshirt2.glb` or render collection posters.

**The script is specific to the supplied model.** Its mesh selection assumes the current export's ordering. The viewers also rely on garment-piece names, including `70_*` for the front and `28_*` for the back. When replacing the source model, review the script, piece classification, UV handling, and camera framing before regenerating the preview.

### Collection images

`public/images/studio/` contains rendered PNG posters for the four starting points. These are displayed with Next.js Image in the collection and supporting public pages. Update the corresponding poster whenever a template's artwork or colors change; model regeneration does not update these images automatically.

### Patterns and fonts

- Built-in fabric patterns live in `public/patterns/` and are referenced by `PatternsSettings`.
- The interface uses local **Oswald** display typography and **Saira** body typography through [lib/fonts.ts](lib/fonts.ts).
- Additional artwork fonts are registered in `app/globals.css` for use in the text tool.
- Core garment, pattern, and font assets are bundled with the repository, so those resources do not require an external asset service.

Keep the bundled font license files and review asset usage rights when adding or redistributing models, fonts, or artwork.

## Theme and animation

| File | Responsibility |
| --- | --- |
| `app/globals.css` | Shared colors, font tokens, base styles, focus treatment, and reduced-motion rules |
| `app/(shop)/studio.css` | Public layout, hero composition, collection cards, walkthrough, and responsive styling |
| `app/customizer/studio.css` | Editor header, tool rail, settings, viewport, order review, and mobile drawers |
| `app/(shop)/components/LandingMotion.tsx` | GSAP entrance, reveal, orbit, and scroll animation setup |
| `components/garment/GarmentMesh.tsx` | Public garment materials, orientation changes, and scroll-driven rotation |

Shared color tokens include `--background`, `--foreground`, `--accent`, `--accent-hover`, `--muted`, `--surface`, and `--line`. Some editor surfaces use explicit colors in route CSS and tool components, so a complete theme change should review those files as well as the shared tokens.

GSAP manages the public page choreography. Framer Motion handles tool-panel transitions and existing interface motion. Public 3D previews use demand rendering, and the editor uses continuous rendering only when automatic rotation is enabled and reduced motion is not requested. Both viewers cap device pixel ratio at `1.5`.

`next.config.ts` currently enables the experimental React view-transition integration used by existing product pages. Test those routes when changing React, Next.js, or that configuration.

## Bag and pricing

The current pricing rules are frontend constants, displayed in dollars:

| Rule | Current value | Location |
| --- | --- | --- |
| Base custom T-shirt | `$49.00` | `CheckoutSummaryPanel.tsx` |
| Added text or image layer | `$5.00` per layer | `CheckoutSummaryPanel.tsx` |
| Shipping | `$9.99` | `app/(shop)/cart/page.tsx` |
| Free-shipping threshold | Subtotal strictly greater than `$100.00` | `app/(shop)/cart/page.tsx` |

```text
unit price = 49.00 + 5.00 × (text layers + image/logo layers)
subtotal   = unit price × quantity
bag total = subtotal + shipping
```

At exactly `$100.00`, the current code still applies shipping. Colors and patterns do not currently add a surcharge. Tax calculation is not implemented.

Adding a design captures the current viewport and stores a product summary in the bag. The bag does not retain a separate, complete editable design configuration for each item. Returning from a custom bag item opens the current saved studio design, which may have changed since that item was added.

The final **Proceed to Checkout** button is presentational. It does not submit an order or collect payment. Server-side pricing, order validation, delivery details, Cash on Delivery, and online payments still need implementation.

## Validation

For application changes, use the existing checks:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

These commands check different concerns; a successful production build does not imply that ESLint passed. There is no committed unit-test or browser-test runner configured yet.

For visual or interaction changes, manually check:

1. The landing model loads; colors, artwork toggling, rotation, and studio links work.
2. The walkthrough and section reveals work while scrolling, including with reduced motion enabled.
3. Collection filters display the expected templates and each template initializes the correct design.
4. Editing, refreshing, and returning to `/customizer` preserve the current design.
5. Front/back colors, text, uploaded images, and fabric patterns appear on the expected garment pieces.
6. The settings panel and order drawer remain usable on mobile; keyboard focus and Escape dismissal work where implemented.
7. Adding a design produces the expected thumbnail, size, quantity, price, and bag link.
8. Landing, collection, and editor layouts fit widths such as 320, 390, 768, 1024, and 1440 pixels without horizontal scrolling.
9. The browser console and network panel show no new runtime failures or missing assets.

## Deployment

Deploy as a Next.js application with a compatible Node.js runtime or a hosting platform that supports the framework's server behavior and image optimization.

For a Node.js host:

```bash
npm ci
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

For a managed Next.js deployment, use `npm run build` as the build command and keep the framework's output handling. Static export is not configured in this repository.

Ensure the deployment includes the `public/` assets, especially both GLB files, the collection PNGs, patterns, and fonts. The full editor model is relatively large, so account for its download size and the host's asset limits.

No environment secrets are currently required for the frontend. Deployment does not add authentication, order storage, payment processing, or cross-device persistence; those need separate integrations.

## Troubleshooting

| Symptom | Checks |
| --- | --- |
| 3D preview does not appear | Check WebGL 2/hardware acceleration, model requests, and browser console errors. Confirm the relevant GLB exists under `public/models/`. |
| Model or artwork looks stretched after replacing the GLB | Review mesh names, per-piece UV normalization, material assignment, and model transforms. The current pipeline is tailored to the bundled garment. |
| Text appears in the wrong font | Verify the font path and `@font-face` declaration, then check font requests and reload. The compositor refreshes after selected fonts finish loading. |
| A chosen color is not visible on the expected side | Check whether body color is set to Both, Front, or Back and whether artwork or a fabric pattern covers that area. |
| A design seems missing | Confirm the same browser and origin are in use. Opening an explicit template replaces the current saved design. Check local storage and storage quota. |
| Collection thumbnail does not match its template | Update the rendered poster in `public/images/studio/` alongside the template definition. |
| Type checking refers to a route that was deleted | Regenerate Next.js route types with `npm run build`, or restart the development server after route changes. |
| Port 3000 is occupied | Use the address printed by Next.js or pass `--port 3001`. Remember that a different port has separate browser storage. |
| `npm run start` cannot find a build | Run `npm run build` successfully before starting the production server. |

## Current limitations

- Authentication and password flows simulate submissions; they do not create accounts, verify credentials, or send email.
- Catalog and review data are local. Review submission is simulated and is not persisted to a service.
- There is no connected database, order API, inventory service, payment provider, or fulfillment integration.
- Designs, uploaded assets, and bag contents remain browser-local. There is no project library, account synchronization, or full-design sharing/export flow.
- Bag entries contain summaries and previews rather than independent editable project snapshots.
- Collar and zipper choices are stored as settings and shown in the order summary; the supplied model's geometry does not change to render alternative collars or zippers.
- A rendered preview and captured thumbnail do not constitute a print-ready production file or manufacturing specification.
- Browser storage quota handling, backend validation, upload limits, and production order pricing need further work before accepting real purchases.
- Existing catalog pages and older storefront components remain alongside the newer studio-focused public experience.

## Development conventions

Read [AGENTS.md](AGENTS.md) before contributing. In particular:

- Keep page-specific components with their route and reserve shared components for reusable UI.
- Use descriptive PascalCase component names, focused responsibilities, and strict TypeScript.
- Prefer Server Components; isolate browser APIs, interactive state, and 3D rendering in Client Components.
- Follow the established Next.js, Tailwind CSS, Framer Motion, Three.js, Drei, and Fabric.js stack. GSAP is included for the public animation experience.
- Avoid unnecessary dependencies and keep the lockfile synchronized when dependencies change.
- Provide semantic controls, labels, keyboard access, loading feedback, empty states, and error fallbacks.
- Respect reduced-motion preferences and keep rendering, animations, and large assets deliberate.
- Keep design state and texture composition separate from tool UI, and dispose of owned GPU resources when they are replaced or unmounted.
