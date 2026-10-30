# Garment preparation

Run `npm run models:prepare` after changing `baseball_cap.glb` or `hoodie_black.glb`, then run `npm run models:check`.

The preparation script keeps every source triangle and removes common export transforms. Both models use a shared local coordinate system across their meshes: Y is up, positive Z is the front. The renderer centers and sizes each garment using its actual bounding box.

## Cap

The source has seven meshes: top button, bill, two closure straps, inner liner, metal button, and crown. The crown is split into front and back triangles at Z = 0. Both crown halves share a planar XY projection across their original UV seams. The back reverses U so text remains readable. The brim, liner, and closure use the corresponding trim texture, without artwork. The metal button retains its own material.

Print UV: `U = 0.5 + X / 9.5`, `V = (Y + 1.825) / 9.5` (negate X on the back). Equal projection dimensions preserve the aspect ratio of text and logos; the crown occupies the middle of the canvas vertically.

## Hoodie

The source contains two fleece meshes and one ribbing mesh. Connected triangle islands identify the full front and back torso panels and the kangaroo pocket. These use one shared projection, keeping artwork aligned between the torso and pocket. Hood, sleeves, cuffs, hem, and seam details use trim textures. The back reverses U.

Print UV: `U = 0.5 + X / 139`, `V = (Y - 255) / 139` (negate X on the back). Equal projection dimensions preserve artwork proportions; the torso occupies the middle of the canvas horizontally.

## Material and texture channels

The editor's 1024 × 1024 front/back canvases use `TEXCOORD_0`. Original fabric UVs are preserved in `TEXCOORD_1` for the resized 1024 px normal maps. The cap's legacy specular/glossiness materials are converted to standard rough, nonmetallic cloth. The original GLBs are retained as preparation sources; the browser loads `cap-studio.glb` and `hoodie-studio.glb`.

The T-shirt retains its original piece classification and normalized pattern UVs. Landing previews and the editor share the same garment renderer and texture compositor.

Garment names, model paths, posters, sizes, and base prices live in `data/garments.ts`. Hoodie pricing follows the existing Urban Hoodie catalog price; the new cap defaults to $29.99 and can be adjusted there.
