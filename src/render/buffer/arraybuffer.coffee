Buffer  = require './buffer'
Texture = require './texture'
Util    = require '../../util'

class ArrayBuffer_ extends Buffer
  constructor: (gl, shaders, options) ->
    @callback = options.callback || ->
    @length   = options.length   || 1
    @history  = options.history  || 1

    @samples = @length
    super gl, shaders, options

  shader: (shader) ->
    super shader

  build: () ->
    super

    @data    = new Float32Array @samples * @channels * @items
    @texture = new Texture @gl, @samples * @items, @history, @channels
    @index   = 0
    @filled  = 0

    @dataPointer = @uniforms.dataPointer.value

    @_adopt @texture.uniforms

  getFilled: () -> @filled

  iterate: () ->
    callback = @callback
    output = @generate()
    limit = @samples

    i = 0
    while i < limit && callback(i++, output) != false
      true

    i

  write: (n = @samples) ->
    @texture.write @data, 0, @index, n * @items, 1
    @dataPointer.set .5, @index + .5
    @index = (@index + @history - 1) % @history
    @filled = Math.min @history, @filled + 1

  copy2D: (data) ->
    channels = Math.min data[0].length, @channels
    samples  = Math.min data.length,    @samples * @items

    o = 0
    data = @data
    for k in [0...samples]
      d = data[k]
      d[o++] = (v[i] ? 0) for i in [0...channels]

    @write Math.floor o / @channels / @items

module.exports = ArrayBuffer_