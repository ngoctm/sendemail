var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.use(express.static('/'));

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

//app.post('/process_post', urlencodedParser, function (req, res) {
app.post('/messages/send-template.json', urlencodedParser, function (req, res) {

   var username = req.body.txtUsername;
   var email = req.body.txtEmail;
   
   sendMail(username,email);
   
   var body = '<html> ' + 
		'<head> ' +
		'<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" /> ' +
		'<title>User SignUp</title> ' +
		'</head> ' +
		'<body> ' +
		'<div style="padding: 20px">' +
		'<center>' +
		'<h2>Stay turned ' + username + '.</h2>' +
		'<h3>You have been signed up!</h3>' +
		'</center>' +
		'</div>' +
		'</body> ' +
		'</html>';
   res.writeHead(200, {"Content-Type": "text/html"});
   res.write(body);
   res.end();
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

function sendMail(user_name, user_email){
	var API_KEY = 'SAMCBFVD5NEqlo8gRTidSw';
	var mandrill = require('mandrill-api/mandrill');
	mandrill_client = new mandrill.Mandrill(API_KEY);
	var template_name = "test-template";
	var template_content = [{
			"name": user_name,
			"content": "example content"
		}];
	var message = {
		"html": "<p>Example HTML content</p>",
		"text": "Example text content",
		"subject": "example subject",
		"from_email": "message.from_email@example.com",
		"from_name": "Example Name",
		"to": [{
				"email": user_email,
				"name": "Recipient Name",
				"type": "to"
			}],
		"headers": {
			"Reply-To": "message.reply@example.com"
		},
		"important": false,
		"track_opens": null,
		"track_clicks": null,
		"auto_text": null,
		"auto_html": null,
		"inline_css": null,
		"url_strip_qs": null,
		"preserve_recipients": null,
		"view_content_link": null,
		"bcc_address": "message.bcc_address@example.com",
		"tracking_domain": null,
		"signing_domain": null,
		"return_path_domain": null,
		"merge": true,
		"merge_language": "mailchimp",
		"global_merge_vars": [{
				"name": "merge1",
				"content": "merge1 content"
			}],
		"merge_vars": [{
				"rcpt": "recipient.email@example.com",
				"vars": [{
						"name": "merge2",
						"content": "merge2 content"
					}]
			}],
		"tags": [
			"password-resets"
		],
		"subaccount": "customer-123",
		"google_analytics_domains": [
			"example.com"
		],
		"google_analytics_campaign": "message.from_email@example.com",
		"metadata": {
			"website": "www.example.com"
		},
		"recipient_metadata": [{
				"rcpt": "recipient.email@example.com",
				"values": {
					"user_id": 123456
				}
			}],
		"attachments": [{
				"type": "text/plain",
				"name": "myfile.txt",
				"content": "ZXhhbXBsZSBmaWxl"
			}],
		"images": [{
				"type": "image/png",
				"name": "IMAGECID",
				"content": "ZXhhbXBsZSBmaWxl"
			}]
	};
	var async = false;
	var ip_pool = "Main Pool";
	var send_at = new Date().toLocaleDateString("en-US");
	mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
		console.log(result);
		/*
		[{
				"email": "recipient.email@example.com",
				"status": "sent",
				"reject_reason": "hard-bounce",
				"_id": "abc123abc123abc123abc123abc123"
			}]
		*/
	}, function(e) {
		// Mandrill returns the error as an object with name and message keys
		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	});
}