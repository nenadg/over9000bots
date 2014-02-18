
var OAuth = require('oauth');
var searchUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=datarbeiter'; // add target user

var oauth = new OAuth.OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        '---your api key ---------',                    // api key
        '---your api key secret---',                    // api key secret
        '1.0A',
        null,
        'HMAC-SHA1');
        
var tweets;         // collection of retrieved tweets
var lastId = 0;     // last tweet chronologically

// random tweets 
var messages = ['sure over nine THOUSAND', 'yeah over 9000 thousand', 'above and over 9000 thousand', 'srs? over nine thousand ?', 'no bullshit?! Over 9000 bots?'
                'no way there can be over 9000', 'so much for energy level', 'less than 9000' ];

function run(){

    oauth.get(
        searchUrl,
        '---your access token ---',         // access token
        '---access token secret ---',       // access token secret
        
        function (e, data, res){
           
            tweets = JSON.parse(data);
            
            // if one searches by screen name or user id tweets come in array format
            // otherwise you've probably found what you want
            if(tweets[0]){
                
                // new tweet prevails
                if(tweets[0].id_str > lastId){
                    lastId = tweets[0].id_str;
                    
                    // change your query
                    searchUrl = 'https://api.twitter.com/1.1/statuses/show.json?id=' + lastId;
                    console.log("search: " + searchUrl);
                    
                    run();
                }
                
            } else {
                
                console.log("target tweet: " + tweets.text);
                
                // tweet new status with random message
                oauth.post(
                    "https://api.twitter.com/1.1/statuses/update.json",
                    '2349755682-HKKSs5wmp4lasLIWDZTP91RyweutO3NyBuhUZoG',
                    'PIrYHvwdXuTAZfKC84UrYUqCCAyFzXByzao3dnRDSXU8d',
                    { "status": messages[Math.floor(Math.random() * messages.length)] }, // if replying add: { status: @handle + message, "in_reply_to_status_id" : lastId },
                    function(e, d) { if(e) console.log(e) else  console.log(d.text); } );
                
                // modify query to search again    
                searchUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=DBZNappa';
                console.log("search(2): " + searchUrl);
                
                // this is important, since tweeter api kicks you out if you flood
                setInterval(run, 300000);
                
            }
        });
};

run();
            




