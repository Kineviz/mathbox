declare var _default: "uniform float worldUnit;\nuniform float focusDepth;\nuniform float tickSize;\nuniform float tickEpsilon;\nuniform vec3  tickNormal;\nuniform vec2  tickStrip;\n\nvec4 getSample(vec4 xyzw);\n\nvec3 transformPosition(vec4 position, in vec4 stpqIn, out vec4 stpqOut);\n\nvec3 getTickPosition(vec4 xyzw, in vec4 stpqIn, out vec4 stpqOut) {\n  float epsilon = tickEpsilon;\n\n  // determine tick direction\n  float leftX  = max(tickStrip.x, xyzw.y - 1.0);\n  float rightX = min(tickStrip.y, xyzw.y + 1.0);\n  \n  vec4 left    = getSample(vec4(leftX,  xyzw.zw, 0.0));\n  vec4 right   = getSample(vec4(rightX, xyzw.zw, 0.0));\n  vec4 diff    = right - left;\n\n  vec3 normal  = cross(normalize(diff.xyz + vec3(diff.w)), tickNormal);\n  float bias   = max(0.0, 1.0 - length(normal) * 2.0);\n       normal  = mix(normal, tickNormal.yzx, bias * bias);\n  \n  // transform (point) and (point + delta)\n  vec4 center  = getSample(vec4(xyzw.yzw, 0.0));\n  vec4 delta   = vec4(normal, 0.0) * epsilon;\n\n  vec4 a = center;\n  vec4 b = center + delta;\n\n  vec4 _;\n  vec3 c = transformPosition(a, stpqIn, stpqOut);\n  vec3 d = transformPosition(b, stpqIn, _);\n  \n  // sample on either side to create line\n  float line = xyzw.x - .5;\n  vec3  mid  = c;\n  vec3  side = normalize(d - c);\n\n  return mid + side * line * tickSize * worldUnit * focusDepth;\n}\n";
export default _default;