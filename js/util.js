function render_display() {
  $('.category-wrapper').removeClass('hidden');
  $('.category-wrapper').show();
  $('#like-box-fan-page').addClass('hidden');
  $('.like-page-first').hide('fast');
  try {
    $('#prepare-page').remove();
    $('#like-box-fan-page').remove();
  }
  catch (e) {
    if(typeof(console) !== 'undefined' && console != null) {
      console.log('error: ', e);
    }
  }
}

window.DEBUG = false;
window.fbAsyncInit = function() {
  FB.init({
    appId  : Drupal.settings.fb_util.appid,
    status : true, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    xfbml  : true  // parse XFBML
  });
  FB.Canvas.setAutoResize(90);
  FB.Event.subscribe('edge.create', function(response) {
    render_display();
  });
  FB.Event.subscribe('xfbml.render', function(response) {
    $('#prepare-page').remove();
    $('#like-box-fan-page').show();
    $('#like-box-fan-page').removeClass('hidden');
  });

  FB.Event.subscribe('edge.remove', function(response) {
    $('.category-wrapper').addClass('hidden');
  });

  FB.getLoginStatus(function(response) {
    if (response.session) {
      if(DEBUG && typeof(console) !== 'undefined' && console != null) {
        console.log('logged in');
      }
      var uid =  FB.getSession().uid;
      var pageId = Drupal.settings.fb_util.pageid;
      var graph_url = '/' + pageId + '/members/' + uid;
      FB.api(graph_url , function(res) {
        if (res.data.length == 0) {
          $('#prepare-page').remove();
          $('#like-box-fan-page').html('<fb:like-box href="http://www.facebook.com/happyschoolbreak" width="292" show_faces="false" stream="false" header="false"></fb:like-box>');
          $('#like-box-fan-page').append("<div class='like-page-first'>กรุณากด Like เพื่อร่วมกิจกรรม</div>");
          FB.XFBML.parse();
          if(DEBUG && typeof(console) !== 'undefined' && console != null) {
            console.log('Not fan');
          }
        }
        else {
          if(DEBUG && typeof(console) !== 'undefined' && console != null) {
            console.log(res.data[0].name, 'isFan');
          }
          render_display();
        }
      });
    }
    else {
      if(DEBUG && typeof(console) !== 'undefined' && console != null) {
        console.log('redirect');
      }
      var login_url = "http://www.facebook.com/dialog/oauth/?scope=publish_stream,email&client_id=" + Drupal.settings.fb_util.appid +"&redirect_uri=http://www.happyschoolbreak.com/facebook/util/verify&response_type=code_and_token&display=page";
      top.window.location.href = login_url
    }
    $('#prepare-page').remove();
  });
}

var prepare_data_ui = function(to, category, cate_id) {
  var picture_path = 'http://vacation.opendream.in.th/sites/all/modules/custom/fb_util/images/cate-'+cate_id+'.png';
  var data_ui = {
      method: 'feed',
      name: 'ปิดเทอมสร้างสรรค์',
      link: 'http://www.happyschoolbreak.com/',
      picture: picture_path,
      caption: 'หมวดหมู่: '+ category,
      message: 'Enter your idea!',
      description: ' ',
      to: to
    };
  return data_ui;
}

$(function() {
  //$('.category-wrapper').hide();
  $('#like-box-fan-page').hide();
});

$('.category-item').live('click', function(e) {
  e.preventDefault();
  var self = $(this);
  if(DEBUG && typeof(console) !== 'undefined' && console != null) {
    console.log(self.parent(), self, self.html());
  }
  var category = self.html();
  var post_to = Drupal.settings.fb_util.pageid || '153305968014537';
  var data_ui = prepare_data_ui(post_to, category, self.attr('tid'));
  var session_string = JSON.stringify(FB.getSession());
  var tid = self.attr('tid');
  if(DEBUG && typeof(console) !== 'undefined' && console != null) {
    console.log('data_ui', data_ui);
  }
  FB.ui(data_ui, function(response) {
  if (response && response.post_id) {
    if(DEBUG && typeof(console) !== 'undefined' && console != null) {
      console.log('Post was published.');
      jQuery('.category-wrapper').html('<p class=loading>Please wait..</p>');
    }
    var post_id = response.post_id;
    FB.api('/' + post_id, function(post_object) {
      var data = { 'tid': tid, 'post_id': post_id, 'message': post_object.message }
      var post_object_string = JSON.stringify(post_object);
      var data_object_to_send = { 'fb_util_data': session_string, 'fb_util_drupal': JSON.stringify(data), 'fb_post_object': post_object_string };
      if(DEBUG && typeof(console) !== 'undefined' && console != null) {
          console.log('response', response);
          console.log('data to send', data_object_to_send);
      }
      jQuery.post('/facebook/util/idea/post', data_object_to_send , function(resp) {
        if(DEBUG && typeof(console) !== 'undefined' && console != null) {
          console.log(resp);
          top.window.location.href = "http://www.facebook.com/happyschoolbreak?sk=app_168099556581644";
        }
      });
    });
  }
  else {
      if(DEBUG && typeof(console) !== 'undefined' && console != null) {
        console.log('Post was not published.');
      }
   }
  });//ui
});//live
