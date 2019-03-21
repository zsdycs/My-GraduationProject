$(document).ready(function () {
  // fix menu when passed
  $('.masthead').visibility({
    once: false,
    onBottomPassed: function () {
      $('.fixed.menu').transition('fade in');
    },
    onBottomPassedReverse: function () {
      $('.fixed.menu').transition('fade out');
    }
  });
  // create sidebar and attach to menu open
  $('.ui.sidebar').sidebar('attach events', '.toc.item')
  // $("#segment").animate({"opacity":"0.8"},15000); 
  //x上限，y下限     
  var x = 16;     
  var y = 1;     
  var rand = parseInt(Math.random() * (x - y + 1) + y);
  $("#segment").addClass("bg"+rand)
});

$(function(){
  FiltrateAndAudioByCookie()
  getFiltrateByCookieForRtopList()
  //筛选列表折叠事件
  $(document).on("click",".filtrate-button",function(){
    if($(this).attr("aria-label")=="collapse"){
      $(this).removeClass("open-filtrate")
      $(this).attr("aria-label","spread")
      $(this).next().css("display","none")
    }else{
      $(this).addClass("open-filtrate")
      $(this).attr("aria-label","collapse")
      $(this).next().css("display","block")
    }
  })

  // 排序选项列表
  $('.ui.dropdown').dropdown();
  $(document).on("click",".rank-a",function(){
    // console.log($(this).text()) 
    // ajax排序请求局部刷新audioList
    
    // 修改列表标题
    $('.dropdown-title').html($(this).text())
  })
})

// 分页
// 请求获得最大分页
var maxpage=11,nowpage=1
isInsufficientPage()
$(document).on("click",".paging",function(){
  $(".paging").removeClass("active")
  $(this).addClass("active")
  nowpage = parseInt($(this).text())
})
// 分页→右
$(document).on("click",".toendpage",function(){
  if(parseInt($(".pageend").text()) < maxpage){
    for(i=0; i<$(".paging").length; i++){
      $(".paging").eq(i).text(parseInt($(".paging").eq(i).text()) +4)
      if(parseInt($(".paging").eq(i).text()) == nowpage){
        $(".paging").eq(i).addClass("active")
      }else{
        $(".paging").eq(i).removeClass("active")
      }
      if(parseInt($(".paging").eq(i).text()) > maxpage){
        $(".paging").eq(i).css("display","none")
      }
    }
  }
})
// 分页←左
$(document).on("click",".tofistpage",function(){
  if(parseInt($(".pagefist").text()) > 1){
    $(".paging").css("display","block")
    for(i=0; i<$(".paging").length; i++){
      $(".paging").eq(i).text(parseInt($(".paging").eq(i).text()) -4)
      if(parseInt($(".paging").eq(i).text()) == nowpage){
        $(".paging").eq(i).addClass("active")
      }else{
        $(".paging").eq(i).removeClass("active")
      }
    }
  }
})
// 页码超出隐藏
function isInsufficientPage(){
  for(i=0; i<$(".paging").length; i++){
    if(parseInt($(".paging").eq(i).text()) > maxpage){
      $(".paging").eq(i).css("display","none")
    }
  }
}

// 渲染右边标签项，从cookie获取数据
function getFiltrateByCookieForRtopList(){
  //已选标签列表
  var labeltagList = new Vue({
    el: '#labeltagList',
    data: {
      labeltagList: [],
    },
    created() {
      ////////////测试用数据//////////////
      data=[
        // {
        //   tag_name:'电子',
        // },
      ]
      //////////测试用数据结束////////////
        // }
    var self=this;
    filtrateList=JSON.parse(getCookie("filtrateTagList"))
    // 标签
    for(var i = 0;i<filtrateList[0].tag.length;i++){
      var tag_name=filtrateList[0].tag[i]
      var tag_one = {tag_name:tag_name}
      data.push(tag_one)
    }
    // 价格
    // 通过cookie获得最大价格
    maxandnumlist=JSON.parse(getCookie("maxAndNum"))
    var max_price = maxandnumlist[0].max_price
    if(!(filtrateList[0].price[0]==1 && filtrateList[0].price[1]==max_price)){
      var tag_name="￥"+filtrateList[0].price[0]+" - ￥"+filtrateList[0].price[1]
      var tag_one = {tag_name:tag_name}
      data.push(tag_one)
    }
    // 时间
    if(filtrateList[0].time != 1){
      if(filtrateList[0].time == 2){
        set_time("最近1周")
      }else if(filtrateList[0].time == 3){
        set_time("最近1月")
      }else if(filtrateList[0].time == 4){
        set_time("最近3月")
      }else{
        set_time("最近1年")
      }
      function set_time(t){
        var tag_one = {tag_name:t}
        data.push(tag_one)
      }
    }
    
    self.labeltagList = data
    // console.log("1---"+data)
    data=JSON.stringify(data)
    // console.log("2---"+data)
    },
    watch:{    
      labeltagList:function(){  
        this.$nextTick(function (){
          labeltagListisloading()
          // console.log('v-for渲染已经完成')
        }
      
      )}
    }
  });
}
function labeltagListisloading(){
  $(".labeltag").removeClass("loader")
}
// 删除所选标签
$(document).on("click",".labeltag",function(){
  // 修改cookie
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24); //24小时
  filtrateList=JSON.parse(getCookie("filtrateTagList"))
  for(var i=0;i<filtrateList[0].tag.length;i++){
    if(filtrateList[0].tag[i] == $(this).text()){
      filtrateList[0].tag.splice(i,1)
      break;
    }
  }
  if($(this).text().indexOf("￥") >= 0 ){
    // cookie获得最大值
    maxandnumlist=JSON.parse(getCookie("maxAndNum"))
    var max_price = maxandnumlist[0].max_price
    filtrateList[0].price[0] = 1
    filtrateList[0].price[1] = max_price
  }
  if($(this).text() == "最近1周" || $(this).text() == "最近1月" || $(this).text() == "最近3月" || $(this).text() == "最近1年"){
    filtrateList[0].time = 1
  }
  document.cookie = "filtrateTagList=" + JSON.stringify(filtrateList) + ";expires=" + exp.toGMTString()+ ";path=/";
  $(this).remove()
  // 刷新页面刷新
  window.location.reload()

})

// 初始化筛选项变量。标签，价格，时间
// 标签
var tag = new Array()
// 价格，最大金额通过cookie获得，测试使用固定值
var price = new Array()
price[0] = 1,price[1] = 9999
// 时间,状态值=1:所有，2：最近一周，3：最近一个月，4：最近3个月，5：最近1年。
var time = 1
var filtrate = { tag:tag,price:price,time:time },filtrateList = [];
filtrateList.push(filtrate);
// 如果筛选项cookie不存在，写入空筛选项cookie
if(getCookie("filtrateTagList")==""){
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24); //24小时
  document.cookie = "filtrateTagList=" + JSON.stringify(filtrateList) + ";expires=" + exp.toGMTString()+ ";path=/";
}
// 根据cookie筛选项显示页面筛选项状态，数据绑定
function FiltrateAndAudioByCookie(){
  filtrateList=JSON.parse(getCookie("filtrateTagList"))
  maxandnumlist=JSON.parse(getCookie("maxAndNum"))
  // 关联数量
  $(".audio_num").text(maxandnumlist[0].voice_num)
  // 关联标签
  $(".input-check-tag").each(function(){
    filtrateList=JSON.parse(getCookie("filtrateTagList"))
      for(var i=0;i<filtrateList[0].tag.length;i++){
        if(filtrateList[0].tag[i] == $(this).next().text()){
          $(this).prop("checked",true)
        }
      }
  })
  // 关联价格状态
  var price_max =maxandnumlist[0].max_price
  if(price_max == filtrateList[0].price[1]){
    $(".price-r-input").attr("placeholder",price_max)
  }else{
    $(".price-r-input").attr("value",filtrateList[0].price[1])
  }
  if(filtrateList[0].price[0] == 1){
    $(".price-l-input").attr("placeholder",1)
  }else{
    $(".price-l-input").attr("value",filtrateList[0].price[0])
  }
  // 关联时间状态
  $(".label_time[data-time="+filtrateList[0].time+"]").prev().attr("checked",true)

}
// 标签-------------------
// 左边tag选择->写入cookie->上传后右边的音频列表内容刷新->左边选择列表上传给后端，返回新了可选项列表
$(document).on("click",".input-check-tag",function(){
  // 被选中
  if($(this).prop("checked")){
    // 写入cookie
    var exp = new Date();
    exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24); //24小时
    //流程，取出标签，判断是否为空，为空直接添加进数组，不为空通过length添加到空位
    filtrateList=JSON.parse(getCookie("filtrateTagList"))
    // console.log("filtrateList[0].tag.length:"+filtrateList[0].tag.length)
    if(filtrateList[0].tag.length==0){
      filtrateList[0].tag[0] = $(this).next().text()
      // for(var i=0;i<filtrateList[0].tag.length;i++){
      //   console.log(i+":"+filtrateList[0].tag[i])
      // }
    }else{
      filtrateList[0].tag[filtrateList[0].tag.length] = $(this).next().text()
    }
    document.cookie = "filtrateTagList=" + JSON.stringify(filtrateList) + ";expires=" + exp.toGMTString()+ ";path=/";
    // console.log("ed:"+$(this).next().text())
  }else{
    // 取消选中修改cookie
    // console.log("didn't:"+$(this).next().text())
    var exp = new Date();
    exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24); //24小时
    // 流程，取出标签，遍历找到数组所在位置，移除位置的值
    filtrateList=JSON.parse(getCookie("filtrateTagList"))
    for(var i=0; i<filtrateList[0].tag.length; i++){
      if(filtrateList[0].tag[i] == $(this).next().text()){
        filtrateList[0].tag.splice(i,1)
        break;
      }
    }
    document.cookie = "filtrateTagList=" + JSON.stringify(filtrateList) + ";expires=" + exp.toGMTString()+ ";path=/";
  }
  // 上传cookie（上传所有筛选项，返回音频列表与可筛选项，刷新列表，可复用函数）
  window.location.reload()
})
// 价格--------------------
$(document).on("click",".price_button",function(){
  // 通过cookie获得最大价格》》》
  maxandnumlist=JSON.parse(getCookie("maxAndNum"))
  var price_max =maxandnumlist[0].max_price

  if($(".price-l-input").val()!="" && $(".price-r-input").val()==""){
    console.log(1)
    todo($(".price-l-input").val(),price_max,price_max)
  }else if($(".price-l-input").val()=="" && $(".price-r-input").val()!=""){
    console.log(2)
    todo(1,$(".price-r-input").val(),price_max)

  }else if($(".price-r-input").val() == "" && $(".price-l-input").val() == ""){
    console.log(3)
    todo(1,price_max,price_max)
  }else{
    todo($(".price-l-input").val(),$(".price-r-input").val(),price_max)
  }

  function todo(l,r,max){
    var exp = new Date();
    exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24); //24小时
    // 流程，取出标签，遍历找到数组所在位置，移除位置的值
    filtrateList=JSON.parse(getCookie("filtrateTagList"))
    var price_l = l, price_r = r
    if(price_l > price_r){
      $(".price-r-input").val(max)
      price_r = $(".price-r-input").val()
    }
    // 写入cookie
    filtrateList[0].price[0] = price_l, filtrateList[0].price[1] = price_r
    document.cookie = "filtrateTagList=" + JSON.stringify(filtrateList) + ";expires=" + exp.toGMTString()+ ";path=/";
    // console.log("min:"+price_l+"  max:"+price_r)
    // 上传cookie（上传所有筛选项，返回音频列表与可筛选项，刷新列表，可复用函数）
    window.location.reload()
  }
  
})
// 时间--------------------
$(document).on("click",".label_time",function(){
  filtrateList=JSON.parse(getCookie("filtrateTagList"))
  if(filtrateList[0].time != $(this).data("time")){
    // 写入cookie
    var exp = new Date();
    exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24); //24小时
    filtrateList[0].time=$(this).data("time")
    document.cookie = "filtrateTagList=" + JSON.stringify(filtrateList) + ";expires=" + exp.toGMTString()+ ";path=/";
    // 上传cookie（上传所有筛选项，返回音频列表与可筛选项，刷新列表，可复用函数）
    window.location.reload()
  }
})


// ////数量输入规则
// 输入,最大值根据请求获得，例9904
$(document).on("keyup",".price-l-input",function(){
  // if(isNaN(this.value)||this.value==''||this.value==0){
  //   this.value=1;
  // }
  maxandnumlist=JSON.parse(getCookie("maxAndNum"))
  var max_price = maxandnumlist[0].max_price
  if(this.value>max_price){
    this.value=max_price;
  }
  if(this.value.length==1){
    this.value=this.value.replace(/[^1-9]/g,'')
    }else{
      this.value=this.value.replace(/\D/g,'')
    }
})
// 粘贴
$(document).on("blur",".price-l-input",function(){
  if(this.value.length==1){
    this.value=this.value.replace(/[^1-9]/g,'')
    }else{
      this.value=this.value.replace(/\D/g,'')
    }
})
// 右边
$(document).on("keyup",".price-r-input",function(){
  // 获取页面加载获得的cookie，得到最大价格
  maxandnumlist=JSON.parse(getCookie("maxAndNum"))
  var max_price = maxandnumlist[0].max_price
  if(this.value>max_price){
    this.value=max_price;
  }
  if(this.value.length==1){
    this.value=this.value.replace(/[^1-9]/g,'')
    }else{
      this.value=this.value.replace(/\D/g,'')
    }
})
// 粘贴
$(document).on("blur",".price-r-input",function(){
  // 获取页面加载获得的cookie，得到最大价格
  maxandnumlist=JSON.parse(getCookie("maxAndNum"))
  var max_price=maxandnumlist[0].max_price
  // if(isNaN(this.value)||this.value==''||this.value==0){
  //   this.value=max_price;
  // }
  if(this.value>max_price){
    this.value=max_price;
  }
  if(this.value.length==1){
    this.value=this.value.replace(/[^1-9]/g,'')
    }else{
      this.value=this.value.replace(/\D/g,'')
    }
})
// 购物车按钮
$(document).on("click",".add-cart-button",function(){
  $("#select-price").empty()
  $("#SelectLicenses").css("display","block")
  $("body").css({overflow:"hidden"})
  // 关联数据
  // .data("action")
  var one = $(this).data("price_one")
  var unlimited = $(this).data("price_unlimited")
  var name = $(this).data("audioname")
  var audio_id = $(this).data("audio_id")
  $("#select-price").append("<option value =\""+ one +"\">一次性 - ￥"+ one +"</option>")
  $("#select-price").append("<option value =\""+ unlimited +"\">无限制 - ￥"+ unlimited +"</option>")
  // console.log(name)
  $("#selected-audio-name").text(name)
  $(".s-button").data("audio_id",audio_id)
  $("#selected-price").text($("#select-price").val())
  if($("#select-price").val() == one){
    $("#selected-license").text("一次性")
  }else if($("#select-price").val() == unlimited){
    $("#selected-license").text("无限制")
  }
})
// 选择许可证
$(document).on("click","#select-price",function(){
  var selected = $("#select-price").find("option:selected").text()
  $("#selected-price").text($("#select-price").val())
  if(selected.indexOf("一次性") >= 0){
    $("#selected-license").text("一次性")
  }else{
    $("#selected-license").text("无限制")
  }
  // console.log($("#select-price").val())
})
// 取消加入
$(document).on("click",".c-button",function(){
  $("#select-price").empty()
  $("#SelectLicenses").css("display","none")
  $('body').css('overflow','auto');
})
// 确认加入
$(document).on("click",".s-button",function(){
  // console.log($("#select-price").val())
  $("#SelectLicenses").css("display","none")
  $("#HadSelect").css("display","block")
  // 绑定添加成功弹框数据
  $("#hadSelectName").text($("#selected-audio-name").text())
  $("#hadSelectPrice").text($("#selected-price").text())
  $("#hadSelectLicenses").text($("#selected-license").text())
  var id = $(this).data("audio_id")
  // 写入购物车cookie，名字，金额，许可证，id
  var exp = new Date();
  exp.setTime(exp.getTime() + 60 * 1000 * 60 * 24); //24小时
  var name = $("#hadSelectName").text(),price = $("#hadSelectPrice").text(), license = $("#hadSelectLicenses").text()
  var audios = {name:name,price:price,license:license,id:id}
  var audioList = []
  // 如果cooki为空，直接添加
  if(getCookie("shoppingcart").length==0){
		// 添加到audioList
		audioList.push(audios);
	}else{
    audioList=JSON.parse(getCookie("shoppingcart"))
    // 购物车有商品，判断当前加入是否包含，包含则移除，再添加
    // 先判断cookie中有无相同的id商品
    for(var i=0;i<audioList.length;i++){
      if(audioList[i].id === id){
        audioList.splice(i,1)
        audioList.push(audios);
        break;
      }
    }
    // 如果原cookie中没有当前商品
    if(i===audioList.length){
      // 添加到audioList
      audioList.push(audios);
      }
    }
    document.cookie = "shoppingcart=" + JSON.stringify(audioList) + ";expires=" + exp.toGMTString()+ ";path=/";
    var data=getCookie("shoppingcart")
    data=JSON.parse(data)
    data=JSON.stringify(data)
    // console.log(">>>>:"+data)


})
// 加入成功-马上结算->购物车页！！！不做结算页啦啦啦
$(document).on("click",".add-s-button",function(){
  window.location.href="/cart"
  $("#HadSelect").css("display","none")
  $('body').css('overflow','auto');
})
// 返回浏览
$(document).on("click",".add-c-button",function(){
  $("#HadSelect").css("display","none")
  $('body').css('overflow','auto');
})

  