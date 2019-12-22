# Data Structure Visualizer

A simple graphical debugger to help visualize data structures. It's been built using HTML/CSS and a bunch of JS scripts. The code editor is a customized and heavily trimmed version of the [ACE Editor](https://github.com/ajaxorg/ace). 

As of date, the debugger only supports non-binary trees, but there is more to come (hopefully).

##### How?

Enter data structures and algorithms operating on them in a class implemented in JavaScript to the editor, and press `Run` for the visualization.

Different data structures use different APIs:

___

###### Trees

Provide a `Node` class in the editor, which has an array named `children`.

In order to draw the tree in its entirety, instantiate the node, and call `draw(nameOfInstance)`.

For visualizing the execution of an algorithm, say, a breadth-first traversal, you need to call the `drawNode()` method in it, much like how would you use `console.log()`.

___

That's it! Since the program attempts to parse any JS which you throw at it, it can be also used as a somewhat stunted code editor.  

##### Why?

Because I can. On a more serious note, I always have trouble visualizing data flow when learning algorithms and data structures, and figured a visual debugger of sorts might help with this issue. I was partially inspired by Bret Victor's somewhat famous [essay](http://worrydream.com/#!/LearnableProgramming) on the topic.

Plus, I also wanted to build something with pure HTML/CSS/JS, because frontend technologies are kind of built on these three, and it's good to know the fundamentals, I guess.
