import numpy as np
from PIL import Image

from matplotlib import pylab, mlab, pyplot
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from matplotlib.path import Path
import matplotlib.patches as patches
import copy


### visualization helpers

def get_patch(verts,
              color='orange',
              line_width = 2):
    '''
    input:
        verts: array or list of (x,y) vertices of convex polygon. 
                last vertex = first vertex, so len(verts) is num_vertices + 1
        color: facecolor
        line_width: edge width    
    output:
        patch matplotlib.path patch object
    '''
    codes = [1] + [2]*(len(verts)-1)    ## 1 = MOVETO, 2 = LINETO
    path = Path(verts,codes)
    patch = patches.PathPatch(path, facecolor=color, lw=line_width)
    return patch


def render_blockworld(patches,
                      xlim=(-10,10),
                      ylim=(-10,10),
                      figsize=(4,4)):
    
    '''
    input: 
        patches: list of patches generated by get_patch() function
        xlim, ylim: axis limits
        figsize: defaults to square aspect ratio
    output:
        visualization of block placement
    '''
    fig = plt.figure(figsize=figsize)
    ax = fig.add_subplot(111)    
    for patch in patches:
        ax.add_patch(patch)
    ax.set_xlim(xlim)
    ax.set_ylim(ylim)
    plt.show()
    
def translate(verts, dx, dy):
    '''
    input:
        verts: array or list of (x,y) vertices of convex polygon. 
                last vertex = first vertex, so len(verts) is num_vertices + 1
        dx, dy: distance to translate in each direction
    output:
        new vertices
    '''
    new_verts = copy.deepcopy(verts)
    new_verts[:,0] = verts[:,0] + dx
    new_verts[:,1] = verts[:,1] + dy
    return new_verts

def return_corners(s):
    '''
    input: list or array of block vertices in absolute coordinates
    output: absolute coordinates of top_left, bottom_left, bottom_right, top_right
    '''
    corners = {}
    corners['top_left'] = s[0]
    corners['bottom_left'] = s[1]
    corners['bottom_right'] = s[2]
    corners['top_right'] = s[3]
    return corners

def get_width_and_height(corners):
    '''
    input: corners dictionary, containing top_left, bottom_left, bottom_right, top_right
    output: return dims dictionary, containing width and height    
    '''
    dims = {}
    dims['width'] = np.abs(corners['bottom_right'][0] - corners['top_left'][0])
    dims['height'] = np.abs(corners['bottom_right'][1] - corners['top_left'][1])
    return dims

def compute_area(dims,shape='rectangle'):
    '''
    input: w = width 
           h = height           
           shape = ['rectangle', 'square', 'triangle']
    output
    '''
    ## extract width and height from dims dictionary
    w = dims['width']
    h = dims['height']    
    if shape in ['rectangle','square']:
        area = w*h
    elif shape=='triangle':
        area = w*h*0.5
    else:
        print('Shape type not recognized. Please use recognized shape type.')
    return area
    