Team Java Grinders:

Our proposal is a shift management system which allows retail employees to add available shifts and view their scheduled shifts, managers to create a schedule based on available shifts, 
and a store manager to add stores which contain managers and retail employees.

`dsmelser's notes:   I really like this conceptually.  This is a real-world problem that many many businesses have to solve.  How are available shifts defined by the user?  Can they have repetition rules or do they just specify particular dates and times? How will schedules be displayed?  On a calendar?  Depending on the answers to these questions, multiple stores/sets of employees may be a little big for the time you have left.  You may want to focus on the core scheduling product for a single fictional business.`

The user will have a set of hours to choose from (opening to closing), a maximum number of hours per shift (9 including a lunch), and a day of the week to choose from. 
Repetition by the same employee won't be allowed, but overlapping shifts by both the same and other employees will be.
Schedules will be displayed on a weekly basis, in a calendar-esque format.