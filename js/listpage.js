
window.get_result = function () {
  $('#results').html('Please wait, processing ...');
/*
  var range_begin = $('#date-begin').datepicker('getDate').getTime();
  var range_tmp = $('#date-end').datepicker('getDate').getTime();
  var range_end = new Date(range_tmp).setHours(17,0,0);
  if (typeof console != undefined)
    console.log(range_end, new Date(range_end));

  generate_result(range_begin/1000, range_end/1000);
  */
  generate_result(ndaysago(3).getTime()/1000, today().getTime()/1000);
}
window.post_id_list = [];
window.create_post_id_to_check = function(list)  {
  var output = [];
  FB.Array.forEach(list, function(v, k) {
    output.push('"' + v + '"');
  });
  output = output.join(',');
  output = "(" + output.toString() + ")";
  return output;
}
window.generate_result = function(range_begin, range_end) {
  var query =
    "SELECT post_id, attachment, likes, created_time, actor_id, message, permalink " +
    "FROM stream " +
    "WHERE source_id = {0} AND " +
           "actor_id != '151383371550838' AND " +
           "created_time > '" + range_begin + "' AND " +
           "created_time <= '" + range_end + "' AND " +
           "likes.count > 0" +
    "ORDER BY likes.count DESC " +
    "LIMIT 256";

  var posts = FB.Data.query(query, '151383371550838');
  var users = FB.Data.query(
     "SELECT uid, name " +
     "FROM user " +
     "WHERE uid in " +
     "(SELECT actor_id from {0})", posts);
  FB.Data.waitOn([posts, users], function() {
    $('#results').html('');
    var user_list = {};

    FB.Array.forEach(users.value, function(user) {
      user_list[user.uid] = user;
    });

    FB.Array.forEach(posts.value, function(post) {
        //console.log(post, (post.message).substr(0, 20), post.likes.count);
      if (post.attachment != undefined) {
        var actor = user_list[post.actor_id];
        var created = new Date(post.created_time * 1000);
        var picture = "http://graph.facebook.com/" + post.actor_id + "/picture";
        var item = generate_item(picture, post, actor, created);
        post_id_list.push(post.post_id);
        $('#results').append(item);
        $('#results-count').html($('#results li').size() + " results");

        FB.Canvas.setSize();
      }
    });
  });
}

window.generate_item = function(picture, post, actor, created) {
  var item;
  /*
  if (typeof console != undefined)
    console.log(post);
    */
  try {
    item = "\
    <li>\
      <div class='item-profile'>\
        <img src='" + picture + "'>\
      </div> \
        <div class='item-info'>\
          <div class='item-author'>\
            <a href='http://facebook.com/profile.php?id=" + actor.uid + "'>" + actor.name + "</a>\
            <em>" + created.format('mmmm dd, yyyy HH:MM') + "</em>\
          </div>\
          <div class='item-message'>" + post.message + "</div>\
          <div class='item-permalink'>link: <a href='" + post.permalink + "'>" + post.permalink + "</a></div>\
      </div>\
      <div class='item-like'> \
        <span class='item-like-count'>" + post.likes.count + "</span>\
      </div>\
      <div style='clear:both'></div>\
    </li>";
  }
  catch (err) {
    if(typeof(console) !== 'undefined' && console != null) {
      console.log(err);
    }

  }
  return item;
}

window.today = function() {
  var d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

window.midnight = function() {
  return new Date(today().getTime() + 86400000);
}

window.now = function() {
  return new Date();
}

window.ndaysago = function(n) {
  return new Date(today().getTime() - n*86400000);
}

window.fbAsyncInit = function() {
  // Init facebook sdk.
  FB.init({
    appId  : Drupal.settings.fb_util.appid,
    status : false, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    xfbml  : false  // parse XFBML
  });
  FB.Canvas.setAutoResize(91);
  FB.getLoginStatus(function(response) {
    if (response.session) {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log('logged in');
      }

      get_result();
    }
    else {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log('redirect');
      }
      var login_url = "http://vacation.opendream.in.th/?scope=email,user_birthday&client_id=" + Drupal.settings.fb_util.appid +"&redirect_uri=http://vacation.opendream.in.th/facebook/util/verify.php&response_type=code_and_token&display=page";
      top.window.location.href = login_url;
    }
  });
};

(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol +
    '//connect.facebook.net/en_US/all.js';
  jQuery(document).ready(function() {
    document.getElementById('fb-root').appendChild(e);
  });
}());

jQuery(document).ready(function ($) {
/*
  $('#date-begin, #date-end').datepicker({
    showButtonPanel : false,
    dateFormat: "dd/mm/yy"
  });
  $('#date-begin').datepicker('setDate', ndaysago(2));
  $('#date-end').datepicker('setDate', midnight());
*/

  $('#get-result').click(function (e) {  });
});

