// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import * as THREE from "three";
import { ClipGeometry } from "./clipgeometry";

/*
Render points as quads

+----+  +----+  +----+  +----+
|    |  |    |  |    |  |    |
+----+  +----+  +----+  +----+

+----+  +----+  +----+  +----+
|    |  |    |  |    |  |    |
+----+  +----+  +----+  +----+

+----+  +----+  +----+  +----+
|    |  |    |  |    |  |    |
+----+  +----+  +----+  +----+

*/

export class SpriteGeometry extends ClipGeometry {
  constructor(options) {
    let depth, height, items, width;
    super(options);

    this._clipUniforms();

    this.items = items = +options.items || 2;
    this.width = width = +options.width || 1;
    this.height = height = +options.height || 1;
    this.depth = depth = +options.depth || 1;

    const samples = items * width * height * depth;
    const points = samples * 4;
    const triangles = samples * 2;

    this.addAttribute(
      "index",
      new THREE.BufferAttribute(new Uint16Array(triangles * 3), 1)
    );
    this.addAttribute(
      "position4",
      new THREE.BufferAttribute(new Float32Array(points * 4), 4)
    );
    this.addAttribute(
      "sprite",
      new THREE.BufferAttribute(new Float32Array(points * 2), 2)
    );

    this._autochunk();

    const index = this._emitter("index");
    const position = this._emitter("position4");
    const sprite = this._emitter("sprite");

    const quad = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    let base = 0;
    for (
      let i = 0, end = samples, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      index(base);
      index(base + 1);
      index(base + 2);

      index(base + 1);
      index(base + 2);
      index(base + 3);

      base += 4;
    }

    for (
      let z = 0, end1 = depth, asc1 = 0 <= end1;
      asc1 ? z < end1 : z > end1;
      asc1 ? z++ : z--
    ) {
      for (
        let y = 0, end2 = height, asc2 = 0 <= end2;
        asc2 ? y < end2 : y > end2;
        asc2 ? y++ : y--
      ) {
        for (
          let x = 0, end3 = width, asc3 = 0 <= end3;
          asc3 ? x < end3 : x > end3;
          asc3 ? x++ : x--
        ) {
          for (
            let l = 0, end4 = items, asc4 = 0 <= end4;
            asc4 ? l < end4 : l > end4;
            asc4 ? l++ : l--
          ) {
            for (let v of Array.from(quad)) {
              position(x, y, z, l);
              sprite(v[0], v[1]);
            }
          }
        }
      }
    }

    this._finalize();
    this.clip();
  }

  clip(width, height, depth, items) {
    if (width == null) {
      ({ width } = this);
    }
    if (height == null) {
      ({ height } = this);
    }
    if (depth == null) {
      ({ depth } = this);
    }
    if (items == null) {
      ({ items } = this);
    }
    this._clipGeometry(width, height, depth, items);
    return this._clipOffsets(
      6,
      width,
      height,
      depth,
      items,
      this.width,
      this.height,
      this.depth,
      this.items
    );
  }
}
