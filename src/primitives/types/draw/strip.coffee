Primitive = require '../../primitive'
Util      = require '../../../util'

class Strip extends Primitive
  @traits = ['node', 'object', 'style', 'line', 'mesh', 'geometry', 'position', 'bind']

  constructor: (node, context, helpers) ->
    super node, context, helpers

    @strip = null

  resize: () ->
    return unless @bind.points?

    dims = @bind.points.getActive()
    {items, width, height, depth} = dims

    #console.log 'strip', dims

    @strip.geometry.clip width, height, depth, items

  make: () ->
    # Bind to attached data sources
    @_helpers.bind.make [
      { to: 'geometry.points', trait: 'source' }
      { to: 'geometry.colors', trait: 'source' }
    ]

    return unless @bind.points?

    # Build transform chain
    position = @_shaders.shader()

    # Fetch position
    position = @bind.points.sourceShader position

    # Transform position to view
    position = @_helpers.position.pipeline position

    # Prepare bound uniforms
    styleUniforms = @_helpers.style.uniforms()
    lineUniforms  = @_helpers.line.uniforms()

    # Fetch geometry dimensions
    dims    = @bind.points.getDimensions()
    {items, width, height, depth} = dims

    # Build color lookup
    if @bind.colors
      color = @_shaders.shader()
      color = @bind.colors.sourceShader color

    # Make line renderable
    ###
    uniforms = Util.JS.merge arrowUniforms, lineUniforms, styleUniforms
    @line = @_renderables.make 'line',
              uniforms: uniforms
              samples:  samples
              ribbons:  ribbons
              strips:   strips
              layers:   layers
              position: position
              color:    color
              clip:     start or end
    ###

    # Make strip renderable
    uniforms = Util.JS.merge styleUniforms, {}

    @strip = @_renderables.make 'strip',
              uniforms: uniforms
              width:    width
              height:   height
              depth:    depth
              items:    items
              position: position
              color:    color

    @_helpers.object.make [@strip]

  made: () -> @resize()

  unmake: () ->
    @_helpers.bind.unmake()
    @_helpers.object.unmake()

    @strip = null

  change: (changed, touched, init) ->
    return @rebuild() if changed['geometry.points']

module.exports = Strip