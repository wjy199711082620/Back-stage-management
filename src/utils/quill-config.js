import request from '@/utils/request'


const uploadConfig = {
  name: "file",
  size: 500,  // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'  // 可选 可上传的图片格式
};
// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{'header': 1}, {'header': 2}],
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],
  [{'indent': '-1'}, {'indent': '+1'}],
  [{'direction': 'rtl'}],
  [{'size': ['small', false, 'large', 'huge']}],
  [{'header': [1, 2, 3, 4, 5, 6, false]}],
  [{'color': []}, {'background': []}],
  [{'font': []}],
  [{'align': []}],
  [{'clean': '源码编辑'}],
  ['link', 'image'],
];
const handlers = {
  image: function image() {
    var self = this;
    var fileInput = this.container.querySelector('input.ql-image[type=file]');
    if (fileInput === null) {
      fileInput = document.createElement('input');
      fileInput.setAttribute('type', 'file');
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute('name', uploadConfig.name);
      }
      // 可设置上传图片的格式
      fileInput.setAttribute('accept', uploadConfig.accept);
      fileInput.classList.add('ql-image');
      // 监听选择文件
      fileInput.addEventListener('change', function () {
        // 创建formData
        var formData = new FormData();
        formData.append(uploadConfig.name, fileInput.files[0]);
        // 如果需要token且存在token
        if (uploadConfig.token) {
          formData.append('token', uploadConfig.token)
        }
        request({
          url:'/file/imageUpload',
          method:'post',
          data:formData
        }).then(response=>{
          if (response.code==="200"){
            console.log(response.data);
            let length = self.quill.getSelection(true).index;
            //这里很重要，你图片上传成功后，img的src需要在这里添加，res.path就是你服务器返回的图片链接。
            self.quill.insertEmbed(length, 'image', response.data);
            self.quill.setSelection(length + 1)
          }
          fileInput.value = ''
        });
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  }
};
export default {
  placeholder: '',
  theme: 'snow',  // 主题
  modules: {
    toolbar: {
      container: toolOptions,  // 工具栏选项
      handlers: handlers  // 事件重写
    }
  },
  init: function (func) {      //在使用的页面中初始化按钮样式
  }
};
