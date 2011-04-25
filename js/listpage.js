
window.get_result = function () {
  $('#prepare-page').remove();
  $('#like-count').show();
  $('#results').html('<p class="loading">Please wait, processing ...</p>');
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
    "WHERE source_id = {0} "
/*           "actor_id != '220551554627180' AND " +
           "created_time > '" + range_begin + "' AND " +
           "created_time <= '" + range_end + "' " + */
/*           "AND likes.count > 0 " +
    "ORDER BY likes.count DESC " + */
      "ORDER BY created_time DESC " +
    "LIMIT 256";

  var posts = FB.Data.query(query, '220551554627180');
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

        jQuery.getJSON('/facebook/util/getnodeterm/' + post.post_id, function(res) {
          var category = '';
          if (res.length>0) {
            var item = generate_item(picture, post, actor, created);
            post_id_list.push(post.post_id);
            $('#results').append(item);
            $('#results-count').html($('#results li').size() + " results");
            FB.Canvas.setSize();
            category = res[0].name;
            jQuery('li[post_id='+post.post_id+']').addClass('category-'+res[0].tid);
          }
          else {
            item = "";
            jQuery('li[post_id='+post.post_id+']').remove();
            if(DEBUG && typeof(console) !== 'undefined' && console != null) {
              console.log('Problem', post);
            }
          }
        });//getJSON
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
      <li class='user-idea' post_id="+ post.post_id +">\
        <div class='item-profile'>\
          <img src='" + picture + "'>\
        </div> \
          <div class='item-info'>\
            <div class='item-author'>\
              <a href='http://facebook.com/profile.php?id=" + actor.uid + "'>" + actor.name + "</a>\
              <em>" + created.format('mmmm dd, yyyy HH:MM') + "</em>\
            </div>\
            <div class='item-message'>" + post.message + "</div>\ <div class='item-permalink'><!--link: <a href='" + post.permalink + "'>" + post.permalink + "</a> !--></div>\ </div>\
        <div class='item-like'> \
          <span class='item-like-count'>" + '-' + "</span>\
          <span class='item-like-button'></span>\
        </div>\
        <div style='clear:both'></div>\
      </li>";
  }// try
  catch (err) {
    if(DEBUG && typeof(console) !== 'undefined' && console != null) {
      console.log(err);
    }

  }
  prepare_function_is_like_text(post.post_id)();
  prepare_function_vote_number(post.post_id)();
  //console.log('i do');

  return item;
}

function prepare_function_vote_number(post_id) {
  var fbuid = FB.getSession().uid;
  var request_path = '/facebook/util/vote/get/'+post_id;
  return function() {
    jQuery.getJSON(request_path, function(json) {
        var votenum = json && json.votenum;
        var selector = '.user-idea[post_id='+post_id+'] .item-like > .item-like-count';
        if (votenum == 0) {
          //$(selector).html('0');
        }
        else {
          //$(selector).html(votenum);
        }
    });
  };
}

function prepare_function_is_like_text(post_id) {
  var fbuid = FB.getSession().uid;
  var request_path = '/facebook/util/delta/get/'+post_id+'/'+fbuid;
  return function() {
    jQuery.getJSON(request_path, function(json) {
        var isLike = json && json.delta;
        var selector = '.user-idea[post_id='+post_id+'] .item-like > .item-like-button';
        if (isFinite(isLike)) {
          $(selector).html('not Like yet');
        }
        else {
          $(selector).addClass('liked').html('Liked');
        }
    });
  };
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
window.DEBUG = false;
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
      if(DEBUG && typeof(console) !== 'undefined' && console != null) {
        console.log('logged in');
      }
      get_result();
    }
    else {
      if(DEBUG && typeof(console) !== 'undefined' && console != null) {
        console.log('redirect');
      }
      var login_url = "http://www.facebook.com/dialog/oauth/?scope=email&client_id=" + Drupal.settings.fb_util.appid +"&redirect_uri=http://www.happyschoolbreak.com/facebook/util/verify&response_type=code_and_token&display=page";

      top.window.location.href = login_url;
    }
  });
};


jQuery(document).ready(function ($) {
  jQuery('#like-count').hide();
  (function() {
    var e = document.createElement('script'); e.async = true;
    e.src = document.location.protocol +
      '//connect.facebook.net/en_US/all.js';
      document.getElementById('fb-root').appendChild(e);
  }());
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

$('.category-item').live('click', function(e) {
    var self = $(this);
    var tid = self.attr('tid');
    var user_idea_selector = '.user-idea.category-'+tid;
    if (tid == 'all') {
      $('.user-idea').show();
    }
    else {
      $('.user-idea').hide();
    }
    $('.category-item').removeClass('active');
    self.addClass('active');
    $(user_idea_selector).show();
});

$('.item-like-button').live('click', function(e) {
  var self = $(this);
  var li = self.parent().parent('li');
  self.toggleClass('liked');
  var friend = self.siblings('.item-like-count').eq(0);
  if (self.is('.liked')) {
    if(DEBUG && typeof(console) !== 'undefined' && console != null) {
      console.log('++', friend.html(parseInt(friend.html())+1));
    }
  }
  else {
    if(DEBUG && typeof(console) !== 'undefined' && console != null) {
      console.log('--', friend.html(parseInt(friend.html())-1));
    }
  }
  var post_id = li.attr('post_id');
  if(DEBUG && typeof(console) !== 'undefined' && console != null) {
    jQuery.post('/facebook/util/vote/toggle/'+post_id, { fb_session: JSON.stringify(FB.getSession()) }, function(res) {
      var json_obj = JSON.parse(res);
      var _status = json_obj && json_obj['status'];
      if(DEBUG && typeof(console) !== 'undefined' && console != null) {
        console.log('_status = ', _status, res);
      }
      if (_status == 'visible') {
        self.removeClass('liked');
        self.addClass('liked');
        self.html('LIKED');
      }
      else {
        self.removeClass('liked');
        self.html('not Like');
      }

    });
  }
});
