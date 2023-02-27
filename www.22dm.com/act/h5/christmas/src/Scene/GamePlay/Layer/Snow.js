var GPSnowLayer = cc.Layer.extend({
    ctor:function(){
        this._super(); 
    },
    onEnter : function () {
        this._super();  
        this.attr({
            anchorX : 0,
            anchorY : 0,
            width : winSize.TmxWidth,
            height : winSize.TmxHeight,
            x : 20,
            y : 114
        });
        this.loadParticleSnow();
    },
    loadParticleSnow : function(){
        var particle1 = new cc.ParticleSystem(res.gp_snow_plist);
        var particleBatchNode = new cc.ParticleBatchNode(particle1.texture);
        this.addChild(particleBatchNode);
        particleBatchNode.addChild(particle1);
        particle1.x = 320;
        particle1.y = 850;
    }
});