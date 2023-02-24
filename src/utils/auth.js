import Store from "@/store";

export const getTokenAUTH = () => Store.state.user.profile.token;

function getActualWidthOfChars(text, options = {}) {
  const { size = 14, family = "Microsoft YaHei" } = options;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${size}px ${family}`;
  const metrics = ctx.measureText(text);
  return (
    Math.abs(metrics.actualBoundingBoxLeft) +
    Math.abs(metrics.actualBoundingBoxRight)
  );
}

export default getActualWidthOfChars;

//File 是图片上传完成后的返回值 state为 0是添加水印 非0则不添加
export const compressImg = (File, state) => {
  //全局函数1
  return new Promise(function (resolve, reject) {
    // let file = File.file;
    let file = File;
    // 看支持不支持FileReader
    if (!file || !window.FileReader) return;
    let reader = new FileReader();

    // 将图片2将转成 base64 格式
    reader.readAsDataURL(file);
    // 读取成功后的回调
    reader.onloadend = function () {
      //此处的this是reader
      //此处的result是个base64文件
      let result = this.result;
      // 还原成图片格式方便后期压缩，此处可以不还原，在压缩的时候还原
      let img = new Image();
      img.src = result;
      // //console.log(img);
      //判断图片是否大于500K,是就直接上传，反之压缩图片
      if (this.result.length <= 300 * 1024) {
        img.onload = function () {
          let base64 = compress(img, true, state);
          let fileZip = dataURLtoFile(base64, file.name);
          let asd = {
            base64: base64,
            fileZip: fileZip,
          };
          resolve(asd);
        };
      } else {
        img.onload = function () {
          let base64 = compress(img, false, state);
          let fileZip = dataURLtoFile(base64, file.name);
          let asd = {
            base64: base64,
            fileZip: fileZip,
          };
          resolve(asd);
        };
      }
    };
  });
};

function compress(img, show, state) {
  //console.log(state);
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");

  //瓦片canvas
  let tCanvas = document.createElement("canvas");
  let tctx = tCanvas.getContext("2d");
  let width = img.width;
  let height = img.height;
  //若是图片大于四百万像素，计算压缩比并将大小压至400万如下
  let ratio;
  if ((ratio = (width * height) / 4000000) > 1) {
    ratio = Math.sqrt(ratio);
    width /= ratio;
    height /= ratio;
  } else {
    ratio = 1;
  }
  canvas.width = width;
  canvas.height = height;
  //铺底色
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //若是图片像素大于100万则使用瓦片绘制
  let count;
  if ((count = (width * height) / 1000000) > 1) {
    // //console.log("超过100W像素"); ~~ 是利于符号转换成数字类型
    count = ~~(Math.sqrt(count) + 1); //计算要分红多少块瓦片
    //      计算每块瓦片的宽和高
    let nw = ~~(width / count);
    let nh = ~~(height / count);
    tCanvas.width = nw;
    tCanvas.height = nh;
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        tctx.drawImage(
          img,
          i * nw * ratio,
          j * nh * ratio,
          nw * ratio,
          nh * ratio,
          0,
          0,
          nw,
          nh
        );
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height);
  }
  if (state == 0) {
    ctx.save();
    ctx.fillStyle = "#fff"; // 填充颜色为白色
    ctx.globalAlpha = 0.5;
    ctx.font = (width + height) * 0.03 + "px Microsoft Yahei";
    ctx.rotate((Math.PI / 180) * 15);
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        ctx.fillText(
          "小兔仙认证",
          i * (width + height) * 0.25,
          height * -0.3 + (height + width) * 0.1 * j,
          300
        );
      }
    }
    ctx.restore();
  }

  if (show) {
    let ndata = canvas.toDataURL("image/jpeg", 0.5);
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
  }
  //进行最小压缩
  let ndata = canvas.toDataURL("image/jpeg", 0.2);
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
  // //console.log(ndata,'压缩后的base64');
  return ndata;
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime,
  });
}
