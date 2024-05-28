1.Results (please ignore how sad Yael looks, they are tired):
![Mean](/results_images/mean.png)
![Median](/results_images/median.png)
![Mode](/results_images/mode.png)
![MaxOtsu](/results_images/maxotsu.png)
![MinOtsu](/results_images/minotsu.png)

We were able to sucessfully calculate the Histogram, Mode, and Mean through fairly sraightforward methods. For Otsu, specifically Max Otsu, we were successfully able to use helper functions to calculate variance and probability in order to maximize the between-class variance. Oddly enough, even though we had success with implementing those helper functions for max Otsu, there was some kind of error with the min Otsu where the result continuously flickers between values that are not the same as max Otsu. We were following the formula but there is something that is off about our results and we are currently unsure where the error comes from considering all of the other results have been reasonable. Update: Fortunately, we have found the problem! Our threshold was not added when calculting the distance but was included when calculating the mean, so our calcVariance function had been off by the threshold and now works properly.
2.
Completely black or completely white images (as in a blank screen) both fail Otsu because there is no background or foreground division possible. If there are no details to differentiate between, Otsu wold not be able to calculate shading differences and therefore would not be able to find a middle-ground threshold. Alernatively if the colors are the same but the lighting is very different throughout the image, Otsu will not be able to work properly because there is no consistent light exposure.

3.
Another method of thresholding (I will admit I found it as an option on the Thresholding Wikipedia page and then did further research) is through "cllustering-based methods" or some kind of grouping of background and foreground that works a bit differently than Otsu. Rather than just divide the image randomly, the selection determines some kind of "object" as the subject of the image, then samples the background and the object separately to find the averages of both. Using this method, the ideal threshold would not be impacted by the light exposure as the subject would have greater and more consistent contrast too.