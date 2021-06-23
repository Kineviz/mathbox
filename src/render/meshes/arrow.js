// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import * as THREE from "three";
import { ArrowGeometry } from "../geometry";
import { Base } from "./base";

export class Arrow extends Base {
  constructor(renderer, shaders, options) {
    let f;
    super(renderer, shaders, options);

    let {
      uniforms,
      material,
      position,
      color,
      mask,
      map,
      combine,
      stpq,
      linear,
    } = options;
    if (uniforms == null) {
      uniforms = {};
    }

    const hasStyle = uniforms.styleColor != null;

    this.geometry = new ArrowGeometry({
      sides: options.sides,
      samples: options.samples,
      strips: options.strips,
      ribbons: options.ribbons,
      layers: options.layers,
      anchor: options.anchor,
      flip: options.flip,
    });

    this._adopt(uniforms);
    this._adopt(this.geometry.uniforms);

    const factory = shaders.material();

    const v = factory.vertex;

    v.pipe(this._vertexColor(color, mask));

    v.require(this._vertexPosition(position, material, map, 1, stpq));
    v.pipe("arrow.position", this.uniforms);
    v.pipe("project.position", this.uniforms);

    factory.fragment = f = this._fragmentColor(
      hasStyle,
      material,
      color,
      mask,
      map,
      1,
      stpq,
      combine,
      linear
    );

    f.pipe("fragment.color", this.uniforms);

    this.material = this._material(factory.link({}));

    const object = new THREE.Mesh(this.geometry, this.material);
    object.frustumCulled = false;
    object.matrixAutoUpdate = false;

    this._raw(object);
    this.renders = [object];
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.renders = this.geometry = this.material = null;
    return super.dispose();
  }
}
