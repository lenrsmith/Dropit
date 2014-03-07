DropIt
======

Stupidly Simple jQuery Dropdowns - http://dev7studios.com/dropit

Customizations
--------------

This is a customized version of the DropIt jQuery plugin by dev7studios. I needed a dropdown to use with text fields that presents the user with a set of predefined options. A select box was out of the question because the data needed to be updated on the fly whenever what the user typed in was not already in the list. Furthermore, I needed a way to allow users to delete the options on the fly. Therefore, this version has a remove button inside each option. 

I use AJAX to retrieve the data from the server with which to populate the list. When the user deletes the option another call is made to remove the data from the DB. 

This works for me as is. Use at your own discretion/Risk.