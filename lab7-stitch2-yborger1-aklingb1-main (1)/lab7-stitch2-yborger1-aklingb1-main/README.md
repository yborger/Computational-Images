# Assignment 7: Image Stitching II

**DUE March 25th at 11:59 PM**

This is an open-ended creative lab, think of it as warm-up for the final project.

## Do Something Fun with Homographies

1. Stitch together multiple images (a panorama):
   - different views of a planar surface 
   - rotating about a single point
2. Automatically find the target quadrangle(s).
   - The `opencv` library included in this repo supports [`findChessboardCorners`](https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html#ga93efa9b0aa890de240ca32b11253dd4a).
```javascript
     let src = cv.imread(grid.canvas);
     let gray = new cv.Mat();
     cv.cvtColor(src, gray, cv.COLOR_BGR2GRAY, 0);
     let gridCorners = new cv.Mat();
     let cornersS = new cv.Size(9, 6);
     cv.findChessboardCorners(gray, cornersS, gridCorners)
     print(gridCorners);
     src.delete();
     gray.delete();
```
3. Some other fun application!

## Learning Objectives

- use homographies to apply arbitrary 2D-geometry transformations
- use [opencv](https://docs.opencv.org/4.x/da/d6e/tutorial_py_geometric_transformations.html) for some computer vision tasks

## Deliverables

1. Commit the JavaScript `sketch.js` to the repo.

2. Write the reflection (as a markdown document named
   `reflection.md`) about what you were able to accomplish in this
   lab. Don't forget the collaboration statement!

