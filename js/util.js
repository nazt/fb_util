window.fbAsyncInit = function() {
  FB.init({
    appId  : Drupal.settings.fb_util.appid,
    status : true, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    xfbml  : true  // parse XFBML
  });
  FB.Canvas.setAutoResize(90);
  FB.getLoginStatus(function(response) {
    if (response.session) {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log('logged in');
      }
      $('.category-wrapper').removeClass('hidden');
      $('body').show();
    }
    else {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log('redirect');
      }
      var login_url = "http://www.facebook.com/dialog/oauth/?scope=publish_stream,email,user_birthday&client_id=" + Drupal.settings.fb_util.appid +"&redirect_uri=http://vacation.opendream.in.th/facebook/util/verify&response_type=code_and_token&display=page";
      top.window.location.href = login_url
    }

  });
}

var prepare_data_ui = function(to, category, cate_id) {
  var picture_path = 'http://vacation.opendream.in.th/sites/all/modules/custom/fb_util/images/cate-'+cate_id+'.png';
      console.log('picture path', picture_path);
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
  $('body').hide();
});

$('.category-item').live('click', function(e) {
  e.preventDefault();
  var self = $(this);
  if(typeof(console) !== 'undefined' && console != null) {
    console.log(self.parent(), self, self.html());
  }
  var category = self.html();
  var post_to = Drupal.settings.fb_util.pageid || '153305968014537';
  var data_ui = prepare_data_ui(post_to, category, self.attr('tid'));
  var session_string = JSON.stringify(FB.getSession());
  var tid = self.attr('tid');
  if(typeof(console) !== 'undefined' && console != null) {
    console.log('data_ui', data_ui);
  }
  FB.ui(data_ui, function(response) {
  if (response && response.post_id) {
    if(typeof(console) !== 'undefined' && console != null) {
      console.log('Post was published.');
    }
    var post_id = response.post_id;
    FB.api('/' + post_id, function(post_object) {
      var data = { 'tid': tid, 'post_id': post_id, 'message': post_object.message }
      var post_object_string = JSON.stringify(post_object);
      var data_object_to_send = { 'fb_util_data': session_string, 'fb_util_drupal': JSON.stringify(data), 'fb_post_object': post_object_string };
      if(typeof(console) !== 'undefined' && console != null) {
          console.log('response', response);
          console.log('data to send', data_object_to_send);
      }
      jQuery.post('/facebook/util/idea/post', data_object_to_send , function(resp) {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log(resp);
      }
      });
    });
  }
  else {
      if(typeof(console) !== 'undefined' && console != null) {
        console.log('Post was not published.');
      }
   }
  });//ui
});//live
