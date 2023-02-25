var token, openid, nickname, headimgurl, sex, country, province, act_id = 19, debug, totalTime, beginTime, endTime;
$(function () {
    debug = 1;
    if (!debug) {
        $.ajax({
            cache: false,
            async: false,
            type: "POST",
            url: '/act/center/openIdCrossDomain.ashx',
            data: {
                "type": "GET",
                "url": 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb61fdb0e387cbcc4&secret=2de4747ccccb04312e71e86708bfec66&code=' + getQueryString("code") + '&grant_type=authorization_code'
            },
            success: function (response) {
                var result = JSON.parse(response);
                token = result.access_token;
                openid = result.openid;
                guess.user = openid;
                $.ajax({
                    cache: false,
                    async: false,
                    type: "POST",
                    url: '/act/center/openIdCrossDomain.ashx',
                    data: {
                        "type": "GET",
                        "url": 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid + '&lang=zh_CN',
                    },
                    success: function (response) {
                        var r = JSON.parse(response);
                        nickname = r.nickname;
                        headimgurl = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/deep/static/img/icon.jpg';
                        sex = r.sex;
                        country = r.country;
                        province = r.province;
                        if (typeof (openid) == "undefined") {
                            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fguess%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                        }
                        else {
                            guess.init();
                            $("#main").show();
                        }
                    }
                });
            }
        });
    }
    else {
        guess.user = 'oTaiPuEUqBR9FQRGw5hvR0oyOAWo';
        guess.init();
        $("#main").show();
    }
});
var guess = {
    user: null,
    score: 0,
    time: 0,
    scoreList: null,
    init: function () { //获取我的分数以及排行榜
        // $.ajax({
        //     cache: false,
        //     async: false,
        //     type: "POST",
        //     url: '/act/h5/deep/doDeepScore.ashx',
        //     data: {
        //         "act_id": act_id,
        //         "init": "1",
        //         "user": guess.user
        //     },
        //     success: function (response) {
        //         console.info(response);
        //         var result = JSON.parse(response);
        //         guess.score = result.score;
        //         guess.time = result.count;
        //         guess.scoreList = result.scoreList;
        //         guess.addScoreList();
        //     }
        // });
        guess.score = 0;
        guess.time = 0;
        guess.scoreList = [
            {
                json: {
                    img: './static/user/羊年喜羊羊_头像_慢羊羊.jpg',
                    name: '慢羊羊',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '01',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_喜羊羊.jpg',
                    name: '喜羊羊',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '02',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_美羊羊.jpg',
                    name: '美羊羊',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '03',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_灰太狼.jpg',
                    name: '灰太狼',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '04',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_暖羊羊.jpg',
                    name: '暖羊羊',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '05',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_小灰灰.jpg',
                    name: '小灰灰',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '06',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_红太狼.jpg',
                    name: '红太狼',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '07',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_沸羊羊.jpg',
                    name: '沸羊羊',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '08',
                count: '60'
            }, {
                json: {
                    img: './static/user/羊年喜羊羊_头像_懒羊羊.jpg',
                    name: '懒羊羊',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '09',
                count: '60'
            }, {
                json: {
                    img: './static/user/Karsten.jpg',
                    name: 'Karsten',
                    addtime: '2017-02-10 23:59:59',
                    score: '30'
                },
                user: '10',
                count: '60'
            },
        ];
        guess.addScoreList();

    },
    addScoreList: function () {
        var html = '';
        var list = guess.scoreList;
        for (var i = 0; i < list.length; i++) {
            html += '<li><img class="p_image" src="' + list[i].json.img + '" width="50" height="50" /><a class="p_name">' + list[i].json.name + '</a><a class="p_time">' + list[i].json.addtime + '</a><a class="p_score">你认出了' + list[i].json.score + '个角色，只花了' + list[i].count + '秒！</a><a class="p_index">' + (i + 1) * 1 + '</a></li>';
        }
        $("#paihan_main").empty().append(html);
    },
    addScore: function (score, time) {
        var json = '{"addtime":"str_addtime","score":"' + score + '","name":"' + nickname + '","img":"' + headimgurl + '","usetime":"' + time + '","sex":"' + sex + '","country":"' + country + '","province":"' + province + '"}';
        console.info(json);
        // $.ajax({
        //     cache: false,
        //     async: false,
        //     type: "POST",
        //     url: '/act/h5/deep/doDeepScore.ashx',
        //     data: {
        //         "act_id": act_id,
        //         "init": "0",
        //         "type": "add",
        //         "user": guess.user,
        //         "score": score,
        //         "count": time,
        //         "json": json
        //     },
        //     success: function (response) {
        //         console.info('更新记录成功');
        //         for (var i = 0; i < guess.scoreList.length; i++) {
        //             if (score > guess.scoreList[i].score) {
        //                 guess.init();
        //             }
        //         }
        //     }
        // });
    },
    openP: function () {
        $("#paihanPanel").show();
    },
    closeP: function () {
        $("#paihanPanel").hide();
    },
    getPrize: function () {
        var time = new Date();
        var now = time.getTime();
        if (now < Date.parse("2017/04/23 00:00:00")) {
            var hasPrize = false;
            for (var i = 0; i < guess.scoreList.length; i++) {
                if (guess.scoreList[i].user == openid) {
                    hasPrize = true;
                }
            }
            if (!hasPrize) {
                console.info(openid);
                award.open();
            }
            else {
                console.info(openid);
                $(".paihan_tips").empty().html('您本次没有上榜哦!');
                return false;
            }
        }
        else {
            $(".paihan_tips").empty().html('排行榜截止于2017-04-22,请于结束后再来领取奖品!');
            return false;
        }
    }
};
Array.prototype._random = function () {
    this.sort(function (d, e) {
        return Math.random() <= .5 ? -1 : 1;
    });
    return this;
};
Array.prototype.random = function () {
    var d = Math.ceil(this.length / 2), e = this.length;
    var f = this.slice(0, d), g = this.slice(d, this.length);
    f._random(), g._random();
    for (var h = 0; h < e; h += 2) {
        var i = Math.floor(h / 2);
        f[i] && (this[h] = f[i]);
        g[i] && (this[h + 1] = g[i]);
    }
    this._random();
    return this;
};
Array.prototype.remove = function (d) {
    if (d <= 0) {
        this.shift();
    } else if (d >= this.length - 1) {
        this.pop();
    } else {
        var e = this.slice(0, d).concat(this.slice(d + 1, this.length));
        for (var f = 0, max = this.length; f < max; f++) {
            this.pop();
        }
        for (var f = 0, max = e.length; f < max; f++) {
            this.push(e[f]);
        }
        e = null;
    }
    return this;
};

String.prototype.format = function (d, e) {
    return this.replace(e || /\${([^}]*)}/g, function (f, h) {
        var i = d;
        if (h.indexOf(".") >= 0) {
            var j = h.split("."), k;
            while (k = j.shift()) {
                i = i[k];
                if (!i) break;
            }
        } else {
            i = i[h];
        }
        return i || "";
    });
};

var a = {};

a.debug = false;

a.width = 480;

a.height = 760;

btGame.makePublisher(a);

~function (a) {
    a.load = [];
    var d = null;
    a.load.add = function (e) {
        a.load.push(e);
    };
    a.load.start = function () {
        var e = a.load, f = 0, g = e.length;
        d = $("<div></div>");
        d.css({
            position: "absolute",
            top: 1,
            left: 1,
            "z-index": -1,
            opacity: 0,
            overflow: "hidden",
            height: 1,
            width: 1
        });
        $("body").append(d);
        a.fire("loadProgress", 0);
        for (var h = 0, max = e.length; h < max; h++) {
            var i = $("<img />");
            i.one("load error", function () {
                f++;
                a.fire("loadProgress", f / g);
            });
            d.append(i);
            var j = e[h];
            i.attr({
                "data-id": j.id || j.src,
                src: j.src
            });
        }
    };
    a.load.get = function (e) {
        return d.find("[data-id='" + e + "']");
    };
    a.on("loadProgress", function (e, f) {
        btGame.gameLoading(f);
    });
}(a);

~function (a) {
    a.gameMap = {
        "1": ["闪电鹿", "霹雳鼠", "小猩猩", "豆豆", "大板兔", "路人甲", "造型鸟", "发明猴", "垃圾怪", "熊孩子"],
        "2": ["胡飞", "红莉", "白大大", "阿香", "赵巨富", "华姐", "小薪", "孟波", "小喇叭", "小肥"],
        "3": ["大哥", "吴尘", "小张", "牧牧", "蛛正义", "薇薇公主", "小蚂哥", "蜗捕快", "甲导师", "蚁后"],
        "4": ["蜜蜂服务生", "普通蚂蚁", "萤火虫", "龙套蟑螂", "大毛虫", "屎壳郎", "古羊族族长", "威哥", "荷花", "大力", "大猩猩", "外母鸡", "小彩虹", "大嘴", "皮皮", "尖尖", "转转", "小衣柜", "大镜", "小流星", "流星爷爷", "康康", "姑奶奶", "棒棒", "健健", "乐乐", "欢欢", "忽悠老羊", "机械羊", "焦太狼", "狼表哥", "老刀羊", "羚羊公主", "羚羊王子", "小香香", "双刀狼", "双叉狼", "蛋蛋", "外星驾驶员", "外星大王", "外星护卫", "外星经理", "白眼狼", "巫师狼", "刀疤狼", "拳击狼", "包包大人", "泰哥", "野猪老大", "河马老二", "水牛老三", "香太郎", "扁嘴伦", "乌龟邮差", "小刀羊", "小飞机", "黑大帅", "潇洒哥", "黑猪妹", "蜜蜂兵"]
    };
    a.gameList = [];
    a.maxLevel = 30;
    a.currentLevel = 0;
    a.maxGate = 3;
    a.picPath = "resource/";
    var d = a.gameMap, e = a.picPath, f = 0;
    for (var g in d) {
        f++;
        var h = d[g];
        for (var i = 0, max = h.length; i < max; i++) {
            var j = h[i], k = i + 1 + (f - 1) * 10, l = e + k + ".jpg";
            h[i] = {
                key: k,
                name: j,
                pic: l
            };
            a.gameList.push(h[i]);
        }
    }
    a.MODE = {
        PIC: "picture",
        NAM: "name"
    };
    a.playMode = a.MODE.PIC;
    a.setPlayMode = function (h) {
        if (typeof h == "number") {
            if (h == 0) {
                a.playMode = a.MODE.PIC;
            } else {
                a.playMode = a.MODE.NAM;
            }
        } else if (h == a.MODE.PIC) {
            a.playMode = a.MODE.PIC;
        } else {
            a.playMode = a.MODE.NAM;
        }
        a.fire("playModeChange", a.playMode);
    };
    for (var g = 0, max = a.gameList.length; g < max; g++) {
        var h = a.gameList[g];
        a.load.add({
            id: h.key,
            src: h.pic
        });
    }
    a.load.start();
}(a);

~function (a) {
    var d = $("#main .page"), e = "hide", f = 200;
    function g() {
        var h = Math.random() > .5 ? "100%" : "-100%", i = Math.random() > .5 ? "100%" : "-100%";
        return {
            left: h,
            top: i
        };
    }
    a.on("pageChange", function (h, i) {
        d.css(g());
        var j;
        if (typeof i === "number") {
            j = d.eq(i);
        } else {
            j = d.filter(i);
        }
        j.removeClass("animate");
        j.css(g());
        setTimeout(function () {
            j.addClass("animate");
            j.css({
                left: 0,
                top: 0
            });
        }, f);
    });
}(a);

~function (a) {
    var d = $("#start");
    d.on("click", ".guessPic, .guessNam", function (e) {
        a.setPlayMode($(this).index() - 1);
        a.fire("pageChange", 1);
        a.fire("gameStart");
    });
}(a);

~function (a) {
    var d = "", e = $(".container"), f = $("#play .time"), g = $("#play .tip");
    var h = $(".heartList"), i = $("#play .level");
    a.on("playModeChange", function (k, l) {
        d = $(l === a.MODE.PIC ? "#template_game_pic" : "#template_game_nam").html();
        d = $.trim(d);
    });
    a.on("gameStart", function (k) {
        for (var l in a.gameMap) {
            a.gameMap[l].random();
        }
        j.reset();
    });
    var j = {
        reset: function () {
            a.currentLevel = 0;
            a.maxWrongCount = 3;
            a.wrongCount = 0;
            totalTime = 0;
            this.next(false);
            var k = 3, l = this;
            var m = setInterval(function () {
                k--;
                if (k <= 0) {
                    clearInterval(m);
                    l.timer.start();
                }
                a.fire("playPrepare", k);
                beginTime = new Date();
            }, 1e3);
            a.fire("playPrepare", k);
            this.heart(3);
        },
        next: function (k) {
            var l = ++a.currentLevel;
            if (a.currentLevel > a.maxLevel) {
                a.fire("gameEnd");
                return;
            }
            var m = Math.ceil(a.currentLevel / 10), n = a.gameMap[m][l - (m - 1) * 10 - 1];
            var o = a.gameList.slice(0).remove(n.key - 1).random().slice(0, 3);
            o.push(n);
            o.random();
            a.fire("nextLevel", o, n);
            if (k) {
                this.timer.start();
            }
        },
        heart: function (k) {
            a.fire("resetHeartCount", k);
        },
        timer: {
            timer: null,
            start: function () {
                clearInterval(this.timer);
                var k = 10, l = this;
                a.fire("timeChange", k);
                this.timer = setInterval(function () {
                    k--;
                    a.fire("timeChange", k);
                    if (k <= 0) {
                        l.timeup();
                        clearInterval(l.timer);
                    }
                }, 1e3);
                a.isTimeup = false;
            },
            stop: function () {
                clearInterval(this.timer);
                this.timer = null;
            },
            timeup: function () {
                a.fire("gameEnd");
                a.isTimeup = true;
            }
        }
    };
    a.on("gameEnd", function () {
        j.timer.stop();
    });
    a.on("playPrepare", function (k) {
        f.html(10);
    });
    e.on("click", ".answer1, .answer2", function () {
        var k = $(this);
        if (a.wrongCount >= a.maxWrongCount || a.isPreparingNext || a.isTimeup) {
            return false;
        }
        var l = e.find(".gameTip");
        var m = k.data("key"), n = l.data("key");
        if (m == n) {
            k.addClass("right");
            a.isPreparingNext = true;
            j.timer.stop();
            setTimeout(function () {
                j.next(true);
                a.isPreparingNext = false;
            }, 500);
        } else {
            k.addClass("error");
            setTimeout(function () {
                k.removeClass("error");
            }, 500);
            a.wrongCount++;
            a.fire("answerWrong", a.wrongCount);
        }
    });
    a.on("nextLevel", function (k, l, m) {
        i.html(a.currentLevel);
        e.html(d.format({
            data: m,
            arr1: l[0],
            arr2: l[1],
            arr3: l[2],
            arr4: l[3]
        }));
        if (a.debug) {
            e.find("a[data-key='" + m.key + "']").css("background", "#99ccff");
        }
    });
    a.on("timeChange", function (k, l) {
        f.html(l);
    });
    a.on("playModeChange", function (k, l) {
        if (l == a.MODE.PIC) {
            g.html("根据提示的名字，找出角色的照片");
        } else {
            g.html("根据提示的照片，找出角色的名字");
        }
    });
    a.on("answerWrong", function (k, l) {
        a.fire("resetHeartCount", a.maxWrongCount - l);
        if (l >= a.maxWrongCount) {
            setTimeout(function () {
                a.fire("gameEnd");
            }, 500);
        }
    });
    a.on("resetHeartCount", function (k, l) {
        var m = "";
        for (var n = 0; n < l; n++) {
            m += '<em class="heart"></em>';
        }
        h.html(m);
    });
    if (a.debug) {
        window.b = j;
        a.on("nextLevel", function (k, l, m) {
            console.log(l);
        });
    }
}(a);

~function (a) {
    var d = $("#prepare"), e = d.find(".text");
    a.on("playPrepare", function (f, g) {
        if (g <= 0) {
            d.css("top", "-100%");
            setTimeout(function () {
                d.css("top", 0);
                d.hide();
            }, 500);
        } else {
            d.show();
            e.html(g);
        }
    });
    d.hide();
}(a);

~function (a) {
    var d = $("#end"), e = d.find(".level"), f = d.find(".title");
    d.on("click", ".again", function () {
        a.fire("pageChange", 0);
        return false;
    }).on("click", ".notify", function () {
        btGame.playShareTip();
        return false;
    }).on("click", ".guessP", function () {
        guess.openP();
        return false;
    });
    var g = [{
        key: 0,
        title: "小透明"
    }, {
        key: 5,
        title: "初级辨图员"
    }, {
        key: 10,
        title: "中级辨图员"
    }, {
        key: 15,
        title: "高级辨图员"
    }, {
        key: 20,
        title: "辨图小能手"
    }, {
        key: 25,
        title: "专业辨图员"
    }, {
        key: 29,
        title: "辨图大师"
    }, {
        key: 30,
        title: "辨图达人"
    }];
    function h(i) {
        var j = g[0].title;
        for (var k = 0, max = g.length; k < max; k++) {
            var l = g[k];
            j = l.title;
            if (i <= l.key) {
                break;
            }
        }
        endTime = new Date();
        totalTime = parseInt((endTime.getTime() - beginTime.getTime()) / 1000);//毫秒
        $(".count").empty().text('你用了' + totalTime + '秒,认出了' + i + '个角色');
        if (i >= guess.score) {
            if (i > guess.score) { //刷新纪录
                guess.score = i;
                guess.addScore(i, totalTime);
            }
            else if (totalTime < guess.time) {  //刷新时间
                guess.time = totalTime;
                guess.addScore(i, totalTime);
            }
        }
        return j;
    }
    window.c = h;
    a.on("gameEnd", function () {
        a.fire("pageChange", 2);
        var i = h(a.currentLevel - 1);
        f.html(i);
        e.html("LV" + (a.currentLevel - 1));
        var j = {
            level: a.currentLevel - 1,
            title: i
        };
        a.fire("gameResult", j);
    });
}(a);


~function (a, btGame) {
    var d = $("body,html"), e = $("#main");
    function f() {
        var g = a.width, h = window.innerWidth;
        var i = h / g;
        if (i > 1) i = 1;
        var j = "scale(" + i + ")";
        e.css({
            "-webkit-transform": j,
            "-moz-transform": j,
            "-o-transform": j,
            transform: j,
            top: -a.height * (1 - i) / 2,
            left: -g * (1 - i) / 2
        });
        if (i < 1) {
            d.css("height", a.height * i);
        } else {
            d.css("height", "auto");
        }
    }
}(a, btGame);
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var award = {
    check: function (user) {
        $("#award_tips").empty();
        var name = $("#award_name").val();
        var tel = $("#award_tel").val();
        var address = $("#award_address").val();
        var result = "";
        if (name == "") {
            result = "请输入收件人姓名!";
        }
        else if (tel.length != 11) {
            result = "请输入11位收件人手机号码!";
        }
        else if (address == "" || address.length < 8) {
            result = "请输入详细的收件人地址!";
        }
        if (result == "") { //都正确
            var info = '{"name":"' + name + '","tel":"' + tel + '","address":"' + address + '"}';
            award.post(info);
        }
        else {
            $("#award_tips").text(result);
            return false;
        }
    },
    post: function (info) {
        // $.ajax({
        //     cache: false,
        //     async: false,
        //     type: "POST",
        //     url: '/act/h5/deep/doDeepScore.ashx',
        //     data: {
        //         "act_id": act_id,
        //         "init": "0",
        //         "type": "award",
        //         "user": guess.user,
        //         "info": info
        //     },
        //     success: function (response) {
        //         var result = JSON.parse(response);
        //         if (result.success) {
        //             alert(result.returnStr);
        //         }
        //         else {
        //             alert(result.returnStr);
        //         }
        //     }
        // });
        alert('信息提交成功!奖品于14个工作日内发出。');
    },
    open: function () {
        $("#award").show();
    },
    close: function () {
        $("#award").hide();
    }
};
