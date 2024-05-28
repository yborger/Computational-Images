# Assignment 6: Image Stitching I

**DUE March 26th at 11:59 PM**

In this lab, we will stitch together multiple images using geometric
transformations and forward and backward warping. This will be a two
part-lab, with both due after spring break.

## Tasks

1. [**insert**] Using `perspective_4point_transform` or `homography2d` from
   [jsfeat](https://inspirit.github.io/jsfeat/#math), use forward
   warping to draw webcam images on different quadrangles on a
   background image.
   
![`insert`](homography.png){width=400px}

2. [**extract**]  Using `perspective_4point_transform` or `homography2d` from
   [jsfeat](https://inspirit.github.io/jsfeat/#math), use forward
   warping to draw only a part of the webcam image, essentially
   **rectifying** that part of the image.

![`extract`](perspective.jpg){width=400px}

3. Use [OpenCV's](https://docs.opencv.org/4.9.0/dd/d52/tutorial_js_geometric_transformations.html) `getPerspectiveTransform` and [`warpPerspective`](https://docs.opencv.org/4.x/da/d54/group__imgproc__transform.html#ga8f6d378f9f8eebb5cb55cd3ae295a999) to
   accomplish the two previous tasks (insert & extract).
   
   - NOTES: The tutorial has a bug, use: `let dsize = new cv.Size(src.cols,
     src.rows);` And, more on [OpenCV's `Mat`](https://docs.opencv.org/4.9.0/de/d06/tutorial_js_basic_ops.html) in JavaScript.

## Final Sketch

Combine your work into a single sketch:

  - `'i'`: insert the webcam image into a static image using `jsfeat`
  - `'e'`: extract a piece of the webcam image and rectify it using `jsfeat`
  - `'j'`: insert the webcam image into a static image using `opencv`
  - `'f'`: extract a piece of the webcam image and rectify it using `opencv`

Write in the `reflection.md` about how your `opencv` & `jsfeat` approaches
   compare.

## Challenge Problems

1. Insert a static image into the live webcam image.
2. Stitch together multiple images (different views of a planar surface or rotating from a single point). 
3. Automatically find the target quadrangle(s).

## Learning Objectives

- use homographies to apply arbitrary 2D-geometry transformations
- compare forward and backward warping
- estimate geometric transformations from examples
- use [jsfeat](https://inspirit.github.io/jsfeat/#structs) for some linear-algebra tasks
- use [opencv](https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html) for some computer vision tasks

## Deliverables

1. Commit the JavaScript `sketch.js` to the repo.

2. Write the reflection (as a markdown document named
   `reflection.md`) about what you were able to accomplish in this
   lab. Don't forget the collaboration statement!

