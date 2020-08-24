$(function(){
    $(".view").hide();
    $("#locations").hide();
    $("#view-main").show();
    $(this).scrollTop(0);
    function display(view){
        $(".view").hide();
        $("#" + view).show();
    }
    $(".view-btn").click(function(){
        display("view-" + this.id);
    });

    $("#submitSearch").click(enterPress);

    $("#results-btn").click(function(){
        var locations = $("#locations").text().split(",");
        var output = document.getElementById("output").innerHTML = "";

        if(!(locations == 0)){
            for (i = 0; i < locations.length; i++){
                search_append(locations[i]);
            }
        }
        
    });
});

function search_append(name){
    name = trim(name, "'");
    var output = document.getElementById("output");
  
    var returnString = ""
    var curJSON = {};
    var curString ="";
    var temp = "";

    $.ajax({
        type: 'GET',
        url: "http://api.citybik.es/v2/networks/",
        success:function(data){
            for(i=0; i<data.networks.length; i++){
                curJSON = data.networks[i];
                curString += curJSON.name;
                if (curString.indexOf(name) != -1){
                    temp = "<p>" + "Name: " + convertToString(curJSON.name) + 
                        " City: " + convertToString(curJSON.location.city) + " Country: " 
                        + convertToString(curJSON.location.country);
                    //returnString  += temp + "</p>";
                    var user = "'" + $("#user").text() + "'";

                    returnString += "<form action='/locations/removeId' method='post' style='margin: 0; padding: 0'/> " + temp + 
                   " <input type='hidden' name='user' value=" + "'" + $("#user").text() + "'" + "/>" +
                   " <input type='hidden' name='name' value=" + "'" + name + "'" + "/>" +
                   " <input value='Remove' class='create-button btn' type='submit' style='display: inline;'/> </p> </form>"
                    break;
                }   
            }
            output.insertAdjacentHTML('beforeend', returnString);
        },
        error: function(xhr, error){
            console.log("Something went wrong: ", error);
        }
    })
    //returnString = JSON.stringify(data.networks.company);

}

function trim(chars, id) {
    while (id.indexOf(chars[0]) == 0) {
        chars = chars.slice(1);
    }
    while (id.indexOf(chars[chars.length - 1]) == 0) {
        chars = chars.slice(0, -1);
    }
    return chars;
}


var enterPress = function(){
    var e = $.Event("keypress");
    e.which = 13;
    $("#searchBox").trigger(e);
}


//Switch dropdown text
function dropdown(val) {
    var y = document.getElementsByClassName('btn btn-default dropdown-toggle');
    var aNode = y[0].innerHTML = val + ' <span class="caret"></span>';
}

function convertToString(val){
    return JSON.stringify(val, null, "\t");
}

window.onload=function(){
    //Pressed Enter key on Search bar      
    // var dropVal = "City";
    // var input = document.getElementById("searchBox").onkeypress = function(e){
    //     var event =  e || window.event;
    //     var code = event.which || event.keyCode;
    //     if(code == '13'){   
    //         dropVal = document.getElementById("searchBtn").textContent; 
    //         var ourRequest = new XMLHttpRequest();
    //         ourRequest.open('GET',"http://api.citybik.es/v2/networks/");
    //         ourRequest.onload = function(){
    //             var ourData = JSON.parse(ourRequest.responseText);
    //             renderHTML(ourData);
    //         };
    //         ourRequest.send();
    //     }
    // }
    //Show search result output
    var output = document.getElementById("output");
    function renderHTML(data){
        var returnString = ""
        var curJSON = {};
        var curString ="";
        var temp = "";
        for(i=0; i<data.networks.length; i++){
            curJSON = data.networks[i];
            if(dropVal.trim() == "City"){
                curString = JSON.stringify(curJSON.location.city, null, "\t");
            }
            else if(dropVal.trim() == "Country"){
                curString = JSON.stringify(curJSON.location.country, null, "\t");
            }
            else if(dropVal.trim() == "Company"){
                if (curJSON.company == null){
                    continue;
                }
                for (j=0; j<curJSON.company.length; j++){
                    curString += curJSON.company[j];
                }
            }
            else{
                if (curString.indexOf(document.getElementById("searchBox").value) != -1){
                    returnString += "<p>" + JSON.stringify(data.networks[i].location, null, "\t") + "</p>";
                }
                returnString += "<p>" + JSON.stringify(data.networks[i].location, null, "\t") + "</p>";
            }
            if (curString.indexOf(document.getElementById("searchBox").value) != -1){
                temp = "<p>" + "Name: " + convertToString(curJSON.name) + 
                    " City: " + convertToString(curJSON.location.city) + " Country: " 
                    + convertToString(curJSON.location.country);
                returnString += "<form action='/locations/newId' method='post' style='margin: 0; padding: 0'> " + temp + 
                
                " <input type='hidden' name='name' value=" + convertToString(curJSON.name) + "/>" +
                " <input value='Add' class='create-button btn' type='submit' style='display: inline;'/> </p> </form>"
            }
        }
        //returnString = JSON.stringify(data.networks.company);
        output.innerHTML = returnString;
    }
}
