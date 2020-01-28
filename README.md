# Tree Visualizer

The app lets you visualize the data flow of a tree data structure.

The JavaScript code is provided by you; the visualization is accessible via a simple API.

### Usage

It's best to think of the API as a glorified version of console.log().

Generally, you need to define the tree, instantiate it, and call the `draw(instance)` method in order to see the whole thing.

Call the `paint(node)` method in your algorithm to trace its execution.

A node class or similar - so, anything which holds the `data` and the `children` (name them so) - will be necessary.

That's it! Since the program attempts to parse any JS which you throw at it, it can be also used as a somewhat stunted code editor.  

### Why?

I like trees. Also, I'm learning HTML/CSS/JS, and wanted to build something practical with them without using a framework.

In a broader sense, though, I always have trouble tracing data flow when learning algorithms and data structures for ~~surviving interview hell~~ building my CS fundamentals, and I'm somewhat dissatisfied with the visualizations available out there, because they don't
let you provide your own code. The ultimate goal for this project is to create a visual debugger of sorts for a plethora of data structures.

I was also partially inspired by Bret Victor's somewhat famous [essay](http://worrydream.com/#!/LearnableProgramming) on the topic of a more visual coding experience.

### A Note on Code Quality

![](https://imgs.xkcd.com/comics/code_quality.png)

(From [xkcd](https://xkcd.com/1513/).)

### About & Accolades

The code editor and the console are bastardized versions of [ACE](https://ace.c9.io/) and [Simple Console](https://github.com/1j01/simple-console), respectively.

You're welcome to contribute to the project!