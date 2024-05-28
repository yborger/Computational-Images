# Assignment 11: WebGL Shaders

**DUE April 22nd at 11:59 PM**

In this lab we'll reimplement something from earlier in the semester,
but using the OpenGL Shading Language
([GLSL](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders#:~:text=Shaders%20use%20GLSL%20(OpenGL%20Shading,and%20Fragment%20(Pixel)%20Shaders.))). The
benefit of this re-implementation is the massive parallelism from modern
GPUs, thus speeding up the image processing. To make this really evident, I
suggest running your sketches and webcam in full-size mode
`createCanvas(windowWidth, windowHeight, WEBGL)`.

## Tasks

Pick one of the previous labs and reimplement your sketch using GLSL:

1. Binary Thresholding: [Gray-scale or Otsu Thresholding](https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-12_threshold).
2. Filtering with Convolution: [Box-Blur](https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-9_single-pass-blur), [Gaussian-Blur](https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-10_two-pass-blur) and [Gradient](https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-15_convolution-kernel).
3. FG/BG Segmentation via [Frame Differencing](https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/4_image-effects/4-13_frame-differencing).

## Evaluation

Compare the run-time of your original JavaScript with your GLSL
implementation. Reporting the `frameRate()` for each sketch (2D vs
WEBGL) with a little commentary should do the trick. Note: Drawing
text() in WEBGL is [annoying](https://github.com/processing/p5.js/wiki/Getting-started-with-WebGL-in-p5#text), so you can just dump it to the console.

## Notes

- [Avoid conditionals](https://theorangeduck.com/page/avoiding-shader-conditionals) in your shaders, instead use functions like `step`, `min`, `max`, `lessThan`.
- Use [`p5.Shader.setUniform`](https://p5js.org/reference/#/p5.Shader) to pass data to the shaders from the JavaScript sketch.
- If it makes sense for your sketch (e.g., thresholding, gradient,
  blur), consider implementing a custom `filter` using
  [`createFilterShader`](https://p5js.org/reference/#/p5/createFilterShader).


## Learning Objectives

- write GLSL fragment shaders
- compare performance of image processing implementations


## Deliverables

1. Add your code to `sketch.js`, `shader.frag`, and `shader.vert`.

2. Write about what you were able to accomplish and your performance
   comparison in the reflection (as a markdown document named
   `reflection.md`).


