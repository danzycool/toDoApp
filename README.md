# ToDo App
![391216426-35b407c5-413e-4641-9a39-6ccadfd89fe9](https://github.com/user-attachments/assets/ed6aa1d4-1fea-4b1a-a342-0017d581a0ea)
![218488704-e391d9f0-d4a9-43cc-bd61-6d2b76550d60](https://github.com/user-attachments/assets/5b9f34e5-cc3d-4758-999c-f4e46182f3b9)
![typescript](https://github.com/user-attachments/assets/dd18e2a5-e8a7-446f-856c-6a95baac6337)

This App is a an Ionic App built in React and TypeScript, which serves to schedule activities and events.


# Challenges
This build possed some errors such as:

 1. _'global is undefined'_ in the *parse_react.js* file.

 2.  _'TypeError: EventEmitter is not a constructor'_ in the *App.tsx* file where i called `initializeParse()`.
    
# Fixes 
 1. I added the following lines of code to the index.html file.

```
<script>
   if (global === undefined) {
       var global = window;
   }
</script>
```

 2. I installed the following packages:
   - npm i events    
   - npm i --save-dev @types/events @types/node

    

