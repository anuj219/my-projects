// load XML data using AJAX
// Ajax - asynchronous javascript and xml
// it works where nobody has to wait for each other

// 
// It’s a set of web development techniques that allows web applications to send and retrieve data from a server asynchronously (in the background) without interfering with the display and behavior of the existing page
// AJAX operations are asynchronous, meaning they don’t block the execution of other scripts

// get means firing an http request - either get or post - so it requests server(xampp) to fetch xml data
function loadData() {
    $.ajax({
        type: "GET",  
        url: "mov.xml",     // The URL to which the request is sent. In this case, it’s the path to the XML file.
        dataType: "xml",
        // Sends an HTTP GET request to fetch mov.xml from server(local or any) and expects server response in an XML format.
        success: function (xml) {
            let mov_arr = [];

            // $(xml): Wraps the entire XML data in a jQuery object.
            $(xml).find('movie').each(function () {
                // .find('movie'): Searches for all <movie> elements within the XML.
                // .find() : used to get the descendants of each element in the current set of matched elements,
                // filtered by a selector, jQuery object, or element.
                // .each(function () { ... }): For each <movie> element found, execute the provided function.
                // each is a for loop for a each movie tag
                const title = $(this).find('title').text();    // innerText 
                // $(this): Refers to the current <movie> element being processed in the iteration.
                // Wrapping this with $() (i.e., $(this)) converts it into a jQuery object, allowing you to use jQuery methods on it.        
                const year = $(this).find('year').text();
                const dir = $(this).find('director').text();
                const gen = $(this).find('genre').text();
                const rating = $(this).find('rating').text();
                const img = $(this).find('img').text();
                const cast = $(this).find('cast').text();
                const desc = $(this).find('description').text();
                const trail = $(this).find('trailer').text();

                mov_arr.push({ title, year, dir, gen, rating, img, cast, desc, trail });
                //This line creates an object with properties title, year, dir, gen, rating, and img.
                // The object is then added to the mov_arr array using the push method.

                // so 
                // first array of one particular movie is made in the loop with elements tittle, year, director etc  ---- no no no no
                // first object of one particular movie is made with these elements, object is dictionary in java (look at those curly braces -- python ref )  ------------------------------- important
                //  so the object will have title: IronMan, director: , year:    .. and so on for each movie
                // and that whole array (no i meant object) is then added to the mov_arr using push
            });

            // use this function for displaying all movies either sorted/ non-sorted whatever 
            function dis(mov_arr) {
                mov_arr.forEach(i => {
                    // The append() method in jQuery is used to insert content to the end of the selected elements.
                    // works like .innerHTML += in javascript
                    $('#movie_list').append(`
                    <li class="movie-item">
                        <h3 class="title content info">${i.title}</h3>
                        <img class="image content info" src="${i.img}" alt="${i.title}">
                        <p class="year content common">Year: ${i.year}</p>
                        <p class="dir content common">Director: ${i.dir}</p>
                        <p class="genre content common">Genre: ${i.gen}</p>
                        <div class="mov_rating content common"><p style="margin-right:30px; margin-bottom:10px; display:inline">Rating: ${i.rating}</p><i class="fa fa-star" aria-hidden="true"></i></i></div>
                        <p class="cast content2 common">Cast: ${i.cast}</p>
                        <p class="desc content2 common">Description: ${i.desc}</p>
                        <iframe class="trail content2 common trailer" src="${i.trail}" allow="autoplay"></p>
                    </li>
                `);
                }
                );
            }
    

            dis(mov_arr);           // when page loads , non-ordered movies list

            // code to toggle the sorting based on year of release
            var yflag = 0;
            $('#sort_year').click(function () {
                if (yflag == 0) {
                    // (a, b) => a.year - b.year is a comparator function | compares pair of two objects at a time, after that, compares another pair
                    mov_arr.sort((a, b) => a.year - b.year);  // ascending
                    // If a.year is less than b.year, the function returns a negative value, meaning a comes before b.
                    //  if equal than 0

                    yflag = 1
                }
                else {
                    mov_arr.sort((a, b) => b.year - a.year);  // descending
                    yflag = 0;
                }
                $('#movie_list').empty();  // once you sort them, empty the og array which had non-ordered movies
                dis(mov_arr);
            });


            // code to toggle the sorting based on rating
            var rflag = 0;      // a flag var for rating toggle
            $('#sort_rating').click(function () {
                if (rflag == 0) {
                    mov_arr.sort((a, b) => a.rating - b.rating);   // ascending
                    rflag = 1;
                }
                else {
                    mov_arr.sort((a, b) => b.rating - a.rating);   // descending
                    rflag = 0;
                }
                $('#movie_list').empty();
                dis(mov_arr);
            }); // toggle ends here



            //  copilots code for search bar
            // on can help to use multiple event listeners
            $('#search_box').on('keyup click', function () {
                const input1 = $(this).val().toLowerCase();
                const filteredMovies = mov_arr.filter(i =>
                    i.title.toLowerCase().includes(input1) ||
                    i.year.toLowerCase().includes(input1) ||
                    i.dir.toLowerCase().includes(input1) ||
                    i.gen.toLowerCase().includes(input1) ||
                    i.rating.toLowerCase().includes(input1)
                );
                $('#movie_list').empty();
                dis(filteredMovies);
            });

            // function to display the clicked moin
            // $('.movie-item').click(function () {
            //     if ($(this).children('.content2').css('display') === 'none') {
            //         $('.movie-item').css('display', 'none');
            //         $(this).css('display', 'flex').addClass('active');
            //         $(this).children('.content2').css({'display':'block'});
            //     }
            // })                             ------------------- this didnt work when the list was sorted or filtered, as when you sort, the og list was removed and replaced by new list ,, and this function was tied to the og list 
            // New <li> elements are created and appended to the #movie_list. These new elements have the class .movie-item, but they do not inherit the event listeners that were attached to the old elements.
            // so had to do the below code
            // $('.movie-item').click(function () {         Replace this part
            $('#movie_list').on('click', '.movie-item', function () {
                if ($(this).children('.content2').css('display') === 'none') {
                    $('.movie-item').css('display', 'none');
                    $(this).css('display', 'flex').addClass('active');
                    $(this).children('.content2').css({ 'display': 'block' });
                    $(this).children('.trailer').css({ 'position': 'absolute' });
                }
            });
            // event delegation in action above
            // Event delegation works by attaching the event listener to a parent element (in this case, #movie_list) that is not removed or replaced. The parent element listens for events that bubble up from its child elements.
            //  When an event occurs on a child element that matches the specified selector (e.g., .movie-item), the event handler is executed.


        },  // success code ends here (function ends)

        error: function () {
            $('#movie_list').append('<li> Error Loading List</li>'); //this works as innerHTML+= in JS
        }
    })      // ajax ends    
} // jquery code ends

$(document).ready(function () {
    loadData();
});

$('#home').click(function () {
    $('#movie_list').empty();
    loadData();
});


// var: Variables declared with var are hoisted to the top of their scope and initialized with undefined.
// let: Variables declared with let are also hoisted but are not initialized. Accessing them before declaration results in a ReferenceError12.
/*
function example() {
    if (true) {
        var x = 5;
        let y = 10;
    }
    console.log(x); // 5
    console.log(y); // ReferenceError: y is not defined
}
     */