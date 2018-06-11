$.getJSON("/articles", function (data) {
    // For each one
    data.forEach(element => {
        var card = $("<div>");
        card.addClass("card");
        var body = $("<div>");
        body.addClass("card-body");
        var articleLink = $("<a>");
        articleLink.attr("href", element.link);
        var title = $("<h3>")
            .text(element.title);
        articleLink.append(title);
        var summary = $("<p>")
        .addClass("card-text")
        .text(element.summary);

        var commentBtn = $("<button>")
            .attr("data-id", element._id)
            .addClass("btn btn-primary float-right viewComments")
            .text("Comments");
        var commentArea = $("<div>")
            .addClass("commentArea hide");

        body.append(articleLink, summary, commentBtn, commentArea);
        card.append(body);
        $("#articles").append(card);
    });

});



$(document).on("click", ".viewComments", function () {


    var thisId = $(this).attr("data-id");
   
    var commentArea = $(this).closest(".card-body").find(".commentArea");


    if (!commentArea.hasClass("hide")) {
        commentArea.addClass("hide");
        commentArea.empty();

        return;
    } else {
        commentArea.removeClass("hide");

        callOneArticle(thisId, commentArea);
    }
});

function callOneArticle(thisId, commentArea) {
    commentArea.empty();
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })

        .then(function (data) {

            if (data.comm.length) {
                data.comm.forEach(item =>{
                    commentArea.append("<h5>" + item.title + "</h5>")
                    .append("<p>" + item.body + "</p>");
                });
                // commentArea
                //     .prepend("<p>" + data.comm.body + "</p>")
                //     .prepend("<h5>" + data.comm.title + "</h5>");
            }

            var form = $("<form>");
            var titleInput = $("<div>")
                .addClass("form-group")
                .append("<input type='text' class='form-control' id='titleinput' placeholder='Title'>");
            var bodyInput = $("<div>")
                .addClass("form-group")
                .append("<textarea class='form-control' id='bodyinput' rows='3'></textarea>");

            var saveBtn = $("<button>")
                .addClass("btn btn-secondary")
                .attr("id", "savenote")
                .attr("data-id", data._id)
                .text("Save");
            form.append(titleInput, bodyInput);
            commentArea.append(form, saveBtn);

        });
}



// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var commentArea = $(this).closest(".card-body").find(".commentArea");
    console.log("id of clicked button: " + thisId);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val().trim(),
                // Value taken from note textarea
                body: $("#bodyinput").val().trim()
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data + " this is the response");


        }).then(callOneArticle(thisId, commentArea));


});