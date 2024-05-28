REFLECTION 

The "jsfeat" functions focus on going through each pixel in the image and updating them individually. 
The "opencv" functions work as an entire image warp instead. The entire image gets altered by the warp and reloaded in that way. The function by opencv works in a backwards-warping way so there are way fewer pixel-disconnects during the extract function when the scale difference is so different.

