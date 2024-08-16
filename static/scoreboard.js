function display_scoreboard(scoreboard){
  $("#teams").empty();
  $.each(scoreboard, function(index, team){
    addTeamView(team.id, team.name, team.score);
  });
}

function addTeamView(id, name, score){
  var team_template = $("<div class = row id=" + id + "></div>");
  var name_template = $("<div class = col-md-5></div>");
  var score_template = $("<div class = col-md-2 id= score-" + id + "></div>");
  var button_template = $("<div class = col-md-2></div>");
  var increase_button = $("<button class = increase-button>+</button>");
  $(increase_button).click(function(){
    increase_score(id);
  });
  name_template.text(name);
  score_template.text(score);
  button_template.append(increase_button);
  team_template.append(name_template);
  team_template.append(score_template);
  team_template.append(button_template);
  $("#teams").append(team_template);
}

function reorder_rows(id) {
  let table = $("#teams");
  let rows = table.children();
  let index = 0;
  while(parseInt(rows[index].id, 10) != id && index < rows.length) {
    index += 1;
  }

  let i = index;

  while(i != 0 && parseInt($("#score-" + rows[index].id).text(), 10) > parseInt($("#score-" + rows[i-1].id).text(), 10)) {
    i -= 1;
  }
  if(index > i) {
    $('#' + rows[index].id).insertBefore($('#' + rows[i].id));
    return [index, i];
  }

  return [-1, -1];

}

function increase_score(id){
  var team_id = {"id": id}
  $.ajax({
    type: "POST",
    url: "increase_score",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(team_id),
    success: function(result){
      let score = parseInt($("#score-" + id).text(), 10) + 1;
      $("#score-" + id).text(score);
      [index, i] = reorder_rows(id);
      if(index != -1) {
        $.ajax({
          type: "POST",
          url: "reorder_rows",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({index:index, i:i}),
        });
      }
    },
    error: function(request, status, error){
        console.log("Error");
        console.log(request)
        console.log(status)
        console.log(error)
    }
  });
}

$(document).ready(function(){
  display_scoreboard(scoreboard);
})
