# Assignment 9: A Simple 3D Viewer

**DUE April 8th at 11:59 PM**

Create a sketch that visualizes a set of 3D points. You should
implement both orthographic and perspective projections. You might use
the face dataset included or some other 3D shapes. Your sketch should
allow the user to pan, rotate and scale the 3D scene interactively
using the mouse or keyboard. The camera matrix which projects the
three-dimensional world coordinates into two-dimensional image
coordinates can be decomposed into two parts: the extrinsics matrix
$\mathbf{E}$ (a 3D Euclidean transformation $[\mathbf{R}|\mathbf{T}]$
that describes the camera position) and the intrinsics matrix
$\mathbf{K}$ (the camera parameters). We also will insert either a
perspective $\mathbf{\Pi_{\textrm{persp}}}$ or orthographic projection
$\mathbf{\Pi_{\textrm{ortho}}}$ in between to explore these two kinds of
projections.

$$
\begin{bmatrix}
x\\
y\\
w
\end{bmatrix}
= \mathbf{K} \mathbf{\Pi} [\mathbf{R}|\mathbf{T}] 
\begin{bmatrix}
X\\
Y\\
Z\\
1
\end{bmatrix}
$$

$$
\mathbf{K} = 
\begin{bmatrix}
f_x & 0 & c_x \\
0 & f_y & c_y \\
0 & 0 & 1  
\end{bmatrix} \hspace{0.5in} \mathbf{\Pi_{\textrm{persp}}} = 
\begin{bmatrix}
1 & 0 & 0 &0 \\
0 & 1 & 0 &0 \\
0 & 0 & 1 & 0 
\end{bmatrix} \hspace{0.5in}\mathbf{\Pi_{\textrm{ortho}}} = 
\begin{bmatrix}
1 & 0 & 0 & 0\\
0 & 1 & 0 & 0\\
0 & 0 & 0 & 1
\end{bmatrix}
$$

**NOTE**: You will not use the WEBGL/3D mode of `p5.js` for your part
of the lab---the idea is that you are performing the 3D
projection---but I've included a starter sketch that uses WEBGL to do
the 3D drawing to help you debug. Once you start the lab, feel free to
make a copy of `sketch.js` for safe keeping.

## Rotation Matrices in 3D

When rotating a point about the origin in the two dimensional plane we
used the following rotation or euclidean transformation matrices:

$$
\mathbf{R} = 
\begin{bmatrix}
\cos \theta & -\sin \theta & 0\\
\sin \theta  & \cos \theta & 0\\
0 & 0 & 0
\end{bmatrix}\hspace{1in}[\mathbf{R}|\mathbf{T}] = 
\begin{bmatrix}
\cos \theta & -\sin \theta & t_x\\
\sin \theta  & \cos \theta & t_y\\
0 & 0 & 1 
\end{bmatrix}
$$


In three dimensions, when we rotate a point there are three possible
planes ( $xy$, $yz$, $xz$ ) and thus three angles of possible
rotation. Rotating around the $z$-axis, or in the $xy$-plane is exactly
the transformation we used in the 2D case. The other two rotation matrices
correspond to rotating about the $x$ and $y$ axes.

$$
\mathbf{R}_z =
\begin{bmatrix}
\cos \phi & -\sin \phi & 0 & 0\\
\sin \phi  & \cos \phi & 0 & 0\\
0 & 0 & 1 & 0\\
0 & 0 & 0 & 1
\end{bmatrix}\hspace{0.25in} \mathbf{R_y} =
\begin{bmatrix}
\cos \psi & 0 & \sin \psi & 0 \\
0 &  1 & 0 & 0\\
-\sin \psi  &0 & \cos \psi & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}\hspace{0.25in}\mathbf{R_x} =
\begin{bmatrix}
1 & 0 & 0 & 0\\
0 & \cos \theta & -\sin \theta & 0\\
0 & \sin \theta & \cos \theta  & 0\\
0 & 0 & 0 & 1
\end{bmatrix}
$$


To rotate a point about the origin with angles $\phi$, $\theta$,
$\psi$ you multiply the matrices in the following order for the
product $\mathbf{R} = \mathbf{R_z}\mathbf{R_y}\mathbf{R_x}$.




## Learning Objectives

- explore camera matrices
- perform 3D to 2D projections

## Deliverables

1. Commit the JavaScript `sketch.js` to the repo.

2. Write the reflection (as a markdown document named
   `reflection.md`) about what you were able to accomplish in this
   lab. Don't forget the collaboration statement!
