window.onload = function () {
    //缩略图点击索引
    var previwId = 0;
    conPoin();
    //路径导航渲染
    function conPoin() {
      //步骤：获取路径数据，和当前父元素， 遍历数组 判断如果index全等于数组最大索引
        //获取当前路径的数据
        var path = goodData.path;
        //获取父元素
        var conPoin = document.querySelector(".wrap .main .mainCon .conPoin");
        path.forEach(function (item,index) {
            if (index === path.length-1){
                //说明是最后一个 将item的title赋值给a 没有href
                //创建一个a
                var aNode = document.createElement("a");
                aNode.innerHTML=item.title;
                conPoin.appendChild(aNode);
            }else {
                //不是最后一个 则创建一个a 将a的title 和 url属性设置给a 并且创建反斜杠给i标签中
                var aNode = document.createElement("a");
                aNode.innerHTML = item.title;
                aNode.href = item.url;
                conPoin.appendChild(aNode);
                var iNode = document.createElement("i");
                iNode.innerHTML = "i";
                conPoin.appendChild(iNode);

            }
        })
    }
    /*放大镜功能*/
    previw();
    function previw() {
        /*步骤：
            鼠标移入创建蒙版  创建大图容器 和 大图
            鼠标移动 确定模板最终位置 模板跟随鼠标移动  边界值判断  计算移动比 给大图设疑移动位置
            鼠标移出清除移动 和 移出效果 删除模板 大盒子 清空模板 图片
        */
        var previwNode = document.querySelector(".wrap .main .mainCon .infoWrap .previwWrap .previw");
        var smallBox = document.querySelector(".wrap .main .mainCon .infoWrap .previwWrap .previw .zoomImgBox");
        var imgSrc = goodData.imagessrc;
        //获取小图容器
        var smallImg = document.querySelector('.wrap .main .mainCon .infoWrap .previwWrap .previw .zoomImgBox>img');
        smallImg.src = imgSrc[0].s
        var maskNode = null;
        var bigImg = null;
        var bigImgBox = null;

        //鼠标移入
        previwNode.onmouseenter = function () {
            //创建模板
            if (!maskNode ){
                maskNode = document.createElement("div");
                maskNode.className = 'mask';
                smallBox.appendChild(maskNode);
                //创建大图容器
                bigImgBox = document.createElement("div");
                bigImgBox.className = "bigImgBox";
                previwNode.appendChild(bigImgBox);
                bigImg= new Image();
                bigImg.src = imgSrc[previwId].b;
                bigImgBox.appendChild(bigImg);
            }
            //鼠标移动
            smallBox.onmousemove = function (event) {
                //模板最终位置 等于 鼠标坐标-模板宽度的一半 - 视口到父元素的距离
                var maskPosition = {
                    left:event.clientX - maskNode.offsetWidth / 2 - previwNode.getBoundingClientRect().left,
                    top: event.clientY - maskNode.offsetTop / 2 - previwNode.getBoundingClientRect().top
                }
                //范围限定
                if (maskPosition.left<0){
                    maskPosition.left = 0;
                }else if (maskPosition.left > previwNode.clientWidth-maskNode.offsetWidth){
                    maskPosition.left = previwNode.clientWidth-maskNode.offsetWidth;
                }
                if (maskPosition.top<0){
                    maskPosition.top = 0;
                }else if (maskPosition.top > previwNode.clientHeight-maskNode.offsetHeight){
                    maskPosition.top = previwNode.clientHeight-maskNode.offsetHeight;
                }
//                  设置蒙版位置
                maskNode.style.left = maskPosition.left + "px";
                maskNode.style.top = maskPosition.top + "px";
                //计算移动比
                var scale = (previwNode.clientWidth - maskNode.offsetWidth) /(bigImg.offsetWidth-bigImgBox.clientWidth);
                var bigImgPosition={
                    left: maskPosition.left / scale,
                    top: maskPosition.top / scale
                }
                bigImg.style.marginLeft = -bigImgPosition.left + "px";
                bigImg.style.marginTop = -bigImgPosition.top + "px";

            };
            //鼠标移出
            previwNode.onmouseleave = function () {
                //删除模板 大容器 大图
                smallBox.removeChild(maskNode);
                previwNode.removeChild(bigImgBox);
                maskNode = null;
                bigImgBox= null;
                bigImg = null;
                smallBox.onmousemove = previwNode.onmouseleave = null;
            };

        };
    }
    //缩略图
    thumbnail();
    function thumbnail() {
        /*
            步骤
                 数据渲染 创建li和图片 左右按钮点击事件
                 右按钮事件 定义移动数量和总数 单次移动距离 总路程 判断如果已走距离小于总距离可以点击
                 在判断如果剩余距离大于单次移动距离每次走两个图片距离，如果小于单次移动距离则等于单词移动距离
        */
        var nextNode = document.querySelector(".wrap .main .mainCon .infoWrap .previwWrap .thumbnail > a.next");
        var prevNode = document.querySelector(".wrap .main .mainCon .infoWrap .previwWrap .thumbnail > a.prev");
        //获取图片容器
        var list = document.querySelector(".wrap .main .mainCon .infoWrap .previwWrap .thumbnail .itemWrap .list");
        //数据渲染
        var imgSrc = goodData.imagessrc;
        imgSrc.forEach(function (item) {
            var liNode = document.createElement("li");
            var imgNode = new Image();
            imgNode.src = item.s;
            liNode.appendChild(imgNode);
            list.appendChild(liNode);
        })


        //获取图片集合
        var items = document.querySelectorAll(".wrap .main .mainCon .infoWrap .previwWrap .thumbnail .itemWrap .list > li");

        //获取图片长度
        var imgNum = items.length;
        //设置图片移动数量
        var moveNum = 2;
        //设置图片显示数量
        var showNum = 5;
        //单次移动的值 = 图片移动数量 * 图片自身宽度 + 图片外边距
        var itemLeft = moveNum * (items[0].offsetWidth + 20);
        //总路程 = (总图片数量-显示图片数量) * (图片自身宽度 + 图片外边距)
        var countLeft = (imgNum- showNum) * (items[0].offsetWidth + 20);
        //记录已走的距离
        var tempLeft = 0;
        nextNode.onclick = function () {
            //已走的距离小于总路程才可以点击
            if (tempLeft < countLeft){
               // 如果剩余距离 > 单次偏移  正常移动   如果剩余距离 < 单次偏移  走剩余的
                if (countLeft - tempLeft > itemLeft){
                    tempLeft += itemLeft;
                }else {
                    tempLeft = countLeft;
                }
                list.style.left = -tempLeft + "px";
            }
        }
        prevNode.onclick = function () {
            if (tempLeft > 0){
                if (tempLeft > itemLeft){
                    tempLeft -= itemLeft;
                }else {
                    tempLeft = 0;
                }
                list.style.left = -tempLeft + "px";
            }
        }
    }
    //缩略图点击
    thumbnailClick();
    function thumbnailClick() {
        /*
            步骤
                获取图片集合和小图容器，获取数据
                遍历图片集合 给每个图片添加个index
                图片点击事件
                给小图src赋值为数据渲染的当前点击index的小图照片，并且创建缩略图索引，把大图替换
        */
        //获取图片集合
        var item = document.querySelectorAll(".wrap .main .mainCon .infoWrap .previwWrap .thumbnail .itemWrap .list > li");
        var smallImg = document.querySelector(".wrap .main .mainCon .infoWrap .previwWrap .previw .zoomImgBox img");
        var imgSrc = goodData.imagessrc;
        for (var i=0; i<item.length; i++){
            item[i].index = i;
            item[i].onclick = function () {
                smallImg.src = imgSrc[this.index].s;
                previwId = this.index;
            }
        }

    }
    //商品筛选功能
    chooseFun();
    function chooseFun() {
        /*
            步骤;
                渲染选项数据 创建 dl dt dd
                遍历dl 存储dl里的dd 遍历dd dd点击事件 再次循环每次点击都清空样式 当前点击的变红色
                存储当前点击的dd的父元素的索引 将当前点击的dd存储到数组的这个索引
                遍历数组创建mark 页面内容为数组内容 a
                获取a标签集合 遍历  点击事件
                遍历循环 清除所有高亮 索引为零设置为红色 删除mark 清空对应数组
        */
        var crumbDate = goodData.goodsDetail.crumbData;
        //获取父元素区域
        var chooseArea = document.querySelector(".wrap .main .mainCon .infoWrap .info .choose .chooseArea");
        var chooseNode = document.querySelector(".wrap .main .mainCon .infoWrap .info .choose .choosed");
        crumbDate.forEach(function (item) {
            var dlNode = document.createElement("dl");
            var dtNode = document.createElement("dt");
            dtNode.innerHTML = item.title;
            dlNode.appendChild(dtNode);

            item.data.forEach(function (item) {
                var ddNode = document.createElement("dd");
                ddNode.innerHTML = item.type;
                //给每一个dd添加一个价钱改变属性
                ddNode.setAttribute("changePrice", item.changePrice);
                dlNode.appendChild(ddNode);
            });
            chooseArea.appendChild(dlNode);
        });
        //获取dl集合
        var dlList = document.querySelectorAll(".wrap .main .mainCon .infoWrap .info .choose .chooseArea dl");
        //获取数组
        var arr = new Array(4);
        arr.fill(0);
        for (var i=0; i<dlList.length; i++){
            //使用匿名函数，
            dlList[i].index = i;
            console.log(dlList[i]);
            (function () {
            //依次访问每一个dl里的dd
            var ddList = dlList[i].getElementsByTagName("dd");
                //console.log(ddList);
            for (var j=0; j<ddList.length; j++){
                //console.log(ddList[j]);
                //点击高亮
                ddList[j].onclick = function () {
                    //高亮切换
                    //点击遍历当前行的dd，让所有dd颜色变灰色
                    for (var i=0; i<ddList.length; i++){
                        ddList[i].style.color = "#666";
                        //console.log(ddList[i]);
                    }
                    this.style.color = "red";
                    //根据当前点击的dd的父元素dl的索引 去arr数组中对应的位置 存储ddde文本
                    var clickIndex = this.parentNode.index;
                    //arr[clickIndex] = this;
                   // console.log(arr);
                    //根据当前点击的dd的父元素dl的索引  去arr数组中对应的位置 存储dd的文本
                    arr[clickIndex]= this;
                    //新增筛选条件 价钱需要重新计算
                    priceSum(arr);
                    chooseNode.innerHTML = "";
                    arr.forEach(function (item) {
                        if (item){
                            //能进入这个if当中 说明数组当前这恶元素有内容 不是0
                            var makeNode = document.createElement("mark");
                            //mark的文本就应该是当前这个元素（item）的值
                            makeNode.innerHTML = item.innerHTML;
                            var aNode = document.createElement("a");
                            aNode.innerHTML = "X";
                            aNode.setAttribute("num",item.parentNode.index);
                            makeNode.appendChild(aNode);
                            chooseNode.appendChild(makeNode);

                        }
                    })
                    //获取choosed当中a标签的集合
                    var aList = document.querySelectorAll(".wrap .main .mainCon .infoWrap .info .choose .choosed mark a");
                    for (let  i=0; i<aList.length; i++){
                        aList[i].onclick = function () {
                            //根据当前点击的a标签的属性 找到对应的那组选项
                            var index = parseInt(this.getAttribute("num"));
                            console.log(index);
                            var ddNodes = dlList[index].getElementsByTagName("dd");
                            //清楚高亮
                            for (var j=0; j<ddNodes.length; j++){
                                ddNodes[j].style.color = "#666";
                            }
                            ddNodes[0].style.color = "red";
                            //删除mark标签
                            chooseNode.removeChild(this.parentNode);
                            //将数组中的对应位置的内容清除掉
                            arr[index] = 0;
                            priceSum(arr);

                        }
                    }

                }
            }
            })()
        }
        //封装价钱计算方法   就是将当前arr数组当中每一个dd的价钱改变属性的值和原价加在一起
        //只要arr数组发生改变  无论是增加条件还是删除条件 价钱是需要改变的 我们就调用这个方法
        function priceSum(arr) {
            //原价
            var price = goodData.goodsDetail.price;
            var priceNode = document.querySelector('.wrap .main .mainCon .infoWrap .info .infoTop .priceArea .priceTop > p.price>span')
            arr.forEach(function (item) {
                if (item){
                    price += parseInt(item.getAttribute("changePrice"));
                }
            });
            priceNode.innerHTML = price;
        //联动上下手机总价变化
            var masterpriceNode = document.querySelector('.wrap .main .mainCon .detailWrap .detail .fitting .goodSuits .master p');
            var checkNodes = document.querySelectorAll('.wrap .main .mainCon .detailWrap .detail .fitting .goodSuits .suits li label input')
            var choosedPrice = document.querySelector(".wrap .main .mainCon .detailWrap .detail .fitting .goodSuits .result p");
               //点击后的价格赋值给选择搭配价格
                masterpriceNode.innerHTML = "￥" + price;
            for (var i=0; i<checkNodes.length; i++){
                    if (checkNodes[i].checked){
                        price += parseInt(checkNodes[i].value);
                    }
                }
            choosedPrice.innerHTML = "￥" + price;


        }

    }
    //选择搭配
    fitting()
    function fitting() {
        //获取复选框，价格 和 改变价格
        var priceNode = document.querySelector('.wrap .main .mainCon .detailWrap .detail .fitting .goodSuits .master p');
        var checkNodes = document.querySelectorAll('.wrap .main .mainCon .detailWrap .detail .fitting .goodSuits .suits li label input')
        var choosedPrice = document.querySelector(".wrap .main .mainCon .detailWrap .detail .fitting .goodSuits .result p");
        for (var i=0; i<checkNodes.length; i++){
            checkNodes[i].onclick = function () {
                //每次点击获取价格
                var price = parseInt(priceNode.innerHTML.substr(1));
                for (var i=0; i<checkNodes.length; i++){
                    if (checkNodes[i].checked){
                        price += parseInt(checkNodes[i].value);
                    }
                }
                choosedPrice.innerHTML = "￥" + price;
            }
        }
    }
    //商品价钱区域动态渲染
    infoTop();
    function infoTop() {
        var infoTop = document.querySelector(".wrap .main .mainCon .infoWrap .info .infoTop");
        var goodsDetail = goodData.goodsDetail;
        infoTop.innerHTML =  `<h3>${goodsDetail.title}</h3>
        <span>${goodsDetail.recommend}</span>
        <div class="priceArea">
            <div class="priceTop">
            <p class="title">价   格</p>
        <p class="price">
            <i>￥</i>
            <span>${goodsDetail.price}</span>
            <em>降价通知</em>
            </p>
            <p class="remark">
            <i>累计降价</i>
            <em>${goodsDetail.evaluateNum}</em>
            </p>

            </div>
            <div class="priceBottom">
            <p class="title">促  销</p>
        <div>
        <i>${goodsDetail.promoteSales.type}</i>
        <span>${goodsDetail.promoteSales.content}</span>
        </div>
        </div>
        </div>

        <div class="support">
            <div>
            <p class="title">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</p>
        <p class="text">${goodsDetail.support}</p>
        </div>
        <div>
        <p class="title">配&nbsp;送&nbsp;至</p>
        <p class="text">${goodsDetail.address}</p>
        </div>
        </div>`
    }
    //tap切换
    function Tab(tabBtn,tabContent) {
        this.tabBtn = tabBtn;
        this.tabContent = tabContent;
        //在外部保存this，是为了能够在内部进行访问，不会重名，找不大外边的
        var _this = this;
        for (var i=0; i < this.tabBtn.length; i++){
            this.tabBtn[i].index = i;
            this.tabBtn[i].onclick = function () {
                //调用原型对象里的方法  事件源 this
                _this.clickFun(this);
            }
        }
    }
    Tab.prototype.clickFun = function(btn){
        for (var i=0; i<this.tabBtn.length;i++){
            this.tabBtn[i].className = "";
            this.tabContent[i].className = "";
        }
        btn.className = "active";
        this.tabContent[btn.index].className = "active";
    }
    asideTab();
    function asideTab() {
        /*步骤
            创建一个函数，声明按钮和内容区 构造函数调用
            创建一个构造函数,接收实参
            将实参赋值给实例化对象
            遍历按钮 给每个按钮添加一个index 按钮点击事件
            此时this指向实例化对象 可以声明作为保存
            调用原型方法，此时this指向事件源（将事件源作为实参传入）
            创建原型方法
            遍历按钮 将所有的按钮和内容去的类名清空
            给当前点击的按钮添加类名  内容区：当前点击按钮的索引位置的类名更改
        */
        var tabBtn = document.querySelectorAll('.wrap .main .mainCon .detailWrap aside .tabWrap > h4');
        var tabContent = document.querySelectorAll('.wrap .main .mainCon .detailWrap aside .tabContent>div');
        new Tab(tabBtn,tabContent);
    }
    introTab();
    function introTab() {
        var tabBtn = document.querySelectorAll('.wrap .main .mainCon .detailWrap .detail .tabWrap > li');
        var tabContent = document.querySelectorAll('.wrap .main .mainCon .detailWrap .detail .tabContent > div');

        new Tab(tabBtn,tabContent);
    }
    //tap切换
    /*   tab();
    function tab() {
        var tabBtn = document.querySelectorAll(".wrap .main .mainCon .detailWrap aside .tabWrap > h4");
        var content = document.querySelectorAll(".wrap .main .mainCon .detailWrap aside .tabContent>div");
        for (var i=0; i<tabBtn.length; i++){
            tabBtn[i].index = i;
            tabBtn[i].onclick = function () {
                for (var i=0; i<content.length; i++){
                    tabBtn[i].className = "";
                    content[i].className = "";
                }
                this.className = "active";
                content[this.index].className = "active";
            }
        }
    }*/
    //购物车侧边栏
    toolBar();
    function toolBar() {
        // 获取按钮 点击事件 设置标识符
        var tooBtnNode = document.querySelector(".wrap .toolBar .toolBtn");
        var toolBarNode = document.querySelector(".wrap .toolBar");
        //flag 为真处于关闭状态   为假处于打开状态
        var flag = true;
        tooBtnNode.onclick = function () {
            if (flag){
                toolBarNode.className = "toolBar toolIn";
                tooBtnNode.className = "toolBtn cross";
            }else {
                toolBarNode.className = "toolBar toolOut";
                tooBtnNode.className = "toolBtn list";
            }
            flag = !flag;
        }


    }

}