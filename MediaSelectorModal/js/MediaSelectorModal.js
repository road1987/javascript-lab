/**
 * [_getMediaCateListServ]-->TESTDATA--> {"success":true,"data":[{"_id":"","name":"uncategorized","mediasCount":11},{"_id":"57178c78d3892558e4593be6","name":"三七","mediasCount":15},{"_id":"57470308ca29ef54303526db","name":"活动2015","mediasCount":11}]}
 * [_getMediaListServ]    -->TESTDATA--> {"success":true,"data":[{"_id":"577d0e905d7610c81df813c7","name":"Hydrangeas.jpg","url":"uploads/medias/2016/07/73373d03f050e3032a547aa20cb02abb.jpg","size":"159kb","category":"","__v":0},{"_id":"577d0e915d7610c81df813c8","name":"Jellyfish.jpg","url":"uploads/medias/2016/07/7dcac76a24e340039acd1ee2fe295d94.jpg","size":"132kb","category":"","__v":0},{"_id":"577d23a65d7610c81df813de","name":"Chrysanthemum.jpg","url":"uploads/medias/2016/07/ef6ab92eaba2ae9e52de05d927210444.jpg","size":"214kb","category":"","__v":0},{"_id":"577d23ce5d7610c81df813df","name":"Hydrangeas.jpg","url":"uploads/medias/2016/07/bf434915b6d744655eb13a0bd9a9a547.jpg","size":"159kb","category":"","__v":0},{"_id":"577d23ce5d7610c81df813e0","name":"Jellyfish.jpg","url":"uploads/medias/2016/07/29b3918a95056cf96ca32fd39be5ba16.jpg","size":"132kb","category":"","__v":0},{"_id":"577d23d85d7610c81df813e1","name":"Lighthouse.jpg","url":"uploads/medias/2016/07/c72a20daa64be4b6e9ea77b537401f4a.jpg","size":"165kb","category":"","__v":0},{"_id":"577bd43f0fed768442d08407","name":"Desert.jpg","url":"uploads/medias/2016/07/a1e4d0c84e69a7be25d9161fd5fccdc1.jpg","size":"227kb","category":"","__v":0},{"_id":"577bd43f0fed768442d08408","name":"Jellyfish.jpg","url":"uploads/medias/2016/07/44480115cdcf4e71561a088d6007851f.jpg","size":"132kb","category":"","__v":0},{"_id":"577bd43f0fed768442d08409","name":"Hydrangeas.jpg","url":"uploads/medias/2016/07/58ebd4af65a259a9df149a58b32f7249.jpg","size":"159kb","category":"","__v":0},{"_id":"577d23e65d7610c81df813e2","name":"Tulips.jpg","url":"uploads/medias/2016/07/7c5dbd6a9d8d8e14739e5ddace86aa50.jpg","size":"157kb","category":"","__v":0},{"_id":"577e80560547fd302ebf1a3c","name":"Tulips.jpg","url":"uploads/medias/2016/07/12b21a49a18c74b320ff92064efe6106.jpg","size":"157kb","category":"","__v":0}]}
 * 
 */

function MediaSelector(options){
      var options = options || {};

      this._options = {};
      this._options.multiple = options.multiple || false;
      this._options.categoryServUrl = options.categoryServUrl;
      this._options.mediaServUrl    = options.mediaServUrl;
      //event
      this._options.onFinish = options.onFinish || function(){};
      this._options.onCancel = options.onCancel || function(){};
      this._options.onOpen = options.onOpen || function(){};
      this._options.onClose = options.onClose || function(){};

      this._currentCategory = null;
      this._currentPage     = 1;
      this._selectedList    = [];
      this._ui = this._createUI();
      this._uploader = this._createUploader();
      this.init();
  }

  MediaSelector.prototype = {
    init : function(){
      this._bindEvent();
      $(document.body).append(this._ui.mediaSelectorEle);
      $(document.body).append(this._ui.mediaSelectorMaskEle);
    },

    close : function(){
      $(this._ui.mediaSelectorEle).hide();
      $(this._ui.mediaSelectorMaskEle).hide();
    },

    open : function(){
      $(this._ui.mediaSelectorEle).show();
      $(this._ui.mediaSelectorMaskEle).show();
      this.initialData();
      //for fix uploader button can't calculate the position
      $(window).resize()
    },

    gotoPage : function(pageNum){
      var me = this;
      var categoryId = this._currentCategory && this._currentCategory._id || '';
      this._currentPage = pageNum;
      this._getMediaListServ( {page : this._currentPage  , categoryId : categoryId } , function(resp){
          me._loadMediaList(resp.data);
      },function(resp){
          alert("获取媒体列表失败，请重试！");
      });
    },

    setCategory : function(category){
      this._currentCategory = category;
      this.gotoPage(1);
    },

    initialData : function(){
      //initial category/group data
      var me = this;
      this._currentCategory = null;
      this._currentPage = 1;
      this._selectedList = [];
      this._refresh();
    },

    _refresh : function(){
      var me = this;
      var page = this._currentPage;
      var categoryId = this._currentCategory && this._currentCategory._id || '';

      this._getMediaCateListServ(function(resp){

        if(me._currentCategory){
          for(var i = 0 , iLen = resp.data.length;  i < iLen ; i++){
            if(resp.data[i]._id == me._currentCategory._id){
              resp.data[i].selected = true;
              break;
            }
          }
        }else{
          if(resp.data[0]){
            resp.data[0].selected = true;
          }
        }
        me._loadCategoryList(resp.data);
      });

      this._getMediaListServ( {page : page , categoryId : categoryId } , function(resp){
          me._loadMediaList(resp.data);
      },function(resp){
          alert("获取媒体列表失败，请重试！");
      });

    },


    _loadMediaList : function(data){
        var mediaListHTML = [];
        $mediaList = $(this._ui.mediaSelectorEle).find(".media-list");

        for(var i = 0 , iLen = data.length ; i < iLen ; i++){
          var item = data[i];
          var mediaInfoAttr =  ' data-id="' + item._id + '"';
              mediaInfoAttr += ' data-url="' + item.url + '"';
              mediaInfoAttr += ' data-name="' + item.name + '"';
          mediaListHTML.push('<div class="media-item" ' + mediaInfoAttr + '>');
          mediaListHTML.push('  <label>');
          mediaListHTML.push('    <div class="media-item-imgbox">');
          mediaListHTML.push('      <img src="' +item.url+ '"/>');
          mediaListHTML.push('    </div>');
          mediaListHTML.push('    <div class="media-item-name">');
          mediaListHTML.push('  '    + item.name ); 
          mediaListHTML.push('    </div>');  
          mediaListHTML.push('    <div class="media-select-mask">'); 
          mediaListHTML.push('      <div class="media-select-mask-inner"></div>'); 
          mediaListHTML.push('      <div class="media-select-mask-icon"></div>'); 
          mediaListHTML.push('    </div>');         
          mediaListHTML.push('  </label>');
          mediaListHTML.push('</div>');
        }
        $mediaList.html(mediaListHTML.join(''));
    },
    /**
     * /
     * @param  {Object} data [{_id:'',name:'',count:''}]
     * @return {null} 
     */
    _loadCategoryList : function(data){
      var $mediaCategoryBox = $(this._ui.mediaSelectorEle).find(".js_media_category");
      var contentHTML = ["<ul>"];
      for(var i = 0 , iLen = data.length ; i < iLen ; i ++){
        var item = data[i];
        var itemCss = item.selected ? "category-item category-item-selected" : "category-item";
        contentHTML.push('<li class="' + itemCss + '" data-id="' + item._id +'">');
        contentHTML.push('  <a href="javascript:void(0)">');
        contentHTML.push('    ' + item.name + '('+ item.mediasCount +')');
        contentHTML.push('  </a>');
        contentHTML.push('</li>');
      }
      contentHTML.push('</ul>');
      $mediaCategoryBox.html(contentHTML.join(''));
    },

    _bindEvent : function(){
      
      this._bindEventMediaList();
      this._bindEventCateList();
      this._bindEventUploader();
      this._bindEventWindow();

    },

    _bindEventMediaList : function(){
      var me = this;
      $(this._ui.mediaSelectorEle).find(".media-list").delegate(".media-item" ,"click", function(){
           var isSelected = $(this).hasClass("media-item-selected");
           if(isSelected){
              var currentItemId = $(this).data('id'); 
              $(this).removeClass("media-item-selected");
              for( var i = 0 , iLen = me._selectedList.length ; i < iLen ; i++){
                var item = me._selectedList[i];
                if( currentItemId === item._id){
                   me._selectedList.splice(i , 1);
                   break;
                }
              }
           }else{
              if(me._options.multiple){
                $(this).addClass("media-item-selected");
                me._selectedList.push({
                   _id  : $(this).attr('data-id'),
                   url  : $(this).attr('data-url'),
                   name : $(this).attr('data-name')                      
                });
              }else{
                $(me._ui.mediaSelectorEle).find(".media-item-selected").removeClass("media-item-selected");
                $(this).addClass("media-item-selected"); 
                me._selectedList[0] = {
                   _id  : $(this).attr('data-id'),
                   url  : $(this).attr('data-url'),
                   name : $(this).attr('data-name')
                };
              }
           }
      });
    },

    _bindEventCateList : function(){
      var me = this;
      $(this._ui.mediaSelectorEle).find(".js_media_category").delegate(".category-item" , "click" , function(){
          var selectedItemId = $(this).attr('data-id');
          $(".category-item-selected").removeClass("category-item-selected");
          $(this).addClass("category-item-selected");
          me.setCategory({ "_id" : selectedItemId});
      });
    },

    _bindEventUploader : function(){
      var me = this;
      var uploadSuccessedCount = 0;
      var uploadFailedCount = 0;

      $(this._ui.mediaSelectorEle).find(".btn-uploader").bind('click', function(){
          var cateId = me._currentCategory && me._currentCategory._id;
          me._uploader.options.server = me._uploader.options.serverTpl.replace(/{{cateid}}/ig, cateId);
      });

      this._uploader.on('uploadFinished' , function(){
          alert("Success : " + uploadSuccessedCount + ",failed：" + uploadFailedCount);
          uploadSuccessedCount = 0;
          uploadFailedCount = 0 ;
          me._refresh();
      });

      this._uploader.on( 'uploadSuccess', function( file ) {
            uploadSuccessedCount ++;
      });
      // 文件上传失败，显示上传出错。
      this._uploader.on( 'uploadError', function( file ) {
            uploadFailedCount ++ ;
      });
    },

    _bindEventWindow : function(){
      var me = this;
      $(this._ui.mediaSelectorEle).find(".media-dialog-icon-close").bind("click" , function(e){
          me.close();
      });

      $(this._ui.mediaSelectorEle).find(".js_btn_submit").bind("click" , function(e){
          if(me._options.multiple){
            me._options.onFinish( me._selectedList );
          }else{
            me._options.onFinish( me._selectedList[0] );
          }
          me.close();
      });

      $(this._ui.mediaSelectorEle).find(".js_btn_cancel").bind("click" , function(e){
          me.close();
      });
    },

    _getMediaCateListServ : function(success , failed){
        //用于测试环境中
        var testData = {"success":true,"data":[{"_id":"","name":"uncategorized","mediasCount":11},{"_id":"57178c78d3892558e4593be6","name":"三七","mediasCount":15},{"_id":"57470308ca29ef54303526db","name":"活动2015","mediasCount":11}]};
        success(testData);

        if(!this._options.categoryServUrl){
          throw new Error("categoryServUrl is undefined!");
        }
        var reqUrl = this._options.categoryServUrl;
        $.ajax({
             url: reqUrl,
             type: "GET",
             dataType: "json",
             cache : false,
             success: function( resp ) {
                if(resp.success){
                  success(resp);
                }else{
                  failed(resp);
                }
             },
             error : function(resp){
                alert("Request Error");
             }
        });
    },

    _getMediaListServ : function(config,success,failed){
       //用于测试环境中
        var testData = {"success":true,"data":[{"_id":"577d0e905d7610c81df813c7","name":"Hydrangeas.jpg","url":"uploads/medias/2016/07/73373d03f050e3032a547aa20cb02abb.jpg","size":"159kb","category":"","__v":0},{"_id":"577d0e915d7610c81df813c8","name":"Jellyfish.jpg","url":"uploads/medias/2016/07/7dcac76a24e340039acd1ee2fe295d94.jpg","size":"132kb","category":"","__v":0},{"_id":"577d23a65d7610c81df813de","name":"Chrysanthemum.jpg","url":"uploads/medias/2016/07/ef6ab92eaba2ae9e52de05d927210444.jpg","size":"214kb","category":"","__v":0},{"_id":"577d23ce5d7610c81df813df","name":"Hydrangeas.jpg","url":"uploads/medias/2016/07/bf434915b6d744655eb13a0bd9a9a547.jpg","size":"159kb","category":"","__v":0},{"_id":"577d23ce5d7610c81df813e0","name":"Jellyfish.jpg","url":"uploads/medias/2016/07/29b3918a95056cf96ca32fd39be5ba16.jpg","size":"132kb","category":"","__v":0},{"_id":"577d23d85d7610c81df813e1","name":"Lighthouse.jpg","url":"uploads/medias/2016/07/c72a20daa64be4b6e9ea77b537401f4a.jpg","size":"165kb","category":"","__v":0},{"_id":"577bd43f0fed768442d08407","name":"Desert.jpg","url":"uploads/medias/2016/07/a1e4d0c84e69a7be25d9161fd5fccdc1.jpg","size":"227kb","category":"","__v":0},{"_id":"577bd43f0fed768442d08408","name":"Jellyfish.jpg","url":"uploads/medias/2016/07/44480115cdcf4e71561a088d6007851f.jpg","size":"132kb","category":"","__v":0},{"_id":"577bd43f0fed768442d08409","name":"Hydrangeas.jpg","url":"uploads/medias/2016/07/58ebd4af65a259a9df149a58b32f7249.jpg","size":"159kb","category":"","__v":0},{"_id":"577d23e65d7610c81df813e2","name":"Tulips.jpg","url":"uploads/medias/2016/07/7c5dbd6a9d8d8e14739e5ddace86aa50.jpg","size":"157kb","category":"","__v":0},{"_id":"577e80560547fd302ebf1a3c","name":"Tulips.jpg","url":"uploads/medias/2016/07/12b21a49a18c74b320ff92064efe6106.jpg","size":"157kb","category":"","__v":0}]};
        success(testData);
        config.page = config.page || 1;
        config.categoryId = config.categoryId || '';
        if(!this._options.mediaServUrl){
          throw new Error("mediaServUrl is undefined!");
        }
        var reqUrl = this._options.mediaServUrl.replace(/{page}/gi, config.page).replace(/{categoryId}/gi, config.categoryId);
          $.ajax({
             url: reqUrl,
             type: "GET",
             dataType: "json",
             cache : false,
             success: function( resp ) {
                if(resp.success){
                  success(resp);
                }else{
                  failed(resp);
                }
             },
             error : function(resp){
                alert("Request Error");
             }
         });
    },

    _createUI : function(){
      var mediaSelectorEle = document.createElement('div');
      var mediaSelectorMaskEle = document.createElement('div');
      $(mediaSelectorEle).addClass("media-dialog media-dialog-default");
      $(mediaSelectorMaskEle).addClass("media-dialog-mask");
      var contentHTML = [];
      contentHTML.push('<div class="media-dialog-heading">');
      contentHTML.push('  <div class="media-dialog-title">');
      contentHTML.push('    媒体选择');
      contentHTML.push('  </div>');
      contentHTML.push('  <div class="media-dialog-icon-close">');
      contentHTML.push('    ×');
      contentHTML.push('  </div>');
      contentHTML.push('</div>');

      contentHTML.push('<div class="media-dialog-body">');
      contentHTML.push('  <div class="js_media_category media-category">');
      contentHTML.push('  </div>');
      contentHTML.push('  <div class="media-list-box">');
      contentHTML.push('    <div class="media-list-toolbar">');
      contentHTML.push('      <div class="btn-uploader">本地上传</div>');
      contentHTML.push('    </div>');
      contentHTML.push('    <div class="media-list media-list">');
      contentHTML.push('    </div>');
      contentHTML.push('    <div class="media-list-pagebar">');
      contentHTML.push('      <a class="btn btn-default btn-sm page-prev">');
      contentHTML.push('        <i class="arrow"></i>');
      contentHTML.push('      </a>');
      contentHTML.push('      <span class="js_current_page_num">1</span>&nbsp;&nbsp;/&nbsp;&nbsp;');
      contentHTML.push('      <span class="js_total_page_num">20</span>');
      contentHTML.push('      <a class="btn btn-default btn-sm page-next">');
      contentHTML.push('        <i class="arrow"></i>');
      contentHTML.push('      </a>');  
      contentHTML.push('      <input type="text" size="4" style="text-align:center;"/>');
      contentHTML.push('      <a class="btn btn-default btn-sm">跳转</a>');
      contentHTML.push('    </div>');
      contentHTML.push('  </div>');
      contentHTML.push('</div>');

      contentHTML.push('<div class="media-dialog-footer">');
      contentHTML.push(' <div class="media-select-notice">');
      contentHTML.push('  已选0个，可选1个');
      contentHTML.push(' </div>');
      contentHTML.push(' <div class="media-footer-toolbar">');
      contentHTML.push('    <button class="js_btn_submit btn btn-primary">确定</button>');
      contentHTML.push('    <button class="js_btn_cancel btn btn-default">取消</button>');
      contentHTML.push(' </div>');
      contentHTML.push('</div>');
      $(mediaSelectorEle).html(contentHTML.join(''));
      return { 
        mediaSelectorEle : mediaSelectorEle , 
        mediaSelectorMaskEle : mediaSelectorMaskEle
      };
    },

    _createUploader : function(){
        return WebUploader.create({
        auto: true,
        swf: '/libs/fex-webuploader/dist/Uploader.swf',
        serverTpl : '/admin/medias/uploads?cateid={{cateid}}',
        server: '/admin/medias/uploads',
        pick: $(this._ui.mediaSelectorEle).find(".btn-uploader"),
        resize: false
      });
    }
  }