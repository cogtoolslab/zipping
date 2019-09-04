import pygame
from pygame.locals import *
import json
import blockworld_helpers as bw
from Box2D import *
import random
import argparse

# Helper functions for interacting between stimulus generation and pybox2D

def b2_x(block):
    '''
    Takes a block from stimulus generation and returns the x value of the center of the block
    '''
    return ((block.x) + (block.width / 2))

def b2_y(block):
    '''
    Takes a block from stimulus generation and returns the y value of the center of the block
    '''
    return ((block.y) + (block.height / 2))
    
def add_block_to_world(block, b2world):
    '''
    Add block from stimulus generation to b2world
    '''
    body = b2world.CreateDynamicBody(position=(b2_x(block),b2_y(block)))
    world_block = body.CreatePolygonFixture(box=(block.width/2,block.height/2), density=1, friction=0.3)
        
def jenga_blocks(w,n):

    for j in range(0,n):
        i = 0;
        block_removed = False
        while not block_removed:
            #block_number = random_block_order.pop
            (block_removed, w2) = w.jenga_block(i)
            if block_removed:
                w = w2
            else:
                i += 1;
    return w

def event_handler():
    for event in pygame.event.get():
        if event.type == QUIT or (
             event.type == KEYDOWN and (
              event.key == K_ESCAPE or
              event.key == K_q
             )):
            pygame.quit()
            quit() 

def display_blocks(world, 
                   TIME_STEP = 0.01,
                   VEL_ITERS = 10,
                   POS_ITERS = 10,
                   SCREEN_WIDTH = 400,
                   SCREEN_HEIGHT = 400, 
                   PPM = 20,
                   DISPLAY_OFFSET_X = 100,
                   DISPLAY_OFFSET_Y = -100):
    
    pygame.init()
    
    #make pybox2D world
    b2world = b2World(gravity=(0,-10), doSleep=False)
    groundBody = b2world.CreateStaticBody( #add ground
        position=(0,-10),
        shapes=b2PolygonShape(box=(50,10)),
    )

    for block in world.blocks:
        b2block = add_block_to_world(block, b2world)

    black = (0,0,0)
    green = (0,255,0)
    dark_green = (0,50,0)
    
    gameDisplay = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), 0, 32)
    pygame.display.set_caption('Checking World')
    gameDisplay.fill(black)

    while True:
        event_handler() ## will quit pygame if Q/Esc key pressed

        gameDisplay.fill((0, 0, 0, 0))
        
        for body in b2world.bodies:
            for fixture in body.fixtures:

                shape = fixture.shape

                vertices = [(body.transform * v) * PPM for v in shape.vertices]

                vertices = [(v[0] + DISPLAY_OFFSET_X, SCREEN_HEIGHT - v[1] + DISPLAY_OFFSET_Y) for v in vertices]

                pygame.draw.polygon(gameDisplay, dark_green, vertices)
                pygame.draw.polygon(gameDisplay, green, vertices, 1)
        
        b2world.Step(TIME_STEP, VEL_ITERS, POS_ITERS)
        
        pygame.display.update()

        
        
def random_world_test(blocks_removed = 0,
                      TIME_STEP = 0.01,
                      VEL_ITERS = 10,
                      POS_ITERS = 10, 
                      SCREEN_WIDTH = 400,
                      SCREEN_HEIGHT = 400,
                      PPM = 20,
                      DISPLAY_OFFSET_X = 100,
                      DISPLAY_OFFSET_Y = -100):

    pygame.init()
    
    #make pybox2D world
    b2world = b2World(gravity=(0,-10), doSleep=False)
    groundBody = b2world.CreateStaticBody( #add ground
        position=(0,-10),
        shapes=b2PolygonShape(box=(50,10)),
    )

    # Add blocks
    world = bw.World(world_width = 8,world_height = 8)
    world.fill_world()
    
    world = jenga_blocks(world,blocks_removed)

    for block in world.blocks:
        b2block = add_block_to_world(block, b2world)

    
    white = (255,255,255)
    black = (0,0,0)

    red = (255,0,0)
    green = (0,255,0)
    blue = (0,0,255)
    dark_green = (0,50,0)
    
    gameDisplay = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT), 0, 32)
    pygame.display.set_caption('World Display')
    gameDisplay.fill(black)

    while True:
        event_handler() ## will quit pygame if Q/Esc key pressed
        
        gameDisplay.fill((0, 0, 0, 0))
        
        for body in b2world.bodies:
            for fixture in body.fixtures:

                shape = fixture.shape

                vertices = [(body.transform * v) * PPM for v in shape.vertices]

                vertices = [(v[0] + DISPLAY_OFFSET_X, SCREEN_HEIGHT - v[1] + DISPLAY_OFFSET_Y) for v in vertices]

                pygame.draw.polygon(gameDisplay, dark_green, vertices)
                pygame.draw.polygon(gameDisplay, green, vertices, 1)
        
        b2world.Step(TIME_STEP, VEL_ITERS, POS_ITERS)
        
        pygame.display.update()                           
    
def simple_tests(TEST_NAME='stonehenge',
                 TIME_STEP=0.01,
                 VEL_ITERS = 10,
                 POS_ITERS = 10,
                 SCREEN_WIDTH= 400,
                 SCREEN_HEIGHT = 400,
                 PPM = 20,
                 DISPLAY_OFFSET_X=100,
                 DISPLAY_OFFSET_Y=-100):
    '''
    Runs super simple tests in pybox2d, e.g., T block & stonehenge config.
    '''
    
    if TEST_NAME == 'stonehenge':        
        w = bw.World()
        w.add_block(2,4,2,0)
        w.add_block(2,4,6,0)
        w.add_block(4,2,3,4)
        display_blocks(w,
                       TIME_STEP=TIME_STEP,
                       VEL_ITERS=VEL_ITERS,
                       POS_ITERS=POS_ITERS,
                       SCREEN_WIDTH=SCREEN_WIDTH,
                       SCREEN_HEIGHT=SCREEN_HEIGHT,
                       PPM=PPM,
                       DISPLAY_OFFSET_X=DISPLAY_OFFSET_X,
                       DISPLAY_OFFSET_Y=DISPLAY_OFFSET_Y)    
    elif TEST_NAME == 'T':
        w = bw.World()
        w.add_block(2,4,4,0)
        w.add_block(4,2,2,4)
        display_blocks(w, 
                       TIME_STEP=TIME_STEP, 
                       VEL_ITERS=VEL_ITERS, 
                       POS_ITERS=POS_ITERS,
                       SCREEN_WIDTH=SCREEN_WIDTH,
                       SCREEN_HEIGHT=SCREEN_HEIGHT,
                       PPM=PPM,
                       DISPLAY_OFFSET_X=DISPLAY_OFFSET_X,
                       DISPLAY_OFFSET_Y=DISPLAY_OFFSET_Y) 
    else:
        print('simple test type not understood!')
        
    
if __name__ == "__main__":
    def str2bool(v):
        return v.lower() in ("yes", "true", "t", "1")    
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--PPM', type=int, help='pixels per meter', default=20)
    parser.add_argument('--SCREEN_WIDTH', type=int, help='screen width', default=400)    
    parser.add_argument('--SCREEN_HEIGHT', type=int, help='screen height', default=400)    
    parser.add_argument('--DISPLAY_OFFSET_X', type=int, help='horizontal display offset', default=100)
    parser.add_argument('--DISPLAY_OFFSET_Y', type=int, help='horizontal display offset', default=-100) 
    parser.add_argument('--TIME_STEP', type=float, help='the length of time passed to simulate (seconds)', default=0.01)
    parser.add_argument('--VEL_ITERS', type=int, help='how strongly to correct velocity', default=10)
    parser.add_argument('--POS_ITERS', type=int, help='how strongly to correct position', default=10)    
    parser.add_argument('--TEST_NAME', type=str, help='which test do you want to run? options: T, stonehenge, jenga', default='jenga')
    parser.add_argument('--BLOCKS_REMOVED',type=int, help='how many blocks to remove? only applies to jenga test.', default=5)
    args = parser.parse_args()
    
    ## detect which test the user wants to run and then run that one
    if args.TEST_NAME in ['stonehenge','T']:
        simple_tests(TEST_NAME = args.TEST_NAME,
                     TIME_STEP=args.TIME_STEP,
                     VEL_ITERS=args.VEL_ITERS,
                     POS_ITERS=args.POS_ITERS,
                     SCREEN_WIDTH= args.SCREEN_WIDTH,
                     SCREEN_HEIGHT = args.SCREEN_HEIGHT,
                     PPM = args.PPM,
                     DISPLAY_OFFSET_X=args.DISPLAY_OFFSET_X,
                     DISPLAY_OFFSET_Y=args.DISPLAY_OFFSET_Y)      
    elif args.TEST_NAME=='jenga':
        random_world_test(blocks_removed = args.BLOCKS_REMOVED,
                          TIME_STEP = args.TIME_STEP,
                          VEL_ITERS = args.VEL_ITERS,
                          POS_ITERS = args.POS_ITERS,
                          SCREEN_WIDTH= args.SCREEN_WIDTH,
                          SCREEN_HEIGHT = args.SCREEN_HEIGHT,
                          PPM=args.PPM,
                          DISPLAY_OFFSET_X=args.DISPLAY_OFFSET_X,
                          DISPLAY_OFFSET_Y=args.DISPLAY_OFFSET_Y)
    else:
        print('TEST_NAME not recognized. Please specify a valid test name.')

        
