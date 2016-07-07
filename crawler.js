/**
 * Created by hayden on 16/7/6.
 */


var http  = require('http');
var cheerio = require('cheerio');

var replies = 0;
var url = '';



process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
      url = chunk;
      replies = 0;
      http.get(url, function(res) {
          var html = '';
          res.on('data', function(data) {
              html += data;
          });
          res.on('end', function(data) {
              // urls是存储各个帖子URL链接的数组
              var urls = filterPostUrls(html);
              // 遍历每一个帖子，并统计出帖子的回复数
              var replies = 0;
              for(var index=0,post; post=urls[index]; index++){
                  replies += countReplies(post);
              }
              // console.log(replies);
          });
      }).on("error", function() {
          console.log('error');
      });
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});


// url = 'http://36.01ny.cn/forum.php?mod=viewthread&tid=4427325&extra=page%3D1%26filter%3Dauthor%26orderby%3Ddateline';





// 过滤出汇集贴中所有的帖子链接，并存在一个数组中
function filterPostUrls(html) {
    var $ = cheerio.load(html);
    var urls = $('.t_f').first().find('a');
    var postUrl = new Array();
    // 汇集贴本身也算是一个帖子
    postUrl.push(url);
    urls.each(function(k,v) {
        // console.log(v['attribs']['href']);
        postUrl.push(v['attribs']['href'])
    })

    return postUrl;
}

function countReplies(url) {
    // 帖子本身算一个回复，所以初始值置为1
    var reply = 1;

    http.get(url, function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function(data) {
            var $ = cheerio.load(html);
            var postNum = $('.xi1').first().next().next().next().text();
            // console.log(postNum);
            reply += (postNum/1);
            console.log(url);
            console.log('回复数： ' + reply);
            replies += reply;
            console.log('总数目： ' + replies);
            // console.log(reply);
            console.log('');
        });
    }).on("error", function() {
        console.log('error');
    });
}
