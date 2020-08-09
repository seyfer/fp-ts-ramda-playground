# Based on Companion repo for Functional Programming for Beginners with Javascript and refactored to Typescript

Original forked repo [github.com/seyfer/fpjs](github.com/seyfer/fpjs)

**"Why should I learn Functional Programming?"**

Most software written today, is **overly complex**, **difficult to understand**, **challenging to test**, **hard to change** and **filled with** hard find **bugs**.

**Ouch!** So how do we end up with these problems?

Here’s a few of the many reasons:

* Not using the simplest building blocks possible… If you start with something complicated, you’ll end up with something even more complicated.
* Programming in a style that is more susceptible to complex bugs
* Not properly respecting and handling Side effects(talking to servers, input / output, etc)
* _“Sprinkling”_ Application State all throughout codebases
* Unnecessarily mutating data
* Code Duplication (particularly sneaky ones, like similar class methods in Object Oriented Programming )
* Writing more code than necessary

These are just a few of the many problems that lead to frustrating jobs, working on codebases that are hard to maintain and add features to.

Functional programming addresses the above problems in the following ways:

* Simpler apps, because functional programming uses the simplest building blocks possible, just plain old data and pure functions to transform the data (easier to understand and work with)
* Uses code styles that are simpler and less prone to complicated bugs (more time doing productive work)
* Eliminating Side Effects, as much as possible and controlling them when they are needed (reduces bugs)
* Avoids data mutation as much as possible (reduces bugs)
* Uses pure functions, that can work with many different types of data (improved code reuse)
* Uses generalized functions, that can be specialized to suit different needs (less code, same functionality)
* Creating new functions, without adding any new logic, using function composition (more functionality, no code added)

**Functional programming**, in my experience, is **more productive** than Object Oriented Programming because there are fewer things to think about, so you don’t overwhelm your working memory.  Usually your just thinking about plain old data, and data transformations, using functions.  Additionally, in Functional Programming, there aren’t tons of competing ways of doing the same thing, so you **don’t** have to **think about unnecessary things.** Functional Programming is constraining, and thats a good thing. You’re able to better focus, on the problem you’re solving, rather than the tools you’re using to solve the problem.

In Object Oriented Programming, you have to think about many different types of complicated, stateful objects that can be interacted with in different ways.  You’ve got to think about more than just data, and data transformation… You’ve got to think about things like State and Side Effects, far more than you do in Functional Programming.
