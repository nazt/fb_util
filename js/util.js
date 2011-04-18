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
      console.log('logged in'); 
      $('.category-wrapper').removeClass('hidden');
    }
    else {
      console.log('redirect');
      var login_url = "http://vacation.opendream.in.th/?scope=email,user_birthday&client_id=" + Drupal.settings.fb_util.appid +"&redirect_uri=http://vacation.opendream.in.th/facebook/util/verify.php&response_type=code_and_token&display=page";
      top.window.location.href = login_url 
    }

  });
}

var prepare_data_ui = function(to, category) {
  var data_ui = {
      method: 'feed',
      name: 'ปิดเทอมสร้างสรรค์',
      link: 'http://www.happyschoolbreak.com/',
      picture: 'http://fbrell.com/f8.jpg',
      caption: 'Category: '+ category,
      message: 'Enter your idea!',
      description: ' ', 
      to: to
    };
  return data_ui;
}

$(function() {
  //$('.category-wrapper').hide();
});

$('.category-item').live('click', function(e) {
  e.preventDefault();
  var self = $(this);
  console.log(self.parent(), self, self.html()); 
  var category = self.html();
  var post_to = Drupal.settings.fb_util.pageid || '153305968014537';
  var data_ui = prepare_data_ui(post_to, category);
  var session_string = JSON.stringify(FB.getSession());
  var tid = self.attr('tid');
  FB.ui(data_ui, function(response) {
  if (response && response.post_id) {
    console.log('Post was published.');
    var post_id = response.post_id;
    FB.api('/' + post_id, function(post_object) {
      var data = { 'tid': tid, 'post_id': post_id, 'message': post_object.message }
      var post_object_string = JSON.stringify(post_object);
      var data_object_to_send = { 'fb_util_data': session_string, 'fb_util_drupal': JSON.stringify(data), 'fb_post_object': post_object_string };
      console.log('response', response);
      console.log('data to send', data_object_to_send);
      jQuery.post('/facebook/util/idea/post', data_object_to_send , function(resp) {
        console.log(resp); 
      });
    });
  }
  else {
     console.log('Post was not published.');
   }
  });//ui
});//live 