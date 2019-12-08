TODO
    - display error message if input is incorrect
    - display value of node
    - draw edge between nodes
        - possible method:
            - call a buildTree(tree) method in the background or explicitly by the user
            - this takes the children, and goes through them in a BFT way drawing the tree, storing the node and its coordinates in a map
                - have to come up with an algorithm to draw relations: at each step, check who is the parent
                    - BFT:
                        while we have nodes:
                            - take node
                            - is it root?
                                - draw it at default coordinates
                                - store node and coordinates in map
                            - else:
                                - look up node in map
                                - draw it at coordinates
                            - check the length of its children
                            - in a loop: draw that many lines from it
                                - calculate new coordinates accordingly
                                - store each children and coordinates in map

                         - or you can separate the coord storing and painting methods, but then you need to order stuff in map and store how many edges each node has

            - when to user calls a self-implemented method, like DFT or add or whatever, she has to call a paintCircle(node) method
                - it finds the node in the map, and redraws it in the drawn tree at the given coordinates
            - for traversals, user has to call paintCircle(node) method
            - for adding/removing, first call the add/remove, then repaint the tree manually? or maybe add an event listener or something which monitors the original data struct
                - check it in setInterval, and redraw - or when execute is pressed? - to avoid calling stuff manually, execute executes tree drawing and any other code
                - you have to clear the CANVAS after each function call?
            - conventions: children must be named children, must have a paintCircle() and paintTree()

    - draw left or right node
    - when iterating through node, change color of current node
    - sepearate the are to two parts
    - style the UI
    - make the UI draggable
    - get a better text editor
    - add help text for API
    - hover: show node data, children etc
    - make nodes draggable
    - json tree
    - option to rotate tree
    
    add: Point class
