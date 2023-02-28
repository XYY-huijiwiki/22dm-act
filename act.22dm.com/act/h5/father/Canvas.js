var GamePlayScene = cc.Layer.extend({
  ctor : function () {
      this._super();
      this.loadFFF();
      this.loadUser2();
      this.loadUser1();
      this.loadBackgound();
      this.loadTheme();
      this.loadQRCode();
      v_main.toDataUrl();
  },
  loadFFF : function(){
    let drawNode = new cc.DrawNode();
    let postion1 = cc.p(0,0);
    let postion2 = cc.p(canvasWidth,canvasHeight);
    drawNode.drawRect(postion1,postion2,cc.color(255,255,255,255));
    this.addChild(drawNode,0);
  },
  clipper : function(s_GameTitle){ 
    let stencil = new cc.DrawNode();
    let postion1 = cc.p(0,0);
    let postion2 = cc.p(faceWidth,faceHeight);
    stencil.drawRect(postion1,postion2,cc.color(255,255,255,0));
    let clipnode = new cc.ClippingNode();
    clipnode.attr({
      stencil: stencil
    });
    return clipnode;
  },
  loadUser1 : function(){
    let posX = [209.5,228.5,212];
    let posY = [482,477,510];
    let imdData = v_main.sharedata.imdData.imgId_1;
    var user_1 = new cc.Sprite(winSize.res.user_1);
    user_1.attr({
      anchorX : 0.5,
      anchorX : 0.5,
      x :  faceWidth/2+imdData.deltaX,
      y :  faceHeight/2-imdData.deltaY,
      scale : imdData.scale,
      rotation : imdData.rotate
    });
    let clipper = this.clipper();
    clipper.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : posX[v_main.theme*1-1] - faceWidth/2,
      y : canvasHeight - posY[v_main.theme*1-1] - faceHeight/2
    })
    clipper.addChild(user_1);
    this.addChild(clipper,2);
  },
  loadUser2 : function(){
    let posX = [411,430,413];
    let posY = [440,519,460];
    let imdData = v_main.sharedata.imdData.imgId_2;
    var user_2 = new cc.Sprite(winSize.res.user_2);
    user_2.attr({
      anchorX : 0.5,
      anchorX : 0.5,
      x :  faceWidth/2+imdData.deltaX,
      y :  faceHeight/2-imdData.deltaY,
      scale : imdData.scale,
      rotation : imdData.rotate
    });
    let clipper = this.clipper();
    clipper.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : posX[v_main.theme*1-1] - faceWidth/2,
      y : canvasHeight - posY[v_main.theme*1-1] - faceHeight/2
    })
    clipper.addChild(user_2);
    this.addChild(clipper,1);
  },
  loadBackgound : function(){
    var node = new cc.Sprite(winSize.res.background);
    node.attr({
      anchorX : 0,
      anchorY : 0,
      x : 0,
      y : 0
    });
    this.addChild(node,10);
  },
  loadTheme : function(){
    var theme = new cc.Sprite(winSize.res.theme);
    theme.attr({
      anchorX : 0.5,
      anchorY : 1,
      x : canvasWidth/2,
      y : canvasHeight-315
    });
    this.addChild(theme,5);
    this.loadWord(theme);
    this.loadFoot(theme);
  },
  loadWord : function(theme){
    var node = new cc.Sprite(winSize.res.word);
    node.attr({
      x : canvasWidth / 2,
      y : theme.y-theme.height-70
    });
    this.addChild(node,200);
  },
  loadFoot : function(theme){
    var node = new cc.Sprite(winSize.res.foot);
    var number = new cc.Sprite();
    node.attr({
      anchorX : 1,
      anchorY : 0.5,
      x : canvasWidth - 18,
      y : theme.y-theme.height-5
    });
    number.attr({
      x : node.width/2 - 13.3*winSize.res.number.length,
      y : 54,
      rotation : 15.3
    });
    let num = [];
    winSize.res.number.forEach(item => {
      num.push(new cc.Sprite(item));
    })
    num.forEach((item,index) => {
      item.attr({
        x : index*25,
        y : 0
      });
      number.addChild(item);
    })
    node.addChild(number);
    this.addChild(node,100);
  },
  loadQRCode : function(){
    var texture2d = new cc.Texture2D(); 
    texture2d.initWithElement(document.getElementsByTagName("canvas")[1]); 
    texture2d.handleLoadedTexture(); 
    var node = new cc.Sprite(texture2d);
    node.attr({
      anchorX : 0,
      anchorY : 0,
      x : 8,
      y : 8
    });
    this.ercode = node;
    this.addChild(node,500);
  }
});