var context = require.context('./', true, /-spec\.ts$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);
context = require.context('./', true, /-spec\.js$/); //make sure you have your directory and regex test set correctly!
context.keys().forEach(context);