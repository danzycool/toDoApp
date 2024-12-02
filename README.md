# toDoApp
This App is a an Ionic App built in React and TypeScript, which serves to schedule activities and events.


# Challenges
This build possed some errors such as:

 1. 'global is undefined' in the parse_react.js file
    
    # Fix: 
    I added the following lines of code to the index,html file.

    <script>
        if (global === undefined) {
            var global = window;
        }
    </script>

 2.  'TypeError: EventEmitter is not a constructor' in the App.tsx file where i called initializeParse().

    # Fix: 
    I installed the following packages:

        i. npm i events
        ii. npm i --save-dev @types/events @types/node

    

