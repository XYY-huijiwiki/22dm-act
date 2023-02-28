var GamePlayScene = cc.Layer.extend({
  ctor : function () {
      this._super();
      this.loadBackgound2();
      this.loadUser();
      this.loadBackgound();
      this.loadWord();
      this.loadQRCode();
      v_main.toDataUrl();
  },
  loadBackgound2 : function(){
    var node = new cc.Sprite(winSize.loadres[0]);
    node.attr({
      anchorX : 0,
      anchorY : 1,
      x : 0,
      y : 1300
    });
    this.addChild(node,1);
  },
  loadUser : function(){
    let pos = [845,885,887];
    let imdData = v_main.sharedata.imdData;
    // var mask = new cc.Sprite();
    // mask.attr({
    //   width : 550,
    //   height : 570,
    //   anchorX : 0,
    //   anchorY : 1,
    //   x : 44,
    //   y : 1300 - pos[v_main.theme-1]
    // })
    var node = new cc.Sprite(winSize.loadres[1]);
    // var texture2d = new cc.Texture2D(); 
    // texture2d.initWithElement(document.getElementById("imgId")); 
    // texture2d.handleLoadedTexture(); 
    // var node = new cc.Sprite(texture2d);
    node.attr({
      anchorX : 0.5,
      anchorX : 0.5,
      x : 320 + imdData.deltaX,
      y : pos[v_main.theme*1-1] - imdData.deltaY,
      scale : imdData.scale,
      rotation : imdData.rotate
    });
    //mask.addChild(node);
    this.addChild(node,2);
  },
  loadBackgound : function(){
    var node = new cc.Sprite(winSize.loadres[2]);
    node.attr({
      anchorX : 0,
      anchorY : 0,
      x : 0,
      y : 0
    });
    this.addChild(node,100);
  },
  loadQRCode : function(){
    var texture2d = new cc.Texture2D(); 
    texture2d.initWithElement(document.getElementsByTagName("canvas")[1]); 
    texture2d.handleLoadedTexture(); 
    var node = new cc.Sprite(texture2d);
    node.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : 60,
      y : 60,
      scale : 0.5
    });
    this.ercode = node;
    this.addChild(node,200);
  },
  loadWord : function(){
    var node = new cc.Sprite(winSize.loadres[3]);
    node.attr({
      anchorX : 0.5,
      anchorY : 0,
      x : 335,
      y : 275
    });
    var num = [];
    winSize.loadres.forEach((item,index) => {
      if(index>3){
        num.push(new cc.Sprite(item));
      }
    })
    num.forEach((item,index) => {
      item.attr({
        x : 170 + index*30,
        y : 123
      });
      node.addChild(item);
    })
    this.addChild(node,300);
  }
});