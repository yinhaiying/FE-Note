// 实现瀑布流的思路：
// 1. 不能够通过浮动来动态地改变图片的位置.也就是说需要固定住整个容器的宽度。
// 2. 容器的宽度又是由图片个数和图片宽度决定的。
// 3. 图片的个数由屏幕的宽度和图片的宽度决定。
// 4. 动态获取屏幕的宽度。根据屏幕的宽度和图片的宽度获取到图片的个数，最后容器的宽度就等于屏幕的宽度诚意图片的宽度。


//5. 确定位置：瀑布流中，第二排的第一张图片应该在第一排的高度最短的图片下面。因此我们需要获得所有图片的高度。
//6. 通过绝对定位实现位置：想要精确地实现每张图片位置的确定，只能通过绝对定位。
//7. 确定了第二排第一张的位置。剩下图片的位置需要更改高度数组里面的值。将第二排第一张的高度变为两张图片高度之和。


//8.图片加载：滚动条永远到不了底部。图片加载的时机，在滚动条快要滚动到最后一张图片的时候，让图片进行加载。

window.onload = function(){
  // 设置图片瀑布流效果
  imgLoad('container','box');

  // 设置图片加载效果
  window.onscroll = function(){
    let flag = checkFlag();
    let imgData = {
      'data':[
        {"src":'111.jpg'},
        {"src":'222.jpg'},
        {"src":'333.jpg'},
        {"src":'444.jpg'},
        {"src":'555.jpg'},
        {"src":'666.jpg'}
      ]
    }
    // 返回true表示可以加载数据了
    if(flag){
      console.log(1)
      let cparent = document.getElementById('container');
      for(var i = 0;i < imgData.data.length;i++){
        let ccontent = document.createElement('div');
        ccontent.className = 'box';
        cparent.appendChild(ccontent);
        let boxImg = document.createElement('div');
        boxImg.className = "box_img";
        ccontent.appendChild(boxImg);
        let img = document.createElement('img');
        img.src="./img/"+imgData.data[i].src;
        boxImg.appendChild(img)
        console.log(cparent[cparent.length-1])
      }
      // 再次对图片进行按照规则排列
      imgLoad('container','box');

    }

  }
}

// 是否允许图片加载
function checkFlag(){
  let cparent = document.getElementById('container');
  let ccontent = getChildElements(cparent,'box');
  let lastContentHeight = ccontent[ccontent.length-1].offsetTop;
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;  // 滚动条的滚动距离
  let pageHeight = document.documentElement.clientHeight || document.body.clientHeight;  // 页面可视区的高度
  // console.log('scrollTop:' + scrollTop)
  // console.log('pageHight:' + pageHight)
  if(lastContentHeight <= scrollTop + pageHeight){
    return true;
  }else{
    return false;
  }
}




function imgLoad(parent,content){
  // 将parent下的内容全部取出来
  let cparent = document.getElementById(parent);
  let ccontent = getChildElements(cparent,content);
  let imgWidth = ccontent[0].offsetWidth; // 图片的宽度
  let viewWidth = document.documentElement.clientWidth;  // 屏幕的宽度
  let num =Math.floor(viewWidth/imgWidth) ;  // 每行图片的个数
  cparent.style.cssText = "width:"+imgWidth*num + 'px;margin:0 auto';

  let boxHeightArr = [];
  for(var i = 0;i < ccontent.length;i++){
    if(i < num){
      boxHeightArr[i] = ccontent[i].offsetHeight;
    }else{
      let minHeight = Math.min.apply(null,boxHeightArr);
      let minIndex = getMinHeightLocation(boxHeightArr,minHeight);
      ccontent[i].style.position = "absolute"
      ccontent[i].style.top = minHeight + 'px';
      ccontent[i].style.left = ccontent[minIndex].offsetLeft + 'px';
      boxHeightArr[minIndex] = boxHeightArr[minIndex] + ccontent[i].offsetHeight
    }
  }
}

function getChildElements(parent,content){
  let contentArr = [];
  let allcontent = parent.getElementsByTagName('*');
  for(var i = 0;i < allcontent.length;i++){
    if(allcontent[i].className == content){
      contentArr.push(allcontent[i])
    }
  }
  return contentArr;
}

// 获取最小高度图片对应的位置。
function getMinHeightLocation(boxHeightArr,minHeight){
  return boxHeightArr.indexOf(minHeight)
}
