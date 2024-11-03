// ------------------------------- //
// ------ SmallState TESTS ------- //
// import SmallState

// ------------------------------- //
// ----- BASIC FUNCTIONALITY ----- //
//        --- NO ERRORS ---        //

// create instance
// make sure it exists
// set value of `test` -- "stuff"
// get value of `test` -- "stuff"
// subscribe to `test` using a named function
// set value of `test` -- "more stuff"
// verify value returned to fumction -- "more stuff"
// unsubscribe named function from `test`
// set value of `test` -- "no stuff"
// verify no callbacks are called
// get value of `test` -- "no stuff" -- to show that the change happened

// ------------------------------- //
// --- SUBSCRIBE & UNSUBSCRIBE --- //
//     --- EXPECTED ERRORS ---     //

// create instance
// make sure it exists
// make sure `test` doesn't exist
// -- has() w/ error
// create `test` with no value
// get value of `test` -- null (???)
// set value of `test` -- "stuff"
// get value of `test` -- "stuff"
// subscribe to `test` using a named function
// set value of `test` -- "more stuff"
// verify value returned to fumction -- "more stuff"
// subscribe to `test` using an arrow function
// set value of `test` -- "even more stuff"
// verify value returned to both fumctions -- "even more stuff"
// unsubscribe named function from `test`
// set value of `test` -- "less stuff"
// verify value returned to arraow fumction -- "less stuff"
// try to to remove arrow function -- should be unable
// remove all subscribers of `test`
// set value of `test` -- "no stuff"
// verify no callbacks are called
// get value of `test` -- "no stuff" -- to show that the change happened

// ------------------------------- //
//  ------- LOCK & UNLOCK -------- //
//     --- EXPECTED ERRORS ---     //

